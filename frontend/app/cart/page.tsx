"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Calendar, Clock, MessageSquare, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

// 3-Hour Time Slots
const TIME_SLOTS = [
    "09:00 AM - 12:00 PM",
    "12:00 PM - 03:00 PM",
    "03:00 PM - 06:00 PM",
    "06:00 PM - 09:00 PM",
    "09:00 PM - 12:00 AM"
];

// ---------------------------------------------------------
// 1. ISOLATED CART ITEM COMPONENT (Fixes the typing lag)
// ---------------------------------------------------------
const CartItem = ({ item, removeFromCart, updateQuantity, updateItemDetails }: any) => {
    const product = item.productId;
    if (!product) return null;

    // Local state for inputs to ensure smooth typing
    const [message, setMessage] = useState(item.message || "");
    const [date, setDate] = useState(item.eventDate || "");
    const [time, setTime] = useState(item.timeSlot || "");

    // Calculate prices locally
    const discount = product.discount || 0;
    const price = product.price;
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

    // Sync local state to global ONLY when user leaves the field (onBlur)
    // This prevents the "jumping letters" issue
    const handleMessageBlur = () => {
        if (message !== item.message) {
            updateItemDetails(product._id, { message });
        }
    };

    const handleDateBlur = () => {
        if (date !== item.eventDate) {
            updateItemDetails(product._id, { eventDate: date });
        }
    };

    // For Select dropdowns, we can update immediately as they don't involve rapid typing
    const handleTimeChange = (val: string) => {
        setTime(val);
        updateItemDetails(product._id, { timeSlot: val });
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100 transition-all hover:shadow-md group">
            {/* Top Section: Image & Basic Info */}
            <div className="flex gap-6 items-start">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-zinc-100 shrink-0 bg-zinc-50">
                    <Image
                        src={product.image ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}` : "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-serif text-xl font-bold text-zinc-900 truncate pr-4">{product.name}</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-red-500 hover:bg-red-50 -mt-2 -mr-2"
                            onClick={() => removeFromCart(product._id)}
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Price & Quantity */}
                    <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
                        <div className="flex flex-col">
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Price per Package</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-xl text-black">₹{finalPrice.toLocaleString()}</span>
                                {discount > 0 && (
                                    <span className="text-sm text-zinc-400 line-through">₹{price.toLocaleString()}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center border border-zinc-200 rounded-full px-1 py-1 bg-white shadow-sm">
                            <button onClick={() => updateQuantity(product._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(product._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded-full transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-zinc-100 my-6" />

            {/* Bottom Section: Event Details (Date, Time, Message) */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Left: Setup & Date */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                        <Info className="w-3 h-3" /> Setup Duration: <span className="text-black">{product.setupTime || "3-4 Hours"}</span>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Event Date
                        </label>
                        <Input
                            type="date"
                            className="rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onBlur={handleDateBlur} // Sync on blur
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Time Slot
                        </label>
                        <select
                            className="flex h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            value={time}
                            onChange={(e) => handleTimeChange(e.target.value)}
                        >
                            <option value="">Select Time Slot</option>
                            {TIME_SLOTS.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right: Message (FIXED BEHAVIOR) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Special Instructions / Message
                    </label>
                    <Textarea
                        placeholder="Any specific requests for color theme, name on board, etc."
                        className="h-[105px] rounded-xl border-zinc-200 bg-zinc-50/50 focus:bg-white resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} // Update local state immediately
                        onBlur={handleMessageBlur} // Sync to global context only when user clicks away
                    />
                </div>
            </div>
        </div>
    );
};


// ---------------------------------------------------------
// 2. MAIN CART PAGE
// ---------------------------------------------------------
export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, updateItemDetails, cartTotal } = useCart()

    const subtotal = cartTotal
    const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 500) : 0
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
                <Navbar />
                <div className="max-w-7xl mx-auto px-6 text-center py-24 bg-white rounded-[3rem] border border-dashed border-zinc-200 mt-10">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-zinc-300" />
                    <h1 className="font-serif text-4xl font-bold mb-4 text-zinc-900">Your Cart is Empty</h1>
                    <p className="text-zinc-500 mb-8">It looks like you haven't added any packages yet.</p>
                    <Button asChild size="lg" className="rounded-full px-10 h-14 bg-black text-white hover:bg-zinc-800">
                        <Link href="/shop">
                            Explore Collections <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="font-serif text-4xl font-bold mb-10 text-zinc-900">Shopping Cart ({cartItems.length})</h1>

                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <CartItem 
                                key={item.productId._id} 
                                item={item} 
                                removeFromCart={removeFromCart} 
                                updateQuantity={updateQuantity} 
                                updateItemDetails={updateItemDetails} 
                            />
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100 sticky top-32">
                            <h2 className="font-serif text-2xl font-bold mb-6 text-zinc-900">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-zinc-500 text-sm font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-zinc-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-zinc-500 text-sm font-medium">
                                    <span>Logistics & Setup</span>
                                    <span className="text-green-600">{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
                                </div>
                                <div className="flex justify-between text-zinc-500 text-sm font-medium">
                                    <span>GST (18%)</span>
                                    <span className="text-zinc-900">₹{tax.toLocaleString()}</span>
                                </div>

                                <div className="border-t border-dashed border-zinc-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-zinc-900">Total Amount</span>
                                    <span className="text-2xl font-serif font-bold text-black">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button asChild className="w-full rounded-2xl h-16 text-lg font-bold bg-black hover:bg-zinc-800 shadow-xl shadow-black/10 transition-all active:scale-[0.98]">
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-zinc-400 opacity-70">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">100% Secure Payment</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}