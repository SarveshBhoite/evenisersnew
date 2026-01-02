// test-email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Testing with:", process.env.EMAIL_USER);

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Auth Failed:", error.message);
    console.log("Tip: Check if 'App Password' is 16 characters and 2FA is on.");
  } else {
    console.log("✅ Email Server is ready to send messages!");
  }
  process.exit();
});