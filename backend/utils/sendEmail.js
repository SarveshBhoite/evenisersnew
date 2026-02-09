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
    from: `"evenizers Order" <${process.env.EMAIL_USER}>`,
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
    from: `"evenizers Website" <${process.env.EMAIL_USER}>`,
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
    from: `"evenizers" <${process.env.EMAIL_USER}>`,
    to: contactData.email,
    subject: `We received your message: ${contactData.subject}`,
    html: `
      <div style="font-family: serif; padding: 20px; color: #333;">
        <h1 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">Hello ${contactData.name},</h1>
        <p>Thank you for reaching out to evenizers.</p>
        <p>We have received your message regarding <b>"${contactData.subject}"</b> and our team will get back to you within 24-48 hours.</p>
        <br />
        <p>Best regards,</p>
        <p><b>evenizers Team</b></p>
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
    from: `"evenizers Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otp}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Verify Your Account</h2>
        <p>Your One-Time Password (OTP) for evenizers is:</p>
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
  const uniqueId = Math.random().toString(36).substring(7);

  // 1. Generate HTML list of ALL items
  const itemsHtml = order.items.map(item => `
    <div style="margin-bottom: 10px; border-bottom: 1px dashed #ddd; padding-bottom: 10px;">
        <p style="margin: 2px 0;"><strong>🎉 Event:</strong> ${item.product?.name || "Event Package"}</p>
        <p style="margin: 2px 0;"><strong>📅 Date:</strong> ${item.eventDate || "Not Set"}</p>
        <p style="margin: 2px 0;"><strong>⏰ Time:</strong> ${item.timeSlot || "Not Set"}</p>
    </div>
  `).join("");

  const mailOptions = {
    from: `"Event Manager" <${process.env.EMAIL_USER}>`,
    to: vendorEmail,
    subject: `🔥 New Order (${order.items.length} Events) in ${order.shippingAddress.city}! [${uniqueId}]`, 
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #000; margin-bottom: 10px;">New Event Request</h2>
        <p style="color: #555;">Hello <strong>${vendorName}</strong>,</p>
        <p style="color: #555;">You have a new request containing <strong>${order.items.length} event(s)</strong> in your area.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e0e0e0;">
            <p style="margin-bottom: 15px;"><strong>📍 Location:</strong> ${order.shippingAddress.city}</p>
            ${itemsHtml} 
        </div>

        <div style="text-align: center; margin: 35px 0; padding: 10px;">
            <a href="${acceptLink}" style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
              View Full Details & Accept
            </a>
        </div>
        
        <div style="opacity: 0; font-size: 1px; color: #fff; height: 1px;">
           ID: ${uniqueId} - Sent: ${new Date().toISOString()}
        </div>
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

const sendResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"evenizers Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to create a new one:</p>
        <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
        </div>
        <p>Or paste this link in your browser: <br/> <a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">This link expires in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Reset Email Error:", error.message);
  }
};

// 🚨 EXPORT ALL FUNCTIONS
module.exports = { 
    sendOrderEmail, 
    sendContactEmail, 
    sendOTPEmail, 
    sendVendorBroadcast,
    sendResetEmail,
};