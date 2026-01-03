const nodemailer = require("nodemailer");
const path = require("path");
// 🚨 Force load .env from the root backend folder
require("dotenv").config({ path: path.join(__dirname, "../.env") });

console.log("Checking Email Auth:", process.env.EMAIL_USER ? "FOUND" : "NOT FOUND");

const recipent = process.env.ADMIN_EMAIL || orderData.userEmail;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async (orderData) => {
  const mailOptions = {
    from: `"Luxe Fashion Order" <${process.env.EMAIL_USER}>`,
    to: recipent,
    subject: `New Order Received! #${orderData._id}`,
    html: `<h2>New Order Notification</h2><p>Total: ₹${orderData.totalAmount}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Order email sent to admin");
  } catch (error) {
    console.error("❌ Order Email Error:", error.message);
  }

  
};

const sendContactEmail = async (contactData) => {
  // 1. Mail Options for the ADMIN (You)
  const adminMailOptions = {
    from: `"Luxe Website" <${process.env.EMAIL_USER}>`,
    replyTo: contactData.email,
    to: process.env.ADMIN_EMAIL,
    subject: `New Inquiry: ${contactData.subject}`,
    html: `
      <h3>New Website Message</h3>
      <p><b>From:</b> ${contactData.name}</p>
      <p><b>Email:</b> ${contactData.email}</p>
      <p><b>Message:</b> ${contactData.message}</p>
    `,
  };

  // 2. Mail Options for the USER (The Customer)
  const userMailOptions = {
    from: `"Luxe Fashion" <${process.env.EMAIL_USER}>`,
    to: contactData.email, // Sends to the address the user typed in the form
    subject: `We received your message: ${contactData.subject}`,
    html: `
      <div style="font-family: serif; padding: 20px; color: #333;">
        <h1 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">Hello ${contactData.name},</h1>
        <p>Thank you for reaching out to Luxe Fashion.</p>
        <p>We have received your message regarding <b>"${contactData.subject}"</b> and our team will get back to you within 24-48 hours.</p>
        <br />
        <p>Best regards,</p>
        <p><b>Luxe Fashion Team</b></p>
      </div>
    `,
  };

  try {
    // Send to Admin
    await transporter.sendMail(adminMailOptions);
    console.log("✅ Contact email sent to ADMIN");

    // Send to User
    await transporter.sendMail(userMailOptions);
    console.log("✅ Confirmation email sent to USER");

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Luxe Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otp}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Verify Your Account</h2>
        <p>Your One-Time Password (OTP) for Luxe Fashion is:</p>
        <h1 style="letter-spacing: 5px; background: #eee; padding: 10px; display: inline-block;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
  } catch (error) {
    console.error("❌ OTP Email Error:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = { sendOrderEmail, sendContactEmail, sendOTPEmail };