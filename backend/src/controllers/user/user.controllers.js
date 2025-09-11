import { asyncHandler } from '../../utils/asyncHandler.js'
import { User, Address } from '../../models/user.models.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiRes.js';
import otpGenerator from 'otp-generator';
import { body, validationResult } from 'express-validator';
import Jwt from "jsonwebtoken";
import { product } from '../../models/product.js';

import Order from '../../models/order.models.js';

import mongoose, { Schema, mongo } from "mongoose";

import validateMobileNumber from '../../middlewares/validateMobileNumber.middlewares.js';
import { otpSender, registerOtpSender } from '../../utils/otpSend.user.js';
import session from 'express-session';
import moment from 'moment-timezone';
import { stat } from 'fs';


import { errorMonitor } from 'events';
import { log } from 'console';


// ES Module syntax
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { clearFilters } from '../../../../frontend/src/store/productSlice.js';


const TemporyData = {

}
const signUpTempData = {

}

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        console.log(`user id is : ${userId}`)
        const user = await User.findById(userId);

        console.log(`user  is : ${user}`)
        const accessToken = Jwt.sign({ userId: user._id, role: user.role, phone: user.phone }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });
        const refreshToken = Jwt.sign({ userId: user._id, role: user.role, phone: user.phone }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (err) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

const checkUserController = asyncHandler(async (req, res) => {
    console.log('this is  a controller of user checking');
    let { phone } = req.body;
    phone = `+${phone}`
    console.log(phone, req.body)
    if (!phone) {
        throw new ApiError(400, 'Phone number is required');
    }

    const user = await User.findOne({ phone });

    if (user) {
        // ✅ User exists
        return res.status(200).json(new ApiResponse(200, { exists: true }, 'User exists', true));
    } else {
        // ❌ User does not exist
        return res.status(404).json(new ApiResponse(404, { exists: false }, 'User does not exist', false));
    }
});

const userLogin = asyncHandler(async (req, res, next) => {
    // if(req.query==='/'){
    // take  the user input(mobile number) from req
    // validate the mobile number
    //  check if the user exists in the database
    //  if the user exists, then send the otp  to the user and store in database
    //  if the user does not exist, then send a message saying user does not exist and render to signup route
    // }
    // else{
    // redirect to /account/register?sigup=TRUE
    // }

    console.log(req.query.ret === "/");

    const ret = req.query.ret === "/"
    const phone = req.body.phone;
    console.log('phone', phone)
    const otp = req.body.otp;
    console.log(ret)
    if (ret === true) {
        if (!otp) {
            const result = await validateMobileNumber[0].run(req);
            if (phone.startsWith("+") && result.errors.length === 0) {
                console.log('validation is success');
                // return 'done'
                new ApiResponse(200, '', 'phone number is valid', true)
                // res.status(201).json(new ApiResponse(200, '', 'phone number is valid', true))
            }
            else {
                //             // console.log(false); 
                //             console.log(result.errors);
                throw new ApiError(400, 'mobile number  is invalid ')
            }
            const user = await User.findOne({ phone: phone })
            if (user) {
                // console.log(user)   if user exists it gives userOtp data
                console.log('user is exists')
                TemporyData.mobileNumber = user.phone;      /// ---------------------------
                req.session.mobileNumber = user.phone;   //here changed
                await req.session.save()
                console.log(`user mobilenumber is ${req.session.mobileNumber}`)       //here changed
                const loginOtpSender = await otpSender(user.phone)
                console.log('otpSender func is called', loginOtpSender)
                console.log('session', req.session.mobileNumber)
                // Send a response indicating OTP was sent successfully
                return res.status(200).json(new ApiResponse(200, '', 'OTP sent successfully', true));
            }
            else {
                console.log('user doesnot exists')
                // return res.json({ redirect: '/account?signup=true' });
                return res.status(404).json(new ApiResponse(
                    404,
                    '',
                    'User does not exist. Please sign up first',
                    true
                ))
                //             // res.redirect('/account/login?signup=true')
            }
        }
        else {
            console.log('login otp verification section')

            // const phone = req.session.mobileNumber;               //here changed
            const phone = TemporyData.mobileNumber

            //         // const userOtpRequestCurrentTime = req.body.currentTime
            const userOtpRequestCurrentTime = moment(req.body.currentTime).tz('UTC');
            console.log(otp, userOtpRequestCurrentTime, req.session.mobileNumber)          //here changed
            const user = await User.findOne({ phone: phone });

            console.log(user, user.otp[0].otpCode, 'otpcode')
            if (user) {
                const otpExpirationTime = moment(user.otp[0].otpExpirationTime).tz('UTC'); // assume UTC timezone
                console.log(otpExpirationTime > userOtpRequestCurrentTime)
                console.log(otpExpirationTime, '\n', userOtpRequestCurrentTime)
                if (user.otp[0].otpCode === otp && otpExpirationTime > userOtpRequestCurrentTime) {
                    console.log('success');
                    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
                    const loggedInUser = await User.findById(user._id).select("-refreshToken -otp")
                    const options = {
                        httpOnly: true,
                        // secure: true,
                        // secure: process.env.NODE_ENV === 'production',
                        secure: false
                    }
                    if (user.role === 'user') {

                        return res.status(200)
                            .cookie("accessToken", accessToken, options)
                            .cookie("refreshToken", refreshToken, options)
                            .json(
                                new ApiResponse(
                                    200,
                                    {
                                        user: user, accessToken, refreshToken,
                                    },
                                    "User logged in successfully",
                                )
                            )
                    }
                    else {
                        return res.status(200)
                            .cookie("accessToken", accessToken, options)
                            .cookie("refreshToken", refreshToken, options)
                            .json(
                                new ApiResponse(
                                    200,
                                    {
                                        user: user, accessToken, refreshToken
                                    },
                                    "Admin logged in successfully",

                                )
                            )
                    }
                }
                else {
                    // throw new ApiError(404, 'Login is not successfull or invalid credentials and otp is expired')
                    return res.status(400).json(400, 'login is not successfull or invalid credentials')
                    // return res.status(200).json(
                    //     new ApiResponse(
                    //         200,

                    //     )
                    // )
                }
            }
            else {
                return res.status(404).json({ error: 'User  not found' });
            }
        }

    }
    else {
        res.json({ redirect: '/account?signup=true' });
    }
})

const userRegister = asyncHandler(async (req, res) => {
    //register controller part start from here
    console.log('register controller part start from here')
    console.log(req.query, req.body)
    const signup = req.query.signup
    const phone = req.body.phone
    const otp = req.body.otp
    if (signup === 'true') {
        if (!otp) {
            const result = await validateMobileNumber[0].run(req);
            console.log(result)
            if (phone.startsWith("+") && result.errors.length === 0) {
                console.log('validation is success');
                // res.status(201).json(new ApiResponse(200, '', 'phone number is valid', true))
                new ApiResponse(200, '', 'phone number is valid', true)  // this response is not going back to frontend
            }
            else {
                console.log(false);
                console.log(result.errors);
                throw new ApiError(500, 'mobile number  is invalid ')  // this response is not goinh back to frontend
            }
            // const user = await UserOtp.findOne({ phone: phone })
            const user1 = await User.findOne({ phone: phone })  //
            console.log(user1)
            if (!user1) {
                console.log('user  is not exist , new user')
                // req.session.tempMobileNumber = phone;
                signUpTempData.phone = phone
                // await req.session.save();
                const regOtpSender = await registerOtpSender(req, phone);
                console.log(regOtpSender)
                // console.log('session:-', req.session.tempMobileNumber)
                console.log('session:-', signUpTempData)
                return res.status(200).json(new ApiResponse(
                    200,
                    '',
                    'phone number is valid and user is not exist and otp is sent',
                    true,
                ))
            }
            else {
                console.log('user is already exist')
                // res.send(400).json(new ApiResponse(400, '', 'user already exists with this mobile number ', false))
                // res.json({ redirect: '/account?ret=/' })
                const user = user1
                return res.status(200).json(new ApiResponse(
                    200,
                    { user },
                    'user already exists with this mobile number',
                    false

                )
                )
            }
        }
        else {
            console.log('registration otp verification section')
            // const phone = req.session.tempMobileNumber;
            const phone = signUpTempData.phone
            const userOtpRequestCurrentTime = moment(req.body.currentTime).tz('UTC');
            // console.log(userOtpRequestCurrentTime, req.session)          //here changed    
            console.log(userOtpRequestCurrentTime, signUpTempData)          //here changed    
            // console.log(otp, req.session.tempOtp)
            console.log(otp, signUpTempData.otp)
            // const otpExpirationTime = moment(req.session.tempOtpExpirationTime).tz('UTC'); // assume UTC timezone
            const otpExpirationTime = moment(signUpTempData.otpExpirationTime).tz('UTC'); // assume UTC timezone
            console.log(otpExpirationTime > userOtpRequestCurrentTime)
            console.log(otpExpirationTime, '\n', userOtpRequestCurrentTime)

            // if (req.session.tempOtp === otp && otpExpirationTime > userOtpRequestCurrentTime) {
            if (signUpTempData.otp === otp && otpExpirationTime > userOtpRequestCurrentTime) {
                console.log('success otp is verified in registration');
                // req.session.isLoggerIn = true;
                signUpTempData.isLoggerIn = true;
                const newUserOtp = await User.create({
                    phone: phone,
                    otp: {
                        otpCode: otp,
                        // otpGeneratedTime: req.session.tempOtpGeneratedTime,
                        // otpExpirationTime: req.session.tempOtpExpirationTime
                        otpGeneratedTime: signUpTempData.otpGeneratedTime,
                        otpExpirationTime: signUpTempData.otpExpirationTime
                    }
                })

                const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUserOtp._id)
                const user = await User.findById(newUserOtp._id).select("-refreshToken -otp")
                const options = {
                    httpOnly: true,
                    // secure: true,
                    // secure: process.env.NODE_ENV === 'production',
                    secure: false
                }
                if (user.role === 'user') {

                    return res.status(200)
                        .cookie("accessToken", accessToken, options)
                        .cookie("refreshToken", refreshToken, options)
                        .json(
                            new ApiResponse(
                                200,
                                {
                                    user: user, accessToken, refreshToken,
                                },
                                "User logged in successfully",
                            )
                        )
                }
                else {
                    return res.status(200)
                        .cookie("accessToken", accessToken, options)
                        .cookie("refreshToken", refreshToken, options)
                        .json(
                            new ApiResponse(
                                200,
                                {
                                    user: user, accessToken, refreshToken
                                },
                                "Admin logged in successfully",

                            )
                        )
                }



                //                 req.session.userId = newUserOtp._id;
                //                 console.log(newUserOtp)

                return res.status(200).json(new ApiResponse(200, newUserOtp, 'registration is successfull', true))
                //                 // res.redirect('/home')
                // res.json({ redirect: '/home' });
            }
            else {
                res.status(400).json(404, 'registration is not successfull or invalid credentials')
            }
        }
    }
})


