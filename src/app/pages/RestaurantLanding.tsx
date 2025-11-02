"use client";

import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import MenuSection from "../components/MenuSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import DatabaseStatus from "../components/DatabaseStatus";

import { useScrollToSection } from "../hooks/useScrollToSection";

const RestaurantLanding: React.FC = () => {
  // Initialize scroll behavior for hash navigation
  useScrollToSection();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <Features />
        <MenuSection />
        <ContactSection />
        <Footer />
      </div>
      {/* Database Status Indicator */}
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <DatabaseStatus />
      </div>


      

    </div>
  );
};

export default RestaurantLanding;
