"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

export default function ChangePasswordPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error("New passwords do not match");
    
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/password`, {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success("Password Changed Successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#FDFCFB]">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <h1 className="font-serif text-3xl font-bold mb-2">Change Password</h1>
        <p className="text-zinc-500 mb-8">Secure your account with a strong password.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">Current Password</label>
                <Input type="password" required value={form.oldPassword} onChange={e => setForm({...form, oldPassword: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">New Password</label>
                <Input type="password" required value={form.newPassword} onChange={e => setForm({...form, newPassword: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-500">Confirm New Password</label>
                <Input type="password" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="h-12 rounded-xl" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold mt-2">
                {loading ? "Updating..." : "Update Password"}
            </Button>
        </form>
      </div>
    </div>
  );
}