const axios = require("axios");

/**
 * Utility to send SMS OTPs.
 * Supports MSG91 (Recommended), Fast2SMS, and Aisensy.
 *
 * @param {string} phone - 10 digit Indian mobile number
 * @param {string} otp - The 6 digit OTP to send
 */
const sendSMS = async (phone, otp) => {
    try {
        // 1. MSG91 Implementation (Multichannel Flow)
        if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
            console.log(`📡 Sending OTP ${otp} to ${phone} via MSG91 (WhatsApp/SMS Flow)...`);

            const response = await axios.post(`https://control.msg91.com/api/v5/flow/`, {
                template_id: process.env.MSG91_TEMPLATE_ID,
                sender: process.env.MSG91_SENDER || "",
                recipients: [{
                    mobiles: `91${phone}`,
                    mobile: `91${phone}`,
                    OTP: otp,
                    otp: otp,
                    var: otp,
                    var1: otp,
                    // Matched to user's ##OTP## template variable
                }]
            }, {
                headers: {
                    "authkey": process.env.MSG91_AUTH_KEY,
                    "Content-Type": "application/json"
                }
            });

            console.log("✅ MSG91 Flow Response:", response.data);
            return true;
        }

        // 2. Fast2SMS Implementation (Secondary/Backup)
        if (process.env.FAST2SMS_KEY && process.env.FAST2SMS_KEY !== "your_fast2sms_api_key_here") {
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
        }

        // 3. Aisensy WhatsApp Implementation
        if (process.env.AISENSY_KEY && process.env.AISENSY_KEY !== "your_aisensy_api_key_here") {
            console.log(`📡 Sending OTP ${otp} to ${phone} via Aisensy WhatsApp...`);
            await axios.post(
                "https://backend.aisensy.com/campaign/t1/api/v2",
                {
                    apiKey: process.env.AISENSY_KEY,
                    campaignName: "otp_login",
                    destination: `+91${phone}`,
                    userName: "User",
                    templateParams: [otp],
                }
            );
            return true;
        }

        // 4. Fallback for Local Development
        console.log("-----------------------------------------");
        console.log(`🚨 NO VALID SMS API KEY SET in .env`);
        console.log(`🚨 DEV MODE: OTP for ${phone} is: [ ${otp} ]`);
        console.log("-----------------------------------------");
        return true;

    } catch (error) {
        console.error("❌ SMS Error Details:", error?.response?.data || error.message);

        // Final fallback so UI keeps moving during setup
        console.log("-----------------------------------------");
        console.log(`🚨 FALLBACK DEV MODE: OTP for ${phone} is: [ ${otp} ]`);
        console.log("-----------------------------------------");
        return true;
    }
};

module.exports = { sendSMS };
