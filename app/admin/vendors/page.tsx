"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Phone, Mail, Trash2, ArrowLeft, Truck, Award, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { CITIES } from "@/context/LocationContext";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", city: "", address: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => { if (token) fetchVendors(); }, [token]);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_URL}/vendors`, { headers: { Authorization: `Bearer ${token}` } });
      setVendors(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/vendors`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Vendor Added");
      setFormData({ name: "", email: "", phone: "", city: "", address: "" });
      setIsDialogOpen(false);
      fetchVendors();
    } catch (err: any) { toast.error("Failed to add"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this vendor?")) return;
    try {
        await axios.delete(`${API_URL}/vendors/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("Vendor removed");
        fetchVendors();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-xs tracking-widest" href={"/admin/dashboard"}>
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-zinc-900">Manage Vendors</h1>
            <p className="text-zinc-500 mt-2">Connect local partners for city-specific events.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white rounded-full px-6 h-12 shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> Register Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl p-8">
              <DialogHeader><DialogTitle className="font-serif text-2xl mb-4">Add New Vendor</DialogTitle></DialogHeader>
              <form onSubmit={handleAddVendor} className="space-y-4">
                <Input required placeholder="Vendor Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                <div className="grid grid-cols-2 gap-4">
                    <Input required placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                    <Input required placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                </div>
                <select className="w-full rounded-xl h-12 bg-zinc-50 border-0 px-3 text-sm font-medium outline-none" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required>
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Input placeholder="Full Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                <Button type="submit" className="w-full h-12 rounded-xl bg-black text-white font-bold mt-2">Register Partner</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <p>Loading...</p> : vendors.length === 0 ? <p className="text-zinc-400">No vendors yet.</p> : (
                vendors.map((vendor) => (
                    <div key={vendor._id} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-zinc-50 rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                                <Truck className="w-6 h-6" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(vendor._id)} className="text-zinc-300 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-1">{vendor.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-blue-600 font-bold bg-blue-50 w-fit px-2 py-0.5 rounded uppercase tracking-wide mb-4">
                            <MapPin className="w-3 h-3" /> {vendor.city}
                        </div>
                        <div className="space-y-2 text-sm text-zinc-500 border-b border-zinc-50 pb-4 mb-4">
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {vendor.email}</p>
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {vendor.phone}</p>
                        </div>
                        
                        {/* 🚨 CLICKABLE HISTORY SECTION */}
                        <VendorHistoryModal vendor={vendor} token={token} />
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// NEW: VENDOR HISTORY MODAL COMPONENT
// --------------------------------------------------------
function VendorHistoryModal({ vendor, token }: { vendor: any, token: any }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders when modal opens
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/orders?vendorId=${vendor._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div onClick={fetchHistory} className="flex items-center gap-2 text-sm font-bold text-zinc-700 cursor-pointer hover:text-black transition-colors group/link">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>{vendor.history?.completed || 0} Successful Events</span>
                    <span className="text-[10px] uppercase text-zinc-400 font-normal group-hover/link:underline">(View History)</span>
                </div>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-[2rem] p-0 gap-0">
                <DialogHeader className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                    <DialogTitle className="font-serif text-2xl font-bold flex flex-col">
                        <span>{vendor.name}</span>
                        <span className="text-sm font-sans font-normal text-zinc-400 mt-1">Event History Log</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {loading ? (
                        <p className="text-center text-zinc-400 py-10">Loading history...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-center text-zinc-400 py-10">No events found for this vendor yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="border border-zinc-100 rounded-xl p-4 flex justify-between items-center hover:bg-zinc-50 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-zinc-900">
                                            {order.items[0]?.product?.name || "Deleted Product"}
                                        </p>
                                        <div className="flex gap-3 mt-1 text-xs text-zinc-500 font-medium uppercase tracking-wide">
                                            <span>ID: #{order._id.slice(-6).toUpperCase()}</span>
                                            <span>•</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="font-bold text-zinc-900">₹{order.totalAmount?.toLocaleString()}</p>
                                        <Badge className={`mt-1 ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                        } border-0 uppercase text-[10px]`}>
                                            {order.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}