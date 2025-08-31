import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userProductService from '../../services/userProduct';
import ProductImage from './ProductImage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import userCartService from '../../services/userCart';
import {
    addToGuestCart,
    removeFromGuestCart,
    updateGuestCartQuantity,
    addToGuestSaveForLater,
    removeFromGuestSaveForLater,
    addToGuestWishlist,
    removeFromGuestWishlist,

} from '../../store/guestUserSlice';
import userOrderService from '../../services/order';
const serviceAvaiablePinCode = [
    { pincode: "560001", district: "Bangalore Urban", deliveryAvailable: true, codAvailable: true },
    { pincode: "560002", district: "Bangalore Urban", deliveryAvailable: true, codAvailable: true },
    { pincode: "560003", district: "Bangalore Urban", deliveryAvailable: true, codAvailable: true },
    { pincode: "560004", district: "Bangalore Urban", deliveryAvailable: true, codAvailable: true },
    { pincode: "560005", district: "Bangalore Urban", deliveryAvailable: true, codAvailable: true },
    { pincode: "560100", district: "Bangalore Urban", deliveryAvailable: true, codAvailable: true },
    { pincode: "570001", district: "Mysore", deliveryAvailable: true, codAvailable: true },
    { pincode: "570002", district: "Mysore", deliveryAvailable: true, codAvailable: true },
    { pincode: "580001", district: "Dharwad", deliveryAvailable: true, codAvailable: true },
    { pincode: "590001", district: "Belgaum", deliveryAvailable: true, codAvailable: true },
    { pincode: "591201", district: "Belgaum", deliveryAvailable: true, codAvailable: true },
    { pincode: "577201", district: "Shimoga", deliveryAvailable: true, codAvailable: true }
]


