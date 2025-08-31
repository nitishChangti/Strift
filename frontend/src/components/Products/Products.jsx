import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Wishlist
import { BsCartPlus } from "react-icons/bs"; // Add to cart icon
import { FilterSidebar } from "../index";
import userProductService from "../../services/userProduct";
import { setList, setQuery, setSelected } from "../../store/productSlice";

function Products() {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]);

    const searchQuery = searchParams.get("search") || "";

    const products = useSelector((state) => state.product.filteredList);
    const selectedFilters = useSelector((state) => state.product.selectedFilters);

    // Fetch products on search
    useEffect(() => {
        if (!searchQuery) return;

        const fetchProducts = async () => {
            try {
                const res = await userProductService.fetchProducts(searchQuery);
                dispatch(setList(res.productData || []));
                dispatch(setQuery(searchQuery));
                dispatch(setSelected(res.productData?.[0] || null));
            } catch (err) {
                console.error("Failed to fetch products", err);
                dispatch(setList([]));
                dispatch(setSelected(null));
            }
        };

        fetchProducts();
    }, [searchQuery, dispatch]);

    const handleProductClick = (product) => {
        navigate(`/product/${product._id}`);
    };

    const toggleWishlist = (productId) => {
        setWishlist((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    const addToCart = (product) => {
        setCart((prev) => {
            if (prev.find((p) => p._id === product._id)) return prev; // already in cart
            return [...prev, { ...product, quantity: 1 }];
        });
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            {/* Filter Sidebar */}
            <div className="w-full md:w-64 border-r hidden md:block sticky top-0 h-screen bg-white z-10 shadow-md">
                <FilterSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <div className="mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-wide">Products</h1>
                    {searchQuery && (
                        <p className="text-gray-600 text-sm md:text-base mt-1">
                            Showing results for: <span className="font-medium">{searchQuery}</span>
                        </p>
                    )}
                </div>

                {/* Filters Applied */}
                {Object.keys(selectedFilters).length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {Object.entries(selectedFilters).map(([key, values]) =>
                            Array.isArray(values)
                                ? values.map((v) => (
                                    <span
                                        key={`${key}-${v}`}
                                        className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full shadow-sm animate-pulse"
                                    >
                                        {key}: {v}
                                    </span>
                                ))
                                : values && (
                                    <span
                                        key={key}
                                        className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full shadow-sm animate-pulse"
                                    >
                                        {key}
                                    </span>
                                )
                        )}
                    </div>
                )}

                {/* No Products */}
                {products.length === 0 && (
                    <p className="text-center text-gray-500 mt-20 text-lg md:text-xl animate-fadeIn">
                        No products found.
                    </p>
                )}

                {/* Product Grid */}
                <AnimatePresence>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const isWishlisted = wishlist.includes(product._id);
                            const inCart = cart.find((p) => p._id === product._id);

                            return (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="border rounded-lg shadow-sm p-3 bg-white cursor-pointer hover:shadow-lg hover:-translate-y-1 transform transition-all relative"
                                    onClick={() => handleProductClick(product)} // <- Navigate works
                                >
                                    {/* Wishlist Heart */}
                                    <div
                                        className="absolute top-2 right-2 text-red-500 text-xl z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(product._id);
                                        }}
                                    >
                                        {isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
                                    </div>

                                    {/* Product Image */}
                                    <div className="overflow-hidden rounded-md">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            src={product.image || "/placeholder.png"}
                                            alt={product.name}
                                            className="w-full h-40 object-cover rounded-md mb-3"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                                    <p className="text-sm text-gray-500 capitalize truncate">{product.category}</p>
                                    <p className="font-bold mt-2 text-blue-600">₹{product.price}</p>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className={`mt-2 w-full flex items-center justify-center gap-2 py-1 px-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors`}
                                    >
                                        <BsCartPlus /> {inCart ? "Added" : "Add to Cart"}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Products;
