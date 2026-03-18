"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { Eye, EyeOff, Mail, KeyRound, User, Smartphone, Sparkles, ShieldCheck, ArrowRight, Star, CheckCircle2, ArrowLeft } from "lucide-react";
import MobileAuthForm from "@/components/MobileAuthForm";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function SignupPage() {
  // ALL STATE - UNCHANGED
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");

  // ALL HANDLERS - UNCHANGED
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast({ title: "OTP Sent", description: "Check your email for the code." });
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      toast({ title: "Success", description: "Account verified! Logging you in..." });

      try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(loginRes.data.user, loginRes.data.token);
      } catch (loginErr: any) {
        console.error("Auto-login failed:", loginErr);
        toast({ title: "Login Required", description: "Account verified, please login manually." });
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* ═══ BACKGROUND ═══ */}
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

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="pt-28 md:pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden">

            {/* ═══ LEFT PANEL - Brand ═══ */}
            <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12 flex-col justify-between overflow-hidden hidden md:flex">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]" />

              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
                <div className="absolute bottom-1/3 -left-20 w-48 h-48 rounded-full bg-[#B8860B]/10 blur-3xl" />
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
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">
                    {step === 1 ? "Get Started" : "Almost There"}
                  </span>
                </div>

                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                  {step === 1 ? (
                    <>
                      Create Your
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
                        Account
                      </span>
                    </>
                  ) : (
                    <>
                      Verify Your
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
                        Email
                      </span>
                    </>
                  )}
                </h2>

                <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                  {step === 1
                    ? "Join thousands of families who trust us to create magical celebrations."
                    : "We've sent a 6-digit verification code to your email address."
                  }
                </p>
              </div>

              {/* Steps Indicator */}
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${step === 1 ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30' : 'bg-white/5'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#D4AF37] text-white' : 'bg-white/10 text-white/40'}`}>
                      {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${step === 1 ? 'text-[#D4AF37]' : 'text-white/40'}`}>Details</span>
                  </div>
                  
                  <div className="w-8 h-px bg-white/20" />
                  
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${step === 2 ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30' : 'bg-white/5'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#D4AF37] text-white' : 'bg-white/10 text-white/40'}`}>2</div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? 'text-[#D4AF37]' : 'text-white/40'}`}>Verify</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-6 border-t border-white/10">
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
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">100%</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Secure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT PANEL - Form ═══ */}
            <div className="p-6 md:p-10 lg:p-12 bg-gradient-to-b from-white to-[#FDFCF8]">

              {/* Mobile Header */}
              <div className="md:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#B8860B] text-xs font-bold uppercase tracking-[0.2em]">
                    {step === 1 ? "Get Started" : "Verify Email"}
                  </span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-zinc-900">
                  {step === 1 ? "Create Account" : "Enter Code"}
                </h1>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block mb-8">
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-zinc-900 mb-1">
                  {step === 1 ? "Create Account" : "Verify Email"}
                </h1>
                <p className="text-zinc-500 text-sm">
                  {step === 1 ? "Fill in your details to get started" : "Enter the code we sent you"}
                </p>
              </div>

              {/* ═══ STEP 1: Registration ═══ */}
              {step === 1 && (
                <div className="space-y-5">
                  
                  {/* ✅ GOOGLE BUTTON - ORIGINAL, UNTOUCHED */}
                  <GoogleAuthButton isSilent={false} />

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
                  <div className="flex bg-zinc-100 p-1 rounded-lg mb-2">
                    <button
                      onClick={() => setLoginMethod("email")}
                      className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        loginMethod === "email" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                    <button
                      onClick={() => setLoginMethod("mobile")}
                      className={`flex-1 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        loginMethod === "mobile" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </button>
                  </div>

                  {loginMethod === "email" ? (
                    <form className="space-y-4" onSubmit={handleSignup}>
                      {/* Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Full Name
                        </Label>
                        <div className="relative group">
                          <Input
                            id="name"
                            required
                            placeholder="Your full name"
                            className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                            value={formData.name}
                            onChange={handleChange}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> Email Address
                        </Label>
                        <div className="relative group">
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" /> Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Create a password"
                            className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none pr-12 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm [&::-ms-reveal]:hidden"
                            value={formData.password}
                            onChange={handleChange}
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
                        <Label htmlFor="confirmPassword" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Confirm Password
                        </Label>
                        <div className="relative group">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            placeholder="Repeat password"
                            className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none pr-12 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm [&::-ms-reveal]:hidden"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

                      {/* Submit */}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full h-14 bg-zinc-900 hover:bg-[#D4AF37] text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending OTP...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>
                    </form>
                  ) : (
                    /* ✅ MOBILE FORM - ORIGINAL, UNTOUCHED */
                    <MobileAuthForm isSilent={false} />
                  )}
                </div>
              )}

              {/* ═══ STEP 2: OTP Verification ═══ */}
              {step === 2 && (
                <form className="space-y-6 flex flex-col items-center" onSubmit={handleVerify}>
                  {/* Icon */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 flex items-center justify-center border border-[#D4AF37]/20">
                    <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-lg font-bold text-zinc-900 mb-1">Check Your Email</h3>
                    <p className="text-sm text-zinc-500">
                      We sent a 6-digit code to
                    </p>
                    <p className="text-sm font-bold text-zinc-900 mt-1">{formData.email}</p>
                  </div>

                  {/* OTP Input */}
                  <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot 
                          key={index}
                          index={index} 
                          className="w-11 h-13 rounded-lg border-2 border-zinc-200 text-lg font-bold focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all" 
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 py-3 px-4 border border-red-100 w-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || otp.length < 6}
                    className="w-full h-14 bg-zinc-900 hover:bg-[#D4AF37] text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Verify & Login
                      </span>
                    )}
                  </Button>

                  {/* Back Link */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-500 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Change Email
                  </button>
                </form>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                <span className="text-zinc-500 text-sm">Already have an account?</span>{" "}
                <Link href="/login" className="text-[#B8860B] hover:text-[#D4AF37] font-bold text-sm transition-colors">
                  Sign In
                </Link>
              </div>

              <p className="text-center text-[10px] text-zinc-400 mt-4">
                By creating an account, you agree to our{" "}
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