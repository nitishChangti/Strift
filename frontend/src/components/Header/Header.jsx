import React, { useState } from "react";
import Logo from "../Logo";
import { NavLink, Link } from "react-router-dom";
import { Logout, SearchBar } from "../index";
import { accountCircle, call, shoppingCart } from "../../assets/index.js";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react"; // icons for menu toggle
import { motion, AnimatePresence } from "framer-motion"; // for animations

function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        {
            name: "Profile",
            icon: accountCircle,
            path: "/profile",
            active: authStatus,
        },
        {
            name: "Login",
            path: "/login",
            icon: accountCircle,
            active: !authStatus,
        },
        {
            name: "Cart",
            path: "/cart",
            icon: shoppingCart,
            active: true,
        },
        {
            name: "Contact Us",
            path: "/contact",
            icon: call,
            active: true,
        },
    ];

    return (
        <header
            className="w-full sticky top-0 z-50 bg-white shadow-md"
            style={{ borderBottom: "2px solid rgba(159, 151, 151, 0.15)" }}
        >
            <nav className="flex items-center justify-between px-4 lg:px-8 py-3">
                {/* Logo */}
                <Link to="/">
                    <Logo />
                </Link>

                {/* Desktop SearchBar */}
                <div className="hidden md:flex flex-1 justify-center">
                    <SearchBar />
                </div>

                {/* Desktop Nav */}
                <ul className="hidden md:flex gap-6 items-center">
                    {navItems.map((item) =>
                        item.active ? (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex gap-2 items-center px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 ${isActive ? "text-red-500 font-bold" : "text-gray-700"
                                        }`
                                    }
                                >
                                    {item.icon && (
                                        <img src={item.icon} alt="" className="w-5 h-5" />
                                    )}
                                    <span className="text-base font-medium">{item.name}</span>
                                </NavLink>
                            </li>
                        ) : null
                    )}

                    {authStatus && <Logout />}
                </ul>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-gray-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="md:hidden bg-white shadow-inner"
                    >
                        <div className="p-4 border-t border-gray-200">
                            {/* Search Bar */}
                            <div className="mb-4">
                                <SearchBar />
                            </div>

                            <ul className="flex flex-col gap-3">
                                {navItems.map((item) =>
                                    item.active ? (
                                        <motion.li
                                            key={item.name}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <NavLink
                                                to={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex gap-2 items-center px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 ${isActive ? "text-red-500 font-bold" : "text-gray-700"
                                                    }`
                                                }
                                            >
                                                {item.icon && (
                                                    <img src={item.icon} alt="" className="w-5 h-5" />
                                                )}
                                                <span className="text-base font-medium">
                                                    {item.name}
                                                </span>
                                            </NavLink>
                                        </motion.li>
                                    ) : null
                                )}

                                {authStatus && <Logout />}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
