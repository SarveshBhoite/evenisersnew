const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { sendOTPEmail, sendResetEmail } = require("../utils/sendEmail");
const { sendSMS } = require("../utils/sendMobile");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @route   POST /api/auth/signup
// @desc    Register user & Send OTP (No Token yet)
// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    console.log("👉 Signup Request Received:", req.body.email); // Debug Log

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    // 1. Check if user exists
    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Resend OTP logic
      console.log("👉 Resending OTP to existing unverified user");
      const otp = generateOTP();
      user.name = name;
      user.password = password;
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      try {
        await sendOTPEmail(email, otp);
        console.log("✅ OTP Resent Successfully");
      } catch (emailErr) {
        console.error("❌ Email Failed:", emailErr.message);
        return res.status(500).json({ message: "Error sending email. Please try again." });
      }
      return res.status(200).json({ message: "Verification code resent to email", email });
    }

    // 2. Create New User
    console.log("👉 Creating New User in DB...");
    const otp = generateOTP();
    user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });
    console.log("✅ User Created in DB:", user._id);

    // 3. Send OTP (With Safety Block)
    try {
      console.log("👉 Attempting to send OTP Email...");
      await sendOTPEmail(email, otp);
      console.log("✅ OTP Email Sent Successfully");
    } catch (emailErr) {
      console.error("❌ FATAL EMAIL ERROR:", emailErr);
      // Delete the user so they can try again
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        message: "Failed to send email. Check server logs.",
        error: emailErr.message
      });
    }

    res.status(201).json({
      message: "Verification code sent to email",
      email: user.email
    });

  } catch (err) {
    console.error("🔥 SERVER CRASH IN SIGNUP:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and Issue Token
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches and hasn't expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify User
    user.isVerified = true;
    user.otp = undefined;       // Clear OTP
    user.otpExpires = undefined;
    await user.save();

    // Create Token (Now that they are verified)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Optional: Prevent login if not verified (Client preference)
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/auth/google-login
// @desc    Login or Signup with Google SSO
router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Google token is required" });

    console.log("👉 Google Login Attempt");
    console.log("Using Client ID:", process.env.GOOGLE_CLIENT_ID);

    // Verify Google Token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    console.log(`✅ Token verified for email: ${email}`);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user via Google
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        isVerified: true, // Google emails are pre-verified
      });
    } else {
      // Link Google ID if it's an existing email/password user logging in with Google
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.authProvider === "local" ? "google" : user.authProvider;
        user.isVerified = true;
        await user.save();
      }
    }

    // Issue standard JWT
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google Authentication failed" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 2. Hash and save to DB
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

    await user.save();

    // 3. Create URL (Matches your nested folder structure)
    // frontend/app/forgot-password/reset-password/[token]/page.tsx
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/forgot-password/reset-password/${resetToken}`;

    try {
      await sendResetEmail(user.email, resetUrl);
      res.json({ message: "Reset link sent to email" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/auth/reset-password/:token
// @desc    Verify Token & Set New Password
router.put("/reset-password/:token", async (req, res) => {
  try {
    // 1. Hash the token from URL to compare with DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2. Update Password (Middleware handles hashing)
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/auth/mobile/send-otp
// @desc    Send OTP to Mobile Number
router.post("/mobile/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    let user = await User.findOne({ phone });
    const otp = generateOTP();

    // If user doesn't exist, create a temporary stub
    if (!user) {
      user = await User.create({
        phone,
        authProvider: "mobile",
        isVerified: false,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
      });
    } else {
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
    }

    await sendSMS(phone, otp);

    res.json({ message: "OTP sent successfully to " + phone });
  } catch (error) {
    console.error("Mobile OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

// @route   POST /api/auth/mobile/verify-otp
// @desc    Verify Mobile OTP & Login
router.post("/mobile/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP are required" });

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify User
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name || "User",
        email: user.email,
        phone: user.phone,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
});

module.exports = router;