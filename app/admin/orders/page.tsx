"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Package, Calendar, User, ArrowLeft, MapPin, Wallet, Truck, Check, Send, ChevronDown, UserCircle, XCircle } from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

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

  // Status Change Logic
  const changeStatus = async (orderId: string, newStatus: string) => {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders(); // Refresh table immediately
      } catch(err) {
          toast.error("Failed to update status");
      }
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <Link className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-xs tracking-widest" href={"/admin/dashboard"}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-zinc-900">Manage Orders</h1>
          <Badge variant="outline" className="px-4 py-1 text-md bg-white">{orders.length} Total Orders</Badge>
        </div>

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
                    
                    {/* STATUS DROPDOWN */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <Badge className={`${getStatusColor(order.status)} cursor-pointer hover:opacity-80 transition-opacity`}>
                                {order.status.replace("_", " ")} <ChevronDown className="w-3 h-3 ml-1" />
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-white rounded-xl shadow-xl border-zinc-100 p-2 z-50">
                            <DropdownMenuLabel className="text-xs uppercase text-zinc-400">Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => changeStatus(order._id, "completed")} className="cursor-pointer font-medium text-green-700 focus:bg-green-50 rounded-lg">
                                <Check className="w-4 h-4 mr-2" /> Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeStatus(order._id, "cancelled")} className="cursor-pointer font-medium text-red-700 focus:bg-red-50 rounded-lg">
                                <XCircle className="w-4 h-4 mr-2" /> Mark Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => changeStatus(order._id, "in_progress")} className="cursor-pointer font-medium text-blue-700 focus:bg-blue-50 rounded-lg">
                                <Truck className="w-4 h-4 mr-2" /> Set In Progress
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                  </td>
                  <td className="px-8 py-5 text-right">
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
    case "paid": return "bg-green-100 text-green-700 border-green-200 uppercase"
    case "partial_paid": return "bg-orange-100 text-orange-700 border-orange-200 uppercase"
    case "broadcasting": return "bg-purple-100 text-purple-700 border-purple-200 animate-pulse uppercase"
    case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200 uppercase"
    case "completed": return "bg-zinc-800 text-white border-zinc-800 uppercase"
    case "cancelled": return "bg-red-100 text-red-700 border-red-200 uppercase"
    default: return "bg-gray-100 text-gray-700 border-gray-200 uppercase"
  }
}

// --- ORDER DETAILS MODAL ---
function OrderDetailsModal({ order, refreshOrders, token }: { order: any, refreshOrders: any, token: any }) {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [assignMode, setAssignMode] = useState<"myself" | "broadcast" | "">("")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  const fetchLocalVendors = async () => {
    if (!order.shippingAddress?.city) return;
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors?city=${order.shippingAddress.city}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data);
    } catch (err) { console.error(err) }
  }

  const handleAssignMyself = async () => {
      setLoading(true);
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/status`, 
            { status: "in_progress" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Order assigned to you!");
        refreshOrders();
      } catch (err) { toast.error("Failed") }
      finally { setLoading(false) }
  }

  const handleBroadcast = async () => {
      if(selectedVendors.length === 0) return;
      setLoading(true);
      try {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/broadcast`, 
            { vendorIds: selectedVendors },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Requests sent to selected partners");
          refreshOrders();
      } catch (err) { toast.error("Failed") } 
      finally { setLoading(false) }
  }

  const toggleVendor = (id: string) => {
      if(selectedVendors.includes(id)) setSelectedVendors(selectedVendors.filter(v => v !== id));
      else setSelectedVendors([...selectedVendors, id]);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-zinc-100" onClick={fetchLocalVendors}>
          <Eye className="w-4 h-4" /> View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-0 shadow-2xl p-0 gap-0 bg-white [&::-webkit-scrollbar]:hidden">
        
        {/* Modal Header */}
        <DialogHeader className="p-8 pb-6 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
                <DialogTitle className="font-serif text-3xl font-bold flex items-center gap-3">
                    Order Details
                    <Badge variant="outline" className="font-sans font-normal text-sm px-3 py-1 border-zinc-300">
                        #{order._id.slice(-8).toUpperCase()}
                    </Badge>
                </DialogTitle>
                <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold">Review details & assign responsibilities</p>
            </div>
            
            {/* ASSIGNMENT BADGES */}
            {order.assignedVendor && (
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                    <Check className="w-3 h-3 mr-2" /> Assigned: {order.assignedVendor.name}
                </Badge>
            )}
            {order.status === "broadcasting" && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2 text-xs font-bold uppercase tracking-wider animate-pulse">
                    <Send className="w-3 h-3 mr-2" /> Request Broadcasted
                </Badge>
            )}
          </div>

          {/* --- ASSIGNMENT UI (Below Title, Aligned) --- */}
          {!order.assignedVendor && order.status !== "completed" && order.status !== "cancelled" && order.status !== "in_progress" && (
              <div className="flex flex-col gap-2 w-[240px]">
                  <Select onValueChange={(val) => setAssignMode(val as any)}>
                      <SelectTrigger className="w-full bg-white h-10 rounded-xl border-zinc-300 font-bold text-sm shadow-sm focus:ring-0">
                          <SelectValue placeholder="Assign Responsibility" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl border-zinc-100 shadow-xl w-[240px]">
                          <SelectItem value="myself" className="font-bold cursor-pointer py-2">
                              <div className="flex items-center gap-2">
                                  <UserCircle className="w-4 h-4" /> Myself (Admin)
                              </div>
                          </SelectItem>
                          <SelectItem value="broadcast" className="font-medium cursor-pointer py-2">
                              <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" /> Broadcast to Vendors
                              </div>
                          </SelectItem>
                      </SelectContent>
                  </Select>

                  {/* Mode A: Myself Button */}
                  {assignMode === "myself" && (
                      <Button onClick={handleAssignMyself} disabled={loading} size="sm" className="w-full bg-black text-white rounded-xl h-9 animate-in slide-in-from-top-2 fade-in">
                          {loading ? "Processing..." : "Confirm & Start"}
                      </Button>
                  )}

                  {/* Mode B: Vendor Multi-Select */}
                  {assignMode === "broadcast" && (
                      <div className=" bg-white border border-zinc-200 rounded-xl p-3 shadow-lg absolute top-38 z-50 animate-in slide-in-from-top-2 fade-in w-[350px]">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Select Vendors ({order.shippingAddress?.city})</p>
                          <div className="max-h-40 overflow-y-auto space-y-1 mb-2 [&::-webkit-scrollbar]:hidden">
                              {vendors.length > 0 ? vendors.map((v: any) => (
                                  <div key={v._id} className="flex items-center space-x-2 p-2 hover:bg-zinc-50 rounded-lg cursor-pointer" onClick={() => toggleVendor(v._id)}>
                                      <Checkbox id={v._id} checked={selectedVendors.includes(v._id)} />
                                      <label htmlFor={v._id} className="text-xs font-bold cursor-pointer flex-1 truncate">{v.name}</label>
                                  </div>
                              )) : <p className="text-xs text-red-400 italic">No local partners found.</p>}
                          </div>
                          <Button onClick={handleBroadcast} disabled={loading || selectedVendors.length === 0} size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-8 text-xs">
                              <Send className="w-3 h-3 mr-2" /> Send Request
                          </Button>
                      </div>
                  )}
              </div>
          )}
        </DialogHeader>

        <div className="p-8 space-y-8">
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