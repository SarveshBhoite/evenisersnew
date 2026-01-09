"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    // Small delay to show the message before clearing data
    const timer = setTimeout(() => {
      logout();
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <div className="text-center">
        <h1 className="font-serif text-3xl mb-4">Logging you out...</h1>
        <p className="text-muted-foreground">Thank you for visiting Evenisers. We hope to see you again soon!</p>
        <div className="mt-8 animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
      </div>
    </div>
  );
}