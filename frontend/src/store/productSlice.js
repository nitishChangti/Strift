import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],             // all products from search
    filteredList: [],     // products after applying filters
    query: "",            // search query
    selectedFilters: {},  // filters selected on products page
    selected: null,       // currently selected product (optional)
};

// Mapping filter keys to actual paths in the product object
const filterKeyMap = {
    gender: "gender",
    size: "variants.size",
    color: "variants.color",          // array of objects with {name, price, stock}
    fabric: "productDetails.Fabric",
    sleeveType: "productDetails.Sleeve",
    fit: "productDetails.Fit",
    type: "productDetails.Type",
    packOf: "variants.SalesPackage",
    pattern: "productDetails.Pattern",
    occasion: "productDetails.Occasion",
    isNewArrival: "isNewArrival",    // boolean filter
};

// Helper function to get nested value by path
const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

// Function to apply filters
const applyFilters = (list, filters) => {
    let filtered = [...list];

    Object.entries(filters).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return;

        const path = filterKeyMap[key];
        if (!path) return;

        filtered = filtered.filter((item) => {
            const itemValue = getValueByPath(item, path);

            if (!itemValue) return false;

            if (Array.isArray(itemValue)) {
                // Handle arrays: size arrays or color arrays of objects
                if (typeof itemValue[0] === "object" && itemValue[0].name) {
                    return itemValue.some((v) =>
                        value.map((v2) => v2.toLowerCase()).includes(v.name.toLowerCase())
                    );
                }
                return itemValue.some((v) => value.map((v2) => v2.toLowerCase()).includes(String(v).toLowerCase()));
            }

            if (typeof value === "boolean") {
                return itemValue === value;
            }

            return value.map((v2) => v2.toLowerCase()).includes(String(itemValue).toLowerCase());
        });
    });

    return filtered;
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setList: (state, action) => {
            state.list = action.payload;
            state.filteredList = [...action.payload]; // keep filteredList same initially
        },
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setSelected: (state, action) => {
            state.selected = action.payload;
        },
        updateFilters: (state, action) => {
            const { filterType, value } = action.payload;
            const arr = state.selectedFilters[filterType] || [];
            if (arr.includes(value)) {
                state.selectedFilters[filterType] = arr.filter((v) => v !== value);
            } else {
                state.selectedFilters[filterType] = [...arr, value];
            }
            state.filteredList = applyFilters(state.list, state.selectedFilters);
        },
        toggleBooleanFilter: (state, action) => {
            const key = action.payload;
            state.selectedFilters[key] = !state.selectedFilters[key];
            state.filteredList = applyFilters(state.list, state.selectedFilters);
        },
        clearFilters: (state) => {
            state.selectedFilters = {};
            state.filteredList = [...state.list];
        },
    },
});

export const { setList, setQuery, setSelected, updateFilters, toggleBooleanFilter, clearFilters } =
    productSlice.actions;
export default productSlice.reducer;
