import express from 'express'
import { body } from 'express-validator'
const authRoute = express.Router()
import {verifyAdminOtp,sendAdminOtp, getAllCategories } from '../../controllers/admin/auth.controllers.js'
import {authorization} from '../../middlewares/roleAuth.js'

authRoute.route('/login').post(
    body('phone').isMobilePhone(),
    sendAdminOtp
)

authRoute.route('/login-otp-verify').post(
    body('phone').isMobilePhone(),
    body('otp').notEmpty().isLength({ min: 6, max: 6 }).isNumeric(),
    verifyAdminOtp
)

// authRoute.route('/get-all-categories').get(
//     authorization('admin'),
//     getAllCategories)

export default authRoute