const UserLogout = asyncHandler(async (req, res) => {
    console.log(1)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    )
    console.log(11)

    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ err: 'failed to logout, please try again.' })
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        //clear cookies
        res.clearCookie("accessToken", options);
        res.clearCookie("refreshToken", options);
        console.log(111)

        //REDirect the user to the homepage or login page
        return res.status(200).json(new ApiResponse(200,
            // { redirect: '/home' },
            "User logged outs", true))
    }
    )
})

const resendOtp = asyncHandler(async (req, res) => {
    // console.log(req.session);
    const phone = req.session.mobileNumber       //here changed
    console.log(phone)
    const user = await User.findOne({ phone: phone })
    // console.log(user)

    if (user) {
        const userOtpRequestCurrentTime = moment(req.body.currentTime).tz('UTC');
        const otpExpirationTime = moment(user.otp[0].otpExpirationTime).tz('UTC'); // assume UTC timezone

        if (otpExpirationTime > userOtpRequestCurrentTime) {
            console.log(`otp is not expired`)
        }
        else {
            console.log(user.phone)
            console.log('otp is expired', otpSender(user.phone))
        }
    } else {
        const phone = req.session.tempMobileNumber
        console.log('user  is not found', req.session.tempMobileNumber)
        console.log(registerOtpSender(req, phone))

    }
})

