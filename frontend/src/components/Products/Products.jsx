import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { FilterSidebar } from "../index";
import userProductService from "../../services/userProduct";
import { setList, setQuery, setSelected } from "../../store/productSlice";

function Products() {
  const user = useSelector((state) => state.auth.userData);
  console.log(user);
  const isAuthenticated = useSelector((state) => state.auth.status);

  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category");
  const categoryName = searchParams.get("categoryName") || "";

  const products = useSelector((state) => state.product.filteredList);

  // Fetch products
  useEffect(() => {
    if (!searchQuery && !category && !categoryName) return;

    (async () => {
      try {
        const res = await userProductService.fetchProducts({
          search: searchQuery,
          category,
          categoryName,
        });
        dispatch(setList(res.productData || []));
        dispatch(setQuery(searchQuery));
        dispatch(setSelected(res.productData?.[0] || null));
      } catch {
        dispatch(setList([]));
        dispatch(setSelected(null));
      }
    })();
  }, [searchQuery, category, categoryName, dispatch]);

  // Load wishlist & cart on mount/auth change
 useEffect(() => {
  if (!isAuthenticated) {
    // 👤 Guest → localStorage
    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  } else {
    // 🔐 Logged-in → Redux user is source of truth
    setWishlist(user?.wishlist || []);
    setCart(user?.cart || []);
  }
}, [isAuthenticated, user]);

  // Wishlist toggle
  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const updated = local.includes(productId)
        ? local.filter((id) => id !== productId)
        : [...local, productId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlist(updated);
      return;
    }
    const res = await userProductService.addToWishlist(productId);
    setWishlist(res.wishlist || []);
  };

  // Add to cart
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      console.log('user not loggedIm',isAuthenticated);
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = local.findIndex((i) => i.productId === product._id);
      if (idx > -1) local[idx].quantity += 1;
      else
        local.push({
          productId: product._id,
          quantity: 1,
          price: product.price,
          name: product.name,
          image: product.image,
        });
      localStorage.setItem("cart", JSON.stringify(local));
      setCart(local);
      return;
    }
    console.log('user loggedIn');
    const res = await userProductService.addToCart({
      productId: product._id,
      quantity: 1,
      size: "",
      color: "",
    });
    console.log('res',res);
    setCart(res.data.cart || []);
  };
  // 🔹 Handlers
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`);
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="w-full md:w-64 border-r hidden md:block sticky top-0 h-screen bg-white z-10 shadow-md">
        <FilterSidebar />
      </div>

      <div className="flex-1 p-4">
        {(searchQuery || categoryName) && (
          <div className="mb-4 text-sm text-gray-600">
            {searchQuery && <span>Search: {searchQuery}</span>}
            {!searchQuery && categoryName && <span>Category: {categoryName}</span>}
          </div>
        )}
        <AnimatePresence>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isWishlisted = wishlist.includes(product._id);
              const inCart = cart.some((p) => p.productId === product._id);
              const isOutOfStock = Number(product.stock) <= 0;

              return (
                <motion.div key={product._id} className="border rounded-lg shadow-sm p-3 bg-white relative">
                  <div
                    className="absolute top-2 right-2 text-red-500 text-xl z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product._id);
                    }}
                  >
                    {isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
                  </div>

                  <img
                    src={product.image}
                    className="w-full h-40 object-cover rounded-md mb-3"
                    onClick={() => handleProductClick(product)}
                  />

                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="font-bold text-blue-600">₹{product.price}</p>

                  <p className={`mt-1 text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-black"}`}>
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </p>

                  <button
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product)}
                    className={`mt-2 w-full flex items-center justify-center gap-2 py-1 rounded ${isOutOfStock
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-500 text-white"
                      }`}
                  >
                    <BsCartPlus />
                    {isOutOfStock ? "Out of Stock" : inCart ? "Added" : "Add to Cart"}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
        {products.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            No products found for this category yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
