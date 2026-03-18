"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { Eye, EyeOff, Mail, KeyRound, Smartphone, Sparkles, ShieldCheck, ArrowRight, Star } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import MobileAuthForm from "@/components/MobileAuthForm";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function LoginPage() {
  // ALL STATE - UNCHANGED
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const router = useRouter();

  // ALL HANDLERS - UNCHANGED
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, form, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;
      login(data.user, data.token);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND
      ═══════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════
          MAIN LAYOUT - Split Design
      ═══════════════════════════════════════════════════════ */}
      <div className="pt-28 md:pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden">

            {/* ═══════════════════════════════════════════════════
                LEFT PANEL - Brand / Visual
            ═══════════════════════════════════════════════════ */}
            <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12 flex flex-col justify-between overflow-hidden hidden md:flex">
              {/* Gold accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]" />

              {/* Background decorations */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full bg-[#B8860B]/10 blur-3xl" />
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
                  backgroundSize: "32px 32px"
                }} />
              </div>

              {/* Content */}
              <div className="relative">
                {/* Logo */}
                <Image
                  src="/logobg.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain mb-12 brightness-200"
                />

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">
                    Welcome Back
                  </span>
                </div>

                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                  Sign in to
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
                    Your Account
                  </span>
                </h2>

                <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                  Access your bookings, manage events, and create unforgettable celebrations.
                </p>
              </div>

              {/* Bottom Stats */}
              <div className="relative">
                <div className="flex items-center gap-6 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">50K+</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Events</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">4.9</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" /> Rating
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">16</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Cities</p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-3 mt-6">
                  {[
                    { icon: ShieldCheck, text: "Secure" },
                    { icon: Sparkles, text: "Verified" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <b.icon className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                RIGHT PANEL - Auth Form
            ═══════════════════════════════════════════════════ */}
            <div className="p-6 md:p-10 lg:p-12 bg-gradient-to-b from-white to-[#FDFCF8]">

              {/* Mobile Header (hidden on desktop since left panel shows it) */}
              <div className="md:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#B8860B] text-xs font-bold uppercase tracking-[0.2em]">Secure Login</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-zinc-900">Welcome Back</h1>
                <p className="text-zinc-500 text-sm mt-1">Sign in to your account</p>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block mb-8">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-zinc-900 mb-1">Sign In</h1>
                <p className="text-zinc-500 text-sm">Enter your credentials to continue</p>
              </div>

              {/* ✅ GOOGLE BUTTON - ORIGINAL COMPONENT, NOT WRAPPED */}
              <div className="mb-6">
                <GoogleAuthButton isSilent={false} />
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gradient-to-b from-white to-[#FDFCF8] px-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Method Toggle */}
              <div className="flex bg-zinc-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === "email"
                      ? "bg-white shadow-sm text-zinc-900"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </button>
                <button
                  onClick={() => setLoginMethod("mobile")}
                  className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === "mobile"
                      ? "bg-white shadow-sm text-zinc-900"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
              </div>

              {/* ═══ EMAIL FORM ═══ */}
              {loginMethod === "email" ? (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                        onChange={handleChange}
                        value={form.email}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] text-[#B8860B] hover:text-[#D4AF37] font-semibold transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none pr-12 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm [&::-ms-reveal]:hidden"
                        onChange={handleChange}
                        value={form.password}
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

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 py-3 px-4 border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full h-14 bg-zinc-900 hover:bg-[#D4AF37] text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                /* ═══ MOBILE FORM - UNCHANGED ═══ */
                <MobileAuthForm isSilent={false} />
              )}

              {/* Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                <span className="text-zinc-500 text-sm">
                  Don't have an account?
                </span>{" "}
                <Link
                  href="/signup"
                  className="text-[#B8860B] hover:text-[#D4AF37] font-bold text-sm transition-colors"
                >
                  Create Account
                </Link>
              </div>

              {/* Terms */}
              <p className="text-center text-[10px] text-zinc-400 mt-4">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[#B8860B] hover:underline">Terms</Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-[#B8860B] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}