const userProfile = asyncHandler(async (req, res) => {
    console.log('this is a controller of update profile')
    const { firstName, lastName, gender, email, phone } = req.body.data;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const phoneRegex = /^[6-9]\d{9}$/; // Optional: Indian phone number pattern

    const query = {};

    if (firstName && typeof firstName === 'string') query.firstName = firstName.trim();
    if (lastName && typeof lastName === 'string') query.lastName = lastName.trim();
    if (gender && typeof gender === 'string') query.gender = gender.trim();

    if (email) {
        if (typeof email !== 'string' || !emailRegex.test(email)) {
            // throw new ApiError(400, 'Invalid email format. Only @gmail.com allowed.');
            console.log(' Invalid email format. Only @gmail.com allowed.');
        }
        query.email = email.trim();
    }

    if (phone) {
        if (typeof phone !== 'string' || !phoneRegex.test(phone)) {
            // throw new ApiError(400, 'Invalid phone number format.');
            console.log('Invalid phone number format.');
        }
        query.phone = phone.trim();
    }
    console.log(query)
    // If query is empty, return user profile
    if (Object.keys(query).length === 0) {
        // const user = await User.findById(req.user._id)
        //     .select('-otp -__v -updatedAt -createdAt -role -refreshToken -address');

        // if (!user) {
        //     throw new ApiError(404, 'User not found');
        // }

        // return res.status(200).json(
        //     new ApiResponse(200, user, 'User profile fetched successfully', true)
        // );
        throw new ApiError(400, 'No update data provided');
    }

    // If updating fields
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: query },
        { new: true }
    ).select('-otp -__v -updatedAt -createdAt -role -refreshToken -address');

    if (!updatedUser) {
        throw new ApiError(404, 'User not found');
    }
    console.log('User profile updated successfully')
    return res.status(200).json(
        new ApiResponse(200, updatedUser, 'User profile updated successfully', true)
    );
})

const getUserProfileData = asyncHandler(async (req, res) => {
    try {
        console.log("this is a controller of get user profile data")
        console.log('before find', req.user)
        const user = await User.findOne({ _id: req.user._id }).select('-otp -__v -updatedAt -createdAt -role -refreshToken -address ')
        console.log('after find', user)
        if (!user) {
            return res.status(404).json(
                new ApiResponse(
                    404,
                    'User not found',
                    null,
                    false
                )
            )
        }
        return res.status(200).json(new ApiResponse(
            200,
            { user },
            'User profile data',
            true
        ))

    } catch (error) {
        console.log('error', error)
        // Send response only once in case of error
        if (!res.headersSent) {
            return res.status(500).json(new ApiResponse(
                500,
                'Internal server error',
                null,
                false
            ));
        }
    }
})

const userProfileAddress = asyncHandler(async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { addressId, name, phone, address, city, state, pincode, locality, landmark, altPhone, addressType } = req.body.data;
        console.log(phone)
        let phoneNumber;
        if (!phone.startsWith('+91')) {
            phoneNumber = `+91${phone}`
        }
        else {
            phoneNumber = phone
        }
        const altNumber = altPhone
        const pinCode = pincode
        console.log('Extracted Fields:', name, phoneNumber, address, city, state, pinCode, locality, landmark, altNumber, addressType);

        let query = {};
        if (name && typeof name === 'string' && name.length > 0 && name != null) query.name = name;
        if (phoneNumber && typeof phoneNumber === 'string' && phoneNumber.length > 0 && /^\+[0-9]{1,3}[0-9\s.-]{7,15}$/.test(phoneNumber) && phoneNumber != null) query.phoneNumber = phoneNumber;
        if (address && typeof address === 'string' && address.length > 0 && address != null) {
            query.address = address;
            console.log('Address Field:', address);
        }
        if (city && typeof city === 'string' && city.length > 0 && city != null) query.city = city;
        if (state && typeof state === 'string' && state.length > 0 && state != null) query.state = state;
        if (pinCode && typeof pinCode === 'string' && pinCode.length > 0 && pinCode != null) {
            query.pinCode = pinCode;
            console.log('PinCode Field:', pinCode);
        }
        if (locality && typeof locality === 'string' && locality.length > 0 && locality != null) query.locality = locality;
        if (landmark && typeof landmark === 'string' && landmark.length > 0 && landmark != null) query.landmark = landmark;
        if (altNumber && typeof altNumber === 'string' && altNumber.length > 0 && altNumber != null) query.alternatePhoneNumber = altNumber;
        if (addressType && typeof addressType === 'string' && addressType.length > 0 && addressType != null) query.addressType = addressType;

        console.log('Query Object:', query);

        // Find the existing user by userId and add the new address to their address array
        const user = await User.findById(req.user._id);
        console.log('User Found:', user);

        if (!user) {
            return res.status(404).json(
                new ApiResponse(
                    404,
                    'User not found',
                    null,
                    false
                )
            );
        }

        console.log('Address Data Before Push:', user.address);
        if (addressId) {
            // EDIT EXISTING ADDRESS
            const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
            if (addressIndex === -1) {
                return res.status(404).json(new ApiResponse(404, 'Address not found', null, false));
            }

            // Update specific address fields 
            user.address[addressIndex] = {
                ...user.address[addressIndex]._doc,
                ...query,
                updatedAt: new Date()
            };
        } else {
            // CREATE NEW ADDRESS
            user.address.push({
                ...query,
                updatedAt: new Date()
            });
        }

        // Save the updated user document
        const updatedUser = await user.save();
        console.log('User Saved:', updatedUser);

        return res.status(200).json(new ApiResponse(
            200,
            { updatedUser },
            'User address added successfully',
            true
        ));

    } catch (error) {
        console.error('Error:', error);

        // Check if it's a mongoose validation error
        if (error instanceof Error) {
            return res.status(400).json(new ApiResponse(
                400,
                error.message,
                null,
                false
            ));
        }

        // For other errors, send the error message
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,  // Add the error message for easier debugging
            stack: error.stack,    // Log stack trace for debugging
        });
    }
});

const getUserAddress = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        console.log(user.address)
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                'User not found',
                null,
            ))
        }
        const userAddress = user.address
        return res.status(200).json(new ApiResponse(
            200,
            { userAddress },
            'User address retrieved successfully',
            true
        ))

    } catch (error) {
        return res.status(500).json(new ApiResponse(
            500,
            'Internal server error',
            error,
        ))
    }
})

const delteUserAddress = asyncHandler(async (req, res) => {
    try {
        console.log(req.body)
        const addressId = req.body.id;  // Get addressId from query params
        console.log(addressId)
        if (!addressId) {
            return res.status(400).json(new ApiResponse(
                400,
                'Address ID is required',
                null,
            ));
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                'User not found',
                null,
            ));
        }

        // Find the index of address with matching id
        const index = user.address.findIndex(addr => addr._id.toString() === addressId);
        if (index === -1) {
            return res.status(404).json(new ApiResponse(
                404,
                'Address not found',
                null,
            ));
        }

        const removedAddress = user.address.splice(index, 1)[0];
        await user.save();

        return res.status(200).json(new ApiResponse(
            200,
            { removedAddress },
            'User address deleted successfully',
            true
        ));
    } catch (error) {
        return res.status(500).json(new ApiResponse(
            500,
            'Internal server error',
            error.message,
        ));
    }
})

