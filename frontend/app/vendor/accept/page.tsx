"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { CheckCircle, XCircle, MapPin, Calendar, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
          Thank you for accepting. The admin has been notified.
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

  // STATUS: READY (Show REAL Data)
  return (
    <div className="max-w-md mx-auto pt-32 pb-20 px-6">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold mb-2">New Event Request</h1>
        <p className="text-zinc-500">A new decoration job matches your profile.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-xl overflow-hidden">
        
        {/* Header with Image if available */}
        <div className="bg-zinc-100 h-40 relative">
            {orderData?.products?.[0]?.image ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${orderData.products[0].image}`} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
            )}
            <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                {orderData?.products?.[0]?.category || "Event"}
            </div>
        </div>

        <div className="p-8 space-y-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-400 uppercase">Location</p>
                    <p className="font-bold text-lg text-zinc-900">{orderData?.city}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-400 uppercase">Event Date</p>
                    <p className="font-bold text-lg text-zinc-900">{orderData?.eventDate}</p>
                </div>
            </div>

            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                    <p className="text-sm font-bold text-zinc-400 uppercase">Timing</p>
                    <p className="font-bold text-lg text-zinc-900">{orderData?.timeSlot}</p>
                </div>
            </div>

            <div className="h-px bg-zinc-100 w-full" />

            <Button 
                onClick={handleAccept} 
                className="w-full h-14 bg-black hover:bg-zinc-800 text-white rounded-xl text-lg font-bold shadow-lg transition-transform active:scale-95"
            >
                Accept This Job
            </Button>
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