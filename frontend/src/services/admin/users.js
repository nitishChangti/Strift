import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const adminUserService = {
  // Get all users with pagination and filters
  getAllUsers: async (page = 1, limit = 10, search = "", role = "") => {
    try {
      let url = `${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (role) url += `&role=${role}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user details
  getUserDetails: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

  // Toggle user status (block/unblock)
  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  },

  // Delete user (soft delete)
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },
};

export default adminUserService;
