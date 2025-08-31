// store/guestUserSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load guest state from localStorage on first load:
const savedGuest = JSON.parse(localStorage.getItem("guestUser")) || {
    cart: [],
    saveForLater: [],
    wishlist: [],       // Added wishlist here
    address: {},
    pendingOrder: {},   // ✅ Add this line
};

const guestUserSlice = createSlice({
    name: "guestUser",
    initialState: savedGuest,
    reducers: {
        addToGuestCart: (state, action) => {
            state.cart.push(action.payload);
            localStorage.setItem("guestUser", JSON.stringify(state));
        },
        removeFromGuestCart: (state, action) => {
            state.cart = state.cart.filter(item => item.productId !== action.payload);
            localStorage.setItem("guestUser", JSON.stringify(state));
        },
        updateGuestCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cart.find(i => i.productId === id);
            if (item) item.quantity = quantity;
            localStorage.setItem("guestUser", JSON.stringify(state));
        },
        addToGuestSaveForLater: (state, action) => {
            const productId = action.payload;
            // Find product
            const item = state.cart.find(item => String(item._id) === String(productId));

            if (item) {
                // Remove from cart
                state.cart = state.cart.filter(item => String(item.id) !== String(productId));
                // Add to saveForLater
                state.saveForLater.push(item);
            }

            localStorage.setItem("guestUser", JSON.stringify(state));
        },

        removeFromGuestSaveForLater: (state, action) => {
            const productId = action.payload;
            console.log(productId)
            state.saveForLater = state.saveForLater.filter(
                item => String(item._id) !== String(productId)
            );
            console.log(state.saveForLater)
            console.log(state.cart)
            localStorage.setItem("guestUser", JSON.stringify(state));
        },
        // Wishlist reducers
        addToGuestWishlist: (state, action) => {
            // Optional: prevent duplicates
            const exists = state.wishlist.find(item => item.productId === action.payload.productId);
            if (!exists) {
                state.wishlist.push(action.payload);
                localStorage.setItem("guestUser", JSON.stringify(state));
            }
        },
        removeFromGuestWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(item => item.productId !== action.payload);
            localStorage.setItem("guestUser", JSON.stringify(state));
        },

        setGuestUserAddress: (state, action) => {

            state.address = action.payload;
            console.log(state.address)
            localStorage.setItem("guestUser", JSON.stringify(state));
        },
        // ✅ New: set or update pending order draft
        setGuestPendingOrder: (state, action) => {
            state.pendingOrder = action.payload; // Save draft
            localStorage.setItem("guestUser", JSON.stringify(state));
        },

        clearGuestData: (state) => {
            state.cart = [];
            state.saveForLater = [];
            state.wishlist = [];
            state.address = {};
            state.pendingOrder = {}; // ✅ clear too
            localStorage.setItem("guestUser", JSON.stringify(state));
        },


    },
});

export const {
    addToGuestCart,
    removeFromGuestCart,
    updateGuestCartQuantity,
    addToGuestSaveForLater,
    removeFromGuestSaveForLater,
    addToGuestWishlist,
    removeFromGuestWishlist,
    setGuestUserAddress,
    clearGuestData,
    setGuestPendingOrder

} = guestUserSlice.actions;

export default guestUserSlice.reducer;
