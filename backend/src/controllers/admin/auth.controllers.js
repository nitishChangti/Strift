import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";
import Jwt from "jsonwebtoken";
import { otpSender, registerOtpSender } from "../../utils/otpSend.user.js";
import { validationResult } from "express-validator";
import { Category } from "../../models/category.js";
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

  const admin = await User.findOne({ phone, role: "admin" });
  if (!admin) {
    throw new ApiError(403, "Admin access denied");
  }

  await otpSender(phone);

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

  if (!admin.otp || admin.otp.length === 0) {
    throw new ApiError(400, "No OTP found");
  }

  const latestOtp = admin.otp[admin.otp.length - 1];

  console.log("db otp:", latestOtp.otpCode);
  console.log("expiry:", latestOtp.otpExpirationTime);

  if (
    String(latestOtp.otpCode) !== otp ||
    latestOtp.otpExpirationTime < new Date()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

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