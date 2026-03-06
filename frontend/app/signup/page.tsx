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
import { useAuth } from "@/context/AuthContext"; // ✅ IMPORT AUTH
import axios from "axios"; // ✅ IMPORT AXIOS
import { useToast } from "@/hooks/use-toast"; // ✅ RESTORED IMPORT
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { Eye, EyeOff } from "lucide-react";
import MobileAuthForm from "@/components/MobileAuthForm";

// Helper
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth(); // ✅ GET LOGIN FUNCTION

  const [step, setStep] = useState<1 | 2>(1); // 1 = Details, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Step 1: Request OTP
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
      setStep(2); // Move to next step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP + AUTO LOGIN
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Verify OTP
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      toast({ title: "Success", description: "Account verified! Logging you in..." });

      // 2. ✅ AUTO LOGIN
      try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        login(loginRes.data.user, loginRes.data.token);
        // Login handles redirect to /shop or /admin/dashboard
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
    <div className="min-h-screen pt-32 pb-16">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">
            {step === 1 ? "Create Account" : "Verify Email"}
          </h1>

          {/* --- STEP 1 FORM --- */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                <GoogleAuthButton isSilent={false} />
                <div className="relative mt-6 mb-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-stone-200/60" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-zinc-400 font-medium tracking-wide">Or continue with</span>
                  </div>
                </div>

                <div className="flex bg-stone-100 p-1 rounded-full mt-4 mb-2">
                  <button
                    onClick={() => setLoginMethod("email")}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${loginMethod === "email" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setLoginMethod("mobile")}
                    className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${loginMethod === "mobile" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    Mobile Number
                  </button>
                </div>
              </div>

              {loginMethod === "email" ? (
                <form className="space-y-6" onSubmit={handleSignup}>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      className="mt-2"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="mt-2"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="mt-2"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      className="mt-2"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  {error && <p className="text-sm text-destructive text-center">{error}</p>}

                  <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
                    {loading ? "Sending OTP..." : "Sign Up"}
                  </Button>
                </form>
              ) : (
                <MobileAuthForm isSilent={false} />
              )}
            </div>
          )}

          {/* --- STEP 2 FORM (OTP) --- */}
          {step === 2 && (
            <form className="space-y-6 flex flex-col items-center" onSubmit={handleVerify}>
              <p className="text-center text-sm text-muted-foreground">
                Enter the 6-digit code sent to <br />
                <span className="font-medium text-foreground">{formData.email}</span>
              </p>

              <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-muted-foreground hover:underline"
              >
                Change Email
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <Link href="/login" className="text-accent hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}