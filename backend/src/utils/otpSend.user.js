import twilio from "twilio";
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
import { User } from "../models/user.models.js";
import otpGenerator from "otp-generator";

const normalizePhone = (phone) => {
  return phone.startsWith("+") ? phone : `+${phone}`;
};

const otpSender = async (phone) => {
  try {
    const normalizedPhone = normalizePhone(phone);

    // 🔒 Existing user only
    const user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      return { success: false, message: "User does not exist" };
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 1000);

    // ✅ STORE AS ARRAY (SCHEMA COMPATIBLE)
    user.otp = [
      {
        otpCode: otp,
        otpGeneratedTime: now,
        otpExpirationTime: expiresAt,
      },
    ];

    await user.save();
    console.log("OTP SAVED:", user.otp);

    // SMS send can be enabled later
    // await client.messages.create({ ... });
    const result = await client.messages.create({
      body: `Your OTP is : ${otp}`,
      to: normalizedPhone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
     console.log("Twilio OTP send result:", result);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("OTP Sender Error:", error.message);
    return { success: false, message: "OTP sending failed" };
  }
};

const registerOtpSender = async (phone) => {
  try {
    // Normalize phone number
    const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;

    // 1️⃣ User must NOT exist
    const existingUser = await User.findOne({ phone: normalizedPhone });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    // 2️⃣ Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 1000); // 1 minute

    // 3️⃣ Create temporary user with OTP
    await User.create({
      phone: normalizedPhone,
      otp: [
        {
          otpCode: otp,
          otpGeneratedTime: now,
          otpExpirationTime: expiresAt,
        },
      ],
    });

    // 4️⃣ SEND OTP VIA TWILIO ✅
    const result = await client.messages.create({
      body: `Your OTP is : ${otp}`,
      to: normalizedPhone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
   
    console.log("Twilio OTP send result:", result);

    return {
      success: true,
      message: "OTP sent for registration",
    };
  } catch (error) {
    console.error("Register OTP Error:", error.message);
    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
};

export { otpSender, registerOtpSender };
