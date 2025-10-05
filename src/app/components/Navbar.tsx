"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChefHat } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const linkClass = (href: string) =>
    `text-white transition-colors duration-200 ${
      pathname === href ? "text-orange-500 font-semibold" : "hover:text-orange-500"
    }`;

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
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">Hummusery</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className={linkClass("/#home")}>Home</a>
            <a href="#menu" className={linkClass("/#menu")}>Menu</a>
            <a href="#contact" className={linkClass("/#contact")}>Contact Us</a>

            <div className="flex items-center space-x-3">
              <Link href="/login">
                <button
                  type="button"
                  className={`px-5 py-2 rounded-full bg-orange-500 text-white transform transition-all duration-200 hover:scale-105 ${
                    pathname === "/login" ? "ring-2 ring-orange-300" : ""
                  } hover:bg-transparent hover:text-orange-500`}
                >
                  Sign In
                </button>
              </Link>
            </div>
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
            <a href="#home" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg">
              Home
            </a>
            <a href="#menu" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg">
              Menu
            </a>
            <a href="#contact" onClick={closeMenu} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg">
              Contact Us
            </a>

            <Link href="/login">
              <a
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 mt-2 bg-orange-500 text-white rounded-lg transition-transform transform hover:scale-105 hover:text-orange-500"
              >
                Sign in
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
