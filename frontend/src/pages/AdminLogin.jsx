import React, { useEffect, useState } from "react";
import { PhoneInput, Input, Button, Logo } from "../components";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/auth.js";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, control, getValues } = useForm();

  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const handleAdminLogin = async (data) => {
    try {
      setError("");

      const phone = data.phone.startsWith("+")
        ? data.phone
        : `+${data.phone}`;

      // PHASE 1: SEND OTP
      if (!otpSent) {
        await authService.adminSendOtp(phone);
        setOtpSent(true);
        setCountdown(60);
        return;
      }
      console.log('this verify otp');
      // PHASE 2: VERIFY OTP
      const res = await authService.adminVerifyOtp(phone, data.otp);

      dispatch(authLogin(res.data.admin));
      navigate("/admin");

    } catch (err) {
      setError(err?.response?.data?.message || "Admin login failed");
    }
  };

  const resendOtp = async () => {
    try {
      const phone = getValues("phone");
      if (!phone) {
        setError("Enter phone number first");
        return;
      }
      await authService.adminSendOtp(`+${phone}`);
      setCountdown(60);
    } catch {
      setError("Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, countdown]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="p-4">
        <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
      </div>
      <div className="flex justify-center items-center py-12 px-4">
        <form
          onSubmit={handleSubmit(handleAdminLogin)}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Admin Login</h2>
          <p className="text-center text-gray-600 text-sm mb-6">Access your admin dashboard</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {!otpSent ? (
            <Controller
              name="phone"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="Admin phone number"
                  className="w-full h-12 border pl-16 border-gray-300 rounded px-3 mb-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              )}
            />
          ) : (
            <Input
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              {...register("otp", { required: true })}
              className="w-full h-12 border border-gray-300 rounded px-3 mb-4 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          )}

          <Button 
            type="submit" 
            className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-900 transition-all duration-200 active:scale-95"
          >
            {otpSent ? "Verify OTP" : "Request OTP"}
          </Button>

          {otpSent && (
            <p className="text-center text-sm text-gray-600 mt-4">
              {countdown > 0 ? (
                `Resend OTP in ${countdown}s`
              ) : (
                <span
                  className="text-black cursor-pointer font-medium hover:underline"
                  onClick={resendOtp}
                >
                  Resend OTP
                </span>
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
