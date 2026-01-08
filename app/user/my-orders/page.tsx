"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Loader2, ArrowRight, PackageX } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setOrders(res.data))
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
    }
  }, [token]);

  const getStatusStyle = (status: string) => {
      switch(status) {
          case "completed": return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
          case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100";
          case "paid": return "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800";
          case "cancelled": return "bg-red-50 text-red-600 border-red-200 hover:bg-red-50";
          default: return "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-50";
      }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
            <h1 className="font-serif text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-zinc-500">Manage your upcoming events and view past history.</p>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-300 mb-4" />
                <p className="text-zinc-400 font-medium">Loading your events...</p>
            </div>
        ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                    <PackageX className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="font-serif text-xl font-bold text-zinc-900">No bookings found</h3>
                <p className="text-zinc-500 mb-6 max-w-xs text-center mt-2">You haven't booked any events with us yet. Start planning your special day!</p>
                <Button asChild className="rounded-full px-8 bg-black text-white hover:bg-zinc-800">
                    <Link href="/shop">Explore Packages</Link>
                </Button>
            </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="group bg-white rounded-[2rem] border border-zinc-100 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300">
                        
                        {/* Header: Order ID & Date */}
                        <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</span>
                                <span className="font-mono text-sm font-bold text-zinc-700">#{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Booked On</span>
                                <span className="text-sm font-medium text-zinc-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Items Loop */}
                        <div className="p-6 space-y-6">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-6 items-start">
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                                        <Image 
                                            src={item.product?.image ? `${process.env.NEXT_PUBLIC_API_URL}${item.product.image}` : "/placeholder.svg"} 
                                            alt={item.product?.name || "Product"} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-serif text-xl font-bold text-zinc-900 truncate">{item.product?.name || "Product Unavailable"}</h3>
                                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">{item.product?.category || "Event"}</p>
                                            </div>
                                            <span className="font-bold text-lg text-black">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>

                                        {/* Event Specifics Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-100">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-zinc-500">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Event Date</p>
                                                    <p className="text-sm font-semibold text-zinc-800">{item.eventDate || "Not Scheduled"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2.5 rounded-xl border border-zinc-100">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-zinc-500">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Time Slot</p>
                                                    <p className="text-sm font-semibold text-zinc-800">{item.timeSlot || "Standard Time"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer: Total & Status */}
                        <div className="px-6 py-4 bg-white border-t border-zinc-100 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Badge className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                    {order.status.replace("_", " ")}
                                </Badge>
                                {order.status === "in_progress" && (
                                    <span className="text-xs text-blue-600 font-medium animate-pulse flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Vendor Assigned
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400 font-bold uppercase">Total Amount</p>
                                    <p className="text-xl font-serif font-bold text-black">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                                {/* Optional: View Receipt Button */}
                                {/* <Button variant="outline" size="sm" className="rounded-xl h-10 border-zinc-200">
                                    Receipt <ArrowRight className="w-4 h-4 ml-2" />
                                </Button> */}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}