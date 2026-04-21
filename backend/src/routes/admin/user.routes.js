import express from 'express';
import {
  getAllUsers,
  getUserDetails,
  toggleUserStatus,
  getUserStats,
  deleteUser,
  searchUsers
} from '../../controllers/admin/user.controllers.js';
import { authorization } from '../../middlewares/roleAuth.js';
import { verifyJWT } from '../../middlewares/verifyJwt.js';

const userRouter = express.Router();

// Middleware to verify JWT and check admin role
userRouter.use(verifyJWT);
userRouter.use(authorization(['admin']));

// 👥 Get all users with pagination and filters
userRouter.get('/users', getAllUsers);

// 📊 Get user statistics
userRouter.get('/users/stats', getUserStats);

// 🔍 Search users
userRouter.get('/users/search', searchUsers);

// 👤 Get user details by ID
userRouter.get('/users/:userId', getUserDetails);

// 🔒 Toggle user status (block/unblock)
userRouter.put('/users/:userId/status', toggleUserStatus);

// 🗑️ Delete user (soft delete)
userRouter.delete('/users/:userId', deleteUser);

export default userRouter;
