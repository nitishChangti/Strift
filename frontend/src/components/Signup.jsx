import React, { useEffect, useState } from 'react';
import { Container, PhoneInput, Input, Button } from './index.js';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.js'
import { useDispatch, useSelector } from 'react-redux';
import { register as authSignUp } from '../store/authSlice.js';

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, control, getValues } = useForm()
    const [error, setError] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpsent, setOtpSent] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const handleLogin = async (data) => {
        try {
            console.log(data);
            const api = `account/register?signup=true`
            if (!otpsent) {
                setError("");
                const phone = `+${data.phone}`; // Ensure phone number is in E.164 format
                const result = await authService.phoneSend({ phone, api })
                console.log('Response of phone send:', result);
                console.log(`+${data.phone}`, result.data.user.phone)
                if (`+${data.phone}` === result.data.user.phone) {
                    setError("Phone number already exists. Please log in.");
                    setOtpSent(false)
                    return;
                }
                else {

                    // const result = true;
                    if (result) {
                        // const userData = await authService.getCurrentUser()
                        // if (userData) {
                        // dispatch(authLogin(userData));
                        setOtpSent(true);
                        setShowMessage(false);
                        setError("");
                        // }
                        console.log('otp is sended to phone number')
                    }
                    else {
                        setError("Failed to send OTP. Please try again.");
                    }
                }
            } else {
                console.log(' sending otp to backend', data.otp)
                const result = await authService.verifyOtp({ phone: data.phone, otp: data.otp, api: api });
                console.log(' Response of otp verify:', result);
                // const result = true; // Simulating successful login
                if (result) {

                    const userData = await authService.getCurrentUser()
                    console.log('userdata', userData.user)
                    if (userData) {
                        dispatch(authSignUp(userData.user));
                        setOtpSent(false);
                        setShowMessage(true);
                        setError("");
                        // Redirect to home or dashboard
                        navigate('/');
                    }
                }
                else {
                    setError("Invalid OTP. Please try again.");
                }
            }
        }
        catch (err) {
            console.error(err);
            setError("An error occurred. Please try again later.");
        }
    }
    const resendOtp = async () => {
        setError("");
        try {
            const phone = getValues('phone');
            if (!phone) {
                setError("Please enter your phone number first");
                return;
            }
            const api = `account/register?signup=true`
            const result = await authService.phoneSend({ phone: `+${phone}`, api });
            console.log('Response of phone send (resend):', result);
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
    }

    useEffect(() => {
        if (otpsent && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) clearInterval(timer);
                    return prev - 1
                });
            }, 1000);
            // setShowMessage(false);
            return () => {
                clearInterval(timer);
            }
        }
    }, [otpsent, countdown])

    return (
        <div className='w-full h-screen  flex  justify-center pt-20 '>
            <form onSubmit={handleSubmit(handleLogin)} className=' rounded-xl shadow-2xl/50 w-120 h-120 flex flex-col gap-1  items-center pt-25'>
                {error && <span className='text-red-500'>{error}</span>}
                {!otpsent ? (

                    <div className='flex flex-col justify-center items-center gap-5'>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true, pattern: {
                                    value: /^\+?[1-9]\d{9,14}$/, // Allows + and minimum 10 digits
                                    message: "Enter a valid international phone number"
                                },
                            }}
                            render={({ field }) => (
                                <PhoneInput
                                    // {...register('phone', { required: true })}
                                    name={field.name}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value.replace(/[^\d+]/g, ''))}
                                    placeholder='Enter your phone number'
                                    className="w-80 h-10 border rounded px-3 py-2 pl-10 " />
                            )}
                        />
                        <Button type='submit' className='w-80'>Request OTP</Button>
                        <Link to="/login">
                            <Button type='submit' className='w-80'>Existing User? Log in</Button>
                        </Link>
                    </div>
                ) : (
                    <div className='flex flex-col gap-5'>
                        <Input maxLength={6} className="border w-80 h-10 rounded-sm p-2" name="otp" type='text' placeholder="enter 4 digit  otp" {...register('otp', {
                            required: true,
                            pattern: {
                                value: /^\d{6}$/,
                                message: "OTP must be exactly 6 digits"
                            }
                        })} />
                        <Button type='submit' className='w-80'>Verify OTP</Button>
                        <Link to="/login">
                            <Button type='submit' className='w-80'>Existing User? Log in</Button>
                        </Link>
                    </div>
                )}
                {
                    !showMessage && otpsent ? (<span>Not recieved your code? {countdown === 0 ? (<span onClick={resendOtp} className='text-blue-600 cursor-pointer'>Resend OTP</span>) : countdown} </span>) : (
                        // <span>New to Strift? <Link to="/signup" className='text-blue-400 font-semibold'>Create an account</Link></span>
                        <></>
                    )
                }
            </form>
        </div>
    );
}

export default Signup;