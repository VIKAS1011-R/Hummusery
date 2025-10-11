"use client";

import React, { useEffect, useState } from "react";
import { Leaf, Beef, Loader2 } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  _id: string;
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  category: string;
  isAvailable: boolean;
}

const MenuSection: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedMenuItems();
  }, []);

  const fetchFeaturedMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu");
      if (response.ok) {
        const data = await response.json();
        // Show only first 4 items as featured
        setMenuItems((data.menuItems || []).slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
      // Fallback to empty array if API fails
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Get emoji based on category and veg status
  const getItemEmoji = (item: MenuItem) => {
    if (item.category === "Grab-and-Go Treats") return item.isVeg ? "🥪" : "🌭";
    if (item.category === "Shawarma Combos") return "�";
    if (item.category === "Indian Combos") return item.isVeg ? "🍛" : "🍖";
    if (item.category === "The Grand Feast") return "🍽️";
    if (item.category === "Rice And Noodles Bowls") return item.isVeg ? "🍜" : "🍲";
    if (item.category === "Veg Rolls") return "🌯";
    if (item.category === "Chicken Rolls") return "🌯";
    if (item.category === "Chinese Veg Rolls") return "🥟";
    if (item.category === "Chinese Chicken Rolls") return "🥟";
    return item.isVeg ? "🌱" : "🍖";
  };

  return (
    <section id="menu" className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">Our Signature Dishes</h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Handcrafted with love and the finest ingredients</p>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No menu items available at the moment</p>
            <Link 
              href="/menu" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition-colors"
            >
              View Full Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-gray-900 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <div className="relative text-6xl text-center py-8 bg-gradient-to-br from-orange-500/20 to-gray-800">
                    {getItemEmoji(item)}
                    {/* Veg/Non-Veg Indicator */}
                    <div className="absolute top-4 right-4">
                      {item.isVeg ? (
                        <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded border-2 border-green-400 shadow-sm">
                          <Leaf className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded border-2 border-red-400 shadow-sm">
                          <Beef className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {item.ingredients.split('\n')[0]}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-500">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm transition-colors" type="button">
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View Full Menu Button */}
            <div className="text-center mt-12">
              <Link 
                href="/menu" 
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
              >
                View Full Menu
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
