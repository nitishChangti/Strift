import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../services/auth';
import { logout } from '../../store/authSlice'
function Logout() {
    const dispatch = useDispatch();
    const logoutHandler = async () => {
        await authService.logout()
            .then(() =>
                dispatch(logout())
            )
            .catch((error) => {
                if (error.response?.status === 401) {
                    console.warn("Already logged out on server.");
                    dispatch(logout())
                } else {
                    console.error("Logout failed:", error);
                }
            }
            );
        console.log('logout successfully done')
    }
    return (
        <button
            className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
            onClick={logoutHandler}
        >Logout</button>
    );
}

export default Logout;