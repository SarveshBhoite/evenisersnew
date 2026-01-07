"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { 
    DollarSign, TrendingUp, CreditCard, ShoppingBag, ArrowLeft, 
    Calendar, Download, Activity 
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Optional: You can use a library like 'recharts' for real graphs later.
// For now, we will build a clean UI with the data we have.

export default function RevenuePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (token) fetchRevenueStats();
  }, [token]);

  const fetchRevenueStats = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/revenue`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen pt-32 flex justify-center bg-gray-50">
              <p className="text-zinc-400 font-bold animate-pulse">Calculating Finances...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
            <div>
                <Link className="flex items-center gap-2 text-zinc-400 hover:text-black mb-4 transition-colors font-bold uppercase text-xs tracking-widest" href={"/admin/dashboard"}>
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="font-serif text-4xl font-bold text-zinc-900">Financial Overview</h1>
                <p className="text-zinc-500 mt-2">Track your earnings, pending payments, and growth.</p>
            </div>
            {/* <Button variant="outline" className="gap-2 border-zinc-200">
                <Download className="w-4 h-4" /> Export Report
            </Button> */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Card 1: Total Revenue */}
            <div className="bg-black text-white p-6 rounded-[2rem] shadow-xl shadow-black/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Total Income</p>
                    <h2 className="text-4xl font-serif font-bold">₹{stats?.totalRevenue?.toLocaleString()}</h2>
                    <div className="mt-4 flex items-center text-green-400 text-xs font-bold bg-green-400/10 w-fit px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3 mr-1" /> Money Earned
                    </div>
                </div>
            </div>

            {/* Card 2: Pending Amount */}
            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Activity className="w-24 h-24 text-red-500" />
                </div>
                <div className="relative z-10">
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Pending / Due</p>
                    <h2 className="text-4xl font-serif font-bold text-red-600">₹{stats?.totalPending?.toLocaleString()}</h2>
                    <p className="text-xs text-zinc-400 mt-4">Outstanding balance from advance payments.</p>
                </div>
            </div>

            {/* Card 3: Total Orders */}
            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Total Orders</p>
                <h2 className="text-4xl font-serif font-bold text-zinc-900">{stats?.totalOrders}</h2>
                <div className="mt-4 flex items-center text-blue-600 text-xs font-bold bg-blue-50 w-fit px-2 py-1 rounded-lg">
                    <ShoppingBag className="w-3 h-3 mr-1" /> Lifetime Sales
                </div>
            </div>

            {/* Card 4: Avg Order Value */}
            <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Avg. Order Value</p>
                <h2 className="text-4xl font-serif font-bold text-zinc-900">₹{stats?.avgOrderValue?.toLocaleString()}</h2>
                <div className="mt-4 flex items-center text-orange-600 text-xs font-bold bg-orange-50 w-fit px-2 py-1 rounded-lg">
                    <CreditCard className="w-3 h-3 mr-1" /> Per Transaction
                </div>
            </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="font-serif text-2xl font-bold">Recent Transactions</h3>
                <Link href="/admin/orders" className="text-xs font-bold text-zinc-400 hover:text-black uppercase tracking-widest">View All</Link>
            </div>
            <table className="w-full text-left">
                <thead className="bg-zinc-50/80 text-xs uppercase tracking-wider text-zinc-400">
                    <tr>
                        <th className="px-8 py-4 font-bold">Order ID</th>
                        <th className="px-8 py-4 font-bold">Date</th>
                        <th className="px-8 py-4 font-bold">Customer</th>
                        <th className="px-8 py-4 font-bold">Amount Paid</th>
                        <th className="px-8 py-4 font-bold text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {stats?.recentOrders?.map((order: any) => (
                        <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-8 py-4 font-mono text-xs text-zinc-500">#{order._id.slice(-6).toUpperCase()}</td>
                            <td className="px-8 py-4 text-sm text-zinc-600 flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-zinc-400" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-8 py-4 font-bold text-zinc-900">{order.shippingAddress?.firstName}</td>
                            <td className="px-8 py-4 text-green-700 font-bold">+ ₹{order.amountPaid?.toLocaleString()}</td>
                            <td className="px-8 py-4 text-right">
                                <Badge variant="outline" className="uppercase text-[10px] bg-white border-zinc-200">{order.paymentType}</Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  )
}