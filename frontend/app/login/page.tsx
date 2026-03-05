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
import { Eye, EyeOff } from "lucide-react";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import MobileAuthForm from "@/components/MobileAuthForm";

// Helper to keep code clean
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  }/api`;

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");

  const router = useRouter();

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
    <div className="min-h-screen pt-32 pb-16">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">
            Welcome Back
          </h1>

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="mt-2"
                  onChange={handleChange}
                  value={form.email}
                />
              </div>

              {/* 3. UPDATED PASSWORD FIELD */}
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-black"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pr-10 [&::-ms-reveal]:hidden"
                    onChange={handleChange}
                    value={form.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <MobileAuthForm isSilent={false} />
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>{" "}
            <Link
              href="/signup"
              className="text-accent hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
