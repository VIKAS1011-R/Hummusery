import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import MenuSection from "../components/MenuSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const RestaurantLanding: React.FC = () => {
  return (
    <div className="bg-gray-900">
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <Features />
        <MenuSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default RestaurantLanding;
