"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password !== confirmPassword) return toast.error("Passwords do not match");
    
    setLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password/${token}`, { password });
      toast.success("Password Reset Successfully!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-100">
          <h1 className="font-serif text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-zinc-500 mb-8 text-sm">Enter a new strong password for your account.</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <Label htmlFor="pass">New Password</Label>
                <Input id="pass" type="password" required className="mt-2 h-12" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="conf">Confirm Password</Label>
                <Input id="conf" type="password" required className="mt-2 h-12" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-xl font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}