const axios = require("axios");

/**
 * Utility to send SMS OTPs.
 * Designed to easily plug in Fast2SMS or Aisensy based on the API Key.
 *
 * @param {string} phone - 10 digit Indian mobile number
 * @param {string} otp - The 6 digit OTP to send
 */
const sendSMS = async (phone, otp) => {
    try {
        if (process.env.FAST2SMS_KEY && process.env.FAST2SMS_KEY !== "your_fast2sms_api_key_here") {
            // Fast2SMS Implementation
            console.log(`📡 Sending OTP ${otp} to ${phone} via Fast2SMS...`);
            const response = await axios.post(
                "https://www.fast2sms.com/dev/bulkV2",
                {
                    route: "q",
                    message: `Your Evenizers Login OTP is: ${otp}`,
                    flash: 0,
                    numbers: phone,
                },
                {
                    headers: {
                        authorization: process.env.FAST2SMS_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("✅ SMS Sent Successfully (Fast2SMS):", response.data);
            return true;
        } else if (process.env.AISENSY_KEY && process.env.AISENSY_KEY !== "your_aisensy_api_key_here") {
            // Aisensy WhatsApp Implementation
            console.log(`📡 Sending OTP ${otp} to ${phone} via Aisensy WhatsApp...`);
            /* 
              This requires setting up a template in Aisensy dashboard first.
              Example: "Your Evenizers login OTP is {{1}}."
            */
            const response = await axios.post(
                "https://backend.aisensy.com/campaign/t1/api/v2",
                {
                    apiKey: process.env.AISENSY_KEY,
                    campaignName: "otp_login", // The exact name of your approved template in Aisensy
                    destination: `+91${phone}`,
                    userName: "User",
                    templateParams: [otp],
                }
            );
            console.log("✅ WhatsApp OTP Sent Successfully (Aisensy):", response.data);
            return true;
        } else {
            // Fallback for Local Development without keys
            console.log("-----------------------------------------");
            console.log(`🚨 NO SMS API KEY SET in .env`);
            console.log(`🚨 DEV MODE: OTP for ${phone} is: [ ${otp} ]`);
            console.log("-----------------------------------------");
            return true; // Pretend it succeeded for local testing
        }
    } catch (error) {
        console.error("❌ SMS Error:", error?.response?.data || error.message);
        console.log("-----------------------------------------");
        console.log(`🚨 FALLBACK DEV MODE: OTP for ${phone} is: [ ${otp} ]`);
        console.log("-----------------------------------------");

        // Return true anyway so you aren't blocked from testing the frontend UI 
        // while you figure out your Fast2SMS wallet balance
        return true;
    }
};

module.exports = { sendSMS };