// GET /api/products/suggestions?q=iph
// GET /api/products/suggestions?q=iph
const getSearchSuggestions = asyncHandler(async (req, res) => {
    const query = (req.query.q || '').trim();
    console.log('Search query:', query);

    if (!query) {
        return res.status(400).json({ error: "No search query provided" });
    }

    try {
        const suggestions = await product.find({
            name: { $regex: '^' + query, $options: 'i' }   // prefix match for index usage
        })
            .limit(10)
            .select('name image price CategoryName');       // send extra useful fields

        return res.status(200).json({
            success: true,
            count: suggestions.length,
            suggestions: suggestions.map(p => ({
                id: p._id,
                name: p.name,
                image: p.image,
                price: p.price,
                category: p.CategoryName
            }))
        });
    } catch (err) {
        console.error("Error fetching suggestions:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



const getProductByName = asyncHandler(async (req, res) => {
    console.log('This is the getProductByName controller');

    const productName = req.params.name?.trim();
    console.log('Searching for:', productName);

    if (!productName) {
        return res.status(400).json({ error: "Product name is required" });
    }

    const productData = await product.find({
        name: { $regex: new RegExp(productName, 'i') }
    });
    console.log(productData)
    if (!productData || productData.length === 0) {
        return res.status(404).json({ error: "No matching products found" });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { productData },
            "Products found",
            true
        )
    );
});




// function parseSearchQuery(queryString) {
//     const searchParams = {
//         searchKeywords: queryString,  // Default to the full query string for text search
//         maxPrice: null,
//         minPrice: null,
//     };

//     // Check if the query contains price filters (like "under 2000")
//     const priceMatch = queryString.match(/under\s*(\d+)/i);
//     if (priceMatch) {
//         searchParams.maxPrice = parseInt(priceMatch[1], 10); // Extract price
//     }

//     // Check if the query contains a range like "between 1000 and 2000"
//     const priceRangeMatch = queryString.match(/between\s*(\d+)\s*and\s*(\d+)/i);
//     if (priceRangeMatch) {
//         searchParams.minPrice = parseInt(priceRangeMatch[1], 10);
//         searchParams.maxPrice = parseInt(priceRangeMatch[2], 10);
//     }

//     return searchParams;
// }

// const searchForProductByUser = asyncHandler(async (req, res) => {
//     try {
//         const searchQuery = req.query.searchQuery;
//         console.log(searchQuery)
//         // Parse the search query for price filters (under, between, etc.)
//         const { searchKeywords, maxPrice, minPrice } = parseSearchQuery(searchQuery);

//         // Build the MongoDB query object
//         const queryObj = {};
//         // If there are search keywords, perform a text search
//         if (searchKeywords) {
//             queryObj.$text = { $search: searchKeywords };
//         }
//         // Apply price filters (if any)
//         if (maxPrice) {
//             queryObj.price = { $lte: maxPrice };  // e.g., under 2000
//         }
//         if (minPrice && maxPrice) {
//             queryObj.price = { $gte: minPrice, $lte: maxPrice };  // e.g., between 1000 and 2000
//         }
//         // Fetch the filtered products from MongoDB
//         const products = await product.find(queryObj);
//         if (products.length === 0) {
//             return res.status(404).json({ error: 'No products found matching your query.' });
//         }


//         console.log("products", products)
//         // res.send('done')
//         // Return the products to the frontend
//         return res.status(200).json(
//             new ApiResponse(
//                 200,
//                 { products },
//                 "Products found",
//                 true
//             )
//         )
//     }
//     catch (error) {
//         return res.status(500).json({ error: 'Error fetching products' });
//     }
// })

// function parseSearchQuery(queryString) {
//     const searchParams = {
//         searchKeywords: queryString,  // Default full query string
//         maxPrice: null,
//         minPrice: null,
//     };

//     // Match "between 1000 and 2000" first
//     const priceRangeMatch = queryString.match(/between\s*(\d+)\s*and\s*(\d+)/i);
//     if (priceRangeMatch) {
//         searchParams.minPrice = parseInt(priceRangeMatch[1], 10);
//         searchParams.maxPrice = parseInt(priceRangeMatch[2], 10);
//         searchParams.searchKeywords = queryString.replace(priceRangeMatch[0], '').trim();
//         return searchParams;
//     }

//     // Then match "under 2000"
//     const priceMatch = queryString.match(/under\s*(\d+)/i);
//     if (priceMatch) {
//         searchParams.maxPrice = parseInt(priceMatch[1], 10);
//         searchParams.searchKeywords = queryString.replace(priceMatch[0], '').trim();
//     }

//     return searchParams;
// }


// const searchForProductByUser = asyncHandler(async (req, res) => {
//     try {
//         const searchQuery = req.query.searchQuery;
//         const { searchKeywords, maxPrice, minPrice } = parseSearchQuery(searchQuery);

//         const queryObj = {};

//         // Apply full-text search
//         if (searchKeywords) {
//             queryObj.$text = { $search: searchKeywords };
//         }

//         // Apply price filters if any
//         if (minPrice !== null || maxPrice !== null) {
//             queryObj.price = {};
//             if (minPrice !== null) queryObj.price.$gte = minPrice;
//             if (maxPrice !== null) queryObj.price.$lte = maxPrice;
//         }

//         const products = await product.find(queryObj);

//         if (!products || products.length === 0) {
//             return res.status(404).json({ error: 'No products found matching your query.' });
//         }

//         return res.status(200).json(
//             new ApiResponse(200, { products }, "Products found", true)
//         );
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error fetching products' });
//     }
// });



const searchProductDetail = asyncHandler(async (req, res) => {
    try {
        console.log("this is an search product detail control")
        const id = req.query.id;
        console.log("id", id)
        const products = await product.findById(id);
        if (!products) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log(products._id)

        return res.status(200).json(
            new ApiResponse(
                200,
                { products },
                "Product found",
                true
            )
        )
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching product details' });
    }
})


const sizeMapping = {
    "small": "S",
    "medium": "M",
    "large": "L",
    "extra large": "XL",
    "extra extra large": "XXL",
    "xxl": "XXL",
    "xl": "XL",
    "l": "L",
    "m": "M",
    "s": "S"
};

const productSuggestionsForUser = asyncHandler(async (req, res) => {
    try {
        console.log('🔍 Product suggestions for user');
        const { query } = req.query;
        console.log("👉 Search Query:", query);

        if (!query) {
            return res.status(400).json({ error: '❌ Search query is required' });
        }

        // Extract words and numbers separately
        const words = query.match(/[a-zA-Z]+/g) || [];  // Extract words (keywords)
        const numbers = query.match(/\d+/g) || [];      // Extract numbers (price constraints)

        let searchKeywords = [];
        let sizes = [];
        let minPrice = null, maxPrice = null;

        // Process extracted words
        words.forEach(word => {
            let lowerWord = word.toLowerCase();
            if (sizeMapping[lowerWord]) {
                sizes.push(sizeMapping[lowerWord]); // Convert text size to stored format
            } else {
                searchKeywords.push(word);
            }
        });

        // Identify price filters
        if (query.includes("under") && numbers.length > 0) {
            maxPrice = parseInt(numbers[0]);
        } else if (query.includes("between") && numbers.length >= 2) {
            minPrice = parseInt(numbers[0]);
            maxPrice = parseInt(numbers[1]);
        }

        console.log("🔤 Extracted Keywords:", searchKeywords);
        console.log("📏 Extracted Sizes:", sizes);
        console.log("💰 Price Range:", minPrice, "-", maxPrice);

        // Build MongoDB Query
        let searchQuery = { $or: [] };

        // Add keyword-based search in multiple fields
        if (searchKeywords.length > 0) {
            searchQuery.$or = searchKeywords.flatMap(term => [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
                { CategoryName: { $regex: term, $options: 'i' } },
                { color: { $regex: term, $options: 'i' } }
            ]);
        }

        // Add size filtering
        if (sizes.length > 0) {
            searchQuery.size = { $in: sizes }; // Match sizes in the stored format
        }

        // Apply price filter
        if (!isNaN(minPrice) || !isNaN(maxPrice)) {
            searchQuery.price = {};
            if (!isNaN(minPrice)) searchQuery.price.$gte = minPrice;
            if (!isNaN(maxPrice)) searchQuery.price.$lte = maxPrice;
        }

        console.log("📌 MongoDB Query:", JSON.stringify(searchQuery, null, 2));

        // Execute MongoDB search
        let suggestions = await product.find(searchQuery)
            .select('name CategoryName description price color size')
            .limit(10);
        let completeproductData = await product.find(searchQuery)
            .limit(10);
        console.log("✅ Results Found:", suggestions);

        return res.status(200).json(new ApiResponse(
            200,
            { suggestions, completeproductData },
            "Search results found",
            true
        ));

    } catch (error) {
        console.error("❌ Error fetching product details:", error);
        return res.status(500).json({ error: 'Server error: Unable to fetch product details' });
    }
});

const productwishlist = asyncHandler(async (req, res) => {
    try {
        console.log("✅ This is a wishlist controller of user");

        // Extract TagID from request
        const { productTagId } = req.body;

        // Find the user from the database
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                'User not found',
                null,
                false
            ));
        }

        // Check if product already exists in wishlist
        const index = user.wishlist.findIndex(item => item.tagId === productTagId);

        // ✅ If product exists, REMOVE it from wishlist
        if (index !== -1) {
            user.wishlist.splice(index, 1);
            await user.save();
            console.log("❌ Product removed from wishlist");

            return res.status(200).json(new ApiResponse(
                200,
                { wishlist: user.wishlist },
                'Product removed from wishlist successfully',
                true
            ));
        }

        // ✅ If product does not exist, ADD it to wishlist
        user.wishlist.push({ tagId: productTagId });
        await user.save();
        console.log("✅ Product added to wishlist");

        return res.status(200).json(new ApiResponse(
            200,
            { wishlist: user.wishlist },
            'Product added to wishlist successfully',
            true
        ));
    } catch (error) {
        console.error("❌ Error in wishlist controller:", error);
        return res.status(500).json(new ApiResponse(
            500,
            'Internal server error',
            null,
            false
        ));
    }
});
const updateWishlist = asyncHandler(async (req, res) => {
    console.log('this is  a controller of update wishlist');
    const { productId } = req.body;
    // Check if productId is provided
    if (!productId) {
        return res.status(400).json(new ApiResponse(
            400,
            null,
            'Product ID is required',
            false
        ));
    }


    // Get user
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json(new ApiResponse(
            404,
            'User not found',
            null,
            false
        ));
    }

    // Toggle Wishlist Logic
    const index = user.wishlist.findIndex(id => id.toString() === productId.toString());

    if (index === -1) {
        // Not found, so add to wishlist
        user.wishlist.push(productId);
        await user.save();
        console.log("✅ Product added to wishlist");

        return res.status(200).json(new ApiResponse(
            200,
            { wishlist: user.wishlist },
            'Product added to wishlist successfully',
            true
        ));
    } else {
        // Found, so remove from wishlist
        user.wishlist.splice(index, 1);
        await user.save();
        console.log("❌ Product removed from wishlist");

        return res.status(200).json(new ApiResponse(
            200,
            { wishlist: user.wishlist },
            'Product removed from wishlist successfully',
            true
        ));
    }
})
const getUserProductWishlist = asyncHandler(async (req, res) => {
    console.log('this is a controller of user wishlist')
    const user = await User.findById(req.user._id).select('wishlist');

    if (!user) {
        return res.status(404).json(new ApiResponse(
            404,
            null,
            'User not found',
            false
        ));
    }

    if (!user.wishlist || user.wishlist.length === 0) {
        return res.status(200).json(new ApiResponse(
            200,
            [],
            'Wishlist is empty',
            true
        ));
    }

    const products = await product.find({
        _id: { $in: user.wishlist }
    }).select('name price image category brand'); // Select only necessary fields

    return res.status(200).json(new ApiResponse(
        200,
        products,
        'Wishlist products fetched successfully',
        true
    ));

})

