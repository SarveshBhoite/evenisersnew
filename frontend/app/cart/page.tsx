"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { 
    Minus, Plus, Trash2, ArrowRight, ShoppingBag, Calendar, Clock, 
    MessageSquare, Info, Sparkles
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// 3-Hour Time Slots - UNCHANGED
const TIME_SLOTS = [
    "09:00 AM - 12:00 PM",
    "12:00 PM - 03:00 PM",
    "03:00 PM - 06:00 PM",
    "06:00 PM - 09:00 PM",
    "09:00 PM - 12:00 AM"
];

// Helper: Get today's date as YYYY-MM-DD for min attribute
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// ═══════════════════════════════════════════════════════════
// CART ITEM COMPONENT
// ═══════════════════════════════════════════════════════════
const CartItem = ({ item, removeFromCart, updateQuantity, updateItemDetails }: any) => {
    const product = item.productId;
    if (!product) return null;

    // Local state - UNCHANGED
    const [message, setMessage] = useState(item.message || "");
    const [date, setDate] = useState(item.eventDate || "");
    const [time, setTime] = useState(item.timeSlot || "");

    // Calculate prices - UNCHANGED
    const discount = product.discount || 0;
    const price = product.price;
    const finalPrice = discount > 0 ? price - (price * discount / 100) : price;

    // Handlers - UNCHANGED
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

    const handleTimeChange = (val: string) => {
        setTime(val);
        updateItemDetails(product._id, { timeSlot: val });
    };

    // Format selected date for display
    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-IN', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    return (
        <div className="bg-white border border-zinc-200 overflow-hidden transition-all hover:border-[#D4AF37]/30 hover:shadow-lg group">
            {/* Gold accent top line */}
            <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-4 md:p-6">
                {/* Top Section: Image & Basic Info */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
                    {/* Image */}
                    <div className="relative w-full sm:w-32 h-48 sm:h-32 overflow-hidden border border-zinc-100 shrink-0 bg-zinc-50">
                        <Image
                            src={
                                product.image
                                    ? (product.image.startsWith("http")
                                        ? product.image
                                        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`)
                                    : "/placeholder.svg"
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        {discount > 0 && (
                            <div className="absolute top-2 right-2">
                                <span className="bg-[#D4AF37] text-white text-[8px] font-bold px-2 py-1">
                                    -{discount}%
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-serif text-xl font-bold text-zinc-900 truncate pr-4 group-hover:text-[#B8860B] transition-colors">
                                {product.name}
                            </h3>
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

                            {/* Quantity Control */}
                            <div className="flex items-center border-2 border-zinc-200">
                                <button 
                                    onClick={() => updateQuantity(product._id, item.quantity - 1)} 
                                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-bold text-sm border-x-2 border-zinc-200 h-10 flex items-center justify-center bg-white">
                                    {item.quantity}
                                </span>
                                <button 
                                    onClick={() => updateQuantity(product._id, item.quantity + 1)} 
                                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="h-px w-full bg-zinc-200" />
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3">
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest">Event Details</span>
                    </div>
                </div>

                {/* Bottom Section: Event Details */}
                {/* Bottom Section: Event Details */}
<div className="grid md:grid-cols-2 gap-6">

    {/* Left: Setup & Date & Time */}
    <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Info className="w-3 h-3" /> Setup Duration: <span className="text-black">{product.setupTime || "3-4 Hours"}</span>
        </div>

        {/* DATE PICKER - Click anywhere opens picker */}
<div className="space-y-1.5">
    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> 
        Event Date <span className="text-red-400 text-[10px]">*</span>
    </label>
    <div className="relative group/date">
        <div 
            className={`flex items-center border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                date 
                    ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' 
                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
            } focus-within:border-[#D4AF37] focus-within:bg-white focus-within:shadow-md`}
            onClick={() => {
                const input = document.getElementById(`date-${product._id}`) as HTMLInputElement;
                if (input) {
                    input.showPicker?.();
                    input.focus();
                }
            }}
        >
            <div className={`flex items-center justify-center w-11 h-11 border-r-2 flex-shrink-0 transition-colors ${
                date ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10' : 'border-zinc-200 bg-zinc-100/80'
            }`}>
                <Calendar className={`w-4 h-4 ${date ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
            </div>
            
            <input
                id={`date-${product._id}`}
                type="date"
                min={getTodayDate()}
                className="flex-1 h-11 px-3 bg-transparent text-sm font-medium text-zinc-800 
                           focus:outline-none cursor-pointer
                           [&::-webkit-calendar-picker-indicator]:cursor-pointer 
                           [&::-webkit-calendar-picker-indicator]:opacity-0
                           [&::-webkit-calendar-picker-indicator]:absolute
                           [&::-webkit-calendar-picker-indicator]:inset-0
                           [&::-webkit-calendar-picker-indicator]:w-full
                           [&::-webkit-calendar-picker-indicator]:h-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={handleDateBlur}
            />

            {/* Custom calendar icon on right */}
            <div className="flex items-center justify-center w-10 h-11 flex-shrink-0 pointer-events-none">
                <svg className={`w-4 h-4 transition-colors ${date ? 'text-[#D4AF37]' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within/date:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
</div>

{/* TIME SLOT DROPDOWN - Click anywhere opens dropdown */}
<div className="space-y-1.5">
    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> 
        Time Slot <span className="text-red-400 text-[10px]">*</span>
    </label>
    <div className="relative group/time">
        <div 
            className={`flex items-center border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                time 
                    ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' 
                    : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300'
            } focus-within:border-[#D4AF37] focus-within:bg-white focus-within:shadow-md`}
            onClick={() => {
                const select = document.getElementById(`time-${product._id}`) as HTMLSelectElement;
                if (select) {
                    select.focus();
                    select.click();
                }
            }}
        >
            <div className={`flex items-center justify-center w-11 h-11 border-r-2 flex-shrink-0 transition-colors ${
                time ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10' : 'border-zinc-200 bg-zinc-100/80'
            }`}>
                <Clock className={`w-4 h-4 ${time ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
            </div>
            
            <select
                id={`time-${product._id}`}
                className="flex-1 h-11 px-3 bg-transparent text-sm font-medium text-zinc-800
                           focus:outline-none cursor-pointer appearance-none"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
            >
                <option value="" className="text-zinc-400">Select Time Slot</option>
                {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                ))}
            </select>
            
            <div className="flex items-center justify-center w-10 h-11 flex-shrink-0 pointer-events-none">
                <svg className={`w-4 h-4 transition-colors ${time ? 'text-[#D4AF37]' : 'text-zinc-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within/time:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
</div>
    </div>

    {/* Right: Message */}
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" /> 
            Special Instructions / Message
        </label>
        <div className="relative group/msg">
            <div className={`border-2 transition-all duration-300 overflow-hidden ${
                message 
                    ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5' 
                    : 'border-zinc-200 hover:border-zinc-300'
            } focus-within:border-[#D4AF37] focus-within:bg-white focus-within:shadow-md`}>
                {/* Header bar */}
                <div className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${
                    message ? 'border-[#D4AF37]/20 bg-[#D4AF37]/5' : 'border-zinc-100 bg-zinc-50'
                }`}>
                    <MessageSquare className={`w-3.5 h-3.5 ${message ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Your Message</span>
                </div>
                
                <Textarea
                    placeholder="Any specific requests for color theme, name on board, etc."
                    className="h-[120px] border-0 rounded-none bg-transparent focus:ring-0 resize-none text-sm placeholder:text-zinc-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={handleMessageBlur}
                />
            </div>
            {/* Gold accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within/msg:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
    </div>
</div>
            </div>
        </div>
    );
};


// ═══════════════════════════════════════════════════════════
// MAIN CART PAGE - LOGIC COMPLETELY UNCHANGED
// ═══════════════════════════════════════════════════════════
export default function CartPage() {
    const router = useRouter()
    const { cartItems, removeFromCart, updateQuantity, updateItemDetails, cartTotal } = useCart()

    // Calculations - UNCHANGED
    const subtotal = cartTotal
    const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 500) : 0
    const tax = subtotal * 0.18
    const total = subtotal + shipping + tax

    // Checkout Handler - UNCHANGED
    const handleCheckout = () => {
        for (const item of cartItems) {
            if (!item.eventDate || !item.timeSlot) {
                toast(`Schedule your event for "${item.productId.name}"`, {
                    description: "Please select a date and time slot to proceed.",
                    icon: <Calendar className="w-5 h-5 text-[#D4AF37]" />,
                    style: {
                        background: '#fff',
                        color: '#000',
                        border: '1px solid #f3f4f6',
                        borderRadius: '20px'
                    }
                });
                return;
            }
        }

        if (subtotal > 0) {
            router.push("/checkout");
        }
    }

    // ═══════════════════════════════════════════════════════════
    // EMPTY CART
    // ═══════════════════════════════════════════════════════════
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFCF8]">
                <Navbar />
                <div className="pt-32 pb-16 px-4 md:px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white border-2 border-dashed border-zinc-200 p-10 md:p-16">
                            <div className="w-20 h-20 mx-auto mb-6 border-2 border-dashed border-[#D4AF37]/30 flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-[#D4AF37]/50" />
                            </div>
                            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-zinc-900">Your Cart is Empty</h1>
                            <p className="text-zinc-500 mb-8">It looks like you haven't added any packages yet.</p>
                            <Button asChild size="lg" className="h-14 px-10 bg-zinc-900 text-white hover:bg-[#D4AF37] font-bold uppercase tracking-wider transition-all">
                                <Link href="/shop">
                                    Explore Collections <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ═══════════════════════════════════════════════════════════
    // CART WITH ITEMS
    // ═══════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-[#FDFCF8]">
            <Navbar />

            {/* Subtle Background */}
            <div className="fixed inset-0 -z-10">
                <div 
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(180deg, rgba(212,175,55,0.04) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 80%, rgba(212,175,55,0.04) 100%)`
                    }}
                />
            </div>

            <div className="pt-28 md:pt-32 pb-32 lg:pb-16 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-zinc-900">
                        Shopping Cart <span className="text-[#B8860B]">({cartItems.length})</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
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

                        {/* Checkout Summary - SAME CONTENT */}
                        <div className="lg:col-span-1 h-fit">
                            <div className="bg-white border border-zinc-200 lg:sticky lg:top-28">
                                {/* Header */}
                                <div className="p-5 md:p-6 border-b border-zinc-100">
                                    <h2 className="font-serif text-xl font-bold text-zinc-900">Order Summary</h2>
                                </div>

                                <div className="p-5 md:p-6">
                                    {/* Summary Lines - UNCHANGED */}
                                    <div className="space-y-4 mb-6">
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

                                    {/* Checkout Button */}
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full h-14 text-base font-bold bg-zinc-900 hover:bg-[#D4AF37] text-white transition-all duration-300 uppercase tracking-wider"
                                    >
                                        Proceed to Checkout
                                    </Button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-zinc-400">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold">100% Secure Payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-4 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Total</p>
                        <p className="text-xl font-bold text-zinc-900">₹{total.toLocaleString()}</p>
                    </div>
                    <Button
                        onClick={handleCheckout}
                        className="flex-1 h-12 bg-zinc-900 hover:bg-[#D4AF37] text-white font-bold uppercase tracking-wider transition-all"
                    >
                        Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}