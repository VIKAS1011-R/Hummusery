"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChefHat, Settings, LogOut, Shield, ShoppingCart, ClipboardList, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCart } from "../context/CartContext";
import UserDropdown from "./UserDropdown";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { itemCount } = useCart();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const linkClass = (href: string) =>
    `text-white transition-colors duration-200 ${
      pathname === href ? "text-orange-500 font-semibold" : "hover:text-orange-500"
    }`;

  return (
    <nav
      ref={navRef}
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
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/menu" className={linkClass("/menu")}>
              Menu
            </Link>
            <Link href="/contact" className={linkClass("/contact")}>
              Contact Us
            </Link>
            {user && (
              <Link href="/orders" className={linkClass("/orders")}>
                Orders
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link href="/admin" className={linkClass("/admin")}>
                Admin
              </Link>
            )}

            <div className="flex items-center space-x-3">
              {user && (
                <Link href="/cart" className="relative">
                  <button className="p-2 text-white hover:text-orange-500 transition-colors">
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </button>
                </Link>
              )}
              
              {user ? (
                <UserDropdown />
              ) : (
                <Link href="/login" className="inline-block">
                  <button
                    onClick={closeMenu}
                    className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-transform transform hover:scale-105"
                  >
                    Sign in
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            {/* Menu Button - Always visible for quick access */}
            <Link href="/menu">
              <button 
                className="p-2 text-white hover:text-orange-500 transition-colors"
                aria-label="View Menu"
              >
                <UtensilsCrossed className="h-6 w-6" />
              </button>
            </Link>

            {user && (
              <Link href="/cart" className="relative">
                <button className="p-2 text-white hover:text-orange-500 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </button>
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white z-50"
              aria-label="Toggle menu"
              type="button"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={closeMenu}
              className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
            >
              Menu
            </Link>
            <Link
              href="/contact"
              onClick={closeMenu}
              className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg"
            >
              Contact Us
            </Link>

            {user ? (
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="px-4 py-2 text-orange-500 font-medium">{user.name}</div>
                <Link href="/orders" className="block">
                  <button
                    onClick={closeMenu}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <ClipboardList className="h-4 w-4 mr-3" />
                    Order History
                  </button>
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="block">
                    <button
                      onClick={closeMenu}
                      className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Admin Panel
                    </button>
                  </Link>
                )}
                <Link href="/settings" className="block">
                  <button
                    onClick={closeMenu}
                    className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                </Link>
                <button
                  onClick={async () => {
                    closeMenu();
                    addToast('You have been logged out successfully', 'info');
                    await logout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-400 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="block">
                <button
                  onClick={closeMenu}
                  className="w-full text-center px-4 py-2 mt-2 bg-orange-500 text-white rounded-lg transition-transform transform hover:scale-105"
                >
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
