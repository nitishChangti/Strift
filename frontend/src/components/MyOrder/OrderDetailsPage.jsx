// src/pages/OrderDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import userOrderService from "../../services/order";
import { useNavigate } from "react-router-dom";
const OrderDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderTimeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await userOrderService.getOrderDetails(id);
                if (res.statusCode === 200) {
                    setOrder(res.data);
                } else {
                    console.error("Failed to fetch order:", res.message);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!order) return <p className="text-center mt-10 text-red-600">Order not found</p>;

    const currentStatusIndex = orderTimeline.indexOf(order.orderStatus);
    const product = order.items[0];
    const delivery = order.address;
    const price = {
        list: product.price + product.discount,
        selling: product.price,
        handling: 0,
        total: order.finalAmount,
        cod: order.finalAmount
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                {/* Left Section - Order Details */}
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                    {/* Product Info */}
                    <div className="flex justify-between items-start border-b pb-4 mb-4"
                        onClick={() => {
                            // Handle product click
                            navigate(`/product/${product._id}`);
                        }}>
                        <div>
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <p className="text-gray-500">Size: {product.size}</p>
                            <p className="text-gray-500">Quantity: {product.quantity}</p>
                            <p className="text-xl font-bold mt-2">₹{product.price}</p>
                        </div>
                        <img src={product.image} alt={product.name} className="w-20" />
                    </div>

                    {/* Order Timeline */}
                    <div className="flex flex-col relative ml-6">
                        <div className="absolute left-2 top-0 h-full w-px bg-gray-300"></div>
                        {orderTimeline.map((status, idx) => {
                            const isCompleted = idx <= currentStatusIndex;
                            const isLast = idx === orderTimeline.length - 1;
                            return (
                                <div key={idx} className="flex items-start relative mb-6">
                                    {/* Circle */}
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 z-10 relative ${isCompleted
                                            ? "bg-green-600 border-green-600 flex items-center justify-center text-white"
                                            : "bg-white border-gray-300"
                                            }`}
                                    >
                                        {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                                    </div>

                                    {/* Status text */}
                                    <div className="ml-4">
                                        <p className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                            {status}
                                        </p>
                                        {status === "PLACED" && order.placedAt && (
                                            <p className="text-gray-500 text-sm">
                                                {new Date(order.placedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Connecting line */}
                                    {!isLast && (
                                        <div
                                            className={`absolute left-3 top-4 w-px h-full ${idx < currentStatusIndex ? "bg-green-600" : "bg-gray-300"
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Section - Delivery & Price Details */}
                <div className="space-y-6">
                    {/* Delivery Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Delivery details</h3>
                        <div className="space-y-3">
                            <p className="text-gray-700 text-sm">{delivery.address || "No address provided"}</p>
                            <p className="text-gray-700 text-sm">{delivery.name || "N/A"} • {delivery.phoneNumber || "N/A"}</p>
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="font-semibold text-gray-700 mb-3">Price Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-gray-600">List price</p>
                                <p className="line-through text-gray-400">₹{price.list}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Selling price</p>
                                <p>₹{price.selling}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-600">Handling Fee</p>
                                <p className="text-green-600 font-medium">Free</p>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2">
                                <p>Total Amount</p>
                                <p>₹{price.total}</p>
                            </div>
                            <div className="pt-2 text-gray-700">• Cash On Delivery: ₹{price.cod}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
