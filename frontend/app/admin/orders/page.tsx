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
import { Eye, Package, Calendar, User, ArrowLeft, MapPin, Wallet, Truck, Check } from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { toast } from "sonner" // Assuming you use Sonner for toasts

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  // Function to refresh orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(res.data)
    } catch (err) {
      console.error("Failed to fetch orders", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrders()
  }, [token])

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <Link className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-xs tracking-widest" href={"/admin/dashboard"}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-zinc-900">Manage Orders</h1>
          <Badge variant="outline" className="px-4 py-1 text-md bg-white">{orders.length} Total Orders</Badge>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-50/80 border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-8 py-5 font-bold">Order ID</th>
                <th className="px-8 py-5 font-bold">Customer / City</th>
                <th className="px-8 py-5 font-bold">Date</th>
                <th className="px-8 py-5 font-bold">Payment</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-5 font-mono text-xs text-zinc-500">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-zinc-900">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</div>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded mt-1 uppercase tracking-wide">
                      {order.shippingAddress?.city}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-zinc-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-5 text-sm">
                    <div className="font-bold text-zinc-900">₹{order.amountPaid?.toLocaleString()}</div>
                    {order.remainingAmount > 0 ? (
                        <div className="text-[10px] text-red-500 font-bold">Due: ₹{order.remainingAmount?.toLocaleString()}</div>
                    ) : (
                        <div className="text-[10px] text-green-600 font-bold">Paid Full</div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {/* Pass fetchOrders so we can refresh list after assignment */}
                    <OrderDetailsModal order={order} refreshOrders={fetchOrders} token={token} />
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

function getStatusColor(status: string) {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700 hover:bg-green-100 uppercase"
    case "partial_paid": return "bg-orange-100 text-orange-700 hover:bg-orange-100 uppercase"
    case "pending": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 uppercase"
    case "in_progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100 uppercase"
    case "completed": return "bg-zinc-800 text-white hover:bg-zinc-800 uppercase"
    default: return "bg-gray-100 text-gray-700 uppercase"
  }
}

// --- ORDER DETAILS MODAL (With Assign Logic) ---
function OrderDetailsModal({ order, refreshOrders, token }: { order: any, refreshOrders: any, token: any }) {
  const [vendors, setVendors] = useState<any[]>([])
  const [assigning, setAssigning] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState("")

  // Fetch Vendors relevant to this order's city
  const fetchLocalVendors = async () => {
    if (!order.shippingAddress?.city) return;
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors?city=${order.shippingAddress.city}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data);
    } catch (err) {
        console.error("Error fetching vendors", err);
    }
  }

  const handleAssign = async () => {
      if(!selectedVendor) return;
      setAssigning(true);
      try {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/assign`, 
            { vendorId: selectedVendor },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Order Assigned Successfully");
          refreshOrders(); // Refresh the main list
      } catch (err) {
          toast.error("Failed to assign order");
      } finally {
          setAssigning(false);
      }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-zinc-100" onClick={fetchLocalVendors}>
          <Eye className="w-4 h-4" /> View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-0 shadow-2xl p-0 gap-0">
        
        {/* Modal Header */}
        <DialogHeader className="p-8 pb-6 border-b border-zinc-100 bg-zinc-50/50 flex flex-row justify-between items-center">
          <DialogTitle className="font-serif text-3xl font-bold flex items-center gap-3">
            Order Details
            <Badge variant="outline" className="font-sans font-normal text-sm px-3 py-1 border-zinc-300">
                #{order._id.slice(-8).toUpperCase()}
            </Badge>
          </DialogTitle>
          
          {/* ASSIGNMENT SECTION (Only if not assigned yet) */}
          {!order.assignedVendor && (order.status === "paid" || order.status === "partial_paid") && (
              <div className="flex items-center gap-2">
                  <select 
                    className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none"
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                  >
                      <option value="">Select Vendor ({order.shippingAddress?.city})</option>
                      {vendors.length > 0 ? vendors.map((v: any) => (
                          <option key={v._id} value={v._id}>{v.name} (Rated 4.8)</option>
                      )) : <option disabled>No vendors in this city</option>}
                  </select>
                  <Button 
                    onClick={handleAssign} 
                    disabled={assigning || !selectedVendor}
                    className="bg-black text-white hover:bg-zinc-800 rounded-xl"
                  >
                      {assigning ? "Assigning..." : "Assign Vendor"}
                  </Button>
              </div>
          )}
          
          {/* If Assigned, Show Badge */}
          {order.assignedVendor && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3 h-3 mr-1" /> Assigned to Partner
              </Badge>
          )}
        </DialogHeader>

        <div className="p-8 space-y-8">
            {/* Same Details Grid as before... I will include it for completeness */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <User className="w-4 h-4" /> Customer Info
                    </h3>
                    <div className="text-sm bg-zinc-50 p-6 rounded-2xl space-y-3 border border-zinc-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {order.shippingAddress?.city}
                        </div>
                        <p><span className="font-bold text-zinc-900">Name:</span> {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                        <p><span className="font-bold text-zinc-900">Email:</span> {order.userEmail}</p>
                        <p><span className="font-bold text-zinc-900">Phone:</span> {order.shippingAddress?.phone || "N/A"}</p>
                        <p className="leading-relaxed"><span className="font-bold text-zinc-900">Address:</span> {order.shippingAddress?.address}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Wallet className="w-4 h-4" /> Payment Info
                    </h3>
                    <div className="text-sm bg-zinc-50 p-6 rounded-2xl border border-zinc-100 space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                            <span className="text-zinc-500">Total Bill:</span>
                            <span className="font-bold text-lg">₹{order.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-green-700">
                            <span className="font-medium">Paid Amount:</span>
                            <span className="font-bold">+ ₹{order.amountPaid?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-600">
                            <span className="font-medium">Remaining Due:</span>
                            <span className="font-bold">- ₹{order.remainingAmount?.toLocaleString()}</span>
                        </div>
                        <div className="pt-2">
                            <Badge className={`w-full justify-center py-1 ${getStatusColor(order.status)}`}>
                                {order.status === "partial_paid" ? "Partial Payment (40%)" : order.status === "paid" ? "Full Payment Done" : order.status.replace("_", " ")}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Event Packages
                </h3>
                <div className="border border-zinc-100 rounded-2xl divide-y divide-zinc-50 overflow-hidden">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="p-5 hover:bg-zinc-50/50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-serif text-lg font-bold text-zinc-900">{item.product?.name || "Product Deleted"}</p>
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Category: {item.product?.category || "Event"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    <p className="text-xs text-zinc-400">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <div className="bg-white border border-zinc-100 rounded-xl p-4 flex flex-wrap gap-4 text-sm mt-2 shadow-sm">
                                <div className="flex items-center gap-2 text-zinc-700"><Calendar className="w-4 h-4 text-zinc-400" /><span className="font-semibold">Date:</span> <span>{item.eventDate || "Not Selected"}</span></div>
                                <div className="flex items-center gap-2 text-zinc-700"><Truck className="w-4 h-4 text-zinc-400" /><span className="font-semibold">Time:</span> <span>{item.timeSlot || "Not Selected"}</span></div>
                                {item.message && <div className="w-full text-zinc-600 border-t border-zinc-100 pt-2 mt-1 italic">"{item.message}"</div>}
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