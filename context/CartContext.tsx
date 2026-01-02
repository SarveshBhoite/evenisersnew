"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, Key } from "react";
import { useAuth } from "./AuthContext";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { toast } from "sonner";

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    included?: any;
    category?: string;
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      // ✅ FIXED: Changed method back to GET (default)
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "GET", 
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId: string, quantity: number) => {
    if (!token) {
      toast.error("Please log in first");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.items);
        toast.success("Item added to cart successfully.");
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!token) return;
    if (newQuantity < 1) return removeFromCart(productId);
    try {
      const res = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setCartItems(data.items);
        toast.success("Item removed from cart");
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};