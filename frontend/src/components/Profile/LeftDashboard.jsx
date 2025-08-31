import React from 'react';
import { profilePic, myOrders, arrowForward, accSetting, payments, myStuff, logOut } from '../../assets';
import SideBarNavItem from './SideBarNavItem.jsx';
import { Link } from 'react-router-dom';
import { Logout } from '../index';
function LeftDashboard() {
    const accSettingChild = [
        { label: 'Profile Information', to: '/profile' },
        { label: 'Manage Addresses', to: '/profile/address' },
        { label: 'PAN Card Information', to: '#' },
    ];
    const PaymentsChild = [
        { label: 'Gift Cards', to: '#' },
        { label: 'Saved UPI', to: '#' },
        { label: 'Saved Cards', to: '#' },
    ];

    const myStuffChild = [
        { label: 'My Coupons', to: '#' },
        { label: 'My Reviews & Ratings', to: '#' },
        { label: 'All Notifications', to: '#' },
        { label: 'My Wishlist', to: '/profile/wishlist' },
    ];

    return (
        <div className='w-full md:w-80 flex flex-col gap-5'>
            <div className='flex gap-4 p-3 bg-white items-center pl-5 shadow-sm rounded'>
                <img src={profilePic} alt="Profile" className='w-10 h-10 rounded-full' />
                <h1 className='text-lg font-semibold'>userName</h1>
            </div>
            <div className='bg-white shadow-sm rounded'>
                <SideBarNavItem
                    icon={myOrders}
                    label="MY ORDERS"
                    className="p-4 gap-5"
                    arrowIcon={arrowForward}
                    to="myOrders"  // relative path, no leading slash
                />

                <SideBarNavItem icon={accSetting} label="ACCOUNT SETTINGS" className="p-4 gap-5" arrowIcon={arrowForward} children={accSettingChild} />
                <SideBarNavItem icon={payments} label="PAYMENTS" className="p-4 gap-5" arrowIcon={arrowForward} children={PaymentsChild} />
                <SideBarNavItem icon={myStuff} label="MY STUFF" className="p-4 gap-5" arrowIcon={arrowForward} children={myStuffChild} />
                <SideBarNavItem icon={logOut} label="LogOut" className="p-4 gap-5 border-none" />
                {/* <Logout /> */}
            </div>
        </div>
    );
}

export default LeftDashboard;
