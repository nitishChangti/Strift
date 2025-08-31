import React from "react";
import ProductCarousel from "./ProductCarousel";
import { w1, w2, w3, w4, w5, w6, w7, w8 } from "../../assets/index.js";

const winterProducts = [
    {
        name: "WINTER COAT",
        price: 125,
        image: w1
    },
    {
        name: "PUFFER JACKET",
        price: 98,
        image: w2
    },
    {
        name: "WOOL SWEATER",
        price: 156,
        image: w3
    },
    {
        name: "LEATHER JACKET",
        price: 134,
        image: w4
    },
    {
        name: "THERMAL WEAR",
        price: 87,
        image: w5
    },
    {
        name: "FUR COAT",
        price: 245,
        image: w6
    },
    {
        name: "SCARF",
        price: 35,
        image: w7
    },
    {
        name: "GLOVES",
        price: 28,
        image: w8
    }
];

export default function WinterSection() {
    return (
        <section className="py-16 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl text-center mb-5 ">
                    Winters
                </h1>
                <ProductCarousel products={winterProducts} />
            </div>
        </section>
    );
}
