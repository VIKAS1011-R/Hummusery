"use client";

import React, { useState } from "react";
import { Plus, X, Leaf, Beef, Loader2 } from "lucide-react";
import { useToast } from "@/app/context/ToastContext";
import { useCategories } from "@/app/hooks/useCategories";

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
  hasHalfPlate: boolean;
  halfPlatePrice: string;
}



export default function AddMenuItemForm({ onSuccess, onCancel }: AddMenuItemFormProps) {
  const { addToast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ingredients: "",
    isVeg: true,
    price: "",
    category: "",
    isAvailable: true,
    hasHalfPlate: false,
    halfPlatePrice: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default category when categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: categories[0].name
      }));
    }
  }, [categories, formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      
      // Optional validation for ingredients
      if (formData.ingredients.trim().length > 0 && formData.ingredients.trim().length < 3) {
        throw new Error("Ingredients description must be at least 3 characters long if provided");
      }
      
      const fullPlatePrice = parseFloat(formData.price);
      if (isNaN(fullPlatePrice) || fullPlatePrice <= 0) {
        throw new Error("Please enter a valid price greater than 0");
      }

      let halfPlatePrice = null;
      if (formData.hasHalfPlate) {
        halfPlatePrice = parseFloat(formData.halfPlatePrice);
        if (isNaN(halfPlatePrice) || halfPlatePrice <= 0) {
          throw new Error("Please enter a valid half plate price greater than 0");
        }
        if (halfPlatePrice >= fullPlatePrice) {
          throw new Error("Half plate price should be less than full plate price");
        }
      }

      // Create single menu item with optional half plate pricing
      const menuItem = {
        name: formData.name.trim(),
        ingredients: formData.ingredients.trim(),
        isVeg: formData.isVeg,
        price: fullPlatePrice,
        halfPlatePrice: halfPlatePrice, // null if not enabled
        category: formData.category,
        isAvailable: formData.isAvailable
      };

      const response = await fetch("/api/menu", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuItem),
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
        category: categories.length > 0 ? categories[0].name : "",
        isAvailable: true,
        hasHalfPlate: false,
        halfPlatePrice: ""
      });
      
      const plateText = formData.hasHalfPlate ? " with half & full plate options" : "";
      addToast(`Menu item "${formData.name}"${plateText} added successfully!`, 'success');
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Menu Item</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="e.g., Classic Hummus Bowl"
              required
            />
          </div>

          {/* Ingredients Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ingredients Description (Optional)
            </label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => handleInputChange("ingredients", e.target.value)}
              rows={4}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Describe the ingredients and preparation method (optional)..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.ingredients.length}/200 characters (optional, minimum 3 if provided)
            </p>
          </div>

          {/* Veg/Non-Veg Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Food Type *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleInputChange("isVeg", true)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  formData.isVeg
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500"
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
                    : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.hasHalfPlate ? "Full Plate Price (₹) *" : "Price (₹) *"}
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                min="1"
                step="1"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="e.g., 975"
                required
              />
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categoriesLoading ? (
                  <option value="">Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Half Plate Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Half Plate Option
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add half plate pricing option to this item
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange("hasHalfPlate", !formData.hasHalfPlate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.hasHalfPlate ? "bg-orange-500" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.hasHalfPlate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Half Plate Price Field - Only show when toggle is enabled */}
          {formData.hasHalfPlate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Half Plate Price (₹) *
              </label>
              <input
                type="number"
                value={formData.halfPlatePrice}
                onChange={(e) => handleInputChange("halfPlatePrice", e.target.value)}
                min="1"
                step="1"
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="e.g., 575"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Should be less than full plate price (₹{formData.price || "0"})
              </p>
            </div>
          )}

          {/* Preview of item to be created */}
          {formData.name && (
            <div className="bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Item to be created:</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="font-medium text-gray-800 dark:text-gray-300">• {formData.name}</div>
                {formData.hasHalfPlate ? (
                  <div className="ml-4 space-y-1">
                    <div>- Full Plate: ₹{formData.price || "0"}</div>
                    <div>- Half Plate: ₹{formData.halfPlatePrice || "0"}</div>
                  </div>
                ) : (
                  <div className="ml-4">- Price: ₹{formData.price || "0"}</div>
                )}
              </div>
            </div>
          )}

          {/* Availability Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Availability
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
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