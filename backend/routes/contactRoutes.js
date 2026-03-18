const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { sendContactEmail } = require("../utils/sendEmail"); // Must use curly braces

// @route   POST /api/contact
// @desc    Submit contact form & Send emails
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // 1. Save to Database
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });
    await newContact.save();
    
    // 2. Send Emails (Admin & User)
    await sendContactEmail({ name, email, phone, subject, message });

    res.status(200).json({ success: true, message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("Contact Route Error:", error);
    res.status(500).json({ success: false, message: "Failed to process inquiry" });
  }
});

module.exports = router;