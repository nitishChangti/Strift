import React from "react";
import ProductCarousel from "./ProductCarousel";
import { w1, w2, w3, w4, w5, w6, w7, w8 } from "../../assets/index.js";

const winterDummyProducts = [
  { name: "Winter Coat", price: 125, image: w1 },
  { name: "Puffer Jacket", price: 98, image: w2 },
  { name: "Wool Sweater", price: 156, image: w3 },
  { name: "Leather Jacket", price: 134, image: w4 },
  { name: "Thermal Wear", price: 87, image: w5 },
  { name: "Fur Coat", price: 245, image: w6 },
  { name: "Scarf", price: 35, image: w7 },
  { name: "Gloves", price: 28, image: w8 },
];

export default function WinterSection() {
  return (
    <section className="py-16 px-4 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl">Winters</h1>
          <p className="text-gray-500 mt-1">
            ❄️ Coming Soon
          </p>
        </div>

        {/* Dummy Carousel */}
        <ProductCarousel products={winterDummyProducts} />

        {/* Disclaimer */}
        <p className="text-center text-gray-400 text-sm mt-4">
          * Products shown are for preview purposes only
        </p>
      </div>
    </section>
  );
}
