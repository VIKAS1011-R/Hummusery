"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  plateSize: 'half' | 'full';
  quantity: number;
  isVeg: boolean;
  ingredients: string;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  loading: boolean;
  addToCart: (menuItemId: string, plateSize: 'half' | 'full', quantity?: number) => Promise<void>;
  updateCartItem: (menuItemId: string, plateSize: 'half' | 'full', quantity: number) => Promise<void>;
  removeFromCart: (menuItemId: string, plateSize: 'half' | 'full') => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setItems([]);
      setTotalAmount(0);
      setItemCount(0);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.cart) {
          setItems(data.cart.items);
          setTotalAmount(data.cart.totalAmount);
          setItemCount(data.cart.itemCount);
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItemId: string, plateSize: 'half' | 'full', quantity: number = 1) => {
    if (!user) {
      addToast("Please log in to add items to cart", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuItemId, plateSize, quantity }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setItems(data.cart.items);
        setTotalAmount(data.cart.totalAmount);
        setItemCount(data.cart.itemCount);
        addToast("Item added to cart!", "success");
      } else {
        addToast(data.error || "Failed to add item to cart", "error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      addToast("Failed to add item to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (menuItemId: string, plateSize: 'half' | 'full', quantity: number) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuItemId, plateSize, quantity }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setItems(data.cart.items);
        setTotalAmount(data.cart.totalAmount);
        setItemCount(data.cart.itemCount);
      } else {
        addToast(data.error || "Failed to update cart", "error");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      addToast("Failed to update cart", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (menuItemId: string, plateSize: 'half' | 'full') => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuItemId, plateSize, quantity: 0 }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setItems(data.cart.items);
        setTotalAmount(data.cart.totalAmount);
        setItemCount(data.cart.itemCount);
        addToast("Item removed from cart", "info");
      } else {
        addToast(data.error || "Failed to remove item", "error");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      addToast("Failed to remove item", "error");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setItems([]);
        setTotalAmount(0);
        setItemCount(0);
        addToast("Cart cleared", "info");
      } else {
        addToast(data.error || "Failed to clear cart", "error");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      addToast("Failed to clear cart", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        itemCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};