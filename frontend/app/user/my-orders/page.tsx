"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2, Star, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setOrders(res.data))
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
    }
  }, [token]);

  const handleOpenReview = (product: any) => {
      setSelectedProduct(product);
      setRating(5);
      setComment("");
      setIsReviewOpen(true);
  };

  const submitReview = async () => {
      if(!rating) return toast.error("Please select a rating");
      setSubmitting(true);
      try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedProduct._id}/reviews`, 
            { rating, comment },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Review Submitted!");
          setIsReviewOpen(false);
      } catch (err: any) {
          toast.error(err.response?.data?.message || "Failed to submit review");
      } finally {
          setSubmitting(false);
      }
  };

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
            <div className="text-center py-20 bg-white rounded-[2rem] border border-zinc-100">
                <p className="text-zinc-400">No orders found.</p>
                <Link href="/shop" className="text-black font-bold underline mt-2 block">Book an Event</Link>
            </div>
        ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="group bg-white rounded-[2rem] border border-zinc-100 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-300">
                        {/* Header */}
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

                        {/* Items */}
                        <div className="p-6 space-y-6">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                                        <Image 
                                            src={item.product?.image ? `${process.env.NEXT_PUBLIC_API_URL}${item.product.image}` : "/placeholder.svg"} 
                                            alt={item.product?.name || "Product"} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-serif text-xl font-bold text-zinc-900 truncate">{item.product?.name || "Product Unavailable"}</h3>
                                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">{item.product?.category || "Event"}</p>
                                            </div>
                                            <span className="font-bold text-lg text-black">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>

                                        <div className="flex gap-4 mt-2">
                                            <Badge variant="outline" className="rounded-md px-2 bg-zinc-50 border-zinc-200 text-zinc-500 font-medium">
                                                {item.eventDate || "Date Pending"}
                                            </Badge>
                                            <Badge variant="outline" className="rounded-md px-2 bg-zinc-50 border-zinc-200 text-zinc-500 font-medium">
                                                {item.timeSlot || "Time Pending"}
                                            </Badge>
                                        </div>

                                        {/* 🚨 REVIEW BUTTON (Only if Completed) */}
                                        {order.status === "completed" && item.product && (
                                            <Button 
                                                onClick={() => handleOpenReview(item.product)}
                                                variant="ghost" 
                                                size="sm" 
                                                className="mt-4 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] p-0 h-auto"
                                            >
                                                <Star className="w-3 h-3 mr-1" /> Write a Review
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Status */}
                        <div className="px-6 py-4 bg-white border-t border-zinc-100 flex flex-wrap justify-between items-center gap-4">
                            <Badge className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                {order.status.replace("_", " ")}
                            </Badge>
                            <div className="text-right">
                                <p className="text-xs text-zinc-400 font-bold uppercase">Total Amount</p>
                                <p className="text-xl font-serif font-bold text-black">₹{order.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* 🚨 REVIEW MODAL */}
        <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
            <DialogContent className="rounded-[2rem] p-8 max-w-md">
                <DialogHeader className="mb-4">
                    <DialogTitle className="font-serif text-2xl font-bold text-center">Rate Your Experience</DialogTitle>
                    <p className="text-center text-zinc-500 text-sm">How was {selectedProduct?.name}?</p>
                </DialogHeader>
                
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                            key={star}
                            className={`w-8 h-8 cursor-pointer transition-all ${star <= rating ? "fill-[#D4AF37] text-[#D4AF37] scale-110" : "fill-gray-100 text-gray-300 hover:text-[#D4AF37]"}`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold uppercase text-zinc-400 ml-1">Your Review</label>
                    <Textarea 
                        placeholder="Tell us about the decoration, timing, and service..."
                        className="h-32 rounded-2xl bg-zinc-50 border-zinc-200 focus:bg-white resize-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={submitReview} disabled={submitting} className="w-full h-12 rounded-xl bg-black text-white font-bold hover:bg-zinc-800">
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : "Submit Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}