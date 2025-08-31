import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import userProductService from "../../services/userProduct.js";
import { setQuery as setProductQuery, setList, setSelected } from "../../store/productSlice.js";

function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Initialize input from URL on page load
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlQuery = params.get("search") || "";
        setInput(urlQuery);
        dispatch(setProductQuery(urlQuery));
    }, [location.search, dispatch]);

    // Fetch suggestions as user types
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (input.length >= 2) {
                try {
                    const result = await userProductService.fetchSuggestionProduct(input);
                    setSuggestions(result || []);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error("Suggestions error:", err);
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [input]);

    const handleSearch = async (value) => {
        if (!value.trim()) return;
        try {
            const products = await userProductService.fetchProducts(value);
            dispatch(setProductQuery(value));
            dispatch(setList(products?.productData || []));
            dispatch(setSelected(products?.productData?.[0] || null));
            setShowSuggestions(false);
            navigate(`/products?search=${encodeURIComponent(value.trim())}`);
        } catch (err) {
            console.error("Search failed", err);
            dispatch(setProductQuery(value));
            dispatch(setList([]));
            dispatch(setSelected(null));
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto relative">
            {/* Search Input */}
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
                <Search className="text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    className="w-full p-2 pl-2 rounded-full focus:outline-none"
                    placeholder="Search products..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(input)}
                />
            </div>

            {/* Suggestion Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                    {suggestions.map((item, index) => (
                        <li
                            key={`${item._id || item.name}-${index}`}
                            onClick={() => handleSearch(item.name)}
                            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        >
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover rounded-md"
                                />
                            )}
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    {item.category} • ₹{item.price}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
