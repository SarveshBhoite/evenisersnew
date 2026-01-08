"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";

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

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-zinc-500 mb-8">Track your event bookings and history.</p>

        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-300" /></div>
        ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-zinc-100">
                <p className="text-zinc-400">No orders found.</p>
                <Link href="/shop" className="text-black font-bold underline mt-2 block">Book an Event</Link>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white p-6 rounded-2xl border border-zinc-100 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                                <h3 className="font-serif text-lg font-bold">
                                    {order.items.map((i: any) => i.product?.name).join(", ")}
                                </h3>
                            </div>
                            <Badge className="uppercase text-[10px] bg-black text-white">{order.status.replace("_", " ")}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-zinc-600 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-zinc-400" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-black">₹{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                        
                        {/* We could add a "View Details" page later if needed, for now simple list */}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}