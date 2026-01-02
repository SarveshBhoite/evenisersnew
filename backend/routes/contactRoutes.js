const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../utils/sendEmail"); // Must use curly braces

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // This sends both emails now
    await sendContactEmail({ name, email, subject, message });

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send emails" });
  }
});

module.exports = router;