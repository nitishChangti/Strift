import { User } from '../models/user.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js"
const authorization = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Get token from cookie or Authorization header (remove "Bearer " prefix)
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

            if (!token) {
                return res.status(401).json(
                    new ApiError(401, "Unauthorized request")
                );
            }

            console.log('token is', token);

            // Verify token
            const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log('decoded token is', decodedToken);

            const user = await User.findById(decodedToken?.userId).select("-otp -refreshToken");
            if (!user) {
                return res.status(401).json(
                    new ApiError(401, "Invalid Access Token")
                );
            }

            req.user = user;
            console.log('here authorization is done based on roles provided access to the route');

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json(
                    new ApiError(403, "Forbidden")
                );
            }

            next();

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export { authorization }