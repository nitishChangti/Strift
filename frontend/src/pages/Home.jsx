import React from 'react';
import { Header } from '../components/index';
import HeroSlider from "../components/Home/HeroSlider";
import CategorySection from "../components/Home/CategorySection";
import BestSellingSection from "../components/Home/BestSellingSection";
import WinterSection from "../components/Home/WinterSection";
import StoreShowcase from "../components/Home/StoreShowcase";
import Footer from "../components/Footer/Footer";
function Home() {
    return (
        <div className="font-sans text-gray-800">

            <HeroSlider />
            <CategorySection />
            <BestSellingSection />
            <WinterSection />
            <StoreShowcase />
            <Footer />
        </div>
    );
}

export default Home;