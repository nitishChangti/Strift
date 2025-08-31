// ContactUs.jsx
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
            {/* Page Header */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-gray-800 mb-8"
            >
                Contact <span className="text-indigo-600">Us</span>
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
                {/* Contact Info */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Get in Touch
                    </h2>
                    <div className="flex items-center gap-4">
                        <MapPin className="text-indigo-600" size={28} />
                        <p className="text-gray-600">
                            123 Zenith Mall, Tech City, India
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="text-indigo-600" size={28} />
                        <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Mail className="text-indigo-600" size={28} />
                        <p className="text-gray-600">support@zenithmoves.com</p>
                    </div>

                    {/* Map Placeholder */}
                    <div className="mt-6">
                        <iframe
                            title="Google Map"
                            src="https://maps.google.com/maps?q=bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            className="w-full h-64 rounded-xl border-0"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-6"
                >
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Send Us a Message
                    </h2>
                    <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        rows="5"
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-400 outline-none"
                        required
                    ></textarea>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition"
                    >
                        Send Message
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
}
