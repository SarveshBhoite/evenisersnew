"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, KeyRound, ShieldCheck, Sparkles, ArrowRight, Lock, CheckCircle2, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  // ALL STATE - UNCHANGED
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // HANDLER - UNCHANGED
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");

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
    <div className="min-h-screen relative">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(212,175,55,0.06) 100%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="pt-28 md:pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden">

            {/* ═══ LEFT PANEL ═══ */}
            <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12 flex-col justify-between overflow-hidden hidden md:flex">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]" />

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full bg-[#B8860B]/10 blur-3xl" />
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
                  backgroundSize: "32px 32px"
                }} />
              </div>

              <div className="relative">
                <Image
                  src="/logobg.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain mb-12 brightness-200"
                />

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">
                    Secure Reset
                  </span>
                </div>

                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                  Create Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
                    New Password
                  </span>
                </h2>

                <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                  Choose a strong password to keep your account secure.
                </p>

                {/* Tips */}
                <div className="mt-8 space-y-3">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Password Tips</p>
                  {[
                    "At least 8 characters long",
                    "Include uppercase & lowercase",
                    "Add numbers or special characters",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="text-white/50 text-xs">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 mt-8">
                  {[
                    { icon: ShieldCheck, text: "Encrypted" },
                    { icon: Lock, text: "Secure" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <b.icon className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ RIGHT PANEL ═══ */}
            <div className="p-6 md:p-10 lg:p-12 bg-gradient-to-b from-white to-[#FDFCF8] flex flex-col justify-center">

              {/* Mobile Header */}
              <div className="md:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#B8860B] text-xs font-bold uppercase tracking-[0.2em]">Secure Reset</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-zinc-900">New Password</h1>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block mb-8">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-zinc-900 mb-1">Reset Password</h1>
                <p className="text-zinc-500 text-sm">Enter your new password below</p>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto md:mx-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/5 flex items-center justify-center border border-[#D4AF37]/20 mb-6">
                <KeyRound className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="pass" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                    New Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="pass"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create a strong password"
                      className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none pr-12 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm [&::-ms-reveal]:hidden"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="conf" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Confirm Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="conf"
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="Repeat your password"
                      className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none pr-12 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm [&::-ms-reveal]:hidden"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>

                  {/* Password match indicator */}
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs flex items-center gap-1 mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                      {password === confirmPassword ? (
                        <><CheckCircle2 className="w-3 h-3" /> Passwords match</>
                      ) : (
                        <><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Passwords don't match</>
                      )}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-14 bg-zinc-900 hover:bg-[#D4AF37] text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Reset Password
                    </span>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                <span className="text-zinc-500 text-sm">Remember your password?</span>{" "}
                <Link href="/login" className="text-[#B8860B] hover:text-[#D4AF37] font-bold text-sm transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}