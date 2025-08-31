import React, { useState, useEffect } from 'react';
import { myLocation } from '../../assets/index'
import { Button } from '../index'
import { useForm } from 'react-hook-form';
import userProfileService from '../../services/profile';
function CreateAddressFormComponent({ onCloseForm, editAddress = '' }) {
    console.log(editAddress)
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState('');
    const [addressPopUp, setAddressPopUp] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        pincode: "",
        locality: "",
        address: "",
        city: "",
        state: "",
        landmark: "",
        altPhone: "",
        addressType: "",
    });
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
        });
    }

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
        "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
        "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving address", formData);
        // Submit logic here
    };
    const [coords, setCoords] = useState({ lat: null, lon: null });
    const [address, setAddress] = useState('');


    const handleGetLocation = () => {

        if (!navigator.geolocation) {
            setError('Geolocation is not supported');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lon: longitude });

                // Reverse geocode using OpenStreetMap Nominatim
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    console.log(data.address)
                    if (data?.address) {
                        setAddress(data.address);
                        setAddressPopUp(true)
                    } else {
                        setError('Unable to fetch address');
                    }
                } catch (err) {
                    setError('Failed to fetch address');
                    console.error(err);
                }
            },
            (err) => {
                setError('Permission denied or unavailable');
                console.error(err);
            }
        );
    };
    const onSubmit = async (data) => {
        console.log(data)
        try {
            const payload = editAddress?._id
                ? { ...data, addressId: editAddress._id }  // editing
                : { ...data };                              // creating

            const res = await userProfileService.createUserAddress(payload)
            console.log(res.data.user)
            console.log(res.data.updatedUser)
            if (res.data.user) {
                setAddress(res.data.user)
                onCloseForm();
            } else {
                setAddress(res.data.updatedUser)
                onCloseForm()
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (editAddress) {
            console.log("editAddress.state:", editAddress.addressType);
            // console.log("Available states:", indianStates.includes(editAddress.state));

            // Fill form fields using setValue
            setValue('name', editAddress.name || '');
            setValue('phone', editAddress.phoneNumber || '');
            setValue('pincode', editAddress.pinCode || '');
            setValue('locality', editAddress.locality || '');
            setValue('address', editAddress.address || '');
            setValue('city', editAddress.city || '');
            setValue('state', toTitleCase(editAddress.state || ''));
            setValue('landmark', editAddress.landmark || '');
            setValue('altPhone', editAddress.altPhone || '');
            setValue('addressType', toTitleCase(editAddress.addressType || 'Home'));
        }
    }, [editAddress, setValue]);

    return (
        <div className="w-full bg-[#F9FAFB] border border-gray-200 p-4 md:p-6 lg:p-8 rounded-md max-w-4xl mx-auto">
            <h1 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                ADD A NEW ADDRESS
            </h1>

            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6 text-sm sm:text-base"
                onClick={handleGetLocation}
            >
                <img src={myLocation} alt="location" className="w-4 h-4 sm:w-5 sm:h-5" />
                Use my current location
            </button>
            {addressPopUp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 border-2 border-red-200 rounded shadow-md max-w-md w-full  flex flex-col justify-center items-center gap-2">
                        <h2 className="text-xl font-semibold ">Location Found</h2>
                        <h2 className="text-sm text-gray-700 ">{address.suburb}</h2>
                        <div className='flex gap-2 font-semibold'>
                            <p>{address.city},</p>
                            <p>{address.state} - {address.postcode}</p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setAddressPopUp(false)} className="text-gray-500 hover:text-gray-800">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Apply the address to the form if needed
                                    setAddressPopUp(false);
                                    setValue("city", address.city || address.town || address.village || '');
                                    setValue("state", address.state || '');
                                    setValue("pincode", address.postcode || '');
                                    setValue("locality", address.suburb || address.neighbourhood || '');
                                    setValue("address", ` ${address.suburb || ''}, ${address.city}, ${address.postcode}, ${address.state} `); // Or construct your own string
                                }}
                                className="bg-blue-600 text-white px-4 py-1 rounded"
                            >
                                CONFIRM ADDRESS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input {...register('name', { required: 'Name is required' })} type="text" name="name" placeholder="Name" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                    <input {...register('phone', { required: " Phone is required " })} type="tel" name="phone" placeholder="10-digit mobile number" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input {...register('pincode', { required: 'Pincode is required' })} type="number" name="pincode" placeholder="Pincode" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                    <input {...register('locality', { required: 'locality is required' })} type="text" name="locality" placeholder="Locality" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                </div>

                {/* Address textarea */}
                <textarea
                    {...register('address', { required: 'address is required' })}
                    name="address"
                    placeholder="Address (Area and Street)"
                    rows="3"
                    className="input-field w-full resize-none  border-2 border-gray-400 p-2 rounded-md"
                />

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input {...register('city', { required: 'city is required' })} type="text" name="city" placeholder="City/District/Town" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                    <select {...register('state', { required: 'state is required' })} name="state" className="input-field border-2 border-gray-400 p-2 rounded-md w-full">
                        <option value="">--Select State--</option>
                        {indianStates.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input {...register('landmark', { required: 'landmark is required' })} type="text" name="landmark" placeholder="Landmark (Optional)" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                    <input {...register('altPhone')} type="number" name="altPhone" placeholder="Alternate Phone (Optional)" className="input-field border-2 border-gray-400 p-2 rounded-md w-full" />
                </div>

                {/* Address Type */}
                <div className="flex gap-6 items-center text-sm sm:text-base">
                    <label className="flex items-center gap-2">
                        <input {...register('addressType')} type="radio" name="addressType" value="Home" className="accent-blue-500" />
                        Home
                    </label>
                    <label className="flex items-center gap-2">
                        <input  {...register('addressType')} type="radio" name="addressType" value="Work" className="accent-blue-500" />
                        Work
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6">
                    <Button type="submit">Save</Button>
                    <Button onClick={() => onCloseForm()} type="button" variant="outline">
                        Cancel
                    </Button>
                </div>
            </form >
        </div >
    );
}

export default CreateAddressFormComponent;