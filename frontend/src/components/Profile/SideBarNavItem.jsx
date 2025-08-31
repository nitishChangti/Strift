import React from 'react';
import { NavLink } from 'react-router-dom';
function SideBarNavItem({
    icon,
    label,
    className = '',
    arrowIcon = null,
    children,
    to
}) {
    return (
        <div className='border-b'>
            <div className={`flex items-center ${className}`}>
                <img src={icon} alt="" className='w-5 h-5' />
                {to ? (
                    <NavLink
                        to={to}
                        className={({ isActive }) =>
                            `ml-2 text-base font-medium ${isActive ? 'text-blue-600' : 'text-gray-800'}`
                        }
                    >
                        {label}
                    </NavLink>
                ) : (
                    <h2 className='ml-2 text-base font-medium'>{label}</h2>
                )}
                {arrowIcon && <img src={arrowIcon} alt="Arrow" className='w-4 h-4 ml-auto' />}
            </div>
            {Array.isArray(children) && (
                <div className="flex flex-col gap-2 pl-10 pb-3">
                    {children.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) =>
                                `text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600'} hover:text-blue-500`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SideBarNavItem;
