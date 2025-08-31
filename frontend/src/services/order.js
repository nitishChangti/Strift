import axios from 'axios';

export class UserOrderService {
    baseUrl = 'http://localhost:3000';
    async fetchUserCart() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/fetchUserCart`,
                {
                    withCredentials: true
                }
            );
            return response.data; // returns array of product names
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return []; // fallback to empty array on failure
        }
    }

    async createOrder(order) {
        try {
            const response = await axios.post(`${this.baseUrl}/orders`, order, {
                withCredentials: true, // if you're using cookies for auth
            });
            return response.data;
        }
        catch (err) {
            console.error(" Error adding to cart:", err);
            return null;
        }
    }

    async fetchPendingOrders() {
        try {
            const response = await axios.get(`${this.baseUrl}/orders/pending`, {
                withCredentials: true, // if you're using cookies for auth
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching pending orders:", error);
            return null;
        }
    }

    // 1️⃣ Create Razorpay order
    async createRazorpayOrder(orderData) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/create-razorpay-order`,
                orderData,
                { withCredentials: true }
            );
            return response.data; // { success, razorpayOrder }
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            return null;
        }
    }

    // 2️⃣ Verify Razorpay payment
    async verifyRazorpayPayment(paymentData) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/verify-razorpay-payment`,
                paymentData,
                { withCredentials: true }
            );
            return response.data; // { success, message }
        } catch (error) {
            console.error("Error verifying payment:", error);
            return { success: false };
        }
    }

    async myOrders() {
        try {
            const res = await axios.get(`${this.baseUrl}/my-orders`, {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {
            console.error("Error fetching my orders:", error);
            return [];
        }
    }

    async getOrderDetails(orderId) {
        try {
            const response = await axios.get(`${this.baseUrl}/orderDetail/${orderId}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching order details:", error);
            return null;
        }
    }
}

const userOrderService = new UserOrderService();

export default userOrderService;