function ProductDetail() {
    // You use useDispatch to get the dispatch function for dispatching actions,
    // and useSelector to access state from the Redux store.
    // Example usage:
    const user = useSelector(state => state.auth.userData);
    console.log(user)
    useEffect(() => {
        if (user && user.address && user.address.length > 0) {
            // Sort descending by updatedAt
            const sorted = [...user.address].sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            setLatestAddress(sorted[0]); // pick latest address
        } else {
            setLatestAddress(null); // no address exists
        }
    }, [user]);
    const guest = useSelector(state => state.guestUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isCarted, setIsCarted] = useState(false);
    // const [wishlistData, setWishlistData] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    // const [cart, setCart] = useState([]);
    // const [error, setError] = useState(null);

    const [pincode, setPincode] = useState("");
    const [pincodeStatus, setPincodeStatus] = useState(null);

    // Suppose you already have:
    const totalStock = product?.variants?.stock || 0;
    const [expectedDelivery, setExpectedDelivery] = useState(null);
    const [latestAddress, setLatestAddress] = useState(null); // currently selected address
    const [showAddresses, setShowAddresses] = useState(false); // dropdown toggle



    // Example: classify stock status
    let stockStatus = "";
    if (totalStock > 10) {
        stockStatus = `In Stock (${totalStock} left)`;
    } else if (totalStock > 0) {
        stockStatus = `Hurry! Only ${totalStock} left in stock`;
    } else {
        stockStatus = "Out of Stock";
    }


    console.log(product && product.variants && product.variants.stock)
    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const result = await userProductService.fetchProductDetails(id);
                setProduct(result.products); // Or result.data depending on your API
                // console.log(result.products)

            } catch (error) {
                console.error('Failed to fetch product details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!user) {
            // ✅ Guest: check wishlist
            const isWished = guest.wishlist.includes(id);
            setIsWishlisted(isWished);

            // ✅ Guest: check cart
            const isInCart = guest.cart.some(item => String(item.id) === String(id));
            setIsCarted(isInCart);
        }
        else {
            // ✅ User: backend data
            const isWished = user.wishlist?.includes(id);
            setIsWishlisted(isWished);

            const isInCart = user.cart?.some(item => String(item.productId) === String(id));
            setIsCarted(isInCart);

        }
    }, [id, user, guest]);

    useEffect(() => {
        if (product?.variants?.size?.length > 0) {
            setSelectedSize(product.variants.size[0]);
        }
    }, [product]);


    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (!product) return <div className="p-4 text-center text-red-500">Product not found</div>;

    const handleWishlist = async () => {
        if (!user) {
            if (isWishlisted) {
                dispatch(removeFromGuestWishlist(id));
            } else {
                dispatch(addToGuestWishlist(id));
            }
            setIsWishlisted(!isWishlisted);
        } else {
            try {
                if (isWishlisted) {
                    await userProductService.deleteFromWishlist(id);
                    setIsWishlisted(false);
                } else {
                    await userProductService.addToWishlist(id);
                    setIsWishlisted(true);
                }
            } catch (err) {
                console.error("Wishlist failed", err);
            }
        }
    };
    const getExpectedDeliveryDate = () => {
        const dateString = expectedDelivery || getDefaultExpectedDelivery();
        return new Date(dateString); // convert formatted date to Date object
    };

    const handleCart = async () => {
        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        if (!user) {
            if (isCarted) {
                dispatch(removeFromGuestCart(id));
                setIsCarted(false);
            } else {
                console.log(product.name)
                const cartItem = {
                    _id: id,
                    productId: id,
                    image: product.image,
                    productName: product.name,
                    size: selectedSize,
                    quantity,
                    price: product.price,
                    discount: product.discount || 0,
                    expectedDelivery: getExpectedDeliveryDate() // ✅ Add this field
                };
                dispatch(addToGuestCart(cartItem));
                setIsCarted(true);
                navigate("/cart");
            }
        } else {
            try {
                const cartItem = {
                    productId: id,
                    size: selectedSize,
                    quantity,
                    expectedDelivery: getExpectedDeliveryDate()
                };
                console.log(cartItem)
                const res = await userCartService.addToCart(cartItem);
                if (res.success) {
                    setIsCarted(true);
                    navigate("/cart");
                } else {
                    console.error("Failed to add to cart");
                }
            } catch (err) {
                console.error("Cart failed", err);
            }
        }
    }
    // console.log(selectedSize)

    // BEFORE
    // const isDeliveryAvailable = (pincode) => {
    //   return serviceAvaiablePinCode.some(entry => entry.pincode === pincode && entry.deliveryAvailable);
    // };

    // AFTER
    const isDeliveryAvailable = (pin) => {
        return serviceAvaiablePinCode.find(
            entry => entry.pincode === pin && entry.deliveryAvailable
        ) || null;
    };


    const checkPincode = () => {
        if (!pincode || pincode.length !== 6) {
            setPincodeStatus({
                message: "Please enter a valid 6-digit PIN code.",
                available: false,
            });
            setExpectedDelivery(null);
            return;
        }

        const service = isDeliveryAvailable(pincode);

        if (service) {
            setPincodeStatus({
                message: `✅ Delivery is available for ${service.district} (${pincode})`,
                available: true,
            });

            // Compute expected delivery date
            const [minDays, maxDays] = estimateDeliveryDays(service.district);
            const today = new Date();

            // pick a random day between minDays and maxDays
            const deliveryOffset = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;

            const deliveryDate = new Date(today);
            deliveryDate.setDate(today.getDate() + deliveryOffset);

            // Format: "Sep 5, 2025"
            const formatted = deliveryDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });

            setExpectedDelivery(formatted);
        } else {
            setPincodeStatus({
                message: `❌ Sorry, we do not deliver to ${pincode} yet.`,
                available: false,
            });
            setExpectedDelivery(null);
        }
    };


    // ✅ Pick a random [min,max] within a range, ensuring max > min
    const randomRange = (minStart, maxEnd) => {
        const min = Math.floor(Math.random() * (maxEnd - 1 - minStart + 1)) + minStart; // between minStart..maxEnd-1
        const max = Math.floor(Math.random() * (maxEnd - (min + 1) + 1)) + (min + 1);   // between min+1..maxEnd
        return [min, max];
    };

    // ✅ Estimate delivery window based on district (warehouse = Bangalore)
    const estimateDeliveryDays = (district) => {
        const d = (district || "").toLowerCase();

        // Same-city (Bangalore)
        if (d.includes("bangalore")) return [2, 3];

        // Everything else -> random 4–7 days window
        return randomRange(4, 7);
    };

    const getDefaultExpectedDelivery = () => {
        const now = new Date();
        const cutoffHour = 20; // 8 PM

        let deliveryDate = new Date();

        if (now.getHours() < cutoffHour) {
            // Before 8 PM → next day delivery start
            deliveryDate.setDate(now.getDate() + 1);
        } else {
            // After 8 PM → add one extra day
            deliveryDate.setDate(now.getDate() + 2);
        }

        // Format: "Sep 1, 2025"
        return deliveryDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // In ProductDetails.jsx
    const handleOrderNow = async () => {
        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        if (!user) {
            // Guest user → redirect to login first
            navigate("/login?redirect=checkout");
            return;
        }

        try {
            const orderItem = {
                productId: id,
                name: product.name,
                image: product.image,
                price: product.price,
                discount: product.discount || 0,
                size: selectedSize,
                quantity,
                expectedDelivery: getExpectedDeliveryDate()
            };

            const payload = {
                items: [orderItem],
                totalPrice: product.price * quantity,
                totalDiscount: product.discount || 0,
                finalAmount: (product.price - (product.price * (product.discount || 0) / 100)) * quantity,
                address: latestAddress || {}, // ✅ If user chooses new address, leave empty
            };


            console.log(payload)
            const res = await userOrderService.createOrder(payload);
            console.log(res)
            if (res.success && res.data.savedOrder) {
                const orderId = res.data.savedOrder._id;
                // Redirect to checkout step2 where user can add/select address
                navigate(`/order/checkout`);
            } else {
                console.error("Failed to create order");
            }

        } catch (err) {
            console.error("Order now failed", err);
        }
    };




    return (
        <div className="w-full h-fit flex flex-col bg-gray-100 p-8 ">
            <div className="flex flex-col lg:flex-row lg:mx-auto gap-8 bg-white rounded shadow p-6">

                <div className="border border-gray-200 rounded p-4 bg-white">
                    <ProductImage image={product.image} images={product.images} className="border-blue-400" />
                </div>
                <div className="flex flex-col justify-start">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        {product?.name || 'No Name Available'}
                    </h1>
                    {/* Wishlist Icon */}
                    <div className="mb-2 flex items-center">
                        <button
                            type="button"
                            onClick={handleWishlist}
                            className="focus:outline-none"
                            title="Add to Wishlist"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isWishlisted ? "red" : "none"}
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke={isWishlisted ? "red" : "currentColor"}
                                className={`w-7 h-7 transition duration-300 ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                                    }`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 
             5.25 0 007.5 3.75 5.25 5.25 0 003 
             9c0 7.25 9 11.25 9 11.25s9-4 
             9-11.25a5.25 5.25 0 00-5.25-5.25z"
                                />
                            </svg>
                        </button>
                        <span className="ml-2 text-sm text-gray-600">Add to Wishlist</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            {/* Discounted Price */}
                            <span className="text-3xl font-bold text-green-700">
                                ₹{product.discount
                                    ? Math.round(product.price - (product.price * product.discount) / 100)
                                    : product.price}
                            </span>

                            {/* Original Price (strikethrough) if discount exists */}
                            {product.discount && (
                                <span className="text-lg text-gray-500 line-through">
                                    ₹{product.price}
                                </span>
                            )}

                            {/* Discount % text */}
                            {product.discount && (
                                <span className="text-base text-green-600 font-semibold">
                                    {product.discount}% off
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                        Inclusive of all taxes
                    </div>
                    <div className="mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Free Delivery
                        </span>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Address
                        </label>

                        {user && user.address && user.address.length > 0 ? (
                            <div className="relative">
                                {/* Selected address box */}
                                <div
                                    onClick={() => setShowAddresses(!showAddresses)}
                                    className="p-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                    {latestAddress
                                        ? `${latestAddress.name}, ${latestAddress.address}, ${latestAddress.city} - ${latestAddress.pinCode}`
                                        : "Select or enter an address"}
                                </div>

                                {/* Dropdown with addresses */}
                                {showAddresses && (
                                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto border rounded bg-white shadow-lg">
                                        {user.address
                                            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                                            .map((addr, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => { setLatestAddress(addr); setShowAddresses(false); }}
                                                    className={`p-2 border-b cursor-pointer ${latestAddress?._id === addr._id ? "bg-blue-50" : "hover:bg-gray-100"}`}
                                                >
                                                    {addr.name}, {addr.address}, {addr.city} - {addr.pinCode}
                                                </div>
                                            ))
                                        }

                                        {/* Enter new address / PIN option */}
                                        <div
                                            onClick={() => { setLatestAddress(null); setShowAddresses(false); }}
                                            className="p-2 cursor-pointer text-blue-600 hover:bg-gray-100"
                                        >
                                            Enter a new address / PIN
                                        </div>
                                    </div>
                                )}

                                {/* Input for new PIN (shows only when latestAddress is null) */}
                                {latestAddress === null && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Pincode"
                                            maxLength={6}
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            style={{ width: 120 }}
                                        />
                                        <button
                                            onClick={() => checkPincode()}
                                            type="button"
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            Check
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // No saved addresses → show PIN input
                            <div className="mt-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Pincode"
                                    maxLength={6}
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    style={{ width: 120 }}
                                />
                                <button
                                    onClick={() => checkPincode()}
                                    type="button"
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                >
                                    Check
                                </button>
                            </div>
                        )}

                        {/* Expected delivery */}
                        {expectedDelivery && (
                            <div className="mt-1 text-sm text-blue-600 font-medium">
                                📦 Expected Delivery by {expectedDelivery}
                            </div>
                        )}
                    </div>


                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-green-700 font-semibold text-sm">
                            7 Days Replacement Policy
                        </span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600 text-xs">
                            No questions asked return within 7 days of delivery.
                        </span>
                    </div>
                    {/* Size Options */}
                    {product.variants.size && product.variants.size.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Size
                            </label>
                            <div className="flex gap-2">
                                {product.variants.size.map((size, idx) => (
                                    <button
                                        key={size + idx}
                                        type="button"
                                        className={`px-3 py-1 border border-gray-300 rounded hover:border-blue-400 focus:outline-none text-sm font-medium bg-white ${selectedSize === size ? 'ring-2 ring-blue-400' : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Quantity Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-lg"
                                onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                                disabled={quantity <= 1}
                            >-</button>
                            <input
                                type="number"
                                min={1}
                                max={product.stock || 99}
                                value={quantity}
                                onChange={e => {
                                    const val = Math.max(1, Math.min(Number(e.target.value), product.stock || 99));
                                    setQuantity(val);
                                }}
                                className="w-14 text-center border border-gray-300 rounded py-1"
                            />
                            <button
                                type="button"
                                className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-lg"
                                onClick={() => setQuantity(q => Math.min(q + 1, product.stock || 99))}
                                disabled={quantity >= (product.stock || 99)}
                            >+</button>

                        </div>
                        <div className="mb-2">
                            <span
                                className={`text-sm font-medium ${totalStock === 0
                                    ? "text-red-600"
                                    : totalStock <= 10
                                        ? "text-orange-600"
                                        : "text-green-700"
                                    }`}
                            >
                                {stockStatus}
                            </span>
                        </div>

                    </div>
                    {/* Add to Cart & Buy Now Buttons */}
                    <div className="flex gap-4 mt-2">
                        <button
                            disabled={totalStock === 0}
                            onClick={() => {
                                if (totalStock === 0) return; // just extra safety
                                if (isCarted) {
                                    navigate('/cart');
                                } else {
                                    handleCart();
                                }
                            }}
                            type="button"
                            className={`flex-1 ${totalStock === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-yellow-400 hover:bg-yellow-500"
                                } text-gray-900 font-semibold py-2 rounded shadow transition`}
                        >
                            {totalStock === 0
                                ? "Out of Stock"
                                : isCarted
                                    ? "Go to Cart"
                                    : "Add to Cart"}
                        </button>

                        <button
                            type="button"
                            onClick={handleOrderNow}  // ✅ new handler
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded shadow transition"
                        >
                            Buy Now
                        </button>

                    </div>
                    {/* Product Details Table */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Product Details</h2>
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-[350px] w-full text-sm border border-gray-200 rounded overflow-hidden bg-gray-50">
                                <tbody>
                                    {product.productDetails && Object.entries(product.productDetails).map(([key, value]) => (
                                        <tr key={key} className=" last:border-b-0">
                                            <td className="px-4 py-2 font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</td>
                                            <td className="px-4 py-2 text-gray-600">{value}</td>
                                        </tr>
                                    ))}
                                    {!product.productDetails && (
                                        <tr>
                                            <td className="px-4 py-2 text-gray-500" colSpan={2}>No additional details available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    {/* Product Reviews */}
                    {/* product reviews comments */}
                </div>
                <div>
                    {/* similar products */}
                </div>
                <div>
                    {/* recently viewed products */}
                </div>
            </div>
        </div >
    );
}

export default ProductDetail;
