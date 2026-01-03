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
import { useToast } from "@/hooks/use-toast";

// Helper
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1); // 1 = Details, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
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

  // Step 2: Verify OTP
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

      toast({ title: "Success", description: "Account verified! Please login." });
      router.push("/login"); // Redirect to login
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