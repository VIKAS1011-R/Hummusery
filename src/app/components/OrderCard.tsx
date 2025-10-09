import React from "react";
import { Clock, CheckCircle, Package, Truck, Leaf, Beef } from "lucide-react";

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

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: Order["status"]) => void;
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
  }
};

export default function OrderCard({ order, onStatusUpdate }: OrderCardProps) {
  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleStatusChange = (newStatus: Order["status"]) => {
    onStatusUpdate(order.id, newStatus);
  };

  return (
    <div className={`bg-gray-800 rounded-lg border ${currentStatus.borderColor} p-6 space-y-4`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${currentStatus.bgColor}`}>
          <StatusIcon className={`h-4 w-4 ${currentStatus.color}`} />
          <span className={`text-sm font-medium ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-white font-medium">{order.customerName}</p>
        <p className="text-sm text-gray-400">{order.customerEmail}</p>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Items:</h4>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
            <div className="flex-shrink-0 mt-1">
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
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-white font-medium">×{item.quantity}</p>
                  <p className="text-sm text-gray-400">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Total:</span>
          <span className="text-white font-bold text-lg">₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Status Update */}
      <div className="border-t border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Update Status:
        </label>
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value as Order["status"])}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready for Pickup</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}