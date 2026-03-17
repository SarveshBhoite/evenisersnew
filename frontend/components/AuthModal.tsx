"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
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
    Mail,
    User,
    KeyRound,
    Smartphone,
    ArrowRight,
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

// ═══════════════════════════════════════════════════════════
// CUSTOM THEMED INPUT COMPONENT
// ═══════════════════════════════════════════════════════════
interface ThemedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
    rightElement?: React.ReactNode;
}

const ThemedInput = ({ icon, label, error, rightElement, className, ...props }: ThemedInputProps) => (
    <div className="space-y-1.5">
        {label && (
            <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                {icon && <span className="text-[#D4AF37]">{icon}</span>}
                {label}
            </label>
        )}
        <div className="relative group">
            <input
                {...props}
                className={`
                    w-full h-12 md:h-13 px-4 
                    bg-zinc-50 border-2 border-zinc-200 
                    text-zinc-900 text-sm placeholder:text-zinc-400
                    transition-all duration-300
                    focus:outline-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10
                    hover:border-zinc-300 hover:bg-zinc-100/50
                    ${rightElement ? 'pr-12' : ''}
                    ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
                    ${className}
                `}
            />
            {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {rightElement}
                </div>
            )}
            {/* Bottom accent line on focus */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

// ═══════════════════════════════════════════════════════════
// CUSTOM THEMED BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════
interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'google';
    loading?: boolean;
    icon?: React.ReactNode;
}

const ThemedButton = ({ 
    variant = 'primary', 
    loading, 
    icon, 
    children, 
    className,
    disabled,
    ...props 
}: ThemedButtonProps) => {
    const baseStyles = "w-full h-13 md:h-14 font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-zinc-900 text-white hover:bg-[#D4AF37] shadow-lg shadow-zinc-900/20 hover:shadow-[#D4AF37]/30",
        secondary: "bg-white border-2 border-zinc-200 text-zinc-700 hover:border-[#D4AF37] hover:text-[#D4AF37]",
        google: "bg-white border-2 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 shadow-sm hover:shadow-md",
    };

    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Please wait...</span>
                </div>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};

// ═══════════════════════════════════════════════════════════
// AUTH MODAL
// ═══════════════════════════════════════════════════════════

