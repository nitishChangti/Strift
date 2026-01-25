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

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("OTP Sender Error:", error.message);
    return { success: false, message: "OTP sending failed" };
  }
};

const registerOtpSender = async (phone) => {
  const normalizedPhone = phone.startsWith("+") ? phone : `+${phone}`;

  // user must NOT exist
  const existingUser = await User.findOne({ phone: normalizedPhone });
  if (existingUser) {
    return { success: false, message: "User already exists" };
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 60 * 1000);

  // create temp user with OTP
  const user = await User.create({
    phone: normalizedPhone,
    otp: [
      {
        otpCode: otp,
        otpGeneratedTime: now,
        otpExpirationTime: expiresAt,
      },
    ],
  });

  console.log("REGISTER OTP:", otp); // replace with SMS

  return { success: true };
};

export { otpSender, registerOtpSender };
