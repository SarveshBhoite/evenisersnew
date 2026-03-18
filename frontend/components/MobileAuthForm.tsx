"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck, MessageSquare } from "lucide-react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

interface MobileAuthFormProps {
    onSuccess?: (token: string) => void;
    isSilent?: boolean;
}

export default function MobileAuthForm({ onSuccess, isSilent = false }: MobileAuthFormProps) {
    const { login, loginSilently } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState<1 | 2>(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Basic validation for 10 digit Indian numbers
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return setError("Please enter a valid 10-digit mobile number");
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/mobile/send-otp`, { phone });
            setStep(2);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length < 6) return setError("Please enter the complete 6-digit OTP");

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/mobile/verify-otp`, { phone, otp });
            const data = res.data;

            if (isSilent) {
                loginSilently(data.user, data.token);
            } else {
                login(data.user, data.token);
                router.push("/");
            }

            if (onSuccess) onSuccess(data.token);

        } catch (err: any) {
            setError(err?.response?.data?.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    if (step === 1) {
        return (
            <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                    <Label htmlFor="mobile-phone" className="text-xs font-semibold text-zinc-700">
                        Mobile Number
                    </Label>
                    <div className="mt-1.5 flex items-stretch rounded-xl border border-stone-200 bg-white focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37] overflow-hidden transition-all">
                        <div className="px-4 flex items-center justify-center bg-stone-100/80 border-r border-stone-200 text-zinc-500 font-medium text-sm">
                            +91
                        </div>
                        <Input
                            id="mobile-phone"
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="9096949909"
                            className="flex-1 h-11 md:h-12 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 tabular-nums px-4"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
                )}

                <Button
                    type="submit"
                    size="lg"
                    disabled={loading || phone.length !== 10}
                    className="w-full h-11 md:h-13 rounded-full bg-black text-white hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold text-xs md:text-sm shadow-lg shadow-black/20 flex items-center gap-2 justify-center"
                >
                    <MessageSquare className="w-4 h-4" />
                    {loading ? "Sending OTP..." : "Send Verification Code"}
                </Button>
            </form>
        );
    }

    return (
        <form onSubmit={handleVerifyOtp} className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-center w-full">
                <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <ShieldCheck className="w-6 md:w-8 h-6 md:h-8 text-[#D4AF37]" />
                </div>
                <h4 className="font-serif text-lg md:text-xl font-bold text-zinc-900 mb-1">Verify Mobile Number</h4>
                <p className="text-xs md:text-sm text-zinc-500">
                    We sent a 6-digit code to <br className="md:hidden" />
                    <span className="font-semibold text-zinc-800">+91 {phone}</span>
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

            {error && (
                <p className="text-xs text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl w-full">{error}</p>
            )}

            <Button
                type="submit"
                size="lg"
                disabled={loading || otp.length < 6}
                className="w-full h-11 md:h-13 rounded-full bg-black text-white hover:bg-[#D4AF37] hover:text-white transition-all duration-300 font-bold shadow-lg"
            >
                {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <button
                type="button"
                onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                }}
                className="text-sm text-zinc-400 hover:text-zinc-700 hover:underline transition-colors mt-2"
            >
                ← Edit mobile number
            </button>
        </form>
    );
}
