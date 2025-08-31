import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { logout } from './authSlice';
import productSlice from './productSlice';
import addressSlice from './addressSlice';
import cartSlice from './cartSlice';
import guestUserSlice from './guestUserSlice';
import orderSlice from './orderSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productSlice,
        address: addressSlice,
        cart: cartSlice,
        order: orderSlice,
        guestUser: guestUserSlice

    }
})



export default store;
