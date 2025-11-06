"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRazorpay } from "@/app/hooks/useRazorpay";
import {
  ArrowLeft,
  Leaf,
  Beef,
  Store,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar"; 
import Footer from "@/app/components/Footer";
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

function PaymentPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");
  const plateSize = (searchParams.get("plateSize") as 'half' | 'full') || 'full';
  const initialQuantity = parseInt(searchParams.get("quantity") || "1");

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const {
    isLoaded: razorpayLoaded,
    createOrder,
    openCheckout,
    verifyPayment,
  } = useRazorpay();

  useEffect(() => {
    if (itemId) {
      fetchMenuItem();
    } else {
      setError("No item selected for payment");
      setLoading(false);
    }
  }, [itemId]);

  const fetchMenuItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/${itemId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch menu item");
      }
      const data = await response.json();
      setMenuItem(data.menuItem);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !menuItem) return;



    if (!razorpayLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    try {
      setPlacingOrder(true);

      // Generate random 4-digit order number
      const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();

      // Calculate price based on plate size
      const itemPrice = plateSize === 'half' && menuItem.halfPlatePrice 
        ? menuItem.halfPlatePrice 
        : menuItem.price;
      
      // Calculate total amount
      const totalAmount = itemPrice * quantity;

      // Prepare order data for single item
      const orderData = {
        orderNumber: `ORD-${orderNumber}`,
        items: [
          {
            id: menuItem._id,
            name: menuItem.name,
            description: menuItem.ingredients,
            isVeg: menuItem.isVeg,
            plateSize: plateSize,
            quantity: quantity,
            price: itemPrice,
          },
        ],
        status: "pending" as const,
        customerName: user.name || user.email,
        customerEmail: user.email,
        customerPhone: user.phone,
        totalAmount: totalAmount,
      };

      // Create Razorpay order
      const razorpayOrder = await createOrder(totalAmount, orderData);

      // Open Razorpay checkout
      openCheckout({
        key: razorpayOrder.key_id,
        amount: razorpayOrder.order.amount,
        currency: razorpayOrder.order.currency,
        name: "Hummusery",
        description: `Order #${orderData.orderNumber}`,
        order_id: razorpayOrder.order.id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment with retry mechanism
            let verificationResult;
            let retryCount = 0;
            const maxRetries = 2;

            while (retryCount <= maxRetries) {
              try {
                verificationResult = await verifyPayment(response, orderData);
                break; // Success, exit retry loop
              } catch (error) {
                retryCount++;
                console.error(
                  `Payment verification attempt ${retryCount} failed:`,
                  error
                );

                if (retryCount <= maxRetries) {
                  console.log(
                    `Retrying payment verification... (${retryCount}/${maxRetries})`
                  );
                  // Wait 2 seconds before retry
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                } else {
                  throw error; // All retries failed
                }
              }
            }

            if (verificationResult?.success) {
              // Show appropriate success message
              if (verificationResult.warning) {
                alert(
                  `Payment successful! Your order number is: ${orderData.orderNumber}\n\nNote: ${verificationResult.warning}`
                );
              } else {
                alert(
                  `Payment successful! Your order number is: ${orderData.orderNumber}`
                );
              }

              window.location.href = "/orders";
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(
              `Payment completed but there was an issue processing your order.\n\nYour payment ID: ${response.razorpay_payment_id}\nOrder Number: ${orderData.orderNumber}\n\nPlease contact support with these details.`
            );
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone,
        },
        theme: {
          color: "#f97316", // Orange color matching your theme
        },
        modal: {
          ondismiss: () => {
            setPlacingOrder(false);
          },
        },
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
      setPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please Log In
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be logged in to make a payment.
            </p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (error || !menuItem) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "Menu item not found"}
            </p>
            <Link
              href="/menu"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate price and total based on plate size
  const itemPrice = plateSize === 'half' && menuItem.halfPlatePrice 
    ? menuItem.halfPlatePrice 
    : menuItem.price;
  const totalAmount = itemPrice * quantity;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/menu"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Quick Payment</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Complete your order in one click</p>
        </div>
      </section>

      {/* Payment Content */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Item Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Order Details
              </h2>

              <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-medium">{menuItem.name}</h3>
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                      {plateSize === 'half' ? 'Half Plate' : 'Full Plate'}
                    </span>
                    {menuItem.isVeg ? (
                      <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded border border-green-400">
                        <Leaf className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded border border-red-400">
                        <Beef className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {menuItem.ingredients}
                  </p>
                  <p className="text-orange-400 font-semibold mt-2">
                    ₹{itemPrice.toLocaleString("en-IN")} each
                  </p>
                </div>

                {/* Quantity Controls and Total */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-white font-medium w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-white font-semibold text-lg">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Payment Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>
                    Item Total ({quantity} × ₹
                    {itemPrice.toLocaleString("en-IN")})
                  </span>
                  <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>✓ All taxes included in price</span>
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
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Dine-in service • Enjoy at our restaurant
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {placingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Store className="h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </button>
                <p className="text-center text-sm text-gray-400">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>

            {/* Back to Menu */}
            <div className="text-center">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <Navbar />
          <div className="pt-20 flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