// ✅ Handle Wishlist Fetch for Product Page
const getUserWishlist = asyncHandler(async (req, res) => {
    try {
        console.log("✅ Fetching user's wishlist for product page");

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                'User not found',
                null,
                false
            ));
        }

        // Return only the wishlist TagIDs
        const wishlistTagIds = user.wishlist.map(item => item.tagId);

        return res.status(200).json(new ApiResponse(
            200,
            { wishlistTagIds },
            'Wishlist fetched successfully for product page',
            true
        ));
    } catch (error) {
        console.error("❌ Error in fetching wishlist:", error);
        return res.status(500).json(new ApiResponse(
            500,
            'Internal server error',
            null,
            false
        ));
    }
});

const addToCartUser = asyncHandler(async (req, res) => {
    try {
        console.log("✅ Adding product to cart for user:", req.user._id, req.body);
        const { productId, quantity, size, expectedDelivery } = req.body;

        // Validate required fields
        if (!productId || !quantity || !size || !expectedDelivery) {
            return res.status(400).json(new ApiResponse(400, null, 'Missing required fields', false));
        }

        // 1. Get user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
        }

        // 2. Get product
        const productData = await product.findById(productId);
        if (!productData) {
            return res.status(404).json(new ApiResponse(404, null, 'Product not found', false));
        }

        // 3. Extract product details
        const name = productData.name;
        const tagId = productData.TagId; // exact field name from schema
        const price = productData.price;
        const color = productData.color;
        const image = productData.image;
        const discount = productData.discount;

        // 4. Check for duplicates
        const existingProduct = user.cart.find(item =>
            item.productId.equals(productId) &&
            item.productName.toLowerCase() === name.toLowerCase() &&
            item.TagId.toLowerCase() === tagId.toLowerCase() &&
            item.price === price &&
            item.color.toLowerCase() === color.toLowerCase() &&
            item.size.toLowerCase() === size.toLowerCase()
        );

        if (existingProduct) {
            return res.status(400).json(new ApiResponse(
                400,
                null,
                'Product already exists in the cart with the same data',
                false
            ));
        }

        // 5. Use expectedDelivery directly from frontend (validated above)
        const deliveryDate = new Date(expectedDelivery);
        if (isNaN(deliveryDate.getTime())) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid expectedDelivery date', false));
        }

        // 6. Add to cart
        user.cart.push({
            productId,
            productName: name,
            price,
            size,
            quantity,
            color,
            TagId: tagId,
            image,
            discount,
            expectedDelivery: deliveryDate // ✅ Directly from frontend
        });

        await user.save();

        return res.status(200).json(new ApiResponse(
            200,
            user.cart,
            'Product added to cart successfully',
            true
        ));

    } catch (error) {
        console.error("❌ Error in adding to cart:", error);
        return res.status(500).json(new ApiResponse(500, null, 'Internal server error', false));
    }
});


