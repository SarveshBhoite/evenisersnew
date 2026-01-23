"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { useAuth } from "@/context/AuthContext"; 
import { Truck, CheckCircle, Wallet, CreditCard, Loader2 } from "lucide-react";
import axios from "axios";
import Script from "next/script";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { city } = useLocation(); 
  const { user, token } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"full" | "advance">("full");
  const [useProfileData, setUseProfileData] = useState(false);

  // Form State 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    zip: "",
    country: "India",
  });

  // --- 1. PRICE LOGIC ---
  const subtotal = cartItems.reduce((total, item) => {
      const price = item.productId.price;
      const discount = item.productId.discount || 0;
      const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
      return total + (finalPrice * item.quantity);
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 500; 
  const tax = subtotal * 0.18; 
  const grandTotal = subtotal + shipping + tax;

  // --- 2. PAYMENT AMOUNT CALCULATION ---
  const payableAmount = paymentOption === "advance" ? Math.round(grandTotal * 0.40) : Math.round(grandTotal);
  const remainingAmount = grandTotal - payableAmount;

  // --- 3. AUTO-FILL LOGIC ---
  useEffect(() => {
    if (useProfileData && user) {
        axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const u = res.data;
            const names = u.name ? u.name.split(" ") : ["", ""];
            setFormData({
                firstName: names[0] || "",
                lastName: names.slice(1).join(" ") || "",
                email: u.email || "",
                phone: u.phone || "",
                address: u.address || "",
                state: u.state || "",
                zip: u.zip || "",
                country: "India"
            });
        }).catch(err => console.error(err));
    }
  }, [useProfileData, user, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 4. RAZORPAY PAYMENT HANDLER ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Please login to place an order");
    setLoading(true);

    try {
        // A. Create Order ID on Backend
        const { data: orderData } = await axios.post(
            `${API_URL}/payment/create-order`,
            { amount: payableAmount }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // B. Open Razorpay
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount, 
            currency: "INR",
            name: "Evenisers Events",
            description: paymentOption === 'advance' ? "Advance Payment (40%)" : "Full Payment",
            order_id: orderData.id,
            
            handler: async function (response: any) {
                // C. On Success -> Save Order to DB
                await saveOrder(response);
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone,
            },
            theme: { color: "#000000" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error(error);
        toast.error("Payment initialization failed");
        setLoading(false);
    }
  };

  const saveOrder = async (paymentResult: any) => {
      try {
        const orderPayload = {
            userEmail: formData.email,
            items: cartItems.map((item) => {
                const price = item.productId.price;
                const discount = item.productId.discount || 0;
                const finalPrice = discount > 0 ? price - (price * discount / 100) : price;
                return {
                    product: item.productId._id,
                    quantity: item.quantity,
                    price: finalPrice,
                    eventDate: item.eventDate,
                    timeSlot: item.timeSlot,
                    message: item.message
                };
            }),
            shippingAddress: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone, 
                address: formData.address,
                city: city, 
                state: formData.state,
                zip: formData.zip,
                country: formData.country,
            },
            paymentMethod: "Razorpay",
            paymentResult: {
                id: paymentResult.razorpay_payment_id,
                status: "completed",
                email_address: formData.email,
            },
            totalAmount: grandTotal,
            amountPaid: payableAmount,
            remainingAmount: remainingAmount,
            paymentType: paymentOption,
        };

        await axios.post(`${API_URL}/orders`, orderPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("Booking Confirmed!");
        clearCart();
        router.push("/user/my-orders");

        
      } catch (error) {
          console.error(error);
          toast.error("Order creation failed. Please contact support.");
      } finally {
          setLoading(false);
      }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-5xl uppercase mb-12 text-zinc-900">Checkout</h1>

        <form onSubmit={handlePayment}>
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* LEFT: Shipping & Payment */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Shipping Details */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-black" />
                        <h2 className="font-black uppercase tracking-widest text-sm">Event Details</h2>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="useProfile" 
                                checked={useProfileData}
                                onCheckedChange={(c) => setUseProfileData(c as boolean)}
                            />
                            <Label htmlFor="useProfile" className="text-sm font-medium cursor-pointer">
                                Fetch from Profile
                            </Label>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">First Name</Label>
                        <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">Last Name</Label>
                        <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>
                    
                    <div className="md:col-span-2 space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">Email</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">Phone Number</Label>
                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required placeholder="+91 99999 99999" className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">Event Address</Label>
                        <Input name="address" value={formData.address} onChange={handleInputChange} required className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">City (Selected Location)</Label>
                        <Input value={city} disabled className="bg-zinc-100 border-0 h-12 rounded-xl font-bold text-zinc-500 cursor-not-allowed" />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">State</Label>
                        <Input name="state" value={formData.state} onChange={handleInputChange} required className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">Zip Code</Label>
                        <Input name="zip" value={formData.zip} onChange={handleInputChange} required className="bg-zinc-50 border-0 h-12 rounded-xl" />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-bold uppercase text-zinc-500">Country</Label>
                        <Input name="country" value={formData.country} disabled className="bg-zinc-100 border-0 h-12 rounded-xl" />
                    </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex items-center gap-3 mb-6">
                  <Wallet className="w-5 h-5 text-black" />
                  <h2 className="font-black uppercase tracking-widest text-sm">Payment Plan</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* FULL */}
                    <div onClick={() => setPaymentOption("full")} className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative ${paymentOption === "full" ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">Pay Full (100%)</span>
                            {paymentOption === "full" && <CheckCircle className="w-5 h-5 text-black" />}
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-200">
                            <span className="font-serif text-2xl font-bold">₹{grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* ADVANCE */}
                    <div onClick={() => setPaymentOption("advance")} className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative ${paymentOption === "advance" ? "border-black bg-zinc-50" : "border-zinc-100 hover:border-zinc-200"}`}>
                        <div className="absolute -top-3 right-4 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Popular</div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">Book with 40%</span>
                            {paymentOption === "advance" && <CheckCircle className="w-5 h-5 text-black" />}
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-200 flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-2xl font-bold">₹{Math.round(grandTotal * 0.4).toLocaleString()}</span>
                                <span className="text-xs font-bold text-zinc-400 uppercase">Now</span>
                            </div>
                            <span className="text-xs text-red-500 font-bold mt-1">Remaining: ₹{Math.round(grandTotal * 0.6).toLocaleString()}</span>
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
                                      // ✅ FIX: "Smart URL Check" for Checkout Page
                                      src={
                                        item.productId?.image 
                                          ? (item.productId.image.startsWith("http") 
                                              ? item.productId.image 
                                              : `${process.env.NEXT_PUBLIC_API_URL}${item.productId.image}`)
                                          : "/placeholder.svg"
                                      } 
                                      alt="Product" 
                                      fill 
                                      className="object-cover" 
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate">{item.productId?.name}</h4>
                                    <p className="text-xs font-medium text-zinc-500 mt-1">{item.quantity} × ₹{finalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="border-t border-zinc-900 pt-6 mt-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-zinc-500">Total Bill</span>
                        <span className="text-lg font-bold text-zinc-400 line-through decoration-zinc-300">₹{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-lg font-black text-black uppercase tracking-tight">Payable Now</span>
                        <span className="text-4xl font-serif font-bold text-black">₹{payableAmount.toLocaleString()}</span>
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-black hover:bg-zinc-800 text-white rounded-2xl mt-8 h-16 font-bold text-lg shadow-xl transition-all active:scale-[0.98]">
                    {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${payableAmount.toLocaleString()}`}
                </Button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-zinc-400">
                    <CreditCard className="w-3 h-3" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">Razorpay Secured Payment</p>
                </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}