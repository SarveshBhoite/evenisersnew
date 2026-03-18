const nodemailer = require("nodemailer");
const path = require("path");
// 🚨 Force load .env from the root backend folder
require("dotenv").config({ path: path.join(__dirname, "../.env") });

console.log("Checking Email Auth:", process.env.EMAIL_USER ? "FOUND" : "NOT FOUND");

// ✅ 1. AUTHENTICATION (Uses the weird ID: 96f0a2001@smtp-brevo.com)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: process.env.SMTP_PORT || 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // The Login ID
    pass: process.env.EMAIL_PASS, // The API Key
  },
  // 🚨 NETWORK FIXES 🚨
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  family: 4,               // ✅ Force IPv4 (Fixes Render Timeouts)
  connectionTimeout: 10000, // Wait 10 seconds
  greetingTimeout: 5000,    // Wait 5 seconds for Hello
  socketTimeout: 10000,     // Wait 10 seconds for data
});

// Verify connection on start
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Brevo Connection Error:", error);
  } else {
    console.log("✅ Connected to Brevo SMTP Successfully!");
  }
});

// ✅ 2. THE SENDER IDENTITY (Uses your verified Gmail: rajb81008@gmail.com)
// We use ADMIN_EMAIL because that is the verified address in Brevo
const SENDER_IDENTITY = `"Evenizers Team" <${process.env.ADMIN_EMAIL}>`;

// 1. Send Order Email to Admin & User
const sendOrderEmail = async (orderData) => {
  const recipient = `${orderData.userEmail}`; // Send to user
  const adminRecipient = process.env.ADMIN_EMAIL; // Also send to admin

  const itemsHtml = orderData.items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #333;">${item.product?.name || "Event Package"}</p>
        <p style="margin: 0; font-size: 12px; color: #666;">Date: ${item.eventDate || "TBD"} | Time: ${item.timeSlot || "TBD"}</p>
      </td>
      <td style="padding: 12px 0; text-align: right; color: #333;">
        ${item.quantity} x ₹${item.price}
      </td>
    </tr>
  `).join("");

  const commonHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #000; margin: 0; font-size: 28px; letter-spacing: 2px;">EVENIZERS</h1>
        <p style="color: #888; font-size: 14px; margin-top: 5px;">Your Event, Our Passion</p>
      </div>

      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <h2 style="margin-top: 0; font-size: 20px; color: #333;">Order Details</h2>
        <p style="color: #555;"><strong>Order ID:</strong> <span style="font-family: monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">#${orderData._id}</span></p>

        <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #333;">
              <th style="text-align: left; padding-bottom: 10px; color: #333;">Package</th>
              <th style="text-align: right; padding-bottom: 10px; color: #333;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="border-top: 2px solid #eee; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666;">Total Amount:</span>
            <strong style="color: #333; margin-left: auto;">₹${orderData.totalAmount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #008000;">
            <span>Amount Paid Online (${orderData.paymentType === "advance" ? "40% Advance" : "Full Payment"}):</span>
            <strong style="margin-left: auto;">- ₹${orderData.amountPaid}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; margin-top: 10px; border-top: 1px solid #eee; font-size: 18px;">
            <span style="font-weight: bold; color: #000;">Balance to be Paid:</span>
            <strong style="color: #d32f2f; margin-left: auto;">₹${orderData.remainingAmount}</strong>
          </div>
        </div>

        <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Shipping & Contact</h3>
          <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Name:</strong> ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Phone:</strong> ${orderData.shippingAddress.phone}</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Address:</strong> ${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}, ${orderData.shippingAddress.zip}</p>
          <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Email:</strong> ${orderData.userEmail}</p>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
        <p>&copy; ${new Date().getFullYear()} Evenizers. All rights reserved.</p>
      </div>
    </div>
  `;

  // 1. Customer Email
  const customerMailOptions = {
    from: SENDER_IDENTITY,
    to: recipient,
    subject: `Booking Confirmed! Order #${orderData._id} - Evenizers`,
    html: `
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: #333;">Thank you for your booking!</h2>
        <p>We've received your order and are processing it now.</p>
      </div>
      ${commonHtml}
    `,
  };

  // 2. Admin Email
  const adminMailOptions = {
    from: SENDER_IDENTITY,
    to: adminRecipient,
    replyTo: orderData.userEmail,
    subject: `🚨 NEW ORDER RECEIVED: #${orderData._id} - ${orderData.shippingAddress.firstName}`,
    html: `
      <div style="text-align: center; padding: 20px; background: #fff3cd; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #856404; margin: 0;">New Order Alert!</h2>
        <p style="margin: 5px 0;">A new booking has been placed. Review details below.</p>
      </div>
      ${commonHtml}
    `,
  };

  try {
    // Send both emails
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    console.log("✅ Order confirmation emails sent to Customer & Admin.");
  } catch (error) {
    console.error("❌ Order Email Error:", error.message);
  }
};

