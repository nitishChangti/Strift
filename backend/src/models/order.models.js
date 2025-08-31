import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true }, // snapshot product name
    image: { type: String }, // snapshot product image URL
    price: { type: Number, required: true }, // snapshot price at order time
    discount: { type: Number, default: 0 }, // snapshot discount %
    size: { type: String }, // selected size (optional)
    quantity: { type: Number, required: true, min: 1 },
    expectedDelivery: { type: Date }, // ✅ Add this
});

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema], // array of products in this order

        address: {
            name: { type: String, lowercase: true, trim: true, default: "" },
            address: { type: String, lowercase: true, trim: true, default: "" },
            city: { type: String, lowercase: true, trim: true, default: "" },
            state: { type: String, lowercase: true, trim: true, default: "" },
            pinCode: { type: String, lowercase: true, trim: true, default: "" },
            phoneNumber: { type: String, lowercase: true, trim: true, default: "" },
            locality: { type: String, lowercase: true, trim: true, default: "" },
            landmark: { type: String, lowercase: true, trim: true, default: "" },
            alternatePhoneNumber: { type: String, lowercase: true, trim: true, default: "" },
            addressType: { type: String, default: "" },
            updatedAt: { type: Date, default: Date.now },
        },


        totalPrice: { type: Number, required: true }, // total before discount
        totalDiscount: { type: Number, default: 0 },
        finalAmount: { type: Number, required: true }, // after discount

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
        },

        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PLACED",
        },
        checkoutStatus: {
            type: String,
            enum: ["PENDING_ADDRESS", "READY_FOR_PAYMENT", "COMPLETED"],
            default: "PENDING_ADDRESS",
        },
        placedAt: {
            type: Date,
            default: Date.now,
        },

        // 🔹 Razorpay Payment Details
        razorpayOrderId: { type: String },     // from Razorpay order creation
        razorpayPaymentId: { type: String },   // from successful payment
        razorpaySignature: { type: String },   // for verification
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
