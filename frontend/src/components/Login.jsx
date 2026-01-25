import React, { useEffect, useState } from 'react';
import { PhoneInput, Input, Button } from './index.js';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import authService from '../services/auth.js';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice.js';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, control, getValues } = useForm();

  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const api = 'account/login?ret=/';

  // =========================
  // SUBMIT HANDLER
  // =========================
  const handleLogin = async (data) => {
    try {
      setError('');

      // ---------- STEP 1: SEND OTP ----------
      if (!otpSent) {
        const phone = `+${data.phone}`;

        const result = await authService.phoneSend({ phone, api });
        console.log('Login OTP send response:', result);

        if (result?.success === true) {
          setOtpSent(true);
          setCountdown(60);
        } else {
          setError(result?.message || 'Failed to send OTP');
        }
        return;
      }

      // ---------- STEP 2: VERIFY OTP ----------
      const result = await authService.verifyOtp({
        phone: `+${data.phone}`,
        otp: data.otp,
        api
      });

      console.log('Login OTP verify response:', result);

      if (result?.success === true) {
        // ✅ USE USER FROM verifyOtp RESPONSE
        dispatch(authLogin(result.user));
        navigate('/');
      } else {
        setError(result?.message || 'Invalid or expired OTP');
      }

    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const resendOtp = async () => {
    try {
      setError('');
      const phone = getValues('phone');

      if (!phone) {
        setError('Please enter your phone number first');
        return;
      }

      const result = await authService.phoneSend({
        phone: `+${phone}`,
        api
      });

      if (result?.success === true) {
        setCountdown(60);
        setOtpSent(true);
      } else {
        setError(result?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to resend OTP. Please try again.');
    }
  };

  // =========================
  // COUNTDOWN TIMER
  // =========================
  useEffect(() => {
    if (otpSent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpSent, countdown]);

  // =========================
  // UI
  // =========================
  return (
    <div className="w-full min-h-screen flex justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 pt-5 relative overflow-hidden">

      {/* Floating background elements */}
      <div className="absolute w-full h-full">
        <div className="absolute bg-white/20 rounded-full w-32 h-32 top-10 left-20 animate-pulse"></div>
        <div className="absolute bg-white/20 rounded-full w-24 h-24 top-48 right-10 animate-pulse"></div>
        <div className="absolute bg-white/10 rounded-full w-40 h-40 bottom-10 left-32 animate-pulse"></div>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="h-fit relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-[380px] max-w-md flex flex-col gap-6 p-10"
      >
        <h2 className="text-2xl font-semibold text-center">
          {otpSent ? 'Verify OTP' : 'Login'}
        </h2>

        {error && (
          <span className="text-red-500 text-sm font-medium text-center">
            {error}
          </span>
        )}

        {/* PHONE INPUT */}
        {!otpSent ? (
          <>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^\d{10,15}$/
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="Enter your phone number"
                  className="w-full h-12 border rounded-lg px-3 focus:ring-2 focus:ring-pink-400"
                />
              )}
            />

            <Button type="submit" className="w-full">
              Request OTP
            </Button>
          </>
        ) : (
          <>
            <Input
              maxLength={6}
              className="w-full h-12 border rounded-lg px-3 text-center tracking-widest focus:ring-2 focus:ring-purple-400"
              placeholder="Enter 6-digit OTP"
              {...register('otp', {
                required: true,
                pattern: /^\d{6}$/
              })}
            />

            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </>
        )}

        {/* RESEND */}
        {otpSent && (
          <div className="text-center text-sm text-gray-700">
            {countdown === 0 ? (
              <span
                onClick={resendOtp}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Resend OTP
              </span>
            ) : (
              <>Resend in {countdown}s</>
            )}
          </div>
        )}

        <div className="text-center text-sm mt-2">
          New to Strift?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
