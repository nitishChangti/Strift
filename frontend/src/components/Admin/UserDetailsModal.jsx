import { useState } from "react";
import adminUserService from "../../services/admin/users.js";

const UserDetailsModal = ({ user, isOpen, onClose, onUserUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen || !user) return null;

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      await adminUserService.toggleUserStatus(user._id, !user.isActive);
      setSuccess(`User ${!user.isActive ? "activated" : "deactivated"} successfully!`);
      setTimeout(() => {
        onUserUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to deactivate this user? This action cannot be undone immediately.")) {
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      await adminUserService.deleteUser(user._id);
      setSuccess("User deactivated successfully!");
      setTimeout(() => {
        onUserUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate user");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-80 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* User Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Account Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.isActive ? (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    ✓ Active
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    ✕ Inactive
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className={`
                px-4 py-2 rounded font-semibold transition
                ${
                  user.isActive
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }
                disabled:opacity-50 cursor-pointer
              `}
            >
              {isUpdating ? "Updating..." : user.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>

          {/* User Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-gray-900 font-medium">{user.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-gray-900 font-medium">{user.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900 font-medium break-all">{user.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Role</p>
                <p className="text-gray-900 font-medium uppercase">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Account Creation Date */}
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm mb-1">Member Since</p>
            <p className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Order Statistics */}
          {user.stats && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Purchase History</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{user.stats.totalOrders}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-gray-600 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">₹{user.stats.totalSpent?.toLocaleString() || 0}</p>
                </div>
              </div>

              {/* Recent Orders */}
              {user.stats.recentOrders && user.stats.recentOrders.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Recent Orders</p>
                  <div className="space-y-2">
                    {user.stats.recentOrders.map((order) => (
                      <div key={order._id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order._id.slice(-8)}</p>
                          <p className="text-xs text-gray-600">{new Date(order.placedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹{order.finalAmount}</p>
                          <span className={`inline-block text-xs px-2 py-1 rounded ${
                            order.orderStatus === "DELIVERED" ? "bg-green-100 text-green-800" :
                            order.orderStatus === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                            order.orderStatus === "CONFIRMED" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Danger Zone */}
          <div className="border-t pt-4 border-red-200 bg-red-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-3 text-red-900">Danger Zone</h3>
            <button
              onClick={handleDeleteUser}
              disabled={isUpdating}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition"
            >
              {isUpdating ? "Processing..." : "🗑️ Deactivate User Account"}
            </button>
            <p className="text-xs text-red-700 mt-2">
              This will mark the user as inactive. Use with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
