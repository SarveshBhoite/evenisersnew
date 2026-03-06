"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import {
    X,
    Eye,
    EyeOff,
    Star,
    Sparkles,
    ShieldCheck,
    BadgePercent,
    Lock,
    CheckCircle2,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";
import MobileAuthForm from "./MobileAuthForm";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

interface ProductPreview {
    _id: string;
    name: string;
    image: string;
    price: number;
    discount?: number;
    category?: string;
    rating?: number;
    numReviews?: number;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductPreview;
    onAuthSuccess: (token: string) => void;
}

type AuthTab = "signin" | "signup" | "mobile";
type SignupStep = 1 | 2;

export default function AuthModal({ isOpen, onClose, product, onAuthSuccess }: AuthModalProps) {
    const { loginSilently } = useAuth();
    const [activeTab, setActiveTab] = useState<AuthTab>("signin");

    // ── Sign In state ──
    const [signInForm, setSignInForm] = useState({ email: "", password: "" });
    const [signInLoading, setSignInLoading] = useState(false);
    const [signInError, setSignInError] = useState("");
    const [showSignInPassword, setShowSignInPassword] = useState(false);

    // ── Sign Up state ──
    const [signUpStep, setSignUpStep] = useState<SignupStep>(1);
    const [signUpForm, setSignUpForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [otp, setOtp] = useState("");
    const [signUpLoading, setSignUpLoading] = useState(false);
    const [signUpError, setSignUpError] = useState("");
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);

    // Reset state whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab("signin");
            setSignInForm({ email: "", password: "" });
            setSignInError("");
            setSignUpForm({ name: "", email: "", password: "", confirmPassword: "" });
            setOtp("");
            setSignUpError("");
            setSignUpStep(1);
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!isOpen) return null;

    const discountPercent = product.discount || 0;
    const originalPrice = product.price || 0;
    const finalPrice =
        discountPercent > 0
            ? originalPrice - (originalPrice * discountPercent) / 100
            : originalPrice;

    const imageUrl = product.image
        ? product.image.startsWith("http")
            ? product.image
            : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
        : "/placeholder.svg";

    // ── Handle Sign In ──
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignInError("");
        setSignInLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/login`, signInForm, {
                headers: { "Content-Type": "application/json" },
            });
            const data = res.data;
            loginSilently(data.user, data.token);
            onAuthSuccess(data.token);
        } catch (err: any) {
            setSignInError(err?.response?.data?.message || "Invalid credentials");
        } finally {
            setSignInLoading(false);
        }
    };

    // ── Handle Sign Up Step 1 (Request OTP) ──
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignUpError("");
        if (signUpForm.password !== signUpForm.confirmPassword) {
            return setSignUpError("Passwords do not match");
        }
        setSignUpLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: signUpForm.name,
                    email: signUpForm.email,
                    password: signUpForm.password,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Signup failed");
            setSignUpStep(2);
        } catch (err: any) {
            setSignUpError(err.message);
        } finally {
            setSignUpLoading(false);
        }
    };

    // ── Handle OTP Verify + Auto Login ──
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignUpError("");
        setSignUpLoading(true);
        try {
            // Step 1: Verify OTP
            const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: signUpForm.email, otp }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || "Verification failed");

            // Step 2: Auto-login with the credentials just used to sign up
            const loginRes = await axios.post(
                `${API_URL}/auth/login`,
                { email: signUpForm.email, password: signUpForm.password },
                { headers: { "Content-Type": "application/json" } }
            );
            const loginData = loginRes.data;
            loginSilently(loginData.user, loginData.token);
            onAuthSuccess(loginData.token);
        } catch (err: any) {
            setSignUpError(err?.response?.data?.message || err.message || "Verification failed");
        } finally {
            setSignUpLoading(false);
        }
    };

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* ── Modal ── */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="pointer-events-auto w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-[2rem] shadow-2xl bg-white animate-in slide-in-from-bottom-8 fade-in duration-500 flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ────────────────────────────────────── */}
                    {/* LEFT PANEL — Product Preview           */}
                    {/* ────────────────────────────────────── */}
                    <div className="relative md:w-[45%] bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex flex-col overflow-hidden">
                        {/* Gold accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-yellow-300 to-[#D4AF37]" />

                        {/* Close button (visible on mobile only — desktop has close on right panel) */}
                        <button
                            onClick={onClose}
                            className="md:hidden absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        {/* Product Image */}
                        <div className="relative h-40 md:h-64 w-full flex-shrink-0 overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-zinc-900" />

                            {/* Category badge */}
                            {product.category && (
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-800 shadow-sm">
                                    {product.category}
                                </span>
                            )}

                            {/* Discount badge */}
                            {discountPercent > 0 && (
                                <span className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest animate-pulse">
                                    -{discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 p-5 md:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 mb-2 md:mb-3">
                                    <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-[#D4AF37]" />
                                    <span className="text-[#D4AF37] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                                        You're booking
                                    </span>
                                </div>

                                <h2 className="font-serif text-xl md:text-3xl font-semibold text-white leading-tight mb-3 md:mb-4 capitalize">
                                    {product.name}
                                </h2>

                                {/* Rating */}
                                {product.rating && (
                                    <div className="flex items-center gap-1 mb-4 md:mb-5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-2.5 md:w-3 h-2.5 md:h-3 ${i < Math.round(product.rating!)
                                                    ? "fill-[#D4AF37] text-[#D4AF37]"
                                                    : "fill-white/20 text-white/20"
                                                    }`}
                                            />
                                        ))}
                                        {product.numReviews && (
                                            <span className="text-white/50 text-[10px] md:text-xs ml-1">
                                                ({product.numReviews})
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Price */}
                                <div className="flex items-end gap-2 md:gap-3">
                                    <span className="text-2xl md:text-4xl font-serif text-white">
                                        ₹{finalPrice.toLocaleString("en-IN")}
                                    </span>
                                    {discountPercent > 0 && (
                                        <span className="text-white/40 text-base md:text-lg line-through font-serif mb-0.5">
                                            ₹{originalPrice.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-wider mt-1 font-medium">
                                    Inclusive of all taxes & setup charges
                                </p>
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-wrap gap-2 md:gap-3 mt-5 md:mt-6">
                                {[
                                    { icon: ShieldCheck, text: "100% Safe" },
                                    { icon: BadgePercent, text: "Best Price" },
                                    { icon: CheckCircle2, text: "Verified" },
                                ].map((b, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-1 bg-white/10 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full"
                                    >
                                        <b.icon className="w-2.5 md:w-3 h-2.5 md:h-3 text-[#D4AF37]" />
                                        <span className="text-white/70 text-[8px] md:text-[10px] font-bold uppercase tracking-wide">
                                            {b.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ────────────────────────────────────── */}
                    {/* RIGHT PANEL — Auth Forms               */}
                    {/* ────────────────────────────────────── */}
                    <div className="md:w-[55%] flex flex-col overflow-y-auto min-h-0">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 md:px-8 pt-6 md:pt-8 pb-3 md:pb-4 border-b border-stone-100">
                            <div>
                                <div className="flex items-center gap-1.5 mb-0.5 md:mb-1">
                                    <Lock className="w-3 md:w-4 h-3 md:h-4 text-[#D4AF37]" />
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                                        Secure Booking
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl md:text-2xl font-bold text-zinc-900 leading-tight">
                                    {activeTab === "signin" ? "Welcome Back" : "Create Account"}
                                </h3>
                                <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
                                    {activeTab === "signin"
                                        ? "Sign in to complete your booking"
                                        : "Sign up to book this experience"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 md:w-9 h-8 md:h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <X className="w-4 h-4 text-zinc-600" />
                            </button>
                        </div>

                        {/* Tab Toggle */}
                        <div className="px-5 md:px-8 pt-4 md:pt-5">
                            <div className="flex bg-stone-100 p-1 rounded-full">
                                <button
                                    onClick={() => { setActiveTab("signin"); setSignInError(""); }}
                                    className={`flex-1 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "signin"
                                        ? "bg-black text-white shadow-md"
                                        : "text-zinc-400 hover:text-zinc-700"
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => { setActiveTab("signup"); setSignUpError(""); setSignUpStep(1); }}
                                    className={`flex-1 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "signup"
                                        ? "bg-black text-white shadow-md"
                                        : "text-zinc-400 hover:text-zinc-700"
                                        }`}
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => { setActiveTab("mobile"); }}
                                    className={`flex-1 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === "mobile"
                                        ? "bg-black text-white shadow-md"
                                        : "text-zinc-400 hover:text-zinc-700"
                                        }`}
                                >
                                    Mobile
                                </button>
                            </div>
                        </div>

                        {/* Forms */}
                        <div className="px-5 md:px-8 py-5 md:py-6 flex-1">

                            {/* ── SIGN IN FORM ── */}
                            {activeTab === "signin" && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="mb-2">
                                        <GoogleAuthButton isSilent={true} onSuccess={onAuthSuccess} />
                                        <div className="relative mt-5 mb-1">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-stone-200" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px] md:text-xs min-h-[0px]">
                                                <span className="bg-white px-2 text-zinc-400 font-semibold uppercase tracking-widest">or continue with email</span>
                                            </div>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSignIn} className="space-y-5">
                                        <div>
                                            <Label htmlFor="modal-signin-email" className="text-xs font-semibold text-zinc-700">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="modal-signin-email"
                                                type="email"
                                                required
                                                placeholder="you@example.com"
                                                className="mt-1.5 h-11 md:h-12 rounded-xl border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                                value={signInForm.email}
                                                onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="modal-signin-password" className="text-xs font-semibold text-zinc-700">
                                                    Password
                                                </Label>
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-[10px] md:text-xs text-zinc-400 hover:text-black transition-colors"
                                                    onClick={onClose}
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="modal-signin-password"
                                                    type={showSignInPassword ? "text" : "password"}
                                                    required
                                                    placeholder="••••••••"
                                                    className="h-11 md:h-12 rounded-xl border-stone-200 pr-10 [&::-ms-reveal]:hidden"
                                                    value={signInForm.password}
                                                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                                                >
                                                    {showSignInPassword ? <EyeOff className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {signInError && (
                                            <p className="text-xs text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{signInError}</p>
                                        )}

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={signInLoading}
                                            className="w-full h-11 md:h-13 rounded-full bg-black text-white hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold text-xs md:text-sm shadow-lg shadow-black/20"
                                        >
                                            {signInLoading ? "Signing In..." : "Sign In & Book Event"}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* ── SIGN UP FORM ── */}
                            {activeTab === "signup" && signUpStep === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
                                    <div className="mb-2">
                                        <GoogleAuthButton isSilent={true} onSuccess={onAuthSuccess} />
                                        <div className="relative mt-5 mb-1">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-stone-200" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px] md:text-xs min-h-[0px]">
                                                <span className="bg-white px-2 text-zinc-400 font-semibold uppercase tracking-widest">or sign up with email</span>
                                            </div>
                                        </div>
                                    </div>
                                    <form onSubmit={handleSignUp} className="space-y-3.5 md:space-y-4">
                                        <div>
                                            <Label htmlFor="modal-signup-name" className="text-xs font-semibold text-zinc-700">Full Name</Label>
                                            <Input
                                                id="modal-signup-name"
                                                required
                                                placeholder="Your full name"
                                                className="mt-1.5 h-11 md:h-12 rounded-xl border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                                value={signUpForm.name}
                                                onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="modal-signup-email" className="text-xs font-semibold text-zinc-700">Email</Label>
                                            <Input
                                                id="modal-signup-email"
                                                type="email"
                                                required
                                                placeholder="you@example.com"
                                                className="mt-1.5 h-11 md:h-12 rounded-xl border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                                value={signUpForm.email}
                                                onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="modal-signup-password" className="text-xs font-semibold text-zinc-700">Password</Label>
                                            <div className="relative mt-1.5">
                                                <Input
                                                    id="modal-signup-password"
                                                    type={showSignUpPassword ? "text" : "password"}
                                                    required
                                                    placeholder="Create a password"
                                                    className="h-11 md:h-12 rounded-xl border-stone-200 pr-10 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                                    value={signUpForm.password}
                                                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                                                >
                                                    {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="modal-signup-confirm" className="text-xs font-semibold text-zinc-700">Confirm Password</Label>
                                            <Input
                                                id="modal-signup-confirm"
                                                type="password"
                                                required
                                                placeholder="Repeat your password"
                                                className="mt-1.5 h-11 md:h-12 rounded-xl border-stone-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                                value={signUpForm.confirmPassword}
                                                onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                                            />
                                        </div>

                                        {signUpError && (
                                            <p className="text-xs text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{signUpError}</p>
                                        )}

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={signUpLoading}
                                            className="w-full h-11 md:h-13 rounded-full bg-black text-white hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold text-xs md:text-sm shadow-lg shadow-black/20"
                                        >
                                            {signUpLoading ? "Sending OTP..." : "Create Account & Book"}
                                        </Button>
                                    </form>
                                </div>
                            )}
                            {/* ── OTP VERIFICATION STEP ── */}
                            {activeTab === "signup" && signUpStep === 2 && (
                                <form
                                    onSubmit={handleVerifyOtp}
                                    className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                >
                                    <div className="text-center">
                                        <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                            <ShieldCheck className="w-6 md:w-8 h-6 md:h-8 text-[#D4AF37]" />
                                        </div>
                                        <h4 className="font-serif text-lg md:text-xl font-bold text-zinc-900 mb-1">Verify Your Email</h4>
                                        <p className="text-xs md:text-sm text-zinc-500">
                                            We sent a code to <br className="md:hidden" />
                                            <span className="font-semibold text-zinc-800">{signUpForm.email}</span>
                                        </p>
                                    </div>

                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                        <InputOTPGroup className="gap-1 md:gap-2">
                                            <InputOTPSlot index={0} className="w-8 md:w-10 h-10 md:h-12 rounded-lg" />
                                            <InputOTPSlot index={1} className="w-8 md:w-10 h-10 md:h-12 rounded-lg" />
                                            <InputOTPSlot index={2} className="w-8 md:w-10 h-10 md:h-12 rounded-lg" />
                                            <InputOTPSlot index={3} className="w-8 md:w-10 h-10 md:h-12 rounded-lg" />
                                            <InputOTPSlot index={4} className="w-8 md:w-10 h-10 md:h-12 rounded-lg" />
                                            <InputOTPSlot index={5} className="w-8 md:w-10 h-10 md:h-12 rounded-lg" />
                                        </InputOTPGroup>
                                    </InputOTP>

                                    {signUpError && (
                                        <p className="text-xs text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl w-full">{signUpError}</p>
                                    )}

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={signUpLoading || otp.length < 6}
                                        className="w-full h-11 md:h-13 rounded-full bg-black text-white hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold shadow-lg"
                                    >
                                        {signUpLoading ? "Verifying & Logging In..." : "Verify & Book Event"}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => setSignUpStep(1)}
                                        className="text-sm text-zinc-400 hover:text-zinc-700 hover:underline transition-colors"
                                    >
                                        ← Use a different email
                                    </button>
                                </form>
                            )}

                            {/* ── MOBILE AUTH FORM ── */}
                            {activeTab === "mobile" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
                                    <MobileAuthForm isSilent={true} onSuccess={onAuthSuccess} />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-6 pt-2 border-t border-stone-100 text-center">
                            <p className="text-xs text-zinc-400">
                                By continuing you agree to our{" "}
                                <Link href="/terms" className="underline hover:text-zinc-700" onClick={onClose}>
                                    Terms
                                </Link>{" "}
                                &{" "}
                                <Link href="/privacy" className="underline hover:text-zinc-700" onClick={onClose}>
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
