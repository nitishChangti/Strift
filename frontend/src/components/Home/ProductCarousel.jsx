import React, { useRef, useState, useEffect } from "react";

export default function ProductCarousel({ products }) {
    const containerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollDistance = 300; // Scroll 300px per click

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -scrollDistance, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: scrollDistance, behavior: "smooth" });
        }
    };

    return (
        <div className="relative ">
            {/* Left Arrow */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white z-10 hover:bg-white/50 transition"
            >
                &#10094;
            </button>

            {/* Right Arrow */}
            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white z-10 hover:bg-white/50 transition"
            >
                &#10095;
            </button>

            {/* Product Container */}
            <div
                ref={containerRef}
                className="flex space-x-6 overflow-x-hidden py-4 px-2"
            >
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-58 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        {/* Image Container */}
                        <div className="overflow-hidden rounded-t-lg transform transition-transform duration-300 hover:scale-105">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-64 object-cover"
                            />
                        </div>

                        {/* Product Text */}
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
