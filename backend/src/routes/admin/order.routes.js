import express from 'express';
import {
  getAllOrders,
  getOrderDetails,
  confirmOrder,
  updateOrderStatus,
  getOrderStats
} from '../../controllers/admin/order.controllers.js';
import { authorization } from '../../middlewares/roleAuth.js';
import { verifyJWT } from '../../middlewares/verifyJwt.js';

const orderRouter = express.Router();

// Middleware to verify JWT and check admin role
orderRouter.use(verifyJWT);
orderRouter.use(authorization(['admin']));

// 📦 Get all orders with pagination and filters
orderRouter.get('/orders', getAllOrders);

// 📊 Get order statistics
orderRouter.get('/orders/stats', getOrderStats);

// 📋 Get order details by ID
orderRouter.get('/orders/:orderId', getOrderDetails);

// ✅ Confirm order (PLACED -> CONFIRMED)
orderRouter.put('/orders/:orderId/confirm', confirmOrder);

// 🚚 Update order status
orderRouter.put('/orders/:orderId/status', updateOrderStatus);

export default orderRouter;
