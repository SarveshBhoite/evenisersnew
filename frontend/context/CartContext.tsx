"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import axios from "axios";

interface CartItem {
  productId: {
    _id: string;
    name: string;
    price: number;
    discount?: number; // Added discount
    image: string;
    included?: any;
    category?: string;
    setupTime?: string; // Added setupTime
  };
  quantity: number;
  eventDate?: string;
  timeSlot?: string;
  message?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  updateItemDetails: (productId: string, details: { eventDate?: string; timeSlot?: string; message?: string }) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { token } = useAuth();

  const fetchCart = async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items || []);
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
      const res = await axios.post(
        `${API_URL}/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items);
      toast.success("Item added to cart successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!token) return;
    if (newQuantity < 1) return removeFromCart(productId);

    try {
      const res = await axios.put(
        `${API_URL}/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(res.data.items);
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  // ✅ NEW FUNCTION: Update Event Details
  const updateItemDetails = async (productId: string, details: { eventDate?: string; timeSlot?: string; message?: string }) => {
    if (!token) return;
    try {
        const res = await axios.put(
            `${API_URL}/cart/${productId}`,
            details, // Sending updated details
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(res.data.items);
    } catch (err) {
        console.error("Update details failed", err);
        toast.error("Failed to save event details");
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!token) return;
    try {
      const res = await axios.delete(`${API_URL}/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items);
      toast.success("Item removed from cart");
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = () => setCartItems([]);

  // ✅ FIXED TOTAL CALCULATION (Using Discounted Price)
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.productId.price;
    const discount = item.productId.discount || 0;
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
    return total + (finalPrice * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemDetails,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};