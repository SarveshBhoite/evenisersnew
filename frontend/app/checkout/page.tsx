"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { CreditCard, Truck, CheckCircle, PackageCheck } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
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
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
        country: formData.get("country"),
      },
      totalAmount: total,
    };

    try {
      const res = await fetch("https://evenisersnew.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Order placement failed");
      }

      setOrderComplete(true);
      setTimeout(() => {
        clearCart();
        router.push("/");
      }, 3000);
    } catch (error: any) {
      alert(error.message);
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
    <div className="min-h-screen pt-32 pb-16 bg-pink-">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-5xl  text-foreground uppercase  mb-12">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-3 mb-8">
                  <Truck className="w-5 h-5 text-black" />
                  <h2 className=" font-black uppercase serif">
                    Shipping Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="firstName"
                    >
                      First Name
                    </Label>
                    <Input
                      name="firstName"
                      id="firstName"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div>
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="lastName"
                    >
                      Last Name
                    </Label>
                    <Input
                      name="lastName"
                      id="lastName"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="email"
                    >
                      Email for Confirmation
                    </Label>
                    <Input
                      name="email"
                      id="email"
                      type="email"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="address"
                    >
                      Full Address
                    </Label>
                    <Input
                      name="address"
                      id="address"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div>
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="city"
                    >
                      City
                    </Label>
                    <Input
                      name="city"
                      id="city"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div>
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="state"
                    >
                      State
                    </Label>
                    <Input
                      name="state"
                      id="state"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div>
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="zip"
                    >
                      ZIP Code
                    </Label>
                    <Input
                      name="zip"
                      id="zip"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                  <div>
                    <Label
                      className="text-[13px] font-bold uppercase serif text-zinc-600"
                      htmlFor="country"
                    >
                      Country
                    </Label>
                    <Input
                      name="country"
                      id="country"
                      defaultValue="India"
                      required
                      className="mt-2 bg-zinc-50 border-0 rounded-xl h-12 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-3 mb-8">
                  <CreditCard className="w-5 h-5 text-black" />
                  <h2 className="text-sm font-black uppercase tracking-widest">
                    Payment (Simulated)
                  </h2>
                </div>
                <div className="space-y-6 opacity-40 grayscale">
                  <Input
                    placeholder="Cardholder Name"
                    disabled
                    className="rounded-xl h-12 font-bold"
                  />
                  <Input
                    placeholder="Card Number"
                    disabled
                    className="rounded-xl h-12 font-bold"
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      placeholder="MM/YY"
                      disabled
                      className="rounded-xl h-12 font-bold"
                    />
                    <Input
                      placeholder="CVV"
                      disabled
                      className="rounded-xl h-12 font-bold"
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Payment is secured and encrypted.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="space-y-6">
              <div className=" text-black rounded-[2.5rem] p-8 shadow-2xl sticky top-32">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-zinc-500">
                  Your Selection
                </h2>

                <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item, index) => (
                    /* FIX: Using index as fallback key to prevent "unique key" error */
                    <div
                      key={item.productId?._id || index}
                      className="flex gap-4 group"
                    >
                      <div className="relative w-16 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-zinc-800">
                        <Image
                          src={
                            item.productId?.image
                              ? `https://evenisersnew.onrender.com${item.productId.image}`
                              : "/placeholder.svg"
                          }
                          alt={item.productId?.name || "Product"}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black leading-tight mb-1">
                          {item.productId?.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-zinc-500">
                            QTY: {item.quantity}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          <span className="text-sm font-bold text-white">
                            ₹
                            {(
                              item.productId?.price * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                        {/* Show small highlights preview */}
                        <div className="flex gap-1 flex-wrap">
                          {item.productId?.included
                            ?.split(",")
                            .slice(0, 2)
                            .map((inc: string, i: number) => (
                              <span
                                key={i}
                                className="text-[8px] font-bold uppercase px-2 py-1 bg-zinc-300 rounded-md "
                              >
                                {inc.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-6 space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-800">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-zinc-800">Shipping</span>
                    <span className="text-green-400">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pb-4">
                    <span className="text-zinc-800">GST (8%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Total amount
                    </p>
                    <span className="text-3xl   tracking-tighter">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white  rounded-full mt-8 h-16 text-sm font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  {loading ? "Confirming..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
