"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, Package, Leaf, Beef, ShoppingCart, ArrowLeft } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/context/ToastContext";

interface BulkMenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  isVeg: boolean;
  servesPerUnit: number;
  pricePerUnit: number;
  unitType: string;
  minimumOrder: number;
  isAvailable: boolean;
  preparationTime: number;
  advanceNoticeRequired: number;
}

export default function PartyOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [items, setItems] = useState<BulkMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBulkMenuItems();
  }, []);

  const fetchBulkMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bulk-menu");
      
      if (!response.ok) {
        throw new Error("Failed to fetch bulk menu items");
      }
      
      const data = await response.json();
      setItems(data.items || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.items.map((item: BulkMenuItem) => item.category))
      );
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error("Error fetching bulk menu:", error);
      addToast("Failed to load party menu. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const handleOrderInquiry = (item: BulkMenuItem) => {
    if (!user) {
      addToast("Please log in to place a party order", "error");
      router.push("/login");
      return;
    }

    // For now, just show a toast. You can implement a proper order flow later
    addToast(
      `To order ${item.name}, please contact us at least ${item.advanceNoticeRequired} hours in advance.`,
      "info"
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Party Orders & Bulk Catering
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              Perfect for parties, events, and gatherings. All items are prepared fresh and
              require advance notice. Minimum order quantities apply.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-gray-700">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Bulk Servings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each item serves multiple people
              </p>
            </div>
            
            <div className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-gray-700">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Advance Notice
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Orders require advance booking
              </p>
            </div>
            
            <div className="bg-orange-50 dark:bg-gray-800 p-4 rounded-lg border border-orange-200 dark:border-gray-700">
              <Package className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Minimum Orders
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimum quantities apply per item
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === "all"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading party menu...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Items Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Party menu items will be available soon. Please check back later.
              </p>
            </div>
          )}

          {/* Menu Items Grid */}
          {!loading && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    {/* Item Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      {item.isVeg ? (
                        <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Beef className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {item.description}
                    </p>

                    {/* Serving Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-orange-600" />
                        <span>Serves {item.servesPerUnit} people per {item.unitType}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Package className="w-4 h-4 mr-2 text-orange-600" />
                        <span>Minimum: {item.minimumOrder} {item.unitType}(s)</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Clock className="w-4 h-4 mr-2 text-orange-600" />
                        <span>Order {item.advanceNoticeRequired}hrs in advance</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          ₹{item.pricePerUnit}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          / {item.unitType}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleOrderInquiry(item)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Inquire
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-lg border border-orange-200 dark:border-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need Help with Your Party Order?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our team is here to help you plan the perfect menu for your event. Contact us
              to discuss customization options, dietary requirements, and delivery arrangements.
            </p>
            <a
              href="#contact"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
