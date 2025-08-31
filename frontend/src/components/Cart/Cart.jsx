import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAddress, loadSelectedAddress } from '../../store/addressSlice'
import userCartService from "../../services/userCart";
import { addToCart, removeFromCart, setCart, updateQuantity, setSaveForLater, setCartLoading } from '../../store/cartSlice';
import EmptyCart from "./EmptyCart";
import { Link } from 'react-router-dom'
import {
    addToGuestCart,
    removeFromGuestCart,
    updateGuestCartQuantity,
    addToGuestSaveForLater,
    removeFromGuestSaveForLater,
    addToGuestWishlist,
    removeFromGuestWishlist,
    setGuestUserAddress,
    setGuestPendingOrder,
} from '../../store/guestUserSlice';
import userOrderService from "../../services/order";
import { addPlacedOrder } from '../../store/orderSlice';
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.userData)
    // const isCartLoading = useSelector(state => state.cart.isLoading) || true;
    // console.log(isCartLoading)

    const allCartItem = user
        ? useSelector(state => state.cart.items)
        : useSelector(state => state.guestUser.cart);

    const savedItems = user
        ? useSelector(state => state.cart.savedForLater)
        : useSelector(state => state.guestUser.saveForLater);
    // console.log(allCartItem)
    const selectedAddress = user
        ? useSelector(state => state.address.selectedAddress)
        : useSelector(state => state.guestUser.address);
    console.log(selectedAddress, JSON.stringify(selectedAddress))

    useEffect(() => {
        if (selectedAddress && typeof selectedAddress === "object") {
            // console.log("Selected Address:", JSON.stringify(selectedAddress, null, 2));
            dispatch(setSelectedAddress(selectedAddress))
        } else {
            console.log("Selected Address:", selectedAddress);
        }
    }, [selectedAddress]);
    const [guestAddress, setGuestAddress] = useState({});
    const [guestAddrStatus, setGuestAddrStatus] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);


    const handleRemove = (id) => {
        const item = allCartItem.find(item => item.productId === id);
        if (!item) return;
        if (user) {
            handleRemoveCart(id)
            dispatch(removeFromCart(id));
        } else {
            dispatch(removeFromGuestCart(id)); // ✅ use your guestUserSlice action
        }
    };

    const handleRemoveCart = async (id) => {
        if (user) {
            try {
                console.log(id)
                const res = await userCartService.deleteFromCart(id)
                console.log(res.data)
                if (res.status === 200) {
                    dispatch(setCart(res.data));
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            dispatch(removeFromGuestCart(id)); // ✅ new guestUserSlice action
        }
    }

    const handleUpdateCart = async (cartItem) => {
        if (user) {

            try {
                const res = await userCartService.updateCart(cartItem)
                console.log(res.cart)
                dispatch(setCart(res.cart));
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            dispatch(updateGuestCartQuantity({
                id: cartItem.productId,
                quantity: cartItem.quantity
            }));
        }
    }


    const handleUpdateQuantity = (id, increment = true) => {
        const item = allCartItem.find(i => i.productId === id);
        if (!item) return;
        const newQuantity = increment ? item.quantity + 1 : Math.max(item.quantity - 1, 1);

        const cartItem = { ...item, quantity: newQuantity }
        if (user) {
            handleUpdateCart(cartItem);
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        } else {
            dispatch(updateGuestCartQuantity({ id, quantity: newQuantity }));
        }
    };

    const totalPrice = allCartItem.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
    );

    const totalDiscount = allCartItem.reduce(
        (acc, item) =>
            acc + (Number(item.price) * Number(item.discount) / 100) * Number(item.quantity),
        0
    );

    const finalAmount = totalPrice - totalDiscount;


    useEffect(() => {
        if (!user) {
            const guestData = JSON.parse(localStorage.getItem("guestUser"));
            if (guestData && guestData.address) {
                setGuestAddrStatus(true);
                setGuestAddress(guestData.address);

                // Optional: also sync with Redux selectedAddress
                // dispatch(setSelectedAddress(guestData.address));
            }
            else {
                setGuestAddrStatus(false);
                setGuestAddress({});
            }
        }
        const storedAddress = localStorage.getItem("selectedAddress");
        // if (storedAddress) {
        //     dispatch(setSelectedAddress(storedAddress));  // <-- dispatch the right action
        // }

        const fetchCarts = async () => {
            if (user) {

                // dispatch(setCartLoading(true));   // ✅ start loading
                try {
                    const res = await userCartService.fetchUserCart()
                    console.log(res.data.cart)
                    if (res.data.cart) {
                        dispatch(setCart(res.data.cart));
                    }
                    else {
                        dispatch(setCart([]));
                    }
                } catch (error) {
                    console.error(error);
                    // dispatch(setCartLoading(false));  // ✅ done loading
                }
            }
        }
        fetchCarts()

        const fetchSaveForLater = async () => {
            if (user) {

                try {
                    const res = await userCartService.fetchSaveForLater()
                    console.log(res)
                    if (res === undefined) {
                        dispatch(setSaveForLater([]))
                    } else {
                        dispatch(setSaveForLater(res.data));
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchSaveForLater()

    }, [user])
    // if (selectedAddresses) {
    //     const selectedAddress = user.address.find(addr => addr._id === selectedAddresses);
    //     if (selectedAddress) {
    //         // You can use selectedAddress as needed, e.g., set as delivery address
    //         // Example: setGuestAddress(selectedAddress);
    //         // Or perform any other logic
    //         console.log("Selected address:", selectedAddress);
    //         setSelectedAddresses(selectedAddress)

    //         // dispatch(setSelectedAddress());
    //     }
    // }
    useEffect(() => {
        // Check if user has any saved addresses
        if (user && user.address && user.address.length > 0) {
            // If no selected address yet, auto-pick the latest
            if (!selectedAddress || Object.keys(selectedAddress).length === 0) {
                const sorted = [...user.address].sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                );
                const latestAddress = sorted[0];
                console.log(selectedAddress)
                dispatch(setSelectedAddress(latestAddress));
                console.log(selectedAddress, "latest address", latestAddress)
                // localStorage.setItem("selectedAddress", JSON.stringify(latestAddress));
            }
        }
    }, [user, dispatch])


    const getCityStateFromPincode = async (pincode) => {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            console.log(data)
            if (
                data &&
                data[0].Status === "Success" &&
                data[0].PostOffice &&
                data[0].PostOffice.length > 0
            ) {
                const { District, State } = data[0].PostOffice[0];
                return { city: District, state: State };
            } else {
                return { city: "", state: "" };
            }
        } catch (error) {
            console.error("Failed to fetch city/state from pincode:", error);
            return { city: "", state: "" };
        }
    };

    const handleGuestAddressSubmit = async () => {
        if (guestAddress?.pincode) {
            const { city, state } = await getCityStateFromPincode(guestAddress.pincode);
            console.log(city, state)
            const updatedAddress = {
                ...guestAddress,
                city,
                state,
                locationSource: "manual-pincode",
            };
            const address = updatedAddress;
            console.log(address)
            // ✅ Use Redux instead:
            dispatch(setGuestUserAddress(address));

            setGuestAddrStatus(true);
            setShowAddressForm(false);
            console.log(updatedAddress);
        }
    };

    // const handleGuestAddress = () => {
    //     setShowAddressForm(true)
    // }

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();
            return data.address; // Full address
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
            return "Unknown location";
        }
    };
    const handleAddressSelect = (address) => {
        console.log(address)
        const finalAddress = {
            addressType: address.addressType,
            alternatePhoneNumber: address.alternatePhoneNumber,
            city: address.city,
            landmark: address.landmark,
            locality: address.locality,
            name: address.name,
            phoneNumber: address.phoneNumber,
            pinCode: address.pinCode,
            state: address.state,
            address: address.address
        }
        // console.log(finalAddress)
        dispatch(setSelectedAddress(finalAddress)); // Set full address into Redux and localStorage

        setShowAddressForm(false);
    };

    const handleForSavedForLater = async (id) => {
        // Find the product in cart first
        const itemToSave = allCartItem.find(item => item.productId === id);
        if (!itemToSave) return;
        console.log(itemToSave.expectedDelivery)
        if (user) {
            // console.log(id)
            try {
                const res = await userCartService.addProductFromCartToSavedForLater(id)
                console.log(res.data)
                const newCart = res.data.cart || [];
                const newSaved = res.data.saveForLater || [];

                dispatch(setCart(newCart));
                dispatch(setSaveForLater(newSaved));

            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            // dispatch(addToGuestSaveForLater(id));
            // Guest user: save full item including expectedDelivery
            dispatch(addToGuestSaveForLater({
                ...itemToSave, // all product details
                expectedDelivery: itemToSave.expectedDelivery
            }));
            dispatch(removeFromGuestCart(id));
        }
    }

    const handleRemoveSaveForLater = async (id) => {
        if (user) {

            try {
                const res = await userCartService.removeProductFromSavedForLater(id)
                console.log(res.data)
                dispatch(setSaveForLater(res.data)); // ← store updated list from server
                dispatch(removeFromSaveForLater({ id })); // ← remove from Redux state
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            dispatch(removeFromGuestSaveForLater(id));
        }
    }

    const handleMoveToCartFromSaveForLater = async (id) => {
        console.log(id)
        if (user) {

            try {
                const res = await userCartService.addProductFromSavedForLaterToCart(id)
                console.log(res.data)
                // ✅ res.data is { saveForLater: [...], cart: [...] }
                dispatch(setSaveForLater(Array.isArray(res.data.saveForLater) ? res.data.saveForLater : []));
                dispatch(setCart(Array.isArray(res.data.cart) ? res.data.cart : []));
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            // ✅ Find the full product in the guest saveForLater
            const cartItem = savedItems.find(item => String(item.id) === String(id));
            if (cartItem) {
                // ✅ Add the whole product to guest cart
                dispatch(addToGuestCart(cartItem));
                // ✅ Remove from saveForLater
                dispatch(removeFromGuestSaveForLater(id));
            }
        }
    }

    const handlePlaceOrder = async () => {
        console.log('this is a handle PlaceOrder function')
        const orderData = {
            items: allCartItem.map(item => ({
                productId: item.productId,
                name: item.productName,
                price: item.price,
                discount: item.discount,
                image: item.image,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                expectedDelivery: item.expectedDelivery // ✅ include this
            })),
            address: selectedAddress,
            totalPrice,
            totalDiscount,
            finalAmount,
            paymentStatus: 'PENDING',
        };
        console.log(orderData)
        if (user) {
            try {
                const res = await userOrderService.createOrder(orderData)
                console.log(res.data.savedOrder)
                // Add the newly placed order to Redux store
                dispatch(addPlacedOrder(res.data.savedOrder)); // Assuming API returns order object in res.datas
                // maybe redirect to order success page here
                navigate('/order/checkout')
            } catch (error) {
                console.log(" Error in handlePlaceOrder", error);
            }
        }
        else {
            // ✅ 1️⃣ Save order draft in Redux + localStorage
            dispatch(setGuestPendingOrder(orderData));
            navigate('/order/checkout')
        }
    }

    const formatDeliveryDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };


    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold">Shopping Cart</h2>
                    {
                        !guestAddrStatus && user ? (
                            // Case 1: Logged-in user, no guest address
                            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="flex flex-col">
                                    <h2 className="text-sm text-gray-700">
                                        Deliver to: <span className="font-semibold">{`${user.firstName} ${user.lastName}, ${selectedAddress?.pinCode}`}
                                        </span>
                                        <span className="ml-3 px-2 py-0.5 text-xs bg-[#F0F2F5] rounded">HOME</span>
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedAddress?.address || "No address selected"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowAddressForm(true);
                                        setGuestAddrStatus(false);
                                    }}
                                    className="text-blue-600 text-sm font-semibold px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                                    Change
                                </button>
                            </div>
                        ) : !guestAddrStatus && !user ? (
                            // Case 2: Guest user, no address
                            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-2">
                                <div className="flex justify-between w-full items-center px-2">
                                    <h2 className="text-sm text-gray-700">
                                        From Saved Addresses
                                    </h2>
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="text-blue-600 text-sm font-semibold px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                                        Enter Delivery Address
                                    </button>
                                </div>
                            </div>
                        ) : guestAddrStatus && !user ? (
                            // Case 3: Guest user, has address from localStorage
                            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="flex flex-col">
                                    <h2 className="text-sm text-gray-700">
                                        Deliver to:
                                        <span className="font-semibold">
                                            {
                                                guestAddress.locationSource === "geolocation"
                                                    ? ` ${guestAddress.addressLine.city}, ${guestAddress.addressLine.state}, ${guestAddress.addressLine.postcode}`
                                                    : `${guestAddress.city}, ${guestAddress.state}, ${guestAddress.pincode}`
                                            }
                                        </span>
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowAddressForm(true);
                                        setGuestAddrStatus(false);
                                    }}
                                    className="text-blue-600 text-sm font-semibold px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    Change
                                </button>
                            </div>
                        ) : null
                    }
                    {
                        showAddressForm && (
                            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-2">
                                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                                    <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[400px] shadow-lg relative">
                                        <button
                                            onClick={() => setShowAddressForm(false)}
                                            className="absolute top-2 right-2 text-gray-600 text-xl font-bold"
                                        >
                                            ×
                                        </button>
                                        <h2 className="text-lg font-bold mb-3">Select Delivery Address</h2>

                                        {user ? (
                                            //user exists condition

                                            // Case 1: User exists, has address
                                            user.address && user.address.length > 0 ? (
                                                user.address.map((addr) => (
                                                    < div key={addr._id} className="bg-white mb-2 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                                        <input
                                                            type="radio"
                                                            name="address"
                                                            value={addr._id}
                                                            checked={selectedAddress?._id === addr._id}
                                                            onChange={() => handleAddressSelect(addr)}
                                                        />
                                                        <div className="flex flex-col mb-2">
                                                            <h2 className="text-sm text-gray-700">
                                                                Deliver to: <span className="font-semibold">{`${user.firstName} ${user.lastName}, ${addr.pinCode}`
                                                                }</span>
                                                                <span className="ml-3 px-2 py-0.5 text-xs bg-[#F0F2F5] rounded">{addr.addressType}</span>
                                                            </h2>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {addr.address}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-gray-600 mb-4">
                                                    No saved addresses found.
                                                </div>
                                            )
                                        ) : (
                                            <div className="text-sm text-gray-600 mb-4">
                                                🔒 <span className="font-medium">Log in to view saved addresses</span>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <label className="block text-sm mb-1">Use pincode to check delivery info</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter pincode"
                                                    value={guestAddress?.pincode || ""}
                                                    onChange={(e) =>
                                                        setGuestAddress({ ...guestAddress, pincode: e.target.value })
                                                    }
                                                    className="border p-2 flex-1 rounded"
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (guestAddress?.pincode) {
                                                            // 1️⃣ Validate & enrich the address (get city/state from pincode)
                                                            await handleGuestAddressSubmit();

                                                            // 2️⃣ The `handleGuestAddressSubmit` should already:
                                                            // - dispatch(setGuestAddressAction(updatedAddress))
                                                            // - dispatch(setSelectedAddress(updatedAddress))
                                                            // - update localStorage

                                                            // 3️⃣ Local UI state
                                                            setGuestAddrStatus(true);
                                                            setShowAddressForm(false);
                                                        } else {
                                                            alert("Please enter a valid pincode");
                                                        }
                                                    }}
                                                    className="bg-blue-600 text-white px-4 rounded"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            className="text-blue-600 text-sm underline"
                                            onClick={() => {
                                                navigator.geolocation.getCurrentPosition(
                                                    async (pos) => {
                                                        const { latitude, longitude } = pos.coords;

                                                        // Defensive check
                                                        if (!latitude || !longitude) {
                                                            alert("Unable to fetch location coordinates.");
                                                            return;
                                                        }

                                                        const coords = {
                                                            lat: latitude,
                                                            lng: longitude,
                                                        };

                                                        const addressText = await reverseGeocode(coords.lat, coords.lng);

                                                        const updatedAddress = {
                                                            location: coords,
                                                            addressLine: addressText,
                                                            locationSource: "geolocation",
                                                        };
                                                        const address = updatedAddress
                                                        if (user) {
                                                            // ✅ If user is logged in — update selected address slice
                                                            dispatch(setSelectedAddress(updatedAddress));

                                                            // Optional: Save to backend if needed
                                                            // await userAddressService.updateSelectedAddress(updatedAddress);
                                                            setShowAddressForm(false); // ✅ good to close the form for both cases
                                                            // localStorage.setItem("selectedAddress", JSON.stringify(updatedAddress));
                                                        } else {
                                                            // ✅ Guest user flow
                                                            setGuestAddress(updatedAddress);
                                                            setGuestAddrStatus(true);
                                                            setShowAddressForm(false);
                                                            dispatch(setGuestUserAddress(updatedAddress)); // ✅ update guest slice

                                                            // Optional: localStorage persist already handled by slice
                                                        }
                                                    }, (err) => {
                                                        alert("Location access denied.", err);
                                                    });
                                            }}
                                        >
                                            📍 Use my current location
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {

                        (allCartItem.length > 0) ?
                            allCartItem.map(item => (

                                <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
                                    <div className="flex  gap-4 ">
                                        <Link to={`/product/${item.productId}`} key={item.productId}>
                                            <img src={item.image} alt={item.productName} className="w-24 h-24 object-cover rounded" />
                                        </Link>


                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <div className="flex gap-5">

                                                    <Link to={`/product/${item.productId}`} key={item.productId}>
                                                        <h3 className="text-lg font-semibold">{item.productName}</h3>
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Delivery by <span className="font-semibold">{formatDeliveryDate(item.expectedDelivery)}</span>
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                                <div className="flex items-center gap-4">
                                                    {/* Original Price (strikethrough) */}
                                                    {item.discount > 0 && (
                                                        <span className="text-lg text-gray-500 line-through">
                                                            ₹{item.price}
                                                        </span>
                                                    )}

                                                    {/* Discounted Price */}
                                                    <span className="text-2xl font-bold text-black">
                                                        ₹{(Math.round(item.price - (item.price * item.discount) / 100)) * item.quantity}
                                                    </span>

                                                    {/* Discount Percentage */}
                                                    {item.discount > 0 && (
                                                        <span className="text-base text-green-600 font-semibold">
                                                            {item.discount}% off
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`text-sm ${item.availability === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{item.availability}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                                        <div className="flex items-center border px-2 rounded">
                                            <button onClick={() => handleUpdateQuantity(item.productId, false)} className="p-1"><IoMdArrowDropup /></button>
                                            <span className="px-3">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.productId, true)} className="p-1"><IoMdArrowDropdown /></button>
                                        </div>
                                        <div className="flex gap-4 mt-2">
                                            <button
                                                onClick={() => handleForSavedForLater(item.productId)}
                                                className="text-blue-600 text-sm">Save for Later</button>
                                            <button onClick={() => handleRemove(item.productId)} className="text-red-600 text-sm flex items-center gap-1">
                                                <FaTrashAlt /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            ))
                            :
                            <EmptyCart cartItems={allCartItem} />
                    }
                    <div className="flex flex-col">
                        <h1 className="bg-white p-4 rounded-lg">Saved For Later </h1>
                        <div>
                            {
                                savedItems.map(item => (
                                    <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
                                        <div className="flex  gap-4 ">
                                            <Link to={`/product/${item.productId}`} key={item.productId}>
                                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                                            </Link>
                                            <div className="flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center gap-10 justify-between">

                                                        <Link to={`/product/${item.productId}`} key={item.productId}>
                                                            <h3 className="text-lg font-semibold">{item.productName}</h3>
                                                        </Link>
                                                        <p className="text-sm text-gray-500">
                                                            Delivery by <span className="font-semibold">{formatDeliveryDate(item.expectedDelivery)}</span>
                                                        </p>

                                                    </div>
                                                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                                                    <div className="flex items-center gap-4">
                                                        {/* Original Price (strikethrough) */}
                                                        {item.discount > 0 && (
                                                            <span className="text-lg text-gray-500 line-through">
                                                                ₹{item.price}
                                                            </span>
                                                        )}

                                                        {/* Discounted Price */}
                                                        <span className="text-2xl font-bold text-black">
                                                            ₹{
                                                                Math.round(
                                                                    Number(item.price) - (Number(item.price) * Number(item.discount)) / 100
                                                                ) * Number(item.quantity)
                                                            }
                                                        </span>

                                                        {/* Discount Percentage */}
                                                        {item.discount > 0 && (
                                                            <span className="text-base text-green-600 font-semibold">
                                                                {item.discount}% off
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className={`text-sm ${item.availability === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{item.availability}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end mt-4 sm:mt-0">
                                            <div className="flex items-center border px-2 rounded">
                                                <button onClick={() => updateQuantity(item.id, false)} className="p-1"><IoMdArrowDropup /></button>
                                                <span className="px-3">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, true)} className="p-1"><IoMdArrowDropdown /></button>
                                            </div>
                                            <div className="flex gap-4 mt-2">
                                                <button onClick={() => handleMoveToCartFromSaveForLater(item.productId)} className="text-blue-600 text-sm">Move TO Cart</button>
                                                <button onClick={() => handleRemoveSaveForLater(item.productId)} className="text-red-600 text-sm flex items-center gap-1">
                                                    <FaTrashAlt /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Right Price Summary */}
                <div className="bg-white p-4 rounded-lg shadow-sm h-fit">
                    <h3 className="text-lg font-bold mb-4">PRICE DETAILS</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Price ({allCartItem.length} items)</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₹{totalDiscount}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total Amount</span>
                            <span>₹{totalPrice - totalDiscount}</span>
                        </div>
                        <div className="text-green-700 text-sm font-medium mt-2">
                            You will save ₹{totalDiscount} on this order
                        </div>
                    </div>
                    <button
                        onClick={() => handlePlaceOrder()}
                        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded">
                        Place Order
                    </button>
                </div>
            </div>
        </div >
    );
}