// 2. Send Contact Form Emails
const sendContactEmail = async (contactData) => {
  const adminMailOptions = {
    from: SENDER_IDENTITY,
    replyTo: contactData.email,
    to: process.env.ADMIN_EMAIL,
    subject: `📩 New Inquiry: ${contactData.subject}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0; font-size: 28px; letter-spacing: 2px;">EVENIZERS</h1>
          <p style="color: #888; font-size: 14px; margin-top: 5px;">New Website Inquiry</p>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="margin-top: 0; font-size: 20px; color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; display: inline-block;">Inquiry Details</h2>
          
          <div style="margin-top: 20px;">
            <p style="margin: 10px 0; color: #555;"><strong>Name:</strong> ${contactData.name}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: #D4AF37; text-decoration: none;">${contactData.email}</a></p>
            <p style="margin: 10px 0; color: #555;"><strong>Phone:</strong> ${contactData.phone || "Not Provided"}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Subject:</strong> ${contactData.subject}</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #D4AF37;">
            <h3 style="margin-top: 0; font-size: 16px; color: #333;">Message:</h3>
            <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">${contactData.message}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${contactData.email}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reply to Client</a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Evenizers. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  const userMailOptions = {
    from: SENDER_IDENTITY,
    to: contactData.email,
    subject: `✨ We've Received Your Inquiry: ${contactData.subject}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0; font-size: 28px; letter-spacing: 2px;">EVENIZERS</h1>
          <p style="color: #888; font-size: 14px; margin-top: 5px;">Your Event, Our Passion</p>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="margin-top: 0; font-size: 20px; color: #333;">Hello ${contactData.name},</h2>
          <p style="color: #555; line-height: 1.6;">Thank you for reaching out to <strong>Evenizers</strong>!</p>
          <p style="color: #555; line-height: 1.6;">We have received your message regarding <strong>"${contactData.subject}"</strong>. Our team is already reviewing your details and will get back to you within 24-48 hours to discuss how we can make your event extraordinary.</p>
          
          <div style="margin: 30px 0; padding: 20px; border: 1px dashed #D4AF37; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #888; font-style: italic;">"Transforming spaces and creating memories that last a lifetime."</p>
          </div>

          <p style="color: #555; line-height: 1.6;">In the meantime, feel free to explore our latest event collections on our website.</p>
          
          <p style="margin-top: 30px; color: #333;">Best regards,<br><strong>Team Evenizers</strong></p>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Evenizers. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);
    console.log("✅ Inquiry emails sent successfully.");
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

// 3. Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: SENDER_IDENTITY, // ✅ Fixed
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
    console.log(`✅ OTP sent to ${email} FROM ${process.env.ADMIN_EMAIL}`);
  } catch (error) {
    console.error("❌ OTP Email Error:", error.message);
    throw new Error("Email could not be sent");
  }
};

// 4. Send Vendor Broadcast Email
const sendVendorBroadcast = async (vendorEmail, vendorName, order, acceptLink) => {
  const uniqueId = Math.random().toString(36).substring(7);

  const itemsHtml = order.items.map(item => `
    <div style="margin-bottom: 10px; border-bottom: 1px dashed #ddd; padding-bottom: 10px;">
        <p style="margin: 2px 0;"><strong>🎉 Event:</strong> ${item.product?.name || "Event Package"}</p>
        <p style="margin: 2px 0;"><strong>📅 Date:</strong> ${item.eventDate || "Not Set"}</p>
        <p style="margin: 2px 0;"><strong>⏰ Time:</strong> ${item.timeSlot || "Not Set"}</p>
    </div>
  `).join("");

  const mailOptions = {
    from: SENDER_IDENTITY, // ✅ Fixed
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
    from: SENDER_IDENTITY, // ✅ Fixed
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

// 5. Send Review Notification to Admin
const sendReviewNotification = async (reviewData, productName) => {
  const mailOptions = {
    from: SENDER_IDENTITY,
    to: process.env.ADMIN_EMAIL,
    subject: `⭐ New Review for ${productName}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fafafa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0; font-size: 28px; letter-spacing: 2px;">EVENIZERS</h1>
          <p style="color: #888; font-size: 14px; margin-top: 5px;">New Customer Review</p>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="margin-top: 0; font-size: 20px; color: #333; border-bottom: 2px solid #ffcc00; padding-bottom: 10px; display: inline-block;">Review Details</h2>
          
          <div style="margin-top: 20px;">
            <p style="margin: 10px 0; color: #555;"><strong>Product:</strong> ${productName}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Reviewer:</strong> ${reviewData.name}</p>
            <p style="margin: 10px 0; color: #555;"><strong>Rating:</strong> ${"⭐".repeat(reviewData.rating)} (${reviewData.rating}/5)</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #ffcc00;">
            <h3 style="margin-top: 0; font-size: 16px; color: #333;">Comment:</h3>
            <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">${reviewData.comment || "No comment provided."}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; color: #888; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Evenizers. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Review notification sent to ADMIN");
  } catch (error) {
    console.error("❌ Review Notification Error:", error.message);
  }
};

// 🚨 EXPORT ALL FUNCTIONS
module.exports = {
  sendOrderEmail,
  sendContactEmail,
  sendOTPEmail,
  sendVendorBroadcast,
  sendResetEmail,
  sendReviewNotification,
};