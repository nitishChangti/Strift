import React, { useEffect, useState } from 'react';
import { PhoneInput, Input, Button } from './index.js';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import authService from '../services/auth.js';
import { useDispatch } from 'react-redux';
import { register as authSignUp } from '../store/authSlice.js';

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { handleSubmit, control, register, getValues } = useForm();

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);

  const api = 'account/register?signup=true';

  // =========================
  // SUBMIT HANDLER
  // =========================
  const handleSignup = async (data) => {
    try {
      setError('');
      setInfo('');
      setLoading(true);

      // ---------- SEND OTP ----------
      if (!otpSent) {
        const phone = `+${data.phone}`;
        const result = await authService.phoneSend({ phone, api });

        if (result?.success === true) {
          setOtpSent(true);
          setCountdown(60);
          setInfo('OTP sent to your mobile number');
        } else {
          setError(result?.message || 'Failed to send OTP');
        }
        setLoading(false);
        return;
      }

      // ---------- VERIFY OTP ----------
      const result = await authService.verifyOtp({
        phone: `+${data.phone}`,
        otp: data.otp,
        api
      });

      if (result?.success === true) {
        dispatch(authSignUp(result.user));
        navigate('/');
      } else {
        setError(result?.message || 'Invalid or expired OTP');
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const resendOtp = async () => {
    try {
      const phone = getValues('phone');
      if (!phone) {
        setError('Please enter phone number first');
        return;
      }

      const result = await authService.phoneSend({
        phone: `+${phone}`,
        api
      });

      if (result?.success === true) {
        setCountdown(60);
        setInfo('OTP resent successfully');
      }
    } catch {
      setError('Failed to resend OTP');
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
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-gray-100 to-gray-200 pt-5">
      <form
        onSubmit={handleSubmit(handleSignup)}
        className="h-fit w-[380px] bg-white rounded-2xl px-8 py-10"
        style={{
          boxShadow:
            '0 20px 40px rgba(0,0,0,0.15), 0 10px 15px rgba(0,0,0,0.08)'
        }}
      >
        <h2 className="text-2xl font-semibold text-center mb-2">
          {otpSent ? 'Verify OTP' : 'Create Account'}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {otpSent
            ? 'Enter the OTP sent to your phone'
            : 'Sign up using your mobile number'}
        </p>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        {info && <div className="text-green-600 text-sm mb-3">{info}</div>}

        {!otpSent ? (
          <>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{ required: true, pattern: /^\d{10,15}$/ }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  placeholder="Mobile number"
                  className="w-full h-11 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500"
                />
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 h-11 rounded-lg"
            >
              {loading ? 'Sending OTP…' : 'Request OTP'}
            </Button>
          </>
        ) : (
          <>
            <Input
              maxLength={6}
              className="w-full h-11 border border-gray-300 rounded-lg px-3 tracking-widest text-center"
              placeholder="••••••"
              {...register('otp', { required: true, pattern: /^\d{6}$/ })}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 h-11 rounded-lg"
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
            </Button>
          </>
        )}

        {otpSent && (
          <div className="text-center text-sm text-gray-600 mt-4">
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

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Existing user? Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
