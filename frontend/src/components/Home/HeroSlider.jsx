import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { banner1, banner2 } from "../../assets/index";


const slides = [
    {
        title: "Fashion that speaks volumes.",
        subtitle: "Discover the latest trends and timeless classics that define your unique style.",
        button: "Shop Now",
        image: banner1,
    },
    {
        title: "Winter Collection 2025",
        subtitle: "Stay warm and stylish with our premium winter collection.",
        button: "Explore Collection",
        image: banner2,
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    const slideVariants = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
    };

    const headingVariants = {
        initial: { opacity: 0, y: 20, rotate: -2 },
        animate: { opacity: 1, y: 0, rotate: [0, 2, -2, 0] },
        transition: { duration: 1, ease: "easeOut" },
    };

    const subtitleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: [10, -5, 0] },
        transition: { duration: 1.2, ease: "easeOut" },
    };

    const buttonVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
    };

    return (
        <section className="relative w-full h-[400px] sm:h-[500px] md:h-[500px] lg:h-[500px] xl:h-[500px] overflow-hidden ">
            <AnimatePresence>
                <motion.div
                    key={current}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image */}
                    <div
                        className="w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Text Content */}
                    <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-8 lg:px-16">
                        <motion.div className="text-left text-white max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
                            <motion.h1
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-6 leading-tight"
                                variants={headingVariants}
                                initial="initial"
                                animate="animate"
                            >
                                {slides[current].title}
                            </motion.h1>

                            <motion.p
                                className="text-sm sm:text-lg md:text-xl mb-4 sm:mb-6 md:mb-8 opacity-90"
                                variants={subtitleVariants}
                                initial="initial"
                                animate="animate"
                            >
                                {slides[current].subtitle}
                            </motion.p>

                            <motion.button
                                className="bg-white text-black px-6 sm:px-8 py-2 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base md:text-lg"
                                variants={buttonVariants}
                                initial="initial"
                                animate="animate"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {slides[current].button}
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Left & Right Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white text-xl sm:text-2xl transition"
            >
                &#10094;
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white text-xl sm:text-2xl transition"
            >
                &#10095;
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${i === current ? "bg-white" : "bg-white bg-opacity-50"
                            }`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </section>
    );
}
