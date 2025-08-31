import React from 'react';
import userOrderService from '../../services/order.js'; // your order service
import { useNavigate } from 'react-router-dom';
export default function PaymentOptions({ orders, selectedAddress, email }) {

    const navigate = useNavigate();
    const handlePayment = async () => {

        try {
            if (!orders || !orders.length) {
                alert("No orders found!");
                return;
            }

            // 1️⃣ Calculate total amount from orders
            const amount = orders
                .flatMap(order => order.items)
                .reduce((acc, item) => {
                    const price = item.price - (item.price * item.discount / 100);
                    return acc + price * item.quantity;
                }, 0);

            // 2️⃣ Call backend to create Razorpay order
            const { razorpayOrder } = await userOrderService.createRazorpayOrder({
                amount,
                orderId: orders[0]._id // use any unique order ID from DB
            });

            if (!razorpayOrder) throw new Error("Failed to create Razorpay order");
            console.log('Razorpay order created:', razorpayOrder);
            // 3️⃣ Razorpay payment options
            const options = {
                key: 'rzp_test_RAiqZOXpIlF2hR', // Replace with your Razorpay Key ID
                amount: razorpayOrder.amount, // already in paise
                currency: razorpayOrder.currency,
                name: "NITISH",
                description: "Order Payment",
                order_id: razorpayOrder.id,
                prefill: {
                    name: selectedAddress?.name || "Guest",
                    email: email || "guest@example.com",
                    contact: selectedAddress?.phone || "9999999999",
                },
                theme: {
                    color: "#FB641B",
                },
                handler: async function (response) {
                    try {
                        console.log('Payment response:', response);
                        // 4️⃣ Send payment details to backend for verification
                        const verifyResponse = await userOrderService.verifyRazorpayPayment({
                            ...response,               // includes payment_id, order_id, signature
                            orderId: orders[0]._id     // your internal DB order id
                        });

                        console.log('Verification response:', verifyResponse);
                        if (verifyResponse.success) {
                            alert("Payment successful!");
                            // Optional: refresh orders or redirect
                            console.log("Payment verified:", verifyResponse);
                            // Refresh orders or redirect as needed
                            navigate("/profile/myOrders");
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (err) {
                        console.error("Verification failed:", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                modal: {
                    escape: true,
                },
            };

            // 5️⃣ Open Razorpay popup
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Payment failed:", err);
            alert("Payment failed. Please try again.");
        }
    };

    // Total amount display
    const totalAmount = orders
        .flatMap(o => o.items)
        .reduce((acc, item) => acc + (item.price - (item.price * item.discount / 100)) * item.quantity, 0);

    return (
        <div>
            <p>Total Payment: ₹{totalAmount}</p>
            <button
                onClick={handlePayment}
                className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
            >
                Pay with Razorpay
            </button>
        </div>
    );
}
