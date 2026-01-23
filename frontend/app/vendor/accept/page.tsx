"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { CheckCircle, MapPin, Calendar, Clock, AlertTriangle, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

function VendorAcceptContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const vendorId = searchParams.get("vendorId");

  const [status, setStatus] = useState<"loading" | "ready" | "success" | "taken" | "error">("loading");
  const [orderData, setOrderData] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. Fetch Real Order Details
  useEffect(() => {
    if (!orderId || !vendorId) {
      setStatus("error");
      return;
    }
    
    const fetchDetails = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/vendors/details/${orderId}`);
            
            if(res.data.status !== "broadcasting") {
                setStatus("taken");
            } else {
                setOrderData(res.data);
                setStatus("ready");
            }
        } catch (err) {
            setStatus("error");
        }
    };
    
    fetchDetails();
  }, [orderId, vendorId]);

  // 2. Accept Logic
  const handleAccept = async () => {
    setStatus("loading");
    try {
      const res = await axios.post(`${API_URL}/api/vendors/accept`, {
        orderId,
        vendorId,
      });

      if (res.data.success) {
        setStatus("success");
        toast.success("Job Assigned to you!");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setStatus("taken");
      } else {
        setStatus("error");
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
        <p className="text-zinc-500 font-medium">Verifying Event Availability...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">You're Assigned!</h1>
        <p className="text-zinc-500 max-w-md">
          Thank you for accepting. The admin has been notified and you can now see this in your dashboard.
        </p>
      </div>
    );
  }

  if (status === "taken") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">Too Late!</h1>
        <p className="text-zinc-500 max-w-md">This event has already been taken by another partner.</p>
      </div>
    );
  }

  // STATUS: READY (Show REAL Data with Loop)
  return (
    <div className="max-w-lg mx-auto pt-32 pb-20 px-6">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold mb-2">New Job Request</h1>
        <p className="text-zinc-500">
            This order contains <strong className="text-black">{orderData?.items?.length || 0} event(s)</strong>.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-xl overflow-hidden">
        
        {/* Global Location Header */}
        <div className="bg-zinc-50 p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm text-red-500">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</p>
                    <p className="font-bold text-lg text-zinc-900 leading-none">{orderData?.shippingAddress?.city || "City"}</p>
                </div>
            </div>
            <Badge variant="outline" className="bg-black text-white border-black">{orderData?.items?.length} Tasks</Badge>
        </div>

        {/* 🚨 LOOP THROUGH ALL ITEMS */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {orderData?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                    {/* Image Thumbnail */}
                    <div className="w-20 h-20 bg-white rounded-xl flex-shrink-0 overflow-hidden border border-zinc-200">
                        {item.product?.image ? (
                            <img 
                                // ✅ FIX: Smart URL Check Logic
                                src={
                                    item.product.image.startsWith("http") 
                                    ? item.product.image 
                                    : `${process.env.NEXT_PUBLIC_API_URL}${item.product.image}`
                                } 
                                className="w-full h-full object-cover" 
                                alt={item.product?.name}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300"><Package className="w-6 h-6"/></div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-lg text-zinc-900 truncate">{item.product?.name || "Event Package"}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-white px-2 py-1 rounded-md border border-zinc-200 shadow-sm">
                                <Calendar className="w-3 h-3 text-zinc-400" /> {item.eventDate || "TBD"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 bg-white px-2 py-1 rounded-md border border-zinc-200 shadow-sm">
                                <Clock className="w-3 h-3 text-zinc-400" /> {item.timeSlot || "TBD"}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-zinc-100 bg-white sticky bottom-0">
            <Button 
                onClick={handleAccept} 
                className="w-full h-14 bg-black hover:bg-zinc-800 text-white rounded-xl text-lg font-bold shadow-lg transition-transform active:scale-95"
            >
                Accept All Jobs
            </Button>
            <p className="text-center text-xs text-zinc-400 mt-3">By accepting, you agree to handle all events in this order.</p>
        </div>

      </div>
    </div>
  );
}

export default function VendorAcceptPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar />
      <Suspense fallback={<div className="pt-32 text-center">Loading...</div>}>
        <VendorAcceptContent />
      </Suspense>
    </div>
  );
}