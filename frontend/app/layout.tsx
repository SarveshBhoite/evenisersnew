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
  title: "LUXE — Premium Fashion & Lifestyle",
  description: "Discover timeless elegance with our curated collection of luxury fashion and lifestyle essentials",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
        <AuthProvider>
          {/* CartProvider MUST be the parent of Navbar */}
          <CartProvider>
            <Suspense fallback={<div className="h-16" /> /* or a skeleton navbar */}>
              <Navbar />
            </Suspense> 
            <main>{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}