import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";
import Jwt from "jsonwebtoken";
import { otpSender, registerOtpSender } from "../../utils/otpSend.user.js";
import { validationResult } from "express-validator";
import { Category } from "../../models/category.js";
import redisClient from '../../utils/redisClient.js'
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    console.log(`user id is : ${userId}`);
    const user = await User.findById(userId);

    console.log(`user  is : ${user}`);
    const accessToken = Jwt.sign(
      { userId: user._id, role: user.role, phone: user.phone },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = Jwt.sign(
      { userId: user._id, role: user.role, phone: user.phone },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

export const sendAdminOtp = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const { phone } = req.body;
  console.log(phone);
  const admin = await User.findOne({ phone, role: "admin" });
  if (!admin) {
    throw new ApiError(403, "Admin access denied");
  }

  const otpResult = await otpSender(phone);
  console.log('otp result',otpResult);
  return res.status(200).json(
    new ApiResponse(200, null, "OTP sent to admin")
  );
});
export const verifyAdminOtp = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const phone = normalizePhone(req.body.phone);
  const otp = String(req.body.otp);

  console.log("normalized phone:", phone);
  console.log("user otp:", otp);

  const admin = await User.findOne({ phone, role: "admin" });
  if (!admin) {
    throw new ApiError(403, "Admin access denied");
  }


  // 🔥 GET OTP FROM REDIS
  const redisData = await redisClient.get(`otp:${phone}`);

  if (!redisData) {
    throw new ApiError(400, "OTP expired or not found");
  }

  const otpData = JSON.parse(redisData);

  console.log("redis otp:", otpData.otpCode);
  console.log("expiry:", otpData.otpExpirationTime);

 // 🔐 Hash user input
  const hashedInput = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // ✅ Validate OTP
  if (otpData.otpCode !== hashedInput) {
    throw new ApiError(400, "Invalid OTP");
  }

  // ✅ DELETE OTP (one-time use)
  await redisClient.del(`otp:${phone}`);



  // if (!admin.otp || admin.otp.length === 0) {
  //   throw new ApiError(400, "No OTP found");
  // }

  // const latestOtp = admin.otp[admin.otp.length - 1];

  // console.log("db otp:", latestOtp.otpCode);
  // console.log("expiry:", latestOtp.otpExpirationTime);

  // if (
  //   String(latestOtp.otpCode) !== otp ||
  //   latestOtp.otpExpirationTime < new Date()
  // ) {
  //   throw new ApiError(400, "Invalid or expired OTP");
  // }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(admin._id);

  admin.refreshToken = refreshToken;
  admin.otp = []; // clear all OTPs
  await admin.save({ validateBeforeSave: false });

  res
    .cookie("accessToken", accessToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .json(
      new ApiResponse(200, { admin }, "Admin logged in successfully")
    );
});

const normalizePhone = (phone) => {
  let p = phone.replace(/\s+/g, "");
  if (p.startsWith("+91") && p.length === 13) return p;
  if (!p.startsWith("+")) return `+91${p}`;
  return p;
};
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch categories",
    });
  }
};

export const adminLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  if (!req.session) {
    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json(new ApiResponse(200, null, "Admin logged out successfully", true));
  }

  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ err: "failed to logout, please try again." });
    }

    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json(new ApiResponse(200, null, "Admin logged out successfully", true));
  });
});
