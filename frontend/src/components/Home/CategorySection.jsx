import React from "react";
import LazyImage from "./LazyImage";
import { kidsLogo, hoodieLogo, jeanLogo, tshirtLogo } from "../../assets/index.js";

const categories = [
    {
        name: "T-SHIRT",
        image: tshirtLogo,
    },
    {
        name: "HOODIE",
        image: hoodieLogo,
    },
    {
        name: "JEAN",
        image: jeanLogo,
    },
    {
        name: "KIDS",
        image: kidsLogo,
    },
];

export default function CategorySection() {
    return (
        <section className="py-16 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        className="text-center transform transition-transform duration-500 hover:scale-105"
                    >
                        {/* Image with mirror/reflection effect */}
                        <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 relative shadow-lg">
                            <LazyImage
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-all duration-500 hover:rotate-y-180"
                            />
                            {/* Mirror reflection */}
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 via-transparent opacity-30 rounded-full pointer-events-none"></div>
                        </div>

                        {/* Text with animation */}
                        <h3 className="font-semibold text-gray-800 text-lg md:text-xl transition-all duration-500 hover:text-gray-900">
                            {cat.name}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
