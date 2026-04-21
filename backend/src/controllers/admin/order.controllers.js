import { asyncHandler } from "../../utils/asyncHandler.js";
import Order from "../../models/order.models.js";
import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiRes.js";

// 📦 Get all orders with filters
export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const { orderStatus, paymentStatus, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch orders with user details
    const orders = await Order.find(filter)
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(200, 
        {
          orders,
          pagination: {
            total: totalOrders,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(totalOrders / limit)
          }
        },
        "Orders fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch orders: ${error.message}`);
  }
});

// 📋 Get order details by ID
export const getOrderDetails = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId", "name phone email")
      .populate("items.productId", "productName price category");

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
      new ApiResponse(200, order, "Order details fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch order details: ${error.message}`);
  }
});

// ✅ Confirm order (change status from PLACED to CONFIRMED)
export const confirmOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus !== "PLACED") {
      throw new ApiError(400, `Order cannot be confirmed. Current status: ${order.orderStatus}`);
    }

    order.orderStatus = "CONFIRMED";
    await order.save();

    return res.status(200).json(
      new ApiResponse(200, order, "Order confirmed successfully")
    );
  } catch (error) {
    throw new ApiError(500, `Failed to confirm order: ${error.message}`);
  }
});

// 🚚 Update order delivery status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    // Validate status
    const validStatuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(orderStatus)) {
      throw new ApiError(400, `Invalid status. Valid statuses: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Define status progression rules
    const statusProgression = {
      PLACED: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: []
    };

    // Check if status transition is valid
    if (!statusProgression[order.orderStatus].includes(orderStatus)) {
      throw new ApiError(
        400,
        `Cannot change status from ${order.orderStatus} to ${orderStatus}`
      );
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json(
      new ApiResponse(200, order, `Order status updated to ${orderStatus}`)
    );
  } catch (error) {
    throw new ApiError(500, `Failed to update order status: ${error.message}`);
  }
});

// 📊 Get order statistics
export const getOrderStats = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const placedOrders = await Order.countDocuments({ orderStatus: "PLACED" });
    const confirmedOrders = await Order.countDocuments({ orderStatus: "CONFIRMED" });
    const shippedOrders = await Order.countDocuments({ orderStatus: "SHIPPED" });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "DELIVERED" });
    const cancelledOrders = await Order.countDocuments({ orderStatus: "CANCELLED" });
    const paidOrders = await Order.countDocuments({ paymentStatus: "PAID" });

    // Calculate total revenue
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, totalRevenue: { $sum: "$finalAmount" } } }
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res.status(200).json(
      new ApiResponse(200,
        {
          totalOrders,
          placedOrders,
          confirmedOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          paidOrders,
          totalRevenue
        },
        "Order statistics fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch order statistics: ${error.message}`);
  }
});
