"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import OrderCard from "@/app/components/OrderCard";
import { Loader2 } from "lucide-react";

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
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
