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
import { Eye, Package, Calendar, User, ArrowLeft } from "lucide-react"
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

        // ✅ axios already parses JSON
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
        <Link
            className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-[20px] tracking-widest" href={"/admin/dashboard"}        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl font-bold">Manage Orders</h1>
          <Badge variant="outline" className="px-4 py-1 text-md">
            {orders.length} Total Orders
          </Badge>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-sm uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.userEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <OrderDetailsModal order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && !loading && (
            <div className="p-20 text-center text-muted-foreground">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helpers for UI
function getStatusColor(status: string) {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700"
    case "pending": return "bg-yellow-100 text-yellow-700"
    case "shipped": return "bg-blue-100 text-blue-700"
    default: return "bg-gray-100 text-gray-700"
  }
}

// Modal Component (UNCHANGED)
function OrderDetailsModal({ order }: { order: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Eye className="w-4 h-4" /> View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl border-b pb-4">
            Order Details
            <span className="text-muted-foreground text-sm font-sans ml-2">
              #{order._id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 py-6">
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <User className="w-4 h-4" /> Customer Info
            </h3>
            <div className="text-sm bg-gray-50 p-4 rounded-lg space-y-1">
              <p><strong>Name:</strong> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
              <p><strong>Email:</strong> {order.userEmail}</p>
              <p><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
              <p><strong>Country:</strong> {order.shippingAddress?.country}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Order Info
            </h3>
            <div className="text-sm bg-gray-50 p-4 rounded-lg space-y-1">
              <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status.toUpperCase()}</p>
              <p><strong>Total Paid:</strong> ${order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Package className="w-4 h-4" /> Ordered Items
          </h3>
          <div className="border rounded-lg divide-y">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">
                    {item.product?.name || "Product Deleted"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
