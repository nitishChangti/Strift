// src/routes/user.routes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import session from 'express-session';

import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(express.static(path.join(__dirname, '../../../public/user/home')));

router.use(express.static(path.join(__dirname, '../../../public/user/home/header.html')));
// import srsds from '../../../public/user/home';

router.use(express.static(path.join(__dirname, '../../../public/user/products')));
router.use(express.static(path.join(__dirname, '../../../public/user/home/header.html')));
router.use(express.static(path.join(__dirname, '../../../public')));
router.use('/home', express.static(path.join(__dirname, '../../../public/user/home')));
router.use('/products', express.static(path.join(__dirname, '../../../public/user/products')));


// Serve header.html file
router.get('/header', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/home/header.html'));
});
router.get('/footer', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/home/footer.html'));
});

// router.use(express.statrouter.use('/imgs', express.static(path.join(__dirname, 'public/user/home/imgs')));



// Serve the home page
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/home/index.html'));
});

router.use(express.static(path.join(__dirname, '../../../public/user/loginAndRegister')));
// router.use(express.static(path.join(__dirname, '../../public/user/loginAndRegister/images')));

// serve the login and register page
router.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/user/loginAndRegister/index.html'));
})

import validateMobileNumber from '../../middlewares/validateMobileNumber.middlewares.js'
import {
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
    updateWishlist,
    addToCartUser,
    updateCartUser,
    fetchCartByUser,
    deleteFromCartUser,
    saveForLaterProduct,
    getUserSavedForLater,
    removeFromSaveForLater,
    moveToCartForUser,
    placeOrder,
    checkUserController,
    fetchPendingOrderByUser,
    // searchForProductByUser,
    searchProductDetail, getSearchSuggestions, 
    // getProductByName,

    createRazorpayOrder, verifyRazorpayPayment,getAllCategory,getHomeProducts,
getProducts ,
    myOrders, getOrderDetails
} from '../../controllers/user/user.controllers.js'
import { verifyJWT } from '../../middlewares/verifyJwt.js';
import { authorization } from '../../middlewares/roleAuth.js';
router.use(express.static(path.join(__dirname, '../../../public/user/profile')));
// import { verifyJWT } from '../../../public/user/home';

router.get('/account/profile', (req, res) => {
    // res.send('hello')
    res.sendFile(path.join(__dirname, '../../../public/user/profile/profile.html'));
})
router.route('/account/login').post(validateMobileNumber, userLogin);

router.route('/account/getCurrentUser').get(verifyJWT, async (req, res) => {
    try {
        const user = req.user
        console.log("ssassasa", user)
        return res.status(200).json({ status: 200, user, message: 'done' })
    } catch (error) {
        console.log(error);
    }
})

router.route('/auth/status').get(verifyJWT, async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            500

        )
    }
})

router.route('/account/register').post(validateMobileNumber, userRegister)
// verifyJWT
router.route('/account/logout').get(verifyJWT, UserLogout)

router.route('/account/login/resend-Otp').post(session(), resendOtp)

router.route("/account/register/resend-Otp").post(session(), resendOtp)

router.get('/admin', authorization('admin'), async (req, res) => {
    res.send('This is a admin place')
})


router.route('/getallcategory').get(getAllCategory);

router.route('/account/profile').post(authorization('user'), userProfile)
router.route('/account/profile/userData').get(authorization('user'), getUserProfileData)

router.route('/account/profile/address').post(authorization('user'), userProfileAddress)
router.route('/profile/fetchAddress').get(authorization('user'), getUserAddress);
router.route('/profile/deleteAddress').delete(authorization('user'), delteUserAddress)

// router.route('/product/:name').get(getProductByName);
router.route("/products").get(getProducts);

router.get("/products/home", getHomeProducts);


router.route('/suggestions').get(getSearchSuggestions);

router.route('/productdetail').get(searchProductDetail)

router.route('/account/wishlist').get(authorization('user'), getUserProductWishlist)
router.route('/updateWishlist').post(authorization('user'), updateWishlist)

router.route('/addTocart').post(authorization('user'), addToCartUser)

router.route('/fetchUserCart').get(authorization('user'), fetchCartByUser)

router.route('/updateCart').post(authorization('user'), updateCartUser)

router.route('/deleteFromCart/:id').delete(authorization('user'), deleteFromCartUser)

router.route('/addSaveForLaterProduct/:id').post(authorization('user'), saveForLaterProduct)

router.route('/fetchSaveForLater').get(authorization('user'), getUserSavedForLater)

router.route('/removeProductFromSaveForLater/:id').delete(authorization('user'), removeFromSaveForLater)

router.route('/addProductFromSaveForLaterToCart/:id').post(authorization('user'), moveToCartForUser)

router.route('/orders').post(authorization('user'), placeOrder)

router.route('/orders/pending').get(authorization('user'), fetchPendingOrderByUser)

router.route('/check-user').post(checkUserController)

// payment api
router.route('/create-razorpay-order').post(authorization('user'), createRazorpayOrder)

router.route("/verify-razorpay-payment").post(authorization('user'), verifyRazorpayPayment)

//my orders
router.route('/my-orders').get(authorization('user'), myOrders)

router.route('/orderDetail/:id').get(authorization('user'), getOrderDetails);

export default router;