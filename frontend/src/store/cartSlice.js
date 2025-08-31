import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],            // 🛒 main cart items
    savedForLater: [],    // 🗂️ saved for later items
    isLoading: false,  // ← add this
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action) {
            state.items = action.payload;
        },
        addToCart(state, action) {
            const item = action.payload;
            const existingIndex = state.items.findIndex(i =>
                i.id === item.id && i.size === item.size);
            if (existingIndex >= 0) {
                state.items[existingIndex].quantity += item.quantity;
            } else {
                state.items.push(item);
            }
        },
        removeFromCart(state, action) {
            const id = action.payload;
            state.items = state.items.filter(i => !(i.productId === id));
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const item = state.items.find(i => i.id === id);
            console.log(item)
            if (item) {
                item.quantity = quantity;
            }

        },
        clearCart(state) {
            state.items = [];
        },
        saveForLater(state, action) {
            const { id } = action.payload;
            const itemIndex = state.items.findIndex(i => i.id === id);

            if (itemIndex !== -1) {
                const [item] = state.items.splice(itemIndex, 1);
                state.savedForLater.push(item);
            }
        },
        setSaveForLater(state, action) {
            state.savedForLater = action.payload;
        },
        setCartLoading(state, action) {
            state.isLoading = action.payload;
        },

    },
});

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart, saveForLater, setSaveForLater, setCartLoading } = cartSlice.actions;
export default cartSlice.reducer;
