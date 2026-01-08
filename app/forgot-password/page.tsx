"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, { email });
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-zinc-100">
          <Link href="/login" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-black mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
          
          <h1 className="font-serif text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-zinc-500 mb-8 text-sm">Enter your email and we'll send you a link to reset your password.</p>

          {sent ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
                <p className="font-bold">Check your inbox!</p>
                <p className="text-sm mt-1">We have sent a reset link to <strong>{email}</strong>.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required className="mt-2 h-12" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl font-bold" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
                </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}