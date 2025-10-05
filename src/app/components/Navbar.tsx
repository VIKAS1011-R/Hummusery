import React, { useEffect, useState } from "react";
import { Menu, X, ChefHat } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 backdrop-blur-sm shadow-lg"
          : "bg-gray-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2 cursor-pointer">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">Hummusery</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white hover:text-orange-500 transition-colors duration-200">Home</a>
            <a href="#menu" className="text-white hover:text-orange-500 transition-colors duration-200">Menu</a>
            <a href="#contact" className="text-white hover:text-orange-500 transition-colors duration-200">Contact Us</a>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105">
              Login
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white z-50"
            aria-label="Toggle menu"
            type="button"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            <a href="#home" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg">Home</a>
            <a href="#menu" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg">Menu</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg">Contact Us</a>
            <button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full" type="button">Login</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
