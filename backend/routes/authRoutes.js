const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../utils/sendEmail"); // Import the new function

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @route   POST /api/auth/signup
// @desc    Register user & Send OTP (No Token yet)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        // If user exists AND is verified, stop them
        if (user.isVerified) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // If user exists but is NOT verified, update their details and resend OTP
        const otp = generateOTP();
        user.name = name;
        user.password = password; // Will be hashed by pre-save hook
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        await sendOTPEmail(email, otp);
        return res.status(200).json({ message: "Verification code resent to email", email });
    }

    // New User Logic
    const otp = generateOTP();
    user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 mins expires
      isVerified: false
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({ 
        message: "Verification code sent to email", 
        email: user.email 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
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
                role: user.role
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
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;