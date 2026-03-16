import type React from "react"
import type { Metadata } from "next"
import { Lato, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react"
import { Footer } from "@/components/footer"
import { LocationProvider } from "@/context/LocationContext"
import { Toaster as SonnerToaster } from "sonner"
import { GoogleOAuthProvider } from "@react-oauth/google"

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "evenizers — Premium Fashion & Lifestyle",
  description: "Discover timeless elegance with our curated collection of luxury fashion and lifestyle essentials",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/logobg.png",
      },
    ],
    apple: "/logobg.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfair.variable} font-sans antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "missing_client_id"}>
          <AuthProvider>
            {/* CartProvider MUST be the parent of Navbar */}
            <CartProvider>
              <LocationProvider>
                <Suspense fallback={<div className="h-16" /> /* or a skeleton navbar */}>
                  <Navbar />
                </Suspense>
                <main>{children}</main>
                <Footer />
                <Toaster />
                <SonnerToaster position="bottom-right" richColors />
              </LocationProvider>
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}