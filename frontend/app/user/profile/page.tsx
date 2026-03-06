"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function ProfilePage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false); // 🚨 New state to track if email should be read-only
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "India"
  });

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      setFormData(prev => ({ ...prev, ...data }));

      // 🚨 Lock the email field ONLY if it's already set in the database
      if (data.email && data.email.includes('@')) {
        setEmailLocked(true);
      }
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile Updated Successfully!");

      // 🚨 Lock the email field after it's successfully saved for the first time
      if (formData.email && formData.email.includes('@')) {
        setEmailLocked(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-32 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="font-serif text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-zinc-500 mb-8">Manage your personal information and address.</p>

        <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Full Name</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">
                Email {emailLocked ? "(Read Only)" : "(Required for Orders)"}
              </label>
              <Input
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={emailLocked} // 🚨 Use the new state
                className={`h-12 rounded-xl ${emailLocked ? 'bg-zinc-50' : 'bg-white border-[#D4AF37]/30'}`}
                placeholder="yourname@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Phone Number</label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 99999 99999" className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">City</label>
              <Input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="h-12 rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500">Address</label>
            <Input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Flat, Floor, Building Name" className="h-12 rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">State</label>
              <Input value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Zip Code</label>
              <Input value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500">Country</label>
              <Input value={formData.country} disabled className="h-12 rounded-xl bg-zinc-50" />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="w-full h-12 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}