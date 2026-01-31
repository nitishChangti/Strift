import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import DeliveryAddress from './DeliveryAddress';
import OrderSummary from './OrderSummary';
import PaymentOptions from './PaymentOptions';
import { Input, PhoneInput, Button } from '../index.js';
import { useForm, Controller, set } from 'react-hook-form';
import authService from '../../services/auth.js';
import { login, register as registerUser } from '../../store/authSlice.js'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddress } from '../../store/addressSlice.js';
import { add_icon } from '../../assets/index.js';
import { Link } from 'react-router-dom';
import CreateAddressFormComponent from '../Profile/CreateAddressFormComponent.jsx'
import { FaTrashAlt } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import userOrderService from '../../services/order.js';
import { setOrders, addPlacedOrder, updateOrderItemQuantity } from '../../store/orderSlice.js';

export default function CheckoutPage() {
    const [selectedAddressId, setSelectedAddressId] = useState({});

    const user = useSelector((state) => state.auth.userData);
    console.log(user)
    let address = useSelector((state) => state.address.selectedAddress);
    const ORDERS = useSelector((state) => state.order.orders);
    const [orders, setOrdersState] = useState(ORDERS);
    console.log(orders)
    const dispatch = useDispatch();

    // To access all items from the orders array:
    // This will flatten all items from all orders into a single array
    const allOrderItems = orders && Array.isArray(orders)
        ? orders.flatMap(order => order.items || [])
        : [];
    // Example:
    console.log(allOrderItems);
    const [addresses, setAddresses] = useState({});
    const [step, setStep] = useState(1); // 1: login, 2: address, 3: summary, 4: payment
    const { register, handleSubmit, control, getValues } = useForm()
    const [UserExist, setUserExist] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [changeMobileNumber, setChangeMobileNumber] = useState(false);
    const [changeAddress, setChangeAddress] = useState(false);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [tempUser, setTempUser] = useState({});
    const [editAddress, setEditAddress] = useState({});
    console.log(addresses)

    const [changeOrderSummary, setChangeOrderSummary] = useState(false);

    // if (step === 2) {
    //     setShowAddressForm(true);
    // }
    const [email, setEmail] = useState('');

    const handleContinue = async () => {
        let finalEmail = email.trim();

        // Fallback to profile email if input empty
        if (!finalEmail) {
            if (user?.email?.trim()) {
                finalEmail = user.email.trim();
                console.log('Using profile email:', finalEmail);
            } else {
                alert('Please enter your email ID');
                return;
            }
        }

        // If email is different, you decide:
        if (user?.email?.trim() && finalEmail !== user.email.trim()) {
            // 1️⃣ Use for this order: always do
            console.log('Using updated email for this order:', finalEmail);

            // 2️⃣ Optionally: Update user profile too
            // await axios.post('/api/user/update-email', { email: finalEmail });
        }

        // Proceed with finalEmail for this checkout
        console.log('Proceeding with email:', finalEmail);
        setStep(4)
    };



    const handleUpdateQuantity = (orderId, itemId, increment = true) => {
        console.log('this is handleUpdateQuantity', orderId, itemId, increment);
        const order = orders.find(order => order._id === orderId);
        if (!order) return;
        console.log('order is found', order);
        const item = order.items.find(item => item.productId === itemId);
        if (!item) return;
        console.log('item is found', item);
        const newQuantity = increment ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
        console.log('new quantity is', newQuantity);
        // Create a new copy of the order with updated item
        const updatedItems = order.items.map(it =>
            it.productId === itemId ? { ...it, quantity: newQuantity } : it
        );
        console.log('updated items are', updatedItems);
        const updatedOrder = { ...order, items: updatedItems };
        console.log('updated order is', updatedOrder);
        // Replace this order in the orders array
        const updatedOrders = orders.map(o =>
            o._id === orderId ? updatedOrder : o
        );
        console.log('updated orders are', updatedOrders);
        setOrdersState(updatedOrders);

        // Dispatch the full replacement
        dispatch(setOrders(updatedOrders));

        console.log(`Order ${orderId} updated in Redux with new quantity for item ${itemId}`);
        // if (user) {
        //     // handleUpdateCart(cartItem);
        //     dispatch(updateQuantity({ id, quantity: newQuantity }));
        // } else {
        //     dispatch(updateGuestCartQuantity({ id, quantity: newQuantity }));
        // }
    };

    const handleRemove = (orderId, id) => {
        const order = orders.find(order => order._id === orderId);
        if (!order) return;
        console.log('order is found', order);
        const updatedItems = order.items.filter(item =>
            item.productId !== id
        );
        console.log('updated items are', updatedItems);
        // Create a new copy of the order with updated items
        const updatedOrder = { ...order, items: updatedItems };
        console.log('updated order is', updatedOrder);
        // Replace this order in the orders array
        const updatedOrders = orders.map(o =>
            o._id === orderId ? updatedOrder : o
        );
        console.log('updated orders are', updatedOrders);
        setOrdersState(updatedOrders);
        // Dispatch the full replacement
        dispatch(setOrders(updatedOrders));
        console.log(`Order ${orderId} updated in Redux with removed item ${id}`);
    };

    const item = {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "image": "https://example.com/image.jpg",
        "address": {
            "name": "John Doe",
            "address": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "pinCode": "12345"
        },
        "productId": "12345",

    }

    useEffect(() => {
        if (user) {
            setStep(2);
        }
        else {
            setStep(1);
        }
    }, [user])

    useEffect(() => {
        // console.log(user.address[0])
        if (user && address) {
            setAddresses(address);
        }

    }, [user, address, addresses])


    // useEffect(() => {
    //     //fetch user pending and order placed orders data 
    //     const fetchUserPendingOrders = async () => {
    //         if (user) {
    //             try {
    //                 const response = await userOrderService.fetchPendingOrders();
    //                 console.log("Fetched pending orders:", response.data);
    //                 // Handle the fetched orders as needed
    //                 setOrders(response.data);

    //             } catch (error) {
    //                 console.error("Error fetching user data:", error);
    //             }
    //         }
    //     }
    //     fetchUserPendingOrders();
    // }, [])

    const handleForm = async (data) => {
        console.log(data);
        if (step === 1) {
            if (!otpSent) {
                const res = await authService.checkUser(data.phone);
                // console.log(res.data.exists)
                // login
                const accountExists = res.data.exists;
                if (accountExists) {
                    console.log('this is login otp request')
                    const api = `account/login?ret=/`
                    const phone = `+${data.phone}`
                    const response = await authService.phoneSend({ phone, api });
                    console.log(response)
                    setOtpSent(true);
                    setTempUser(data)
                    setUserExist(res.data.exists)
                }
                else {
                    // signup
                    console.log('this is signup otp request')
                    const phone = `+${data.phone}`
                    const api = `account/register?signup=true`
                    const response = await authService.phoneSend({ phone, api });
                    console.log(response)
                    setOtpSent(true);
                    setTempUser(data);
                    // setUserExist(false);

                }
            }

        }

    }
    const handleOtpVerification = async (data) => {
        // const phone = `+${data.phone}`
        const phone = data.phone
        const otp = data.otp
        console.log(data)
        if (otpSent && UserExist) {
            // if user exists, verify otp and login
            console.log('user exists, verifying otp')
            const api = `account/login?ret=/`
            const res = await authService.verifyOtp({ phone, otp, api });
            console.log(res)
            if (res.data.user) {
                dispatch(login(res.data.user));
                setStep(2)

            }
        }

        else if (otpSent && !UserExist) {
            // if user does not exist, verify otp and register
            console.log('user does not exist, verifying otp and registering')
            const api = `account/register?signup=true`
            const res = await authService.verifyOtp({ phone, otp, api });
            console.log(res)
            if (res.data.user) {
                dispatch(registerUser(res.data.user));
                setStep(2)

            }
        }
    }
    console.log(tempUser)

    // utils.js or in your component
    const formatDeliveryDate = (isoDate) => {
        if (!isoDate) return "N/A";
        const date = new Date(isoDate);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    return (
        //main
        <div className=' w-4xl px-30 bg-[#F1F3F6] h-screen py-5 flex flex-col gap-5'>
            {/* first step outer */}
            <div className='w-full p-3 border-2'>
                {/* first step inner */}
                <div className=' border-2 bg-white' >
                    {step === 1 ?
                        (
                            <div className='w-full h-10  text-xl font-bold  flex items-center gap-5 bg-[#2874F0] pl-10'>
                                <span className='border-2 px-2 text-[#2874F0] bg-white'>1</span>
                                <h1 className='text-white'>LOGIN OR SIGNUP</h1>
                            </div>
                        ) :
                        (
                            !changeMobileNumber ?
                                (
                                    <div className="w-full max-w-2xl mx-auto bg-white border rounded shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        {/* Left Block */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold border px-2 py-1 rounded text-blue-600 bg-gray-100">1</span>
                                                <span className="text-lg font-bold text-gray-800">LOGIN</span>
                                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414 5.293 10.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-700 text-base mt-2 sm:mt-0 sm:ml-4">+918217018130</span>
                                        </div>

                                        {/* Right Button */}
                                        <button
                                            className="mt-4 sm:mt-0 border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50"
                                            onClick={() => {
                                                setChangeMobileNumber(true);
                                                setStep(1); // Reset to step 1 to change mobile number
                                            }}
                                        >
                                            CHANGE
                                        </button>
                                    </div>
                                ) :
                                (
                                    <>
                                        <div className='w-full h-10  text-xl font-bold  flex items-center gap-5 bg-[#2874F0] pl-10'>
                                            <span className='border-2 px-2 text-[#2874F0] bg-white'>1</span>
                                            <h1 className='text-white'>LOGIN</h1>
                                        </div>
                                        <div className="w-full max-w-4xl mx-auto bg-white border rounded shadow-sm p-6 flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                                            {/* Left side: Phone and Logout */}
                                            <div className="flex-1 flex flex-col gap-2">
                                                <span className="text-gray-600">Phone <span className="font-bold text-black">{user?.phone}</span></span>
                                                <button
                                                    onClick={() => {
                                                        dispatch(logout()); // or your logout logic
                                                        setStep(1);
                                                        // redirect to home or login page
                                                    }}
                                                    className="text-blue-600 text-sm underline w-max"
                                                >
                                                    Logout &amp; Sign in to another account
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setStep(2); // For example, go to next checkout step
                                                        setChangeMobileNumber(false); // Reset change mobile number state
                                                    }}
                                                    className="mt-4 w-full md:w-60 bg-[#FB641B] text-white py-3 rounded text-center font-semibold"
                                                >
                                                    CONTINUE CHECKOUT
                                                </button>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    Please note that upon clicking "Logout" you will lose all items in cart and will be redirected to home page.
                                                </p>
                                            </div>

                                            {/* Right side: Benefits */}
                                            <div className="flex-1 flex flex-col gap-4">
                                                <h4 className="text-sm text-gray-500 font-medium">Advantages of our secure login</h4>
                                                <ul className="flex flex-col gap-3">
                                                    <li className="flex items-center gap-2 text-sm text-gray-800">
                                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2z" /></svg>
                                                        Easily Track Orders, Hassle free Returns
                                                    </li>
                                                    <li className="flex items-center gap-2 text-sm text-gray-800">
                                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22a1.5 1.5 0 001.5-1.5H10.5A1.5 1.5 0 0012 22zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
                                                        Get Relevant Alerts and Recommendation
                                                    </li>
                                                    <li className="flex items-center gap-2 text-sm text-gray-800">
                                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        Wishlist, Reviews, Ratings and more.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )
                        )}
                    {
                        step === 1 &&
                        <>
                            {
                                !otpSent ?

                                    <form onSubmit={handleSubmit(handleForm)} >
                                        <div className='w-full border-2 px-12 py-5 pt-10 border-yellow-600 flex flex-col gap-5'>
                                            <div>
                                                <label htmlFor="">Enter Mobile Number</label>
                                                <Controller
                                                    name="phone"
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{
                                                        required: true, pattern: {
                                                            value: /^\+?[1-9]\d{9,14}$/, // Allows + and minimum 10 digits
                                                            message: "Enter a valid international phone number"
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <PhoneInput
                                                            // {...register('phone', { required: true })}
                                                            name={field.name}
                                                            value={field.value}
                                                            onChange={(value) => field.onChange(value.replace(/[^\d+]/g, ''))}
                                                            placeholder='Enter your phone number'
                                                            className="w-80 h-10 border rounded px-3 py-2 pl-10 " />
                                                    )}
                                                />
                                            </div>
                                            <Button type='submit' className='w-80 bg-[#FB641B]' bgColor={'bg - [#FB641B]'}>CONTINUE</Button>
                                        </div>
                                    </form>
                                    :
                                    <form onSubmit={handleSubmit(handleOtpVerification)}  >

                                        <div className="w-full border-2 border-yellow-600 px-6 md:px-12 py-6 md:py-10 flex flex-col gap-6">

                                            {/* Mobile Number Input with Change */}
                                            <div className="relative w-3/5 flex items-center border rounded">
                                                <Input type='tel' value={`+ ${tempUser.phone}`} className=" px-2 h-10 w-full" readOnly={true} />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        console.log('Change clicked')
                                                        setOtpSent(false)
                                                        setTempUser({});
                                                    }}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm underline"
                                                >
                                                    Change ?
                                                </button>
                                            </div>



                                            {/* OTP Input with Change */}
                                            <div className="relative w-3/5">
                                                {/* <Controller
                                                    name="otp"
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{ required: true }}
                                                    render={({ field }) => ( */}
                                                <Input
                                                    {...register('otp', {
                                                        required: true,
                                                        pattern: {
                                                            value: /^\d{6}$/,
                                                            message: "OTP must be exactly 4 digits"
                                                        }
                                                    })}
                                                    // {...field}
                                                    maxLength={6}
                                                    type="tel"
                                                    placeholder="Enter OTP"
                                                    className="w-full border p-3 pr-24 rounded"
                                                />
                                                {/* )} */}
                                                {/* /> */}

                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm underline"
                                                >
                                                    Resend ?
                                                </button>
                                            </div>

                                            {/* Continue Button */}

                                            <Button
                                                type="submit"
                                                className="w-80 bg-[#FB641B] text-white px-6 py-3 rounded self-start sm:self-auto"
                                            >
                                                {
                                                    UserExist ?
                                                        'LOGIN' :
                                                        'SIGNUP'
                                                }
                                            </Button>
                                        </div>
                                    </form>
                            }
                        </>
                    }
                </div>
            </div>

            {/* second step outer */}
            <div className='w-full p-3 border-2'>
                <div>
                    {
                        step === 2 ? (
                            <>
                                <div className='w-full h-10  text-xl font-bold  flex items-center gap-5 bg-[#2874F0] pl-10'>
                                    <span className='border-2 px-2 text-[#2874F0] bg-white'>2</span>
                                    <h1 className='text-white'>DELIVERY ADDRESS</h1>
                                </div>
                            </>
                        ) : (
                            !(step === 1 && !step === 2) && (
                                <div className="w-full max-w-3xl mx-auto bg-white border rounded shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    {/* Left Block */}
                                    <div className="flex flex-col  flec-wrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold border px-2 py-0.5 rounded text-gray-700 bg-gray-100">2</span>
                                            <span className="text-base font-bold text-gray-800">DELIVERY ADDRESS</span>
                                            <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414 5.293 10.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>

                                        <p className="text-gray-800 text-sm mt-2 sm:mt-0 sm:ml-4">
                                            <span className="font-bold">{address?.name}</span> {address?.address}, {address?.city}, {address?.state} - <span className="font-bold">{address?.pinCode}</span>
                                        </p>
                                    </div>

                                    {/* Right Block: Change button */}
                                    <button
                                        className="mt-4 sm:mt-0 border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 text-sm font-semibold"
                                        onClick={() => setStep(2)}
                                    >
                                        CHANGE
                                    </button>
                                </div>
                            )
                        )
                    }
                    {
                        step === 2 && (
                            <>

                                {
                                    (user && user.address && user.address.length > 0) && (
                                        user.address.map((addr, index) => (
                                            <div key={index} className="w-full max-w-3xl mx-auto bg-white border-b shadow-sm p-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                                {/* Left side: Radio + Details */}
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <input type="radio" name="address" checked={selectedAddressId === addr._id} className="text-blue-600" onChange={() => setSelectedAddressId(addr._id)} />
                                                        <span className="font-semibold">Web Dev</span>
                                                        <span className="bg-gray-200 text-xs px-2 py-0.5 rounded">HOME</span>
                                                        <span className="font-bold">8217018130</span>
                                                    </div>

                                                    <p className="text-gray-800 text-sm">
                                                        Sb college vidya Nagar Gulbarga 585105, Sb college vidya Nagar Gulbarga 585105,
                                                        Kalaburgi, Karnataka - <span className="font-bold">585102</span>
                                                    </p>

                                                    {/* Show button only if this is the selected address */}
                                                    {selectedAddressId === addr._id && (
                                                        <button
                                                            onClick={() => {
                                                                console.log("Delivering to:", addr);
                                                                dispatch(setSelectedAddress(addr));
                                                                setSelectedAddressId(addr._id);     // optional: keep local state in sync
                                                                setStep(3);
                                                                setChangeOrderSummary(true); // Reset order summary change state
                                                                // move to payment step or summary step
                                                            }}
                                                            className="mt-2 bg-[#FB641B] text-white py-2.5 rounded text-center font-semibold"
                                                        >
                                                            DELIVER HERE
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Right side: Edit */}
                                                <div className="flex justify-end md:justify-start">
                                                    <button
                                                        onClick={() => {
                                                            setEditAddress(addr);         // set the selected address to edit
                                                            setShowAddressForm(true);     // open the form
                                                        }}
                                                        className="text-blue-600 text-sm font-medium hover:underline">
                                                        EDIT
                                                    </button>
                                                </div>
                                            </div>
                                        ))

                                    )

                                }
                                <div
                                    onClick={() => {
                                        {
                                            setShowAddressForm(true);
                                        }
                                    }}
                                    className='w-full h-10  text-sm font-semibold  flex items-center gap-5 bg-[#fff] pl-3 mt-5'>
                                    <img src={add_icon} alt="" />
                                    <h1 className=''>Add a new addess</h1>
                                </div>
                                {
                                    (step === 2 && showAddressForm) && (
                                        <CreateAddressFormComponent onCloseForm={() => setShowAddressForm(false)} editAddress={editAddress} />
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>

            {/* third step outer */}
            <div className='w-full p-3 border-2'>
                <div>
                    {
                        (step === 3) ? (
                            <>
                                <div className='w-full h-10  text-xl font-bold  flex items-center gap-5 bg-[#2874F0] pl-10'>
                                    <span className='border-2 px-2 text-[#2874F0] bg-white'>3</span>
                                    <h1 className='text-white'>ORDER SUMMARY</h1>
                                </div>
                            </>
                        ) : (
                            (!changeOrderSummary) && (

                            <div className="flex justify-between items-center border border-gray-300 p-4 rounded bg-white ">
                                <div className='flex flex-col gap-2 '>

                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-700">
                                            3
                                        </div>
                                        <h2 className="text-sm font-bold text-gray-800">
                                            ORDER SUMMARY <span className="text-blue-900">✔</span>
                                        </h2>
                                    </div>
                                    <span className="text-sm font-bold text-black ml-8">4 Items</span>
                                </div>

                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={() => {
                                            // Handle going back to edit cart
                                            console.log('Go back to change items');
                                            // setChangeOrderSummary(true);
                                            setStep(3); // Reset to step 3 to change order summary
                                        }}
                                        className="border border-gray-300 text-blue-600 px-3 py-1 text-xs font-bold rounded hover:bg-gray-50"
                                    >
                                        CHANGE
                                    </button>
                                </div>
                            </div>

                            )
                        )
                    }
                    {
                        (step === 3) && (
                            <>
                                {
                                    (orders && orders.length > 0) && (
                                        orders.map((ITEMS) => (
                                            ITEMS.items.map((item) => (


                                                < div key={item._id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between" >
                                                    <div className="flex  gap-4 ">
                                                        <Link to={`/product/${item.productId}`} key={item.productId}>
                                                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                                                        </Link>
                                                        <div className="flex flex-col justify-between">
                                                            <div>
                                                                <div className='flex items-center gap-2'>

                                                                    <Link to={`/product/${item.productId}`} key={item.productId}>
                                                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                                                    </Link>
                                                                    {/* Expected Delivery using helper function */}
                                                                    {item.expectedDelivery && (
                                                                        <p className="text-sm text-blue-600">
                                                                            Expected Delivery: {formatDeliveryDate(item.expectedDelivery)}
                                                                        </p>
                                                                    )}
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
                                                            <button onClick={() => handleUpdateQuantity(ITEMS._id, item.productId, false)} className="p-1"><IoMdArrowDropup /></button>
                                                            <span className="px-3">{item.quantity}</span>
                                                            <button onClick={() => handleUpdateQuantity(ITEMS._id, item.productId, true)} className="p-1"><IoMdArrowDropdown /></button>
                                                        </div>
                                                        <div className="flex gap-4 mt-2">

                                                            <button onClick={() => handleRemove(ITEMS._id, item.productId)} className="text-red-600 text-sm flex items-center gap-1">
                                                                <FaTrashAlt /> Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ))
                                    )
                                }

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    borderTop: '1px solid #ddd',
                                    padding: '12px 20px',
                                    maxWidth: '500px',
                                }}>
                                    <label style={{ whiteSpace: 'nowrap', fontSize: '14px', color: '#333' }}>
                                        Order confirmation email will be sent to
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email ID"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={{
                                            flexGrow: 1,
                                            padding: '8px 10px',
                                            fontSize: '14px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            outline: 'none',
                                        }}
                                    />
                                    <button
                                        onClick={handleContinue}
                                        style={{
                                            backgroundColor: '#f97316', // orange
                                            color: 'white',
                                            padding: '10px 20px',
                                            border: 'none',
                                            borderRadius: '2px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        CONTINUE
                                    </button>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>

            {/*  fourth step */}
            <div className='w-full p-3 border-2'>
                {step === 4 && (
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4">Payment</h2>
                        <PaymentOptions
                            orders={orders}
                            selectedAddress={address}
                            email={email}
                        />
                    </div>
                )}
            </div>
        </div >
    );
}

// function Section({ title, isOpen, children }) {
//     return (
//         <div className="border-b">
//             <div className="bg-gray-100 px-4 py-2 font-semibold">{title}</div>
//             {isOpen && <div className="p-4">{children}</div>}
//         </div>
//     );
// }
