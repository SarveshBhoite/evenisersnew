"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MapPin, Phone, Mail, Trash2, ArrowLeft, Truck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { CITIES } from "@/context/LocationContext"; // Use existing cities list

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (token) fetchVendors();
  }, [token]);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_URL}/vendors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/vendors`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Vendor Added Successfully");
      setFormData({ name: "", email: "", phone: "", city: "", address: "" });
      setIsDialogOpen(false);
      fetchVendors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add vendor");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
        await axios.delete(`${API_URL}/vendors/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vendor removed");
        fetchVendors();
    } catch (err) {
        toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <Link
            className="flex items-center gap-2 mt-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-xs tracking-widest" 
            href={"/admin/dashboard"}        
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-zinc-900">Manage Vendors</h1>
            <p className="text-zinc-500 mt-2">Connect local partners for city-specific events.</p>
          </div>
          
          {/* ADD VENDOR MODAL */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white rounded-full px-6 h-12 shadow-lg hover:scale-105 transition-all">
                <Plus className="w-4 h-4 mr-2" /> Register Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl p-8">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl mb-4">Add New Vendor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddVendor} className="space-y-4">
                <Input required placeholder="Vendor Name (e.g. Dream Decorators)" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                <div className="grid grid-cols-2 gap-4">
                    <Input required placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                    <Input required placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                </div>
                
                {/* City Select (Or Input) */}
                <select 
                    className="w-full rounded-xl h-12 bg-zinc-50 border-0 px-3 text-sm font-medium outline-none"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    required
                >
                    <option value="">Select Operational City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <Input placeholder="Full Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="rounded-xl h-12 bg-zinc-50 border-0" />
                
                <Button type="submit" className="w-full h-12 rounded-xl bg-black text-white font-bold mt-2">
                    Register Partner
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                <p>Loading partners...</p>
            ) : vendors.length === 0 ? (
                <p className="text-zinc-400">No vendors registered yet.</p>
            ) : (
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

                        <div className="space-y-2 text-sm text-zinc-500">
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {vendor.email}</p>
                            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {vendor.phone}</p>
                        </div>
                    </div>
                ))
            )}
        </div>

      </div>
    </div>
  );
}