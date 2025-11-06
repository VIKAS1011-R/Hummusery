"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Filter, Leaf, Beef, Search, Plus, Minus, ShoppingBag, Info } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import PlateSizeModal from "@/app/components/PlateSizeModal";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

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

export default function MenuPage() {
  const { user } = useAuth();
  const { items: cartItems, addToCart, updateCartItem, loading: cartLoading } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<'addToCart' | 'buyNow'>('addToCart');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu");
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await response.json();
      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(menuItems.map(item => item.category)))];

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || 
      (selectedType === "veg" && item.isVeg) || 
      (selectedType === "non-veg" && !item.isVeg);
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch && item.isAvailable;
  });

  // Group items by category
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Helper function to get cart item quantity for a specific plate size
  const getCartItemQuantity = (menuItemId: string, plateSize: 'half' | 'full'): number => {
    const cartItem = cartItems.find(item => item.menuItemId === menuItemId && item.plateSize === plateSize);
    return cartItem ? cartItem.quantity : 0;
  };

  // Helper function to get total cart quantity for an item (both half and full)
  const getTotalCartQuantity = (menuItemId: string): number => {
    return cartItems
      .filter(item => item.menuItemId === menuItemId)
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Handle opening modal for items with half plate option
  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (item.halfPlatePrice) {
      setSelectedItem(item);
      setModalAction('addToCart');
      setIsModalOpen(true);
    } else {
      // Direct add to cart for items without half plate option
      addToCart(item._id, 'full', 1);
    }
  };

  // Handle buy now functionality
  const handleBuyNow = (item: MenuItem) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    


    if (item.halfPlatePrice) {
      setSelectedItem(item);
      setModalAction('buyNow');
      setIsModalOpen(true);
    } else {
      // Direct buy now for items without half plate option
      window.location.href = `/payment?item=${item._id}&plateSize=full&quantity=1`;
    }
  };

  // Handle modal actions
  const handleModalAddToCart = async (itemId: string, plateSize: 'half' | 'full', quantity: number) => {
    await addToCart(itemId, plateSize, quantity);
  };

  const handleModalBuyNow = (itemId: string, plateSize: 'half' | 'full', quantity: number) => {
    window.location.href = `/payment?item=${itemId}&plateSize=${plateSize}&quantity=${quantity}`;
  };

  // Handle quantity update
  const handleQuantityChange = async (menuItemId: string, plateSize: 'half' | 'full', newQuantity: number) => {
    if (newQuantity <= 0) {
      await updateCartItem(menuItemId, plateSize, 0);
    } else {
      await updateCartItem(menuItemId, plateSize, newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <PageWrapper>
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <PageWrapper>
        {/* Hero Section */}
        <section className="pb-12 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
            Discover our authentic Middle Eastern cuisine crafted with the finest ingredients
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              ✓ All prices include taxes
            </span>
            <span className="flex items-center gap-1">
              ✓ Dine-in restaurant service
            </span>
            <span className="flex items-center gap-1">
              ✓ No hidden charges
            </span>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType("veg")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === "veg"
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Leaf className="h-4 w-4" />
                Veg
              </button>
              <button
                onClick={() => setSelectedType("non-veg")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === "non-veg"
                    ? "bg-red-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Beef className="h-4 w-4" />
                Non-Veg
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchQuery || selectedCategory !== "all" || selectedType !== "all"
                  ? "No menu items match your filters"
                  : "No menu items available"}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        {/* Item Header */}
                        <div className="p-6 pb-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-4">
                              {item.name}
                            </h3>
                            <div className="flex-shrink-0">
                              {item.isVeg ? (
                                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded border-2 border-green-400 shadow-sm">
                                  <Leaf className="h-4 w-4 text-white" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded border-2 border-red-400 shadow-sm">
                                  <Beef className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            {item.ingredients}
                          </p>
                        </div>

                        {/* Item Footer */}
                        <div className="px-6 pb-6">
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col gap-1">
                                {item.halfPlatePrice ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl font-bold text-orange-400">
                                        ₹{item.halfPlatePrice.toLocaleString('en-IN')}
                                      </span>
                                      <span className="text-sm text-gray-400">Half Plate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl font-bold text-orange-400">
                                        ₹{item.price.toLocaleString('en-IN')}
                                      </span>
                                      <span className="text-sm text-gray-400">Full Plate</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-2xl font-bold text-orange-400">
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
                              <div className="space-y-3">
                                {/* Show cart quantities if any exist */}
                                {getTotalCartQuantity(item._id) > 0 && (
                                  <div className="space-y-2">
                                    {item.halfPlatePrice && getCartItemQuantity(item._id, 'half') > 0 && (
                                      <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                                        <span className="text-sm text-gray-300">Half Plate</span>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleQuantityChange(item._id, 'half', getCartItemQuantity(item._id, 'half') - 1)}
                                            disabled={cartLoading}
                                            className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </button>
                                          <span className="text-white font-medium min-w-[2rem] text-center">
                                            {getCartItemQuantity(item._id, 'half')}
                                          </span>
                                          <button
                                            onClick={() => handleQuantityChange(item._id, 'half', getCartItemQuantity(item._id, 'half') + 1)}
                                            disabled={cartLoading}
                                            className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {getCartItemQuantity(item._id, 'full') > 0 && (
                                      <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                                        <span className="text-sm text-gray-300">Full Plate</span>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleQuantityChange(item._id, 'full', getCartItemQuantity(item._id, 'full') - 1)}
                                            disabled={cartLoading}
                                            className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                                          >
                                            <Minus className="h-3 w-3" />
                                          </button>
                                          <span className="text-white font-medium min-w-[2rem] text-center">
                                            {getCartItemQuantity(item._id, 'full')}
                                          </span>
                                          <button
                                            onClick={() => handleQuantityChange(item._id, 'full', getCartItemQuantity(item._id, 'full') + 1)}
                                            disabled={cartLoading}
                                            className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Add to Cart Button */}
                                <button 
                                  onClick={() => handleAddToCart(item)}
                                  disabled={cartLoading}
                                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                                >
                                  {cartLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Plus className="h-4 w-4" />
                                  )}
                                  Add to Cart
                                </button>
                                
                                {/* Buy Now Button */}
                                <button 
                                  onClick={() => handleBuyNow(item)}
                                  disabled={cartLoading}
                                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                                >
                                  <ShoppingBag className="h-4 w-4" />
                                  Buy Now
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => window.location.href = '/login'}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                              >
                                Login to Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

        <Footer />
      </PageWrapper>

      {/* Plate Size Modal */}
      {selectedItem && (
        <PlateSizeModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleModalAddToCart}
          onBuyNow={handleModalBuyNow}
          loading={cartLoading}
        />
      )}
    </div>
  );
}