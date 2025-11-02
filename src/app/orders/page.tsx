"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, Package, Truck, Leaf, Beef, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import { useAuth } from "@/app/context/AuthContext";
import { useMongoRealTimeOrderHistory } from "@/app/hooks/useMongoRealTimeOrderHistory";
import RealTimeStatus from "@/app/components/RealTimeStatus";

interface OrderHistoryItem {
  orderId: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  orderDate: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    label: "Pending"
  },
  preparing: {
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    label: "Preparing"
  },
  ready: {
    icon: Truck,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    label: "Ready for Pickup"
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    label: "Completed"
  },
  cancelled: {
    icon: Clock,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    label: "Cancelled"
  }
};

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [initialOrderHistory, setInitialOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use MongoDB real-time order history hook
  const { orderHistory, isConnected, error: realtimeError, refreshConnection } = useMongoRealTimeOrderHistory(
    initialOrderHistory, 
    user?.id
  );

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to complete
    }
    
    if (user) {
      fetchOrderHistory();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders/history", {
        credentials: "include" // Ensure cookies are sent
      });
      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setInitialOrderHistory(data.orderHistory);
        } else {
          setError(data.error || "Failed to fetch order history");
        }
      } else {
        console.error("Order history fetch failed:", response.status, response.statusText);
        setError(`Failed to fetch order history (${response.status})`);
      }
    } catch (err) {
      console.error("Order history fetch error:", err);
      setError("Failed to fetch order history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <PageWrapper>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Checking authentication...</p>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <PageWrapper>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Please Log In</h1>
              <p className="text-gray-400 mb-6">You need to be logged in to view your order history.</p>
              <Link
                href="/login"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      
      <PageWrapper>
        {/* Header */}
        <section className="pb-8 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Order History</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {orderHistory.length > 0 
              ? `${orderHistory.length} order${orderHistory.length > 1 ? 's' : ''} found`
              : 'No orders found'
            }
          </p>
        </div>
      </section>

      {/* Order History Content */}
      <section className="py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Real-time Connection Status */}
          {user && (
            <div className="mb-6">
              <RealTimeStatus 
                isConnected={isConnected}
                error={realtimeError}
                onRetry={refreshConnection}
                className=""
              />
              {isConnected && (
                <p className="text-xs text-green-400 mt-1">Real-time updates active</p>
              )}
            </div>
          )}
          {loading ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-400">Loading your order history...</p>
            </div>
          ) : (error || realtimeError) ? (
            <div className="text-center py-16">
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
                {error || realtimeError}
                {realtimeError && (
                  <button
                    onClick={refreshConnection}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Retry Connection
                  </button>
                )}
              </div>
            </div>
          ) : orderHistory.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Orders Yet</h2>
              <p className="text-gray-400 mb-8">You haven&apos;t placed any orders yet. Start exploring our delicious menu!</p>
              <Link
                href="/menu"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orderHistory.map((order) => {
                const currentStatus = statusConfig[order.status];
                const StatusIcon = currentStatus.icon;

                return (
                  <div
                    key={order.orderId}
                    className={`bg-gray-800 rounded-lg border ${currentStatus.borderColor} p-4 sm:p-6`}
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-400">{formatDate(order.orderDate)}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${currentStatus.bgColor} self-start`}>
                        <StatusIcon className={`h-4 w-4 ${currentStatus.color}`} />
                        <span className={`text-sm font-medium ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-300">Items:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            {item.isVeg ? (
                              <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded border border-green-400 flex-shrink-0">
                                <Leaf className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded border border-red-400 flex-shrink-0">
                                <Beef className="h-3 w-3 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{item.name}</p>
                              <p className="text-sm text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
                            </div>
                          </div>
                          <div className="flex justify-between sm:block sm:text-right">
                            <p className="text-white font-medium">×{item.quantity}</p>
                            <p className="text-sm text-gray-400 sm:mt-1">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium">Total Amount:</span>
                        <span className="text-white font-bold text-lg">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

        <Footer />
      </PageWrapper>
    </div>
  );
}