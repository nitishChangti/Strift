import React from "react";
import ProductCarousel from "./ProductCarousel";
import { bs1, bs2, bs3, bs4, bs5, bs6, bs7, bs8, bs9, bs10, bs11, bs12 } from "../../assets/index.js";

const bestSellingProducts = [
    { name: "T-SHIRT FULL", price: 45, image: bs1 },
    { name: "T-SHIRT", price: 38, image: bs2 },
    { name: "NIGHT DRESS", price: 52, image: bs3 },
    { name: "CARDIGAN", price: 89, image: bs4 },
    { name: "BLOUSE", price: 76, image: bs5 },
    { name: "HOODIE", price: 65, image: bs6 },
    { name: "JEANS", price: 72, image: bs7 },
    { name: "SWEATER", price: 58, image: bs8 },
    { name: "JACKET", price: 95, image: bs9 },
    { name: "SHORTS", price: 42, image: bs10 },
    { name: "DRESS", price: 68, image: bs11 },
    { name: "POLO SHIRT", price: 48, image: bs12 },
];

export default function BestSellingSection() {
    return (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl text-center  mb-8 sm:mb-12">
                    Best Selling
                </h1>

                {/* Carousel wrapper with responsive width */}
                <div className="w-full overflow-hidden">
                    <ProductCarousel products={bestSellingProducts} />
                </div>
            </div>
        </section>
    );
}
