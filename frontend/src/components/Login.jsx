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

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setFocus,
    formState: { errors }
  } = useForm();

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);

  const api = 'account/login?ret=/';

  // =========================
  // SUBMIT HANDLER
  // =========================
  const handleLogin = async (data) => {
    try {
      setError('');
      setInfo('');
      setLoading(true);

      // ---------- STEP 1: SEND OTP ----------
      if (!otpSent) {
        const phone = `+${data.phone}`;

        const result = await authService.phoneSend({ phone, api });
        console.log('Login OTP send res:', result);

        if (result?.success === true) {
          setOtpSent(true);
          setCountdown(60);
          setInfo(`OTP sent to ${phone}`);
          setTimeout(() => setFocus('otp'), 0);
        } else {
          setError(result?.message || 'Failed to send OTP');
        }
        setLoading(false);
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
        const loggedInUser = result?.data?.user ?? result?.user;
        dispatch(authLogin(loggedInUser));
        navigate('/');
      } else {
        setError(result?.message || 'Invalid or expired OTP');
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(
        err?.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  // =====================
  // RESEND OTP
  // =====================
  const resendOtp = async () => {
    try {
      setError('');
      setInfo('');
      setLoading(true);
      const phone = getValues('phone');

      if (!phone) {
        setError('Please enter your phone number first');
        setLoading(false);
        return;
      }

      const result = await authService.phoneSend({
        phone: `+${phone}`,
        api
      });

      if (result?.success === true) {
        setCountdown(60);
        setOtpSent(true);
        setInfo(`OTP resent to +${phone}`);
      } else {
        setError(result?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setCountdown(60);
    setError('');
    setInfo('');
    setTimeout(() => setFocus('phone'), 0);
  };

  // =====================
  // COUNTDOWN TIMER
  // =====================
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
        <p className="text-center text-sm text-gray-600">
          {otpSent
            ? 'Enter the 6-digit code we sent to your number'
            : 'Use your mobile number to receive a one-time code'}
        </p>
        {error && (
          <span className="rounded-lg bg-red-50 px-3 py-2 text-red-600 text-sm font-medium text-center">
            {error}
          </span>
        )}
        {info && (
          <span className="rounded-lg bg-green-50 px-3 py-2 text-green-700 text-sm font-medium text-center">
            {info}
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
                  className="w-full h-12 border rounded-lg px-10 pl-16 focus:ring-2 focus:ring-pink-400"
                />
              )}
            />
            {errors.phone && (
              <span className="text-sm text-red-500 -mt-3">
                Enter a valid phone number.
              </span>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sending OTP...' : 'Request OTP'}
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <div className="font-medium text-gray-900">Phone number</div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span>+{getValues('phone')}</span>
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
            <Input
              maxLength={6}
              className="w-full h-12 border rounded-lg px-3 text-center tracking-widest focus:ring-2 focus:ring-purple-400"
              placeholder="Enter 6-digit OTP"
              {...register('otp', {
                required: true,
                pattern: /^\d{6}$/
              })}
            />
            {errors.otp && (
              <span className="text-sm text-red-500 -mt-3">
                Enter a valid 6-digit OTP.
              </span>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}

        {/* RESEND */}
        {otpSent && (
          <div className="text-center text-sm text-gray-700">
            {countdown === 0 ? (
              <button
                type="button"
                onClick={resendOtp}
                disabled={loading}
                className="text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
              >
                Resend OTP
              </button>
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