const updateCartUser = asyncHandler(async (req, res) => {
    console.log('this is a controller of update cart user', req.body)
    const { productId, size, quantity } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const existingItemIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
        user.cart[existingItemIndex].quantity = quantity;
    } else {
        // Defensive fallback → should not happen on Cart page
        user.cart.push({
            productId,
            size,
            quantity
        });
    }

    await user.save();
    res.status(200).json({ message: 'Cart quantity updated', cart: user.cart });
})
const fetchCartByUser = asyncHandler(async (req, res) => {
    try {
        console.log("✅ Fetching user data for cart:");
        const userId = req.user._id;
        const userData = await User.findById(userId).select('_id firstName lastName phone address cart savedForLater')
        if (!userData) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                'User not found',
                false
            ));
        }
        console.log("User data:", userData);
        return res.json(new ApiResponse(
            200,
            userData,
            'User data fetched successfully',
            true
        ));
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("❌ Error fetching user data for cart:", err);
        }
        return res.status(500).json(new ApiResponse(
            500,
            null,
            'Internal server error',
            false
        ));
    }
})

const deleteFromCartUser = asyncHandler(async (req, res) => {
    try {
        console.log('this is a controller of delete cart item for user')
        const userId = req.user._id;
        const productId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
        }

        const originalCartLength = user.cart.length;

        user.cart = user.cart.filter(
            item => item.productId.toString() !== productId
        );

        if (user.cart.length === originalCartLength) {
            return res.status(404).json(new ApiResponse(404, null, 'Product not found in cart', false));
        }

        await user.save();

        return res.status(200).json(
            new ApiResponse(200, user.cart, 'Product removed from user cart successfully', true)
        );
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return res.status(500).json(
            new ApiResponse(500, null, 'Internal server error', false)
        );
    }
})

const syncCartForUser = asyncHandler(async (req, res) => {
    console.log("✅ Syncing cart for user:", req.user._id);

    const newCartItems = req.body.cart;
    console.log("New cart items:", newCartItems);
    const userId = req.user._id;

    // ✅ Validate request body
    if (!Array.isArray(newCartItems)) {
        return res.status(400).json(new ApiResponse(
            400,
            null,
            'Invalid cart format: Expected an array.',
            false
        ));
    }

    try {
        // ✅ Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                'User not found',
                false
            ));
        }

        // ✅ Initialize cart
        let existingCart = user.cart || [];
        let newItemsAdded = false;
        console.log("Existing cart 1:", existingCart);

        // ✅ Validate each cart item and update cart
        for (const newItem of newCartItems) {
            console.log("New item:", newItem);

            // ✅ Fix: Check for 'productName' instead of 'Name'
            if (!newItem.productName) {
                console.error("❌ Error: Cart item is missing the required 'productName' field:", newItem);
                return res.status(400).json(new ApiResponse(
                    400,
                    null,
                    `Invalid cart item: 'productName' field is required.`,
                    false
                ));
            }

            const existingItem = existingCart.find(item => item.TagId === newItem.TagId);
            console.log("Existing item:", existingItem);

            if (!existingItem) {
                existingCart.push(newItem);
                newItemsAdded = true;
                console.log("✅ New item added to cart:", newItem);
            }
        }

        console.log("Existing cart 2:", existingCart);

        // ✅ If no new items, return response
        if (!newItemsAdded) {
            console.log("✅ Cart already up-to-date for user:", req.user._id);
            return res.json(new ApiResponse(
                200,
                user.cart,
                'Cart already up-to-date',
                true
            ));
        }

        // ✅ Save updated cart in user document
        user.cart = existingCart;
        await user.save();

        console.log("✅ Cart synced successfully for user:", req.user._id);
        return res.json(new ApiResponse(
            200,
            user.cart,
            'Cart updated successfully',
            true
        ));

    } catch (error) {
        console.error("❌ Error in syncing cart for user:", error);
        return res.status(500).json(new ApiResponse(
            500,
            null,
            'Internal server error',
            false
        ));
    }

})

