import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
    selectedAddress: null,
};

// reducer
export const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload;
            localStorage.setItem("selectedAddress", action.payload);
        },
        loadSelectedAddress: (state) => {
            const stored = localStorage.getItem("selectedAddress");
            state.selectedAddress = stored || null;
        },
        clearSelectedAddress: (state) => {
            state.selectedAddress = null;
            localStorage.removeItem("selectedAddress");
        },
    },
});

export const {
    setSelectedAddress,
    loadSelectedAddress,
    clearSelectedAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
