import React, { useState } from "react";
import { useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from 'react-redux';
import userProfileService from "../../services/profile";
import userProductService from "../../services/userProduct";
import { useNavigate } from 'react-router-dom';

const wishlistItems = [
    {
        id: 1,
        name: "REXBURG Rechargeable LED Table Lamp",
        price: "₹226",
        oldPrice: "₹999",
        discount: "77% off",
        image: "https://rukminim2.flixcart.com/image/832/832/xif0q/table-lamp/x/5/k/rechargeable-led-table-night-with-3-stage-dimming-light-table-original-imahawq8dq7bqh5y.jpeg?q=70&crop=false", // Replace with real image
        availability: "Available",
    },
    {
        id: 2,
        name: "KAJARU Self Design Polo Neck T-Shirt",
        price: "₹259",
        oldPrice: "₹999",
        discount: "74% off",
        image: "https://via.placeholder.com/100",
        availability: "Available",
    },
    {
        id: 3,
        name: "KELONBRO Hooded Neck Maroon T-Shirt",
        price: "Price: Not Available",
        oldPrice: "",
        discount: "",
        image: "https://via.placeholder.com/100",
        availability: "Currently unavailable",
    },
];

export default function Wishlist() {
    const navigate = useNavigate();
    const [wishList, setWishList] = useState([]);

    const user = useSelector((state) => state.auth.userData)
    const wishlist = user?.wishlist || []
    // console.log(user, wishlist)
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await userProfileService.getUserProductWishlist()
                console.log(res.data)
                setWishList(res.data)
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchWishlist()
    }, [])

    const handleRemoveProductFromWishList = async (id) => {
        console.log("remove product from wishlist", id)

        try {
            const res = await userProductService.deleteFromWishlist(id)
            console.log(res.data.data.wishlist)
            setWishList((prevList) => prevList.filter((item) => item._id !== id))
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8 w-full">

            <div className="max-w-5xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(wishList) && wishList.length > 0 ? (
                        wishList.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                            >
                                <div className="flex items-start sm:items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium">{item.name}</h3>
                                        <div className="flex gap-2 text-sm mt-1">
                                            {item.oldPrice && (
                                                <span className="line-through text-gray-500">
                                                    {item.oldPrice}
                                                </span>
                                            )}
                                            {item.price && <span className="text-black">{item.price}</span>}
                                            {item.discount && (
                                                <span className="text-green-600">{item.discount}</span>
                                            )}
                                        </div>
                                        {item.availability === "Currently unavailable" ? (
                                            <span className="text-red-500 text-sm font-semibold block mt-1">
                                                {item.availability}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <button className="text-gray-500 hover:text-red-600 mt-4 sm:mt-0"
                                    onClick={() => handleRemoveProductFromWishList(item._id)}
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No wishlist items found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