const updateToaddressForCart = asyncHandler(async (req, res) => {
    try {
        console.log("✅ Updating to address for cart:");
        console.log('this is a request from the user', req.body)
        const userId = req.user._id;
        const toAddress = req.body.address;
        // Step 1: Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return null;
        }
        console.log('before updating the address')
        // Step 2: Iterate over the addresses to find and update the matching address
        user.address = user.address.map(addr => {

            console.log(addr.address, '==', toAddress.address)
            if (addr.address === toAddress.address) {
                // Update the address fields
                console.log('correct')
                return {
                    ...addr.toObject(), // Convert Mongoose document to plain object
                    address: toAddress.address,
                    pinCode: toAddress.pinCode,
                    addressType: toAddress.addressType,
                    updatedAt: new Date()
                };
            }
            return addr;
        });
        console.log('after updating the address')
        // Step 3: Save the updated user document back to the database
        const updatedUser = await user.save();

        console.log('Address updated successfully');
        console.log(updatedUser.address)
        return res.status(200).json(new ApiResponse(
            200,
            updatedUser,
            'Address updated successfully',
            true
        ))

    }
    catch (err) {
        if (err instanceof Error) {
            console.error("❌ Error updating to address for cart:", err);
        }
        return res.status(500).json(new ApiResponse(
            500,
            null,
            'Internal server error',
            false
        ));
    }
})
const getUserCartDataForProducts = asyncHandler(async (req, res) => {
    console.log('This is a controller of get user cart data for product');
    const userCart = req.user.cart;
    console.log('usercart', userCart)
    let cartWithImages = [];

    // Fetch all products by their IDs
    const productPromises = userCart.map(async (cart) => {
        try {
            const products = await product.findById(cart.productId).exec();
            // console.log('product', products)
            return products;
        } catch (error) {
            console.error(`Error finding product with ID ${cart.productId}:`, error);
            return null;
        }
    });

    try {
        // Wait for all promises to resolve
        const products = await Promise.all(productPromises);

        // Combine cart products with their corresponding images using productId
        userCart.forEach((cart) => {
            const Product = products.find(p => p && p._id.toString() === cart.productId.toString());
            console.log('true ', Product)
            if (Product) {
                cartWithImages.push({
                    productId: cart.productId,
                    productName: cart.productName,
                    price: cart.price,
                    size: cart.size,
                    color: cart.color,
                    TagId: cart.TagId,
                    quantity: cart.quantity,
                    image: Product.image
                });
            }
        });

        if (cartWithImages.length === 0) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                'No products found',
                false
            ));
        }
        console.log('cartwithImages', cartWithImages)
        // Send the combined data in the response
        return res.status(200).json(new ApiResponse(
            200,
            cartWithImages,
            'Cart data with product images retrieved successfully',
            true
        ));
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json(new ApiResponse(
            500,
            null,
            'Internal server error',
            false
        ));
    }
});

const removeFromCartForUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
        }
        console.log('user', user.cart)
        user.cart = user.cart.filter(cartItem => cartItem.productId.toString() !== productId);
        // Check if the product was removed
        // if (user.cart.length === originalCartLength) {
        //     return res.status(404).json(new ApiResponse(404, null, 'Product not found in cart', false));
        // }
        // Save the updated user document
        const updatedUser = await user.save();
        return res.status(200).json(new ApiResponse(200, updatedUser, 'Product removed from user cart successfully', true));
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return res.status(500).json(new ApiResponse(
            500,
            null,
            'Internal server error',
            false
        ));
    }
});


// add product from cart to saveForLater
const saveForLaterProduct = asyncHandler(async (req, res) => {
    try {
        console.log(` this is a user controller of add product from cart to saveForLater`, req.params)
        const userId = req.user._id;
        const productId = req.params.id;
        console.log(productId);

        // Step 1: Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
        }
        console.log('user is found')
        // Step 2: Find the product in the cart
        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (!cartItem) {
            return res.status(404).json(new ApiResponse(404, null, 'Product not found in cart', false));
        }
        console.log('cart is found')
        // Step 3: Check if already in saveForLater
        const alreadySaved = user.saveForLater.find(item => item.productId?.toString() === productId);
        if (alreadySaved) {
            return res.status(400).json(new ApiResponse(400, null, 'Product already exists in save for later list', false));
        }
        console.log('already save for later', alreadySaved)
        // Step 4: Remove from cart
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        // Step 5: Push to saveForLater
        user.saveForLater.push(cartItem); // cartItem already has all fields

        // Step 6: Save updated user
        await user.save();
        console.log('user cart ', user)

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    cart: user.cart,
                    saveForLater: user.saveForLater
                },
                'Product moved to save for later successfully',
                true
            )
        );


    } catch (error) {
        console.error('Save for later error:', error);
        return res.status(500).json(
            new ApiResponse(500, null, 'Internal server error', false)
        );
    }
});

// fetch all products from saveForLater
const getUserSavedForLater = asyncHandler(async (req, res) => {
    try {
        console.log('Getting saved for later products');
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
        }

        const saveForLater = user.saveForLater;
        console.log('save for later:', saveForLater);

        if (!saveForLater || saveForLater.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], 'No products saved for later', true));
        }


        return res.status(200).json(new ApiResponse(200, saveForLater, 'Products saved for later', true));
    } catch (error) {
        console.error('Error getting user saved for later:', error);
        return res.status(500).json(new ApiResponse(500, null, 'Internal server error', false));
    }
});

// add product from saveForLater to cart
const moveToCartForUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found', false));
        }

        const saveForLaterItem = user.saveForLater.find(item => item.productId.toString() === productId);
        if (!saveForLaterItem) {
            return res.status(404).json(new ApiResponse(404, null, 'Product not found in save For Later', false));
        }

        const productExistingInCart = user.cart.find(item => item.productId.toString() === productId);
        if (productExistingInCart) {
            return res.status(400).json(new ApiResponse(400, null, 'Product already exists in the Cart', false));
        }

        user.saveForLater = user.saveForLater.filter(item => item.productId.toString() !== productId);
        user.cart.push(saveForLaterItem);

        const updatedUser = await user.save();
        return res.status(200).json(new ApiResponse(
            200,
            { saveForLater: updatedUser.saveForLater, cart: updatedUser.cart, user: updatedUser },
            'Product moved to cart successfully',
            true
        ));
    } catch (error) {
        console.error('Error moving product to cart:', error);
        return res.status(500).json(new ApiResponse(500, null, 'Internal server error', false));
    }
});


