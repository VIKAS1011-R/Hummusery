"use client";

import React, { useEffect, useState } from "react";
import { Leaf, Beef, Loader2, Plus, Minus, ShoppingBag, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface MenuItem {
  _id: string;
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  halfPlatePrice?: number | null;
  category: string;
  isAvailable: boolean;
}

const MenuSection: React.FC = () => {
  const { user } = useAuth();
  const { items: cartItems, addToCart, updateCartItem, loading: cartLoading } = useCart();
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

  // Helper function to get cart item quantity (for full plate only in this simplified view)
  const getCartItemQuantity = (menuItemId: string): number => {
    const cartItem = cartItems.find(item => item.menuItemId === menuItemId && item.plateSize === 'full');
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle buy now functionality
  const handleBuyNow = async (menuItemId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    

    
    await addToCart(menuItemId, 'full', 1);
    window.location.href = '/cart';
  };

  // Handle quantity update
  const handleQuantityChange = async (menuItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await updateCartItem(menuItemId, 'full', 0);
    } else {
      await updateCartItem(menuItemId, 'full', newQuantity);
    }
  };

  return (
    <section id="menu" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">Our Signature Dishes</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">Handcrafted with love and the finest ingredients</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-12">
          <span>✓ All prices include taxes</span>
          <span>✓ Dine-in restaurant service</span>
        </div>
        
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
                <div key={item._id} className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-200 dark:border-gray-700">
                  <div className="relative text-6xl text-center py-8 bg-gradient-to-br from-orange-500/20 to-gray-200 dark:to-gray-800">
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
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {item.ingredients.split('\n')[0]}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          {item.halfPlatePrice ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-500">
                                  ₹{item.halfPlatePrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Half</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-500">
                                  ₹{item.price.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Full</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-orange-500">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Info className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">Incl. of all taxes</span>
                          </div>
                        </div>
                      </div>
                      
                      {user ? (
                        <div className="space-y-2">
                          {getCartItemQuantity(item._id) > 0 ? (
                            /* Quantity Controls */
                            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2">
                              <button
                                onClick={() => handleQuantityChange(item._id, getCartItemQuantity(item._id) - 1)}
                                disabled={cartLoading}
                                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              
                              <span className="text-white text-sm font-medium">
                                {getCartItemQuantity(item._id)} in cart
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item._id, getCartItemQuantity(item._id) + 1)}
                                disabled={cartLoading}
                                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            /* Add to Cart Button */
                            <button 
                              onClick={() => addToCart(item._id, 'full', 1)}
                              disabled={cartLoading}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Add to Cart
                            </button>
                          )}
                          
                          {/* Buy Now Button */}
                          <button 
                            onClick={() => handleBuyNow(item._id)}
                            disabled={cartLoading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            Buy Now
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => window.location.href = '/login'}
                          className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          Login to Order
                        </button>
                      )}
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
