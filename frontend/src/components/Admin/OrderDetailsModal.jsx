import { useState } from "react";
import adminOrderService from "../../services/admin/orders.js";

const OrderDetailsModal = ({ order, isOpen, onClose, onOrderUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen || !order) return null;

  const statusOptions = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: []
  };

  const getStatusColor = (status) => {
    const colors = {
      PLACED: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      PENDING: "bg-gray-100 text-gray-800",
      PAID: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleConfirmOrder = async () => {
    if (order.orderStatus !== "PLACED") {
      setError("Only orders in PLACED status can be confirmed");
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      await adminOrderService.confirmOrder(order._id);
      setSuccess("Order confirmed successfully!");
      setSelectedStatus("CONFIRMED");
      setTimeout(() => {
        onOrderUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedStatus || selectedStatus === order.orderStatus) {
      setError("Please select a different status");
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      await adminOrderService.updateOrderStatus(order._id, selectedStatus);
      setSuccess(`Order status updated to ${selectedStatus}!`);
      setTimeout(() => {
        onOrderUpdate();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const availableStatuses = statusOptions[order.orderStatus] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order Details</h2>
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

          {/* Order ID and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Order ID</p>
              <p className="text-lg font-semibold text-gray-900">{order._id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Current Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm mb-2">Placed At</p>
            <p className="text-gray-900">{new Date(order.placedAt).toLocaleString()}</p>
          </div>

          {/* Customer Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-gray-900">{order.userId?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-gray-900">{order.userId?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900">{order.userId?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Delivery Address</h3>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-gray-900">{order.address.name}</p>
              <p className="text-gray-700">{order.address.address}</p>
              <p className="text-gray-700">{order.address.locality}, {order.address.city}, {order.address.state} {order.address.pinCode}</p>
              <p className="text-gray-700 mt-2">Phone: {order.address.phoneNumber}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Items Ordered</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} {item.size && `| Size: ${item.size}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                    <p className="text-sm text-gray-600">Discount: {item.discount}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Price</span>
                <span className="font-semibold">₹{order.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Discount</span>
                <span className="font-semibold text-green-600">-₹{order.totalDiscount}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-semibold">Final Amount</span>
                <span className="text-lg font-semibold text-blue-600">₹{order.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="border-t pt-4">
            <p className="text-gray-600 text-sm mb-2">Payment Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </div>

          {/* Status Timeline - Visual Display */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Progress</h3>
            
            <div className="relative flex items-center justify-between mb-6">
              {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((status, index, arr) => {
                const statusProgression = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
                const currentIndex = statusProgression.indexOf(order.orderStatus);
                const isCompleted = statusProgression.indexOf(status) < currentIndex;
                const isCurrent = status === order.orderStatus;

                return (
                  <div key={status} className="flex flex-col items-center flex-1 relative">
                    {/* Line connector */}
                    {index < arr.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-1 ${isCompleted ? "bg-green-600" : "bg-gray-300"}`}></div>
                    )}

                    {/* Circle */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-white relative z-10
                      ${isCurrent ? "bg-blue-600 ring-4 ring-blue-200" : isCompleted ? "bg-green-600" : "bg-gray-300"}
                    `}>
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    {/* Status Label */}
                    <p className={`text-xs font-semibold mt-2 text-center ${isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Update Section - Quick Action Buttons */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Update Order Status</h3>

            {order.orderStatus !== "DELIVERED" && order.orderStatus !== "CANCELLED" ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Current Status: <span className="font-semibold text-blue-600">{order.orderStatus}</span>
                </p>

                {/* Available Status Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {availableStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                      }}
                      className={`
                        py-2 px-3 rounded font-semibold text-sm transition
                        ${
                          selectedStatus === status
                            ? "bg-blue-600 text-white ring-2 ring-blue-300"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                        }
                      `}
                    >
                      → {status}
                    </button>
                  ))}

                  {/* Cancel Button */}
                  {order.orderStatus !== "DELIVERED" && (
                    <button
                      key="CANCELLED"
                      onClick={() => {
                        setSelectedStatus("CANCELLED");
                      }}
                      className={`
                        py-2 px-3 rounded font-semibold text-sm transition col-span-2
                        ${
                          selectedStatus === "CANCELLED"
                            ? "bg-red-600 text-white ring-2 ring-red-300"
                            : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-300"
                        }
                      `}
                    >
                      ✕ Cancel Order
                    </button>
                  )}
                </div>

                {/* Update Button */}
                {selectedStatus && selectedStatus !== order.orderStatus && (
                  <button
                    onClick={handleStatusChange}
                    disabled={isUpdating}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition mt-4"
                  >
                    {isUpdating ? "Updating..." : `✓ Confirm Change to ${selectedStatus}`}
                  </button>
                )}

                {!selectedStatus && (
                  <p className="text-sm text-gray-500 text-center italic mt-4">
                    Select a status above to update
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded text-center">
                <p className="font-semibold text-gray-700">{order.orderStatus}</p>
                <p className="text-sm text-gray-600 mt-1">No further status updates available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
