"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import { useLocation, CITIES } from "@/context/LocationContext";
import { Truck, CheckCircle, Wallet, CreditCard } from "lucide-react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { city, setCity } = useLocation();
  const router = useRouter();
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Payment Choice State (Default: Full Payment)
  const [paymentOption, setPaymentOption] = useState<"full" | "advance">("full");

  // --- 1. PRICE SYNC LOGIC (Matches Cart Exactly) ---
  const subtotal = cartItems.reduce((total, item) => {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;
      // Exact same logic as Cart Page
      const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
      return total + (finalPrice * item.quantity);
  }, 0);

  // Shipping Logic
  const shipping = subtotal > 50000 ? 0 : 2500; 
  
  // GST Logic (Standard 18%)
  const tax = subtotal * 0.18; 
  
  const grandTotal = subtotal + shipping + tax;

  // --- 2. PARTIAL PAYMENT CALCULATION ---
  const payableAmount = paymentOption === "advance" 
      ? Math.round(grandTotal * 0.40) 
      : Math.round(grandTotal);

  const remainingAmount = grandTotal - payableAmount;

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [cartItems, orderComplete, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      userEmail: formData.get("email"),
      items: cartItems.map((item) => {
        const price = item.productId.price;
        const discount = item.productId.discount || 0;
        const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
        
        return {
            product: item.productId?._id,
            quantity: item.quantity,
            price: finalPrice, // Important: Send discounted unit price
            eventDate: item.eventDate || "",
            timeSlot: item.timeSlot || "",
            message: item.message || ""
        };
      }),
      shippingAddress: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
        country: formData.get("country"),
      },
      // Payment Fields
      totalAmount: grandTotal,
      amountPaid: payableAmount,
      paymentType: paymentOption, 
    };

    try {
      // NOTE: Here you will eventually trigger Razorpay. 
      // For now, we simulate success directly.
      await axios.post(
        `${API_URL}/orders`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrderComplete(true);
      setTimeout(() => {
        clearCart();
        router.push("/");
      }, 3000);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Order placement failed");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderComplete) return null;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6 animate-bounce" />
          <h1 className="font-serif text-4xl font-bold mb-4 text-zinc-900">Booking Confirmed!</h1>
          <p className="text-lg text-zinc-500 mb-4">
            We have received your payment of <strong>₹{payableAmount.toLocaleString()}</strong>.
          </p>
          <p className="text-sm text-zinc-400 italic">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-5xl uppercase mb-12 text-zinc-900">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* LEFT: Shipping & Payment */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Shipping Details */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-3 mb-8">
                  <Truck className="w-5 h-5 text-black" />
                  <h2 className="font-black uppercase tracking-widest text-sm">Event Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["email", "Email", "email"],
                    ["address", "Event Address"],
                    ["city", "City"],
                    ["state", "State"],
                    ["zip", "ZIP Code"],
                    ["country", "Country", "text", "India"],
                  ].map(([name, label, type = "text", def]) => (
                    <div key={name} className={name === "address" || name === "email" ? "md:col-span-2" : ""}>
                      <Label className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider mb-1 block">
                        {label}
                      </Label>
                      
                      {name === "city" ? (
                        <>
                            <Select value={city} onValueChange={(val) => setCity(val)}>
                                <SelectTrigger className="bg-zinc-50 border-0 rounded-xl h-12 font-bold text-base focus:ring-0 px-4">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CITIES.map((c) => (
                                        <SelectItem key={c} value={c} className="font-medium cursor-pointer">{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" name="city" value={city} />
                        </>
                      ) : (
                        <Input
                          name={name}
                          type={type}
                          defaultValue={def}
                          required
                          className="bg-zinc-50 border-0 rounded-xl h-12 font-bold text-zinc-900 focus-visible:ring-black"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT OPTIONS (40% vs 100%) */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-3 mb-6">
                  <Wallet className="w-5 h-5 text-black" />
                  <h2 className="font-black uppercase tracking-widest text-sm">Payment Plan</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* FULL PAYMENT */}
                    <div 
                        onClick={() => setPaymentOption("full")}
                        className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative ${paymentOption === "full" ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">Pay Full (100%)</span>
                            {paymentOption === "full" && <CheckCircle className="w-5 h-5 text-black" />}
                        </div>
                        <p className="text-sm text-zinc-500">Pay everything now. No hassle on event day.</p>
                        <div className="mt-4 pt-4 border-t border-zinc-200">
                            <span className="font-serif text-2xl font-bold">₹{grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* ADVANCE PAYMENT */}
                    <div 
                        onClick={() => setPaymentOption("advance")}
                        className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative ${paymentOption === "advance" ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"}`}
                    >
                        <div className="absolute -top-3 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Popular
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">Book with 40%</span>
                            {paymentOption === "advance" && <CheckCircle className="w-5 h-5 text-black" />}
                        </div>
                        <p className="text-sm text-zinc-500">Secure your slot now. Pay balance later.</p>
                        <div className="mt-4 pt-4 border-t border-zinc-200 flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-2xl font-bold">₹{Math.round(grandTotal * 0.4).toLocaleString()}</span>
                                <span className="text-xs font-bold text-zinc-400 uppercase">Now</span>
                            </div>
                            <span className="text-xs text-red-500 font-bold mt-1">
                                Remaining: ₹{Math.round(grandTotal * 0.6).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
              </div>

            </div>

            {/* RIGHT: Summary */}
            <div className="rounded-[2.5rem] p-8 shadow-2xl sticky top-32 h-fit bg-white border border-zinc-100">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Order Summary</h2>

                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item, index) => {
                        const price = item.productId.price;
                        const discount = item.productId.discount || 0;
                        const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

                        return (
                            <div key={item.productId?._id || index} className="flex gap-4">
                                <div className="relative w-16 h-20 rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0">
                                <Image
                                    src={item.productId?.image ? `${process.env.NEXT_PUBLIC_API_URL}${item.productId.image}` : "/placeholder.svg"}
                                    alt="Product"
                                    fill
                                    className="object-cover"
                                />
                                </div>
                                <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold truncate">{item.productId?.name}</h4>
                                <p className="text-xs font-medium text-zinc-500 mt-1">
                                    {item.quantity} × ₹{finalPrice.toLocaleString()}
                                </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="border-t border-dashed border-zinc-200 pt-6 space-y-3">
                    <div className="flex justify-between font-medium text-sm text-zinc-500">
                        <span>Subtotal</span>
                        <span className="text-zinc-900">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium text-sm text-zinc-500">
                        <span>Logistics</span>
                        <span className="text-green-600">{shipping === 0 ? "FREE" : `₹${shipping.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between font-medium text-sm text-zinc-500">
                        <span>GST (18%)</span>
                        <span className="text-zinc-900">₹{tax.toLocaleString()}</span>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-6 mt-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-zinc-500">Total Bill</span>
                        <span className="text-lg font-bold text-zinc-400 line-through decoration-zinc-300">₹{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-lg font-black text-black uppercase tracking-tight">Payable Now</span>
                        <span className="text-4xl font-serif font-bold text-black">
                            ₹{payableAmount.toLocaleString()}
                        </span>
                    </div>
                    {paymentOption === "advance" && (
                        <p className="text-xs text-right text-red-500 font-bold mt-2">
                            Balance ₹{remainingAmount.toLocaleString()} due later
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-zinc-800 text-white rounded-2xl mt-8 h-16 font-bold text-lg shadow-xl transition-all active:scale-[0.98]"
                >
                    {loading ? "Processing..." : `Pay ₹${payableAmount.toLocaleString()}`}
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-zinc-400">
                    <CreditCard className="w-3 h-3" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">Razorpay Secured</p>
                </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}