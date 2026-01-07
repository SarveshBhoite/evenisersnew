const nodemailer = require("nodemailer");
const path = require("path");
// 🚨 Force load .env from the root backend folder
require("dotenv").config({ path: path.join(__dirname, "../.env") });

console.log("Checking Email Auth:", process.env.EMAIL_USER ? "FOUND" : "NOT FOUND");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Send Order Email to Admin
const sendOrderEmail = async (orderData) => {
  const recipient = process.env.ADMIN_EMAIL || orderData.userEmail;
  const mailOptions = {
    from: `"Luxe Fashion Order" <${process.env.EMAIL_USER}>`,
    to: recipient,
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

// 2. Send Contact Form Emails
const sendContactEmail = async (contactData) => {
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

  const userMailOptions = {
    from: `"Luxe Fashion" <${process.env.EMAIL_USER}>`,
    to: contactData.email,
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
    await transporter.sendMail(adminMailOptions);
    console.log("✅ Contact email sent to ADMIN");
    await transporter.sendMail(userMailOptions);
    console.log("✅ Confirmation email sent to USER");
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

// 3. Send OTP Email
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

// 4. 🚨 NEW: Send Vendor Broadcast Email (Moved OUTSIDE sendOTPEmail)
const sendVendorBroadcast = async (vendorEmail, vendorName, order, acceptLink) => {
  const mailOptions = {
    from: `"Event Manager" <${process.env.EMAIL_USER}>`,
    to: vendorEmail,
    subject: `🔥 New Event Opportunity in ${order.shippingAddress.city}!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #000;">New Event Request</h2>
        <p>Hello <strong>${vendorName}</strong>,</p>
        <p>A new event is available in your area. Be the first to accept it!</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>📍 Location:</strong> ${order.shippingAddress.city}</p>
            <p><strong>📅 Date:</strong> ${order.items[0].eventDate || "Check details"}</p>
            <p><strong>⏰ Time:</strong> ${order.items[0].timeSlot || "Standard"}</p>
        </div>

        <a href="${acceptLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          View & Accept Event
        </a>
        
        <p style="margin-top: 20px; font-size: 12px; color: #888;">If the link doesn't work, this order may have been taken by another partner.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Vendor email sent to ${vendorEmail}`);
  } catch (error) {
    console.error("❌ Vendor Email Error:", error.message);
  }
};

// 🚨 EXPORT ALL FUNCTIONS
module.exports = { 
    sendOrderEmail, 
    sendContactEmail, 
    sendOTPEmail, 
    sendVendorBroadcast
};