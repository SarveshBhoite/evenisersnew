"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, Calendar, User, ArrowLeft, Clock, MessageSquare } from "lucide-react"
import axios from "axios"
import Link from "next/link"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setOrders(res.data)
      } catch (err) {
        console.error("Failed to fetch orders", err)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchOrders()
  }, [token])

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <Link
            className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-xs tracking-widest" 
            href={"/admin/dashboard"}        
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-zinc-900">Manage Orders</h1>
          <Badge variant="outline" className="px-4 py-1 text-md bg-white">
            {orders.length} Total Orders
          </Badge>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/80 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-8 py-5 font-bold">Order ID</th>
                <th className="px-8 py-5 font-bold">Customer</th>
                <th className="px-8 py-5 font-bold">Date</th>
                <th className="px-8 py-5 font-bold">Total</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-5 font-mono text-xs text-zinc-500 group-hover:text-black transition-colors">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-zinc-900">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {order.userEmail}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-zinc-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-zinc-900">
                    ₹{order.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <OrderDetailsModal order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && !loading && (
            <div className="p-20 text-center text-zinc-400">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper: Status Colors
function getStatusColor(status: string) {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700 hover:bg-green-100"
    case "pending": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
    case "shipped": return "bg-blue-100 text-blue-700 hover:bg-blue-100"
    case "delivered": return "bg-zinc-800 text-white hover:bg-zinc-800"
    default: return "bg-gray-100 text-gray-700"
  }
}

// --- ORDER DETAILS MODAL ---
function OrderDetailsModal({ order }: { order: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-zinc-100">
          <Eye className="w-4 h-4" /> View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-0 shadow-2xl p-0 gap-0">
        
        {/* Modal Header */}
        <DialogHeader className="p-8 pb-6 border-b border-zinc-100 bg-zinc-50/50">
          <DialogTitle className="font-serif text-3xl font-bold flex justify-between items-center">
            <span>Order Details</span>
            <Badge variant="outline" className="font-sans font-normal text-sm px-3 py-1 border-zinc-300">
                #{order._id.slice(-8).toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-8">
            
            {/* Customer & Order Info Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <User className="w-4 h-4" /> Customer Info
                    </h3>
                    <div className="text-sm bg-zinc-50 p-5 rounded-2xl space-y-2 border border-zinc-100">
                        <p><span className="font-bold text-zinc-900">Name:</span> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                        <p><span className="font-bold text-zinc-900">Email:</span> {order.userEmail}</p>
                        <p><span className="font-bold text-zinc-900">Phone:</span> {order.shippingAddress?.phone || "N/A"}</p>
                        <p><span className="font-bold text-zinc-900">Address:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Order Info
                    </h3>
                    <div className="text-sm bg-zinc-50 p-5 rounded-2xl space-y-2 border border-zinc-100">
                        <p><span className="font-bold text-zinc-900">Placed On:</span> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><span className="font-bold text-zinc-900">Status:</span> <span className="uppercase text-xs font-bold bg-black text-white px-2 py-0.5 rounded ml-1">{order.status}</span></p>
                        <p><span className="font-bold text-zinc-900">Payment Method:</span> Online</p>
                        <p className="text-lg pt-2 border-t border-zinc-200 mt-2 flex justify-between items-center">
                            <span className="font-bold">Total Paid:</span> 
                            <span className="font-serif font-bold">₹{order.totalAmount?.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Ordered Items List (Updated with Event Details) */}
            <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Event Packages
                </h3>
                <div className="border border-zinc-100 rounded-2xl divide-y divide-zinc-50 overflow-hidden">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-5 hover:bg-zinc-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-serif text-lg font-bold text-zinc-900">
                                        {item.product?.name || "Product Deleted"}
                                    </p>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">
                                        Category: {item.product?.category || "Event"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                </div>
                            </div>

                            {/* --- NEW: Event Details Section --- */}
                            <div className="bg-white border border-zinc-100 rounded-xl p-4 flex flex-wrap gap-4 text-sm mt-2 shadow-sm">
                                <div className="flex items-center gap-2 text-zinc-700">
                                    <Calendar className="w-4 h-4 text-zinc-400" />
                                    <span className="font-semibold">Date:</span> 
                                    <span>{item.eventDate || "Not Selected"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-700">
                                    <Clock className="w-4 h-4 text-zinc-400" />
                                    <span className="font-semibold">Time:</span> 
                                    <span>{item.timeSlot || "Not Selected"}</span>
                                </div>
                                {item.message && (
                                    <div className="w-full flex items-start gap-2 text-zinc-600 border-t border-zinc-100 pt-2 mt-1">
                                        <MessageSquare className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                                        <p className="italic text-xs leading-relaxed">"{item.message}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}