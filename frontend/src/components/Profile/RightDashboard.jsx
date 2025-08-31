import React from 'react';
import Input from '../Input';
import { BsThreeDotsVertical } from "react-icons/bs";
import Wishlist from './Wishlist';
import Addresses from './Addresses';
import ProfileInfo from './ProfileInfo';
import OrderDetailsPage from '../MyOrder/OrderDetailsPage';
import MyOrders from '../MyOrder/MyOrdersComponent';
// import { Outlet } from 'react-router-dom';
function RightDashboard() {
    // const addresses = [
    //     {
    //         id: 1,
    //         type: "HOME",
    //         name: "Nitish",
    //         phone: "8217018130",
    //         address:
    //             "near sgn pu college gulbarga, gulbarga, Kalaburagi, Karnataka - ",
    //         pincode: "585102",
    //     },
    //     {
    //         id: 2,
    //         type: "WORK",
    //         name: "We B",
    //         phone: "8217018130",
    //         address: "gulbarga 585105, glb, Kalaburagi, Karnataka - ",
    //         pincode: "585105",
    //     },
    // ];
    // return (
    //     <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
    //         <div className="max-w-3xl mx-auto">
    //             <h2 className="text-xl sm:text-2xl font-semibold mb-6">Manage Addresses</h2>

    //             <button className="flex items-center gap-2 text-blue-600 font-medium mb-6 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
    //                 <span className="text-xl">+</span>
    //                 ADD A NEW ADDRESS
    //             </button>

    //             <div className="space-y-4">
    //                 {addresses.map((addr) => (
    //                     <div
    //                         key={addr.id}
    //                         className="bg-white p-4 sm:p-5 border rounded shadow-sm flex justify-between items-start"
    //                     >
    //                         <div>
    //                             <div className="flex flex-wrap items-center gap-2 mb-1">
    //                                 <span className="bg-gray-200 text-xs font-semibold px-2 py-0.5 rounded">
    //                                     {addr.type}
    //                                 </span>
    //                                 <span className="font-semibold">{addr.name}</span>
    //                                 <span className="ml-2 text-sm font-medium">{addr.phone}</span>
    //                             </div>
    //                             <p className="text-sm sm:text-base">
    //                                 {addr.address}
    //                                 <span className="font-semibold">{addr.pincode}</span>
    //                             </p>
    //                         </div>

    //                         <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700 cursor-pointer mt-1" />
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <>
            <ProfileInfo />
            <Addresses />
            <Wishlist />
            <MyOrders />
        </>
    )
}

export default RightDashboard;