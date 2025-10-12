"use client";

import React, { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Leaf, Beef, Store } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function CartPage() {
  const { user } = useAuth();
  const { items, totalAmount, itemCount, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user || items.length === 0) return;

    try {
      setPlacingOrder(true);
      
      // Generate random 4-digit order number
      const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Prepare order data
      const orderData = {
        orderNumber: `ORD-${orderNumber}`,
        items: items.map(item => ({
          id: item.menuItemId,
          name: item.name,
          description: item.ingredients,
          isVeg: item.isVeg,
          quantity: item.quantity,
          price: item.price
        })),
        status: "pending" as const,
        customerName: user.name || user.email,
        customerEmail: user.email,
        totalAmount: totalAmount,
        createdAt: new Date().toISOString()
      };

      // Send order to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      
      if (result.success) {
        // Clear cart after successful order
        clearCart();
        
        // Show success message and redirect
        alert(`Order placed successfully! Your order number is: ${orderData.orderNumber}`);
        window.location.href = "/orders";
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Please Log In</h1>
            <p className="text-gray-400 mb-6">You need to be logged in to view your cart.</p>
            <Link
              href="/login"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/menu" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-4xl font-bold text-white">Your Cart</h1>
          </div>
          <p className="text-gray-300">
            {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">Add some delicious items from our menu!</p>
              <Link
                href="/menu"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                      {/* Item Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          {item.isVeg ? (
                            <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded border border-green-400">
                              <Leaf className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded border border-red-400">
                              <Beef className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2">{item.ingredients}</p>
                        <p className="text-orange-400 font-semibold mt-2">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateCartItem(item.menuItemId, item.quantity - 1)}
                          disabled={loading}
                          className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        
                        <span className="text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateCartItem(item.menuItemId, item.quantity + 1)}
                          disabled={loading}
                          className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300 transition-colors mt-2 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>✓ All taxes included in prices</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>✓ Dine-in restaurant service</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>✓ No additional charges</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-white font-bold text-xl">
                      <span>Total Amount</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      Dine-in service • Enjoy at our restaurant
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Store className="h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-400">
                    Your order will be prepared for dine-in service
                  </p>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="text-center">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}