import React from "react";
import { motion } from "framer-motion";
import { store } from "../../assets/index"; // Adjust path if needed

export default function StoreShowcase() {
    return (
        <motion.section
            className="h-96 sm:h-[28rem] md:h-[32rem] lg:h-[36rem] mx-5 sm:mx-10 md:mx-20 mb-15 w-auto flex items-center justify-center relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
                backgroundImage: `url(${store})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0  bg-opacity-30 rounded-2xl"></div>

            {/* Animated Content */}
            <motion.div
                className="text-center text-black relative z-10 px-4 sm:px-6 md:px-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    Visit Our Store
                </motion.h2>

                <motion.p
                    className="text-lg sm:text-xl md:text-2xl mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Experience fashion in person
                </motion.p>

                <motion.button
                    className="bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl"
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: "#f3f4f6",
                        boxShadow: "0px 10px 20px rgba(255,255,255,0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    Find Location
                </motion.button>
            </motion.div>
        </motion.section>
    );
}