export default function AuthModal({ isOpen, onClose, product, onAuthSuccess }: AuthModalProps) {
    const { loginSilently } = useAuth();
    const [activeTab, setActiveTab] = useState<AuthTab>("signin");

    // Sign In state
    const [signInForm, setSignInForm] = useState({ email: "", password: "" });
    const [signInLoading, setSignInLoading] = useState(false);
    const [signInError, setSignInError] = useState("");
    const [showSignInPassword, setShowSignInPassword] = useState(false);

    // Sign Up state
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

    // Handle Sign In
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

    // Handle Sign Up Step 1 (Request OTP)
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

    // Handle OTP Verify + Auto Login
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setSignUpError("");
        setSignUpLoading(true);
        try {
            const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: signUpForm.email, otp }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || "Verification failed");

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

    // Handle Google Success (wrapper)
    const handleGoogleSuccess = (token: string) => {
        onAuthSuccess(token);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="pointer-events-auto w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-white animate-in slide-in-from-bottom-8 fade-in duration-500 flex flex-col md:flex-row"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ════════════════════════════════════════════════════════
                        LEFT PANEL — Product Preview
                    ════════════════════════════════════════════════════════ */}
                    <div className="relative md:w-[45%] bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex flex-col overflow-hidden">
                        {/* Gold accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]" />

                        {/* Close button mobile */}
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

                            {product.category && (
                                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-800 shadow-sm">
                                    {product.category}
                                </span>
                            )}

                            {discountPercent > 0 && (
                                <span className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-3 py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    -{discountPercent}% OFF
                                </span>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 p-5 md:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 mb-2 md:mb-3">
                                    <Sparkles className="w-3 md:w-4 h-3 md:h-4 text-[#D4AF37]" />
                                    <span className="text-[#D4AF37] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                                        You're booking
                                    </span>
                                </div>

                                <h2 className="font-serif text-xl md:text-3xl font-semibold text-white leading-tight mb-3 md:mb-4 capitalize">
                                    {product.name}
                                </h2>

                                {product.rating && (
                                    <div className="flex items-center gap-1 mb-4 md:mb-5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 md:w-3.5 h-3 md:h-3.5 ${
                                                    i < Math.round(product.rating!)
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

                                <div className="flex items-end gap-2 md:gap-3">
                                    <span className="text-2xl md:text-4xl font-serif font-bold text-white">
                                        ₹{finalPrice.toLocaleString("en-IN")}
                                    </span>
                                    {discountPercent > 0 && (
                                        <span className="text-white/40 text-base md:text-lg line-through font-serif mb-0.5">
                                            ₹{originalPrice.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-wider mt-1.5 font-medium">
                                    Inclusive of all taxes & setup
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
                                        className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/5"
                                    >
                                        <b.icon className="w-3 md:w-3.5 h-3 md:h-3.5 text-[#D4AF37]" />
                                        <span className="text-white/70 text-[8px] md:text-[10px] font-bold uppercase tracking-wide">
                                            {b.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════
                        RIGHT PANEL — Auth Forms
                    ════════════════════════════════════════════════════════ */}
                    <div className="md:w-[55%] flex flex-col overflow-y-auto min-h-0 bg-gradient-to-b from-white to-[#FDFCF8]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 md:px-8 pt-6 md:pt-8 pb-4 border-b border-zinc-100">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                        <Lock className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#B8860B]">
                                        Secure Booking
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl md:text-2xl font-bold text-zinc-900 leading-tight">
                                    {activeTab === "signin" ? "Welcome Back" : activeTab === "signup" ? "Create Account" : "Mobile Login"}
                                </h3>
                                <p className="text-zinc-400 text-xs md:text-sm mt-0.5">
                                    {activeTab === "signin"
                                        ? "Sign in to complete your booking"
                                        : activeTab === "signup"
                                        ? "Sign up to book this experience"
                                        : "Quick login with your phone number"}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors flex-shrink-0 group"
                            >
                                <X className="w-4 h-4 text-zinc-500 group-hover:text-zinc-700" />
                            </button>
                        </div>

                        {/* Tab Toggle */}
                        <div className="px-5 md:px-8 pt-5">
                            <div className="flex bg-zinc-100 p-1 rounded-lg">
                                {[
                                    { id: "signin", label: "Sign In", icon: <Mail className="w-3.5 h-3.5" /> },
                                    { id: "signup", label: "Sign Up", icon: <User className="w-3.5 h-3.5" /> },
                                    { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id as AuthTab);
                                            setSignInError("");
                                            setSignUpError("");
                                            setSignUpStep(1);
                                        }}
                                        className={`flex-1 py-2.5 md:py-3 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                                            activeTab === tab.id
                                                ? "bg-white text-zinc-900 shadow-sm"
                                                : "text-zinc-400 hover:text-zinc-600"
                                        }`}
                                    >
                                        {tab.icon}
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Forms Container */}
                        <div className="px-5 md:px-8 py-5 md:py-6 flex-1">

                            {/* ════════════════════════════════════════
                                SIGN IN FORM
                            ════════════════════════════════════════ */}
                            {activeTab === "signin" && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    
                                    {/* Google Button - Standard Direct Render */}
                                    <div className="w-full">
                                        <GoogleAuthButton isSilent={true} onSuccess={onAuthSuccess} />
                                    </div>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-zinc-200" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-gradient-to-b from-white to-[#FDFCF8] px-4 text-[10px] md:text-xs text-zinc-400 font-semibold uppercase tracking-widest">
                                                or continue with email
                                            </span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSignIn} className="space-y-4">
                                        <ThemedInput
                                            icon={<Mail className="w-3.5 h-3.5" />}
                                            label="Email Address"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={signInForm.email}
                                            onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                                        />

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                                                    <span className="text-[#D4AF37]"><KeyRound className="w-3.5 h-3.5" /></span>
                                                    Password
                                                </label>
                                                <Link
                                                    href="/forgot-password"
                                                    className="text-[10px] md:text-xs text-[#B8860B] hover:text-[#D4AF37] font-semibold transition-colors"
                                                    onClick={onClose}
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                            <ThemedInput
                                                type={showSignInPassword ? "text" : "password"}
                                                required
                                                placeholder="••••••••"
                                                value={signInForm.password}
                                                onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                                                rightElement={
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                                                        className="text-zinc-400 hover:text-[#D4AF37] transition-colors"
                                                    >
                                                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                }
                                            />
                                        </div>

                                        {signInError && (
                                            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 py-3 px-4 rounded-lg border border-red-100">
                                                <X className="w-4 h-4 flex-shrink-0" />
                                                {signInError}
                                            </div>
                                        )}

                                        <ThemedButton type="submit" loading={signInLoading}>
                                            <Sparkles className="w-4 h-4" />
                                            Sign In & Book Event
                                        </ThemedButton>
                                    </form>
                                </div>
                            )}

                            {/* ════════════════════════════════════════
                                SIGN UP FORM - Step 1
                            ════════════════════════════════════════ */}
                            {activeTab === "signup" && signUpStep === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    
                                    {/* Google Button - Standard Direct Render */}
                                    <div className="w-full">
                                        <GoogleAuthButton isSilent={true} onSuccess={onAuthSuccess} />
                                    </div>

                                    {/* Divider */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-zinc-200" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="bg-gradient-to-b from-white to-[#FDFCF8] px-4 text-[10px] md:text-xs text-zinc-400 font-semibold uppercase tracking-widest">
                                                or sign up with email
                                            </span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSignUp} className="space-y-3.5">
                                        <ThemedInput
                                            icon={<User className="w-3.5 h-3.5" />}
                                            label="Full Name"
                                            required
                                            placeholder="Your full name"
                                            value={signUpForm.name}
                                            onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                                        />

                                        <ThemedInput
                                            icon={<Mail className="w-3.5 h-3.5" />}
                                            label="Email Address"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={signUpForm.email}
                                            onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                        />

                                        <ThemedInput
                                            icon={<KeyRound className="w-3.5 h-3.5" />}
                                            label="Password"
                                            type={showSignUpPassword ? "text" : "password"}
                                            required
                                            placeholder="Create a password"
                                            value={signUpForm.password}
                                            onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                            rightElement={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                                    className="text-zinc-400 hover:text-[#D4AF37] transition-colors"
                                                >
                                                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            }
                                        />

                                        <ThemedInput
                                            icon={<ShieldCheck className="w-3.5 h-3.5" />}
                                            label="Confirm Password"
                                            type="password"
                                            required
                                            placeholder="Repeat your password"
                                            value={signUpForm.confirmPassword}
                                            onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                                        />

                                        {signUpError && (
                                            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 py-3 px-4 rounded-lg border border-red-100">
                                                <X className="w-4 h-4 flex-shrink-0" />
                                                {signUpError}
                                            </div>
                                        )}

                                        <ThemedButton type="submit" loading={signUpLoading}>
                                            <Sparkles className="w-4 h-4" />
                                            Create Account & Book
                                        </ThemedButton>
                                    </form>
                                </div>
                            )}

                            {/* ════════════════════════════════════════
                                OTP VERIFICATION - Step 2
                            ════════════════════════════════════════ */}
                            {activeTab === "signup" && signUpStep === 2 && (
                                <form
                                    onSubmit={handleVerifyOtp}
                                    className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                >
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
                                            <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
                                        </div>
                                        <h4 className="font-serif text-xl font-bold text-zinc-900 mb-1">Verify Your Email</h4>
                                        <p className="text-sm text-zinc-500">
                                            We sent a 6-digit code to <br />
                                            <span className="font-semibold text-zinc-800">{signUpForm.email}</span>
                                        </p>
                                    </div>

                                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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

                                    {signUpError && (
                                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 py-3 px-4 rounded-lg border border-red-100 w-full">
                                            <X className="w-4 h-4 flex-shrink-0" />
                                            {signUpError}
                                        </div>
                                    )}

                                    <ThemedButton 
                                        type="submit" 
                                        loading={signUpLoading}
                                        disabled={otp.length < 6}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Verify & Complete Booking
                                    </ThemedButton>

                                    <button
                                        type="button"
                                        onClick={() => setSignUpStep(1)}
                                        className="text-sm text-zinc-400 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                                    >
                                        <ArrowRight className="w-3 h-3 rotate-180" />
                                        Use a different email
                                    </button>
                                </form>
                            )}

                            {/* ════════════════════════════════════════
                                MOBILE AUTH FORM
                            ════════════════════════════════════════ */}
                            {activeTab === "mobile" && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <MobileAuthForm isSilent={true} onSuccess={onAuthSuccess} />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 md:px-8 pb-5 md:pb-6 pt-3 border-t border-zinc-100 text-center">
                            <p className="text-[10px] md:text-xs text-zinc-400">
                                By continuing you agree to our{" "}
                                <Link href="/terms" className="text-[#B8860B] hover:underline font-medium" onClick={onClose}>
                                    Terms
                                </Link>{" "}
                                &{" "}
                                <Link href="/privacy" className="text-[#B8860B] hover:underline font-medium" onClick={onClose}>
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