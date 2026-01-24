import twilio from 'twilio';
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
import { User } from '../models/user.models.js';
import otpGenerator from 'otp-generator';
// import { message } from 'statuses';
import { signUpTempData } from '../controllers/user/user.controllers.js';   // imported the var from user.controllers.js
const otpSender = async (phone) => {
    try {
        console.log(phone)
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        console.log(otp, 'here otp is generated')

        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + 60000); // 1 minute expiration for otp
        console.log(`currentTime of otp is ${currentTime} and expirationTime of otp is ${expirationTime}`)

        const userres = await User.findOneAndUpdate({ phone: phone }, {
            otp: {
                otpCode: otp,
                otpGeneratedTime: currentTime,
                otpExpirationTime: expirationTime
            }
        }, { upsert: true, new: true, setDefaultsOnInsert: true })

        console.log(` user is requeseted for login : ${userres}`)
        console.log('phone:', phone, 'TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER, 'and otp is',otp)

        // const result = await client.messages.create({
        //     body: `Your OTP is : ${otp}`,
        //     to: phone,
        //     from: process.env.TWILIO_PHONE_NUMBER
        // })
        // console.log(' OTP sent successfully: result', result)
        return { message: 'otp sent Successfully' }
        // res.status(200).json({ message: 'otp sent Successfully' })
    } catch (error) {
        // res.status(400).json({
        //     success: false,
        //     message: error.message
        // })
        console.log(error)
        return { message: 'otpsending error is occured' }
    }
}

const registerOtpSender = async (req, phone) => {
    try {
        // console.log(phone)
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false })
        console.log(otp, 'here otp is generated')

        const currentTime = new Date();
        const expirationTime = new Date(currentTime.getTime() + 60000); // 1 minute expiration
        console.log(`currentTime of otp is ${currentTime} and expirationTime of otp is ${expirationTime}`)


        // req.session.tempOtp = otp;
        signUpTempData.otp = otp;
        // req.session.tempOtpGeneratedTime = currentTime;
        signUpTempData.otpGeneratedTime = currentTime;
        // req.session.tempOtpExpirationTime = expirationTime;
        signUpTempData.otpExpirationTime = expirationTime;
        // await req.session.save();
        // console.log(req) //req is req
        // console.log(req.session)
        console.log(phone, process.env.TWILIO_PHONE_NUMBER)
        // const result = await client.messages.create({
        //     body: `Your OTP is : ${otp}`,
        //     to: phone,
        //     from: process.env.TWILIO_PHONE_NUMBER
        // })
        // console.log(result)
        return { message: 'otp sent Successfully' }
        // res.status(200).json({ message: 'otp sent Successfully' })
    }
    catch (error) {
        // res.status(400).json({
        //     success: false,
        //     message: error.message
        // })
        // return error.message('otpsending error is occured')
        console.error(`Error sending OTP to ${phone}: ${error.message}`)
        return { message: `Error sending OTP to ${phone}: ${error.message}` }
    }
}

export { otpSender, registerOtpSender };