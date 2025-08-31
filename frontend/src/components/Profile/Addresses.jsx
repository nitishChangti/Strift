import React, { useState, useEffect } from 'react';
import Input from '../Input';
import { BsThreeDotsVertical } from "react-icons/bs";
import CreateAddressFormComponent from './CreateAddressFormComponent';
import userProfileService from '../../services/profile';
function Addresses() {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [error, setError] = useState('');
    const [addressOperation, setAddressOpertaion] = useState(false);
    const [editAddress, setEditAddress] = useState({});
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

    useEffect(() => {
        const fetchUserAddress = async () => {
            try {
                //fetching data from server
                const res = await userProfileService.fetchUserAddresses();
                console.log(res.data.userAddress);
                const ADDRESSES = res.data.userAddress
                setAddresses(ADDRESSES)

            } catch (error) {
                setError(error)
                console.log(' got error while fetching user addresses', error);
            }
        }
        fetchUserAddress()
    }, [])

    const handleAddressDelete = async (data) => {
        console.log(data)
        // setAddresses(addresses.filter((item) =>
        //     item._id !== addr._id
        // ));

        try {
            const res = await userProfileService.deleteUserAddress(data._id);
            console.log(res.data.removedAddress);
            if (res.data.removedAddress) {
                setAddresses(addresses.filter((item) =>
                    item._id !== data._id
                ));

            }

        } catch (error) {
            setError(error)
            console.log(' got error while deleting address', error);
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Manage Addresses</h2>
                {
                    showAddressForm && (
                        <CreateAddressFormComponent onCloseForm={() => setShowAddressForm(false)} editAddress={editAddress} />
                    )
                }
                {
                    !showAddressForm && (
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="flex items-center gap-2 text-blue-600 font-medium mb-6 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
                            <span className="text-xl">+</span>
                            ADD A NEW ADDRESS
                        </button>
                    )
                }

                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            className="bg-white p-4 sm:p-5 border rounded shadow-sm flex justify-between items-start"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="bg-gray-200 text-xs font-semibold px-2 py-0.5 rounded">
                                        {addr.addressType}
                                    </span>
                                    <span className="font-semibold">{addr.name}</span>
                                    <span className="ml-2 text-sm font-medium">{addr.phoneNumber}</span>
                                </div>
                                <p className="text-sm sm:text-base">
                                    {addr.address}
                                    <br />
                                    <span className="font-semibold">{addr.pinCode}</span>
                                </p>
                            </div>

                            <div className="relative group inline-block">
                                <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700 cursor-pointer mt-1" />

                                <div className="absolute hidden group-hover:flex items-start flex-col gap-2 right-0 top-0 bg-white p-2 shadow-xl/40 rounded-md z-10">
                                    <button onClick={() => {
                                        // Update Address
                                        setShowAddressForm(true);
                                        setEditAddress(addr)
                                    }} className='hover:text-blue-500'>Edit</button>
                                    <button onClick={() => {
                                        // Delete Address
                                        handleAddressDelete(addr)
                                    }} className='hover:text-blue-500'>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Addresses;