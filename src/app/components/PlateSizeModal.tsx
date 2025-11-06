"use client";

import React, { useState } from "react";
import { X, Plus, ShoppingBag, Loader2 } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  halfPlatePrice?: number | null;
}

interface PlateSizeModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    itemId: string,
    plateSize: "half" | "full",
    quantity: number
  ) => Promise<void>;
  onBuyNow: (
    itemId: string,
    plateSize: "half" | "full",
    quantity: number
  ) => void;
  loading: boolean;
}

export default function PlateSizeModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  loading,
}: PlateSizeModalProps) {
  const [selectedSize, setSelectedSize] = useState<"half" | "full">("full");
  const [quantity, setQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  if (!isOpen) return null;

  const selectedPrice =
    selectedSize === "half" ? item.halfPlatePrice! : item.price;
  const totalPrice = selectedPrice * quantity;

  const handleAddToCart = async () => {
    try {
      setActionLoading(true);
      await onAddToCart(item._id, selectedSize, quantity);
      onClose();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = () => {
    onBuyNow(item._id, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Select Plate Size
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Item Info */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {item.name}
            </h4>
          </div>

          {/* Plate Size Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose Plate Size
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Half Plate Option */}
              {item.halfPlatePrice && (
                <button
                  onClick={() => setSelectedSize("half")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedSize === "half"
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-orange-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Half Plate
                    </div>
                    <div className="text-orange-500 font-bold text-lg">
                      ₹{item.halfPlatePrice.toLocaleString("en-IN")}
                    </div>
                  </div>
                </button>
              )}

              {/* Full Plate Option */}
              <button
                onClick={() => setSelectedSize("full")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedSize === "full"
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-orange-300"
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Full Plate
                  </div>
                  <div className="text-orange-500 font-bold text-lg">
                    ₹{item.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity
            </label>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <Plus className="h-4 w-4 rotate-45" />
              </button>

              <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="text-2xl font-bold text-orange-500">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {quantity} × {selectedSize === "half" ? "Half" : "Full"} Plate @ ₹
              {selectedPrice.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={actionLoading || loading}
              className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={actionLoading || loading}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
