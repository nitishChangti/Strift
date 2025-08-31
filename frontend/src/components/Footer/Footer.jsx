import React from "react";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-16 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo & Description */}
                    <div>
                        <h3 className="text-2xl font-['Pacifico'] mb-4">Style</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Fashion that speaks volumes. Discover your unique style with our curated collection.
                        </p>
                        <div className="flex space-x-4">
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors">
                                <i className="ri-facebook-fill"></i>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors">
                                <i className="ri-instagram-line"></i>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors">
                                <i className="ri-twitter-line"></i>
                            </button>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-semibold mb-4">Customer Care</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-gray-800 pt-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <h4 className="font-semibold mb-4 md:mb-0">Subscribe to our newsletter</h4>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-full focus:outline-none focus:border-white text-sm"
                            />
                            <button className="bg-white text-black px-6 py-2 rounded-r-full font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2025 Style. All rights reserved.</p>
                        <div className="flex items-center space-x-4 text-white text-2xl">
                            <i className="ri-visa-fill"></i>
                            <i className="ri-mastercard-fill"></i>
                            <i className="ri-paypal-fill"></i>
                            <i className="ri-apple-fill"></i>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
