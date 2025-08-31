import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],           // 📦 Placed orders list
    isLoading: false,     // ⏳ Optional loading state
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders(state, action) {
            state.orders = action.payload; // Replace all orders (e.g., after fetch)
        },
        addPlacedOrder(state, action) {
            state.orders.push(action.payload); // Add newly placed order
        },
        removeOrder(state, action) {
            const orderId = action.payload;
            state.orders = state.orders.filter(order => order._id !== orderId);
        },
        clearOrders(state) {
            state.orders = [];
        },
        setOrdersLoading(state, action) {
            state.isLoading = action.payload;
        },
        updateOrderItemQuantity(state, action) {
            const { orderId, itemId, newQuantity } = action.payload;

            const order = state.orders.find(order => order._id === orderId);
            if (order) {
                const item = order.items.find(item => item._id === itemId);
                if (item) {
                    item.quantity = newQuantity;
                }
            }
        }

    },
});

export const {
    setOrders,
    addPlacedOrder,
    removeOrder,
    clearOrders,
    setOrdersLoading,
    updateOrderItemQuantity
} = orderSlice.actions;

export default orderSlice.reducer;
