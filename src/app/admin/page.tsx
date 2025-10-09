"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import OrderCard from "@/app/components/OrderCard";
import { Loader2, Filter } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  description: string;
  isVeg: boolean;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "completed";
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  createdAt: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");

  useEffect(() => {
    // Check if user is admin (you can modify this logic based on your auth system)
    if (!user) {
      router.push("/login");
      return;
    }

    // For now, we'll assume any logged-in user can access admin
    // In production, you'd check for admin role
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    }
  };

  // Filter orders based on selected status
  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Get count for each status
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(order => order.status === "pending").length,
    preparing: orders.filter(order => order.status === "preparing").length,
    ready: orders.filter(order => order.status === "ready").length,
    completed: orders.filter(order => order.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Total Orders: {orders.length} | 
              Pending: {statusCounts.pending} | 
              Preparing: {statusCounts.preparing} | 
              Ready: {statusCounts.ready} | 
              Completed: {statusCounts.completed}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Filter by Status:</span>
          </div>
          
          {/* Desktop Filter Buttons */}
          <div className="hidden md:flex flex-wrap gap-3">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All Orders ({statusCounts.all})
            </button>
            
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            
            <button
              onClick={() => setStatusFilter("preparing")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "preparing"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Preparing ({statusCounts.preparing})
            </button>
            
            <button
              onClick={() => setStatusFilter("ready")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "ready"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Ready ({statusCounts.ready})
            </button>
            
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Completed ({statusCounts.completed})
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          <div className="md:hidden">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order["status"] | "all")}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Orders ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="preparing">Preparing ({statusCounts.preparing})</option>
              <option value="ready">Ready ({statusCounts.ready})</option>
              <option value="completed">Completed ({statusCounts.completed})</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {statusFilter === "all" ? "All Orders" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Orders`} ({filteredOrders.length})
          </h2>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {statusFilter === "all" 
                  ? "No orders found" 
                  : `No ${statusFilter} orders found`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={updateOrderStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
