import React from 'react';
import LeftDashboard from './LeftDashboard';
import RightDashboard from './RightDashboard';
import Wishlist from './Wishlist';
import { Outlet } from 'react-router-dom';
function Profile() {
    return (
        <div className='w-full min-h-screen flex flex-col md:flex-row gap-6 md:gap-10 p-4 md:p-10 bg-[#F1F3F6]'>
            <LeftDashboard />
            {/* <RightDashboard /> */}
            <div className="flex-1">
                <Outlet />  {/* This is where ProfileInfo, Wishlist, etc. appear */}
            </div>
            {/* <Wishlist /> */}
        </div>
    );
}

export default Profile;