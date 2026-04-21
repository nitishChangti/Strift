import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const adminOrderService = {
  // Get all orders with pagination and filters
  getAllOrders: async (page = 1, limit = 10, orderStatus = null, paymentStatus = null) => {
    try {
      let url = `${API_BASE_URL}/admin/orders?page=${page}&limit=${limit}`;
      if (orderStatus) url += `&orderStatus=${orderStatus}`;
      if (paymentStatus) url += `&paymentStatus=${paymentStatus}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  // Confirm order
  confirmOrder: async (orderId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${orderId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error confirming order:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, orderStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${orderId}/status`,
        { orderStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/orders/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order stats:", error);
      throw error;
    }
  },
};

export default adminOrderService;
