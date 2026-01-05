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
} from "@/components/ui/select"; // Import Select components
import { useCart } from "@/context/CartContext";
import { useLocation, CITIES } from "@/context/LocationContext"; // Import Location Context
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { city, setCity } = useLocation(); // Get global city state
  const router = useRouter();
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = cartTotal;
  const shipping = subtotal > 500 ? 0 : 20;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
      items: cartItems.map((item) => ({
        product: item.productId?._id,
        quantity: item.quantity,
        price: item.productId?.price,
      })),
      shippingAddress: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        address: formData.get("address"),
        city: formData.get("city"), // This will now come from the hidden input or state
        state: formData.get("state"),
        zip: formData.get("zip"),
        country: formData.get("country"),
      },
      totalAmount: total,
    };

    try {
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
      alert(
        error?.response?.data?.message || "Order placement failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderComplete) return null;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6 animate-bounce" />
          <h1 className="font-serif text-4xl font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Thank you for your purchase. We are processing your order.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Redirecting to homepage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-5xl uppercase mb-12">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* FORM */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-3 mb-8">
                  <Truck className="w-5 h-5 text-black" />
                  <h2 className="font-black uppercase">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["email", "Email for Confirmation", "email"],
                    ["address", "Full Address"],
                    ["city", "City"], // We will handle this specially below
                    ["state", "State"],
                    ["zip", "ZIP Code"],
                    ["country", "Country", "text", "India"],
                  ].map(([name, label, type = "text", def]) => (
                    <div key={name} className={name === "address" || name === "email" ? "md:col-span-2" : ""}>
                      <Label className="text-[13px] font-bold uppercase text-zinc-600">
                        {label}
                      </Label>
                      
                      {/* LOGIC: If field is 'city', show Dropdown. Else show Input */}
                      {name === "city" ? (
                        <>
                            <Select 
                                value={city} 
                                onValueChange={(val) => setCity(val)} // Updates Global Context
                            >
                                <SelectTrigger className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold text-base focus:ring-0 px-3">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CITIES.map((c) => (
                                        <SelectItem key={c} value={c} className="font-medium cursor-pointer">
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* Hidden input to ensure FormData picks up the value on submit */}
                            <input type="hidden" name="city" value={city} />
                        </>
                      ) : (
                        <Input
                          name={name}
                          type={type}
                          defaultValue={def}
                          required
                          className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT SECTION (Visual Only) */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 opacity-40 grayscale">
                <div className="flex items-center gap-3 mb-8">
                  <CreditCard className="w-5 h-5 text-black" />
                  <h2 className="text-sm font-black uppercase tracking-widest">
                    Payment (Simulated)
                  </h2>
                </div>
                <div className="space-y-6">
                  <Input disabled className="rounded-xl h-12 font-bold" placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-6">
                     <Input disabled className="rounded-xl h-12 font-bold" placeholder="MM/YY" />
                     <Input disabled className="rounded-xl h-12 font-bold" placeholder="CVC" />
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY SIDEBAR */}
            <div className="rounded-[2.5rem] p-8 shadow-2xl sticky top-32 h-fit bg-white">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-zinc-500">
                Your Selection
              </h2>

              <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={item.productId?._id || index} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded-2xl overflow-hidden border">
                      <Image
                        src={
                          item.productId?.image
                            ? `${process.env.NEXT_PUBLIC_API_URL}${item.productId.image}`
                            : "/placeholder.svg"
                        }
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black line-clamp-2">
                        {item.productId?.name}
                      </h4>
                      <p className="text-sm font-bold text-muted-foreground mt-1">
                        Qty: {item.quantity} × ₹{item.productId?.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-muted-foreground">GST (8%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-6 mt-6 flex justify-between items-end">
                <span className="text-sm font-bold text-muted-foreground">Total</span>
                <span className="text-3xl font-black">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-zinc-800 text-white rounded-full mt-8 h-16 font-black uppercase shadow-lg transition-all active:scale-95"
              >
                {loading ? "Confirming..." : "Place Order"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}