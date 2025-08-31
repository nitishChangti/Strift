import React, { useEffect, useState } from 'react';
import { Container, PhoneInput, Input, Button } from './index.js';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.js';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/authSlice.js';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, control, getValues } = useForm();
    const [error, setError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpsent, setOtpSent] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const handleLogin = async (data) => {
        try {
            const api = `account/login?ret=/`;
            if (!otpsent) {
                setError("");
                const phone = `+${data.phone}`;
                const result = await authService.phoneSend({ phone, api });
                if (result) {
                    setOtpSent(true);
                    setShowMessage(false);
                    setError("");
                } else {
                    setError("Failed to send OTP. Please try again.");
                }
            } else {
                const result = await authService.verifyOtp({ phone: data.phone, otp: data.otp, api: api });
                if (result) {
                    const userData = await authService.getCurrentUser();
                    if (userData) {
                        dispatch(authLogin(userData.user));
                        setOtpSent(false);
                        setShowMessage(true);
                        setError("");
                        navigate('/');
                    }
                } else {
                    setError("Invalid OTP. Please try again.");
                }
            }
        } catch (err) {
            console.error(err.response?.data);
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    const resendOtp = async () => {
        setError("");
        try {
            const phone = getValues('phone');
            if (!phone) {
                setError("Please enter your phone number first");
                return;
            }
            const api = `account/login?ret=/`;
            const result = await authService.phoneSend({ phone: `+${phone}`, api });
            if (result) {
                setError("");
                setCountdown(60);
                setOtpSent(true);
                setShowMessage(false);
            } else {
                setError("Failed to resend OTP. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to resend OTP. Please try again.");
        }
    };

    useEffect(() => {
        if (otpsent && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) clearInterval(timer);
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [otpsent, countdown]);

    return (
        <div className="w-full h-screen flex justify-center items-start pt-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 overflow-hidden relative">
            {/* Animated floating particles */}
            <div className="absolute w-full h-full">
                <div className="animate-pulse-slow absolute bg-white rounded-full opacity-20 w-32 h-32 top-10 left-20"></div>
                <div className="animate-pulse-slow absolute bg-white rounded-full opacity-20 w-24 h-24 top-48 right-10"></div>
                <div className="animate-pulse-slow absolute bg-white rounded-full opacity-10 w-40 h-40 bottom-10 left-32"></div>
                <div className="animate-pulse-slow absolute bg-white rounded-full opacity-15 w-20 h-20 bottom-32 right-20"></div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-120 max-w-md flex flex-col gap-6 items-center p-10 transition-transform transform hover:scale-105 motion-safe:animate-fadeIn"
            >
                {error && <span className='text-red-500 font-semibold animate-pulse'>{error}</span>}

                {!otpsent ? (
                    <div className='flex flex-col justify-center items-center gap-6 w-full'>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                pattern: {
                                    value: /^\+?[1-9]\d{9,14}$/,
                                    message: "Enter a valid international phone number"
                                },
                            }}
                            render={({ field }) => (
                                <PhoneInput
                                    name={field.name}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value.replace(/[^\d+]/g, ''))}
                                    placeholder='Enter your phone number'
                                    className="w-full h-12 border rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-pink-400 transition duration-300 shadow-sm"
                                />
                            )}
                        />
                        <Button type='submit' className='w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform'>
                            Request OTP
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col gap-5 w-full'>
                        <Input
                            maxLength={6}
                            className="border w-full h-12 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 transition duration-300 shadow-sm"
                            name="otp" type='text'
                            placeholder="Enter 6 digit OTP"
                            {...register('otp', {
                                required: true,
                                pattern: {
                                    value: /^\d{6}$/,
                                    message: "OTP must be exactly 6 digits"
                                }
                            })}
                        />
                        <Button type='submit' className='w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform'>
                            Verify OTP
                        </Button>
                    </div>
                )}

                {!showMessage && otpsent ? (
                    <span className='text-sm text-gray-700'>
                        Not received your code? {countdown === 0 ? (
                            <span onClick={resendOtp} className='text-blue-600 font-medium cursor-pointer hover:underline animate-bounce'>Resend OTP</span>
                        ) : countdown}
                    </span>
                ) : (
                    <span className='text-sm text-gray-700'>
                        New to Strift? <Link to="/signup" className='text-blue-400 font-semibold hover:underline'>Create an account</Link>
                    </span>
                )}
            </form>
        </div>
    );
}

export default Login;
