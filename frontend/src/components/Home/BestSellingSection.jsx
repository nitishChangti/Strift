import React, { useEffect, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import userProductService from "../../services/userProduct";

export default function BestSellingSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const res = await userProductService.fetchHomeProducts(12);
        console.log('res in home',res.data);
        setProducts(res.data.productData
 || []);
      } catch (err) {
        console.error("Failed to fetch best selling products", err);
      }
    };

    fetchBestSelling();
  }, []);

  if (products.length === 0) return null; // or loader

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 sm:mb-12">
          Best Selling
        </h1>

        <div className="w-full overflow-hidden">
          <ProductCarousel products={products} />
        </div>
      </div>
    </section>
  );
}
