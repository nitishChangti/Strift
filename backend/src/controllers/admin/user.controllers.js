import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";
import Order from "../../models/order.models.js";

// 👥 Get all users with filters and pagination
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    // Build filter object
    const filter = { role: role || "user" }; // Only show regular users by default

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch users
    const users = await User.find(filter)
      .select("-password -refreshToken -otp")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(200,
        {
          users,
          pagination: {
            total: totalUsers,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(totalUsers / limit)
          }
        },
        "Users fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch users: ${error.message}`);
  }
});

// 👤 Get user details by ID
export const getUserDetails = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -refreshToken -otp");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Get user's orders
    const orders = await Order.find({ userId })
      .select("_id orderStatus paymentStatus finalAmount placedAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get order statistics for this user
    const totalOrders = await Order.countDocuments({ userId });
    const totalSpent = await Order.aggregate([
      { $match: { userId: user._id, paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } }
    ]);

    return res.status(200).json(
      new ApiResponse(200,
        {
          user,
          orders,
          stats: {
            totalOrders,
            totalSpent: totalSpent[0]?.total || 0,
            recentOrders: orders
          }
        },
        "User details fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch user details: ${error.message}`);
  }
});

// 🔒 Block/Unblock user
export const toggleUserStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json(
      new ApiResponse(200, user, `User ${isActive ? "activated" : "deactivated"} successfully`)
    );
  } catch (error) {
    throw new ApiError(500, `Failed to update user status: ${error.message}`);
  }
});

// 📊 Get user statistics
export const getUserStats = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeUsers = await User.countDocuments({ role: "user", isActive: true });
    const inactiveUsers = await User.countDocuments({ role: "user", isActive: false });

    // Users who made purchases
    const usersWithOrders = await Order.distinct("userId");
    const purchasingUsers = usersWithOrders.length;

    // Average orders per user
    const totalOrders = await Order.countDocuments();
    const avgOrdersPerUser = purchasingUsers > 0 ? (totalOrders / purchasingUsers).toFixed(2) : 0;

    return res.status(200).json(
      new ApiResponse(200,
        {
          totalUsers,
          activeUsers,
          inactiveUsers,
          purchasingUsers,
          totalOrders,
          avgOrdersPerUser
        },
        "User statistics fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch user statistics: ${error.message}`);
  }
});

// 🗑️ Delete user (soft delete by marking inactive)
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password -refreshToken -otp");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, user, "User deactivated successfully")
    );
  } catch (error) {
    throw new ApiError(500, `Failed to delete user: ${error.message}`);
  }
});

// 📧 Get user by phone/email
export const searchUsers = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      throw new ApiError(400, "Search query must be at least 2 characters");
    }

    const users = await User.find(
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } }
        ],
        role: "user"
      }
    )
      .select("-password -refreshToken -otp")
      .limit(10);

    return res.status(200).json(
      new ApiResponse(200, users, "Users search results")
    );
  } catch (error) {
    throw new ApiError(500, `Failed to search users: ${error.message}`);
  }
});