// remove product from saveForLater
const removeFromSaveForLater = asyncHandler(async (req, res) => {
    try {
        console.log('Controller: Remove from Save for Later');

        const userId = req.user._id;
        const productId = req.params.id;   // ✅ get ID from URL params

        console.log('Product ID:', productId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                'User not found',
                false
            ));
        }

        const saveForLaterItem = user.saveForLater.find(
            item => item.productId.toString() === productId
        );

        if (!saveForLaterItem) {
            return res.status(404).json(new ApiResponse(
                404,
                null,
                'Product not found in Save for Later',
                false
            ));
        }

        user.saveForLater = user.saveForLater.filter(
            item => item.productId.toString() !== productId
        );

        await user.save();

        return res.status(200).json(new ApiResponse(
            200,
            user.saveForLater,
            'Product removed from Save for Later',
            true
        ));

    } catch (error) {
        console.error('Error removing from Save for Later:', error);
        return res.status(500).json(new ApiResponse(
            500,
            null,
            'Internal server error',
            false
        ));
    }
});

const placeOrder = asyncHandler(async (req, res) => {
    try {
        console.log('this is a controller of creating a order or placeorder')
        const userId = req.user ? req.user._id : null;  // Use JWT auth middleware for logged-in user
        const { items, address, totalPrice, totalDiscount, finalAmount } = req.body;
        console.log(address)
        if (!items || !items.length) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }
        // ✅ 1️⃣ Verify stock ONLY — no reduce yet!
        const productsToUpdate = [];
        // ✅ 1️⃣ Optional: Verify stock & update
        for (const item of items) {
            console.log(item)
            const Product = await product.findById(item.productId);
            if (!Product) {
                return res.status(400).json({ success: false, message: `Product not found: ${item.productId}` });
            }
            console.log('product is found')
            if (Product.variants.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough stock for ${Product.name}` });
            }
            console.log('product is enough to buy')
            // Keep in memory for later update
            productsToUpdate.push({ Product, quantity: item.quantity });
        }

        // ✅ 2️⃣ Save order
        const order = new Order({
            userId,
            items,
            address,
            totalPrice,
            totalDiscount,
            finalAmount,
            paymentStatus: 'PENDING',
            status: 'PLACED',
        });

        const savedOrder = await order.save();
        console.log('Order saved:', savedOrder);

        // ✅ 3️⃣ Now safely reduce stock because order is saved
        // for (const entry of productsToUpdate) {
        //     entry.Product.variants.stock -= entry.quantity;
        //     await entry.Product.save();
        // }
        for (const item of items) {
            await product.updateOne(
                { _id: item.productId },
                { $inc: { 'variants.stock': -item.quantity } }
            );
        }

        console.log('product updated')
        // ✅ 4️⃣ (Optional) Send email after both succeed
        // await sendEmail(mailOptions);
        // ✅ 4️⃣ Return order ID
        return res.status(201).json(new ApiResponse(
            true,
            { savedOrder },
            'Order placed successfully',
            true
        ))

    } catch (err) {
        console.error('Place order failed:', err);
        res.status(500).json({ success: false, message: 'Server error placing order' });
    }
})

const fetchPendingOrderByUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    console.log('Fetching only PENDING (PLACED) order for user:', userId);

    const order = await Order.findOne({
        userId: userId,
        orderStatus: 'PLACED'  // only orders that are just placed
    })
        .sort({ placedAt: -1 }) // just in case there’s more than one

    if (!order) {
        return res.status(404).json(new ApiResponse(
            404,
            null,
            'No PENDING order found for this user',
            false
        ));
    }

    return res.status(200).json(new ApiResponse(
        200,
        order,
        'Pending order fetched successfully',
        true
    ));
})


// 

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
    console.log('Creating Razorpay order...', req.body);
    const { amount, orderId } = req.body; // amount in INR
    try {
        const options = {
            amount: amount * 100, // paise
            currency: 'INR',
            receipt: orderId.toString(),
            payment_capture: 1
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        console.log('Razorpay order created:', razorpayOrder);
        res.status(200).json({ success: true, razorpayOrder });
    } catch (err) {
        console.error('Razorpay order creation failed', err);
        res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    console.log('Verifying Razorpay payment...', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Generate HMAC SHA256 signature
    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
    console.log('Generated Signature:', generated_signature);
    if (generated_signature === razorpay_signature) {
        // Payment verified
        const order = await Order.findById(orderId);
        console.log('Order found:', order);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.paymentStatus = "PAID";
        order.orderStatus = "CONFIRMED";
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        // ✅ Clear user's cart after successful payment
        // ✅ Clear the cart from user model
        await User.findByIdAndUpdate(order.userId, { $set: { cart: [] } });
        console.log('Order updated to PAID:', order);
        res.status(200).json({ success: true, message: 'Payment verified and order updated', order });
    } else {
        res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
});

const myOrders = asyncHandler(async (req, res) => {
    console.log('Fetching all orders for user:', req.user._id);
    const orders = await Order.find({ userId: req.user._id });
    return res.status(200).json(new ApiResponse(
        200,
        orders,
        'User orders fetched successfully',
        true
    ));
})

const getOrderDetails = async (req, res) => {
    try {
        console.log('Fetching order details for order ID:', req.params.id);
        const id = req.params.id;
        const order = await Order.findById(id)
        console.log('Order found:', order);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if logged-in user is the owner
        if (order.userId.toString() !== req.user._id.toString()) {
            console.log('User not authorized to view this order');
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
        console.log('User authorized, returning order details');
        return res.status(200).json(new ApiResponse(
            200,
            order,
            'Order details fetched successfully',
            true
        ));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createRazorpayOrder, verifyRazorpayPayment };
// 

export {
    checkUserController,
    userLogin,
    userRegister,
    UserLogout,
    resendOtp,
    userProfile,
    getUserProfileData,
    userProfileAddress,
    getUserAddress,
    delteUserAddress,
    getUserProductWishlist,
    // searchForProductByUser,
    searchProductDetail,
    productSuggestionsForUser,
    productwishlist,
    getUserWishlist,
    addToCartUser,
    syncCartForUser,
    fetchCartByUser,
    deleteFromCartUser,
    updateCartUser,
    updateToaddressForCart,
    getUserCartDataForProducts,
    removeFromCartForUser,
    saveForLaterProduct,
    getUserSavedForLater,
    moveToCartForUser,
    removeFromSaveForLater,
    getSearchSuggestions,
    getProductByName,
    updateWishlist,
    //exporting var
    signUpTempData,
    placeOrder,
    fetchPendingOrderByUser,
    myOrders,
    getOrderDetails
}

