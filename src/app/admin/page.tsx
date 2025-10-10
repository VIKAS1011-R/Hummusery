"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/context/ToastContext";
import OrderCard from "@/app/components/OrderCard";
import { Loader2, Filter, Plus, UtensilsCrossed, ClipboardList } from "lucide-react";
import AddMenuItemForm from "@/app/components/AddMenuItemForm";
import MenuItemCard from "@/app/components/MenuItemCard";

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

interface MenuItem {
  _id: string;
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      addToast("Access denied. Admin privileges required.", "error");
      router.push("/");
      return;
    }

    fetchOrders();
    if (activeTab === "menu") {
      fetchMenuItems();
    }
  }, [user, router, activeTab, addToast]);

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

  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await fetch("/api/menu?includeUnavailable=true");
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await response.json();
      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch menu items");
    } finally {
      setMenuLoading(false);
    }
  };

  const handleMenuItemAdded = () => {
    setShowAddMenuForm(false);
    fetchMenuItems();
    setError(null);
  };

  const handleTabChange = (tab: "orders" | "menu") => {
    setActiveTab(tab);
    setError(null);
    if (tab === "menu" && menuItems.length === 0) {
      fetchMenuItems();
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
              {activeTab === "orders" ? (
                <>
                  Total Orders: {orders.length} | 
                  Pending: {statusCounts.pending} | 
                  Preparing: {statusCounts.preparing} | 
                  Ready: {statusCounts.ready} | 
                  Completed: {statusCounts.completed}
                </>
              ) : (
                <>Menu Items: {menuItems.length} | Available: {menuItems.filter(item => item.isAvailable).length}</>
              )}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => handleTabChange("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Orders Management
          </button>
          <button
            onClick={() => handleTabChange("menu")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "menu"
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menu Management
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders Management Tab */}
        {activeTab === "orders" && (
          <>
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
          </>
        )}

        {/* Menu Management Tab */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            {/* Add Menu Item Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Menu Items ({menuItems.length})
              </h2>
              <button
                onClick={() => setShowAddMenuForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Menu Item
              </button>
            </div>

            {/* Menu Items Grid */}
            {menuLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-4">No menu items found</p>
                <button
                  onClick={() => setShowAddMenuForm(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Add Your First Menu Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    onEdit={(item) => {
                      // TODO: Implement edit functionality
                      console.log("Edit item:", item);
                    }}
                    onDelete={async (itemId) => {
                      // TODO: Implement delete functionality
                      if (confirm("Are you sure you want to delete this menu item?")) {
                        console.log("Delete item:", itemId);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Menu Item Form Modal */}
        {showAddMenuForm && (
          <AddMenuItemForm
            onSuccess={handleMenuItemAdded}
            onCancel={() => setShowAddMenuForm(false)}
          />
        )}
      </div>
    </div>
  );
}
