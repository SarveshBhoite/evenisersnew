"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

interface GoogleAuthButtonProps {
    onSuccess?: (token: string) => void;
    isSilent?: boolean;
}

export default function GoogleAuthButton({ onSuccess, isSilent = false }: GoogleAuthButtonProps) {
    const { login, loginSilently } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await axios.post(`${API_URL}/auth/google-login`, {
                token: credentialResponse.credential, // This is the ID Token
            });

            const data = res.data;
            if (isSilent) {
                loginSilently(data.user, data.token);
            } else {
                login(data.user, data.token);
                router.push("/");
            }

            if (onSuccess) {
                onSuccess(data.token);
            }
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            setError("Google authentication failed. Please try again.");
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    console.error("Login Failed");
                    setError("Google login was closed or failed.");
                }}
                useOneTap={false}
                shape="rectangular"
                size="large"
                width="100%"
                text="continue_with"
            />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
    );
}
