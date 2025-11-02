"use client";

import React, { useState } from "react";
import { Plus, X, Leaf, Beef, Loader2 } from "lucide-react";
import { useToast } from "@/app/context/ToastContext";

interface AddMenuItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: string;
  category: string;
  isAvailable: boolean;
}

const categories = [
  "Grab-and-Go Treats",
  "Shawarma Combos",
  "Indian Combos",
  "The Grand Feast",
  "Rice And Noodles Bowls",
  "Veg Rolls",
  "Chicken Rolls",
  "Chinese Veg Rolls",
  "Chinese Chicken Rolls"
];

export default function AddMenuItemForm({ onSuccess, onCancel }: AddMenuItemFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ingredients: "",
    isVeg: true,
    price: "",
    category: "Shawarma Combos",
    isAvailable: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      
      if (!formData.ingredients.trim()) {
        throw new Error("Ingredients are required");
      }
      
      if (formData.ingredients.trim().length < 10) {
        throw new Error("Ingredients description must be at least 10 characters long");
      }
      
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price greater than 0");
      }

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          ingredients: formData.ingredients.trim(),
          isVeg: formData.isVeg,
          price: price,
          category: formData.category,
          isAvailable: formData.isAvailable
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create menu item");
      }

      // Reset form and call success callback
      setFormData({
        name: "",
        ingredients: "",
        isVeg: true,
        price: "",
        category: "Shawarma Combos",
        isAvailable: true
      });
      
      addToast(`Menu item "${formData.name}" added successfully!`, 'success');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create menu item");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Menu Item</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Classic Hummus Bowl"
              required
            />
          </div>

          {/* Ingredients Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ingredients Description *
            </label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => handleInputChange("ingredients", e.target.value)}
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Describe the ingredients in 2 lines...&#10;Include preparation method and serving details."
              required
            />
            <p className="text-sm text-gray-400 mt-1">
              {formData.ingredients.length}/200 characters (minimum 10 required)
            </p>
          </div>

          {/* Veg/Non-Veg Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Food Type *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleInputChange("isVeg", true)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  formData.isVeg
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-green-500"
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded border-2 border-green-400">
                  <Leaf className="h-3 w-3 text-white" />
                </div>
                Vegetarian
              </button>
              
              <button
                type="button"
                onClick={() => handleInputChange("isVeg", false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  !formData.isVeg
                    ? "border-red-500 bg-red-500/10 text-red-400"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-red-500"
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded border-2 border-red-400">
                  <Beef className="h-3 w-3 text-white" />
                </div>
                Non-Vegetarian
              </button>
            </div>
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                min="1"
                step="1"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 975"
                required
              />
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Availability
              </label>
              <p className="text-sm text-gray-400">
                Make this item available to customers
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange("isAvailable", !formData.isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isAvailable ? "bg-orange-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isAvailable ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}