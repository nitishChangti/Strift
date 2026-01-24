import React, { useEffect, useState } from "react";
import { PhoneInput, Input, Button } from "../components";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    <div className="w-full h-screen flex justify-center items-start pt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit(handleAdminLogin)}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!otpSent ? (
          <Controller
            name="phone"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                placeholder="Admin phone number"
                className="w-full h-12 border rounded px-3"
              />
            )}
          />
        ) : (
          <Input
            maxLength={6}
            placeholder="Enter OTP"
            {...register("otp", { required: true })}
          />
        )}

        <Button type="submit" className="bg-black text-white py-2 rounded">
          {otpSent ? "Verify OTP" : "Request OTP"}
        </Button>

        {otpSent && (
          <p className="text-center text-sm">
            {countdown > 0 ? (
              `Resend OTP in ${countdown}s`
            ) : (
              <span
                className="text-blue-500 cursor-pointer"
                onClick={resendOtp}
              >
                Resend OTP
              </span>
            )}
          </p>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;
