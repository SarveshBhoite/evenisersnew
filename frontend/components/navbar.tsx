"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

 const navLinks = [
  { href: "/", label: "Home", type: "exact" },
  { href: "/shop", label: "All Packages", type: "shop-all" },
  { href: "/shop?category=wedding", label: "Wedding", cat: "wedding" },
  { href: "/shop?category=birthday", label: "Birthday", cat: "birthday" },
  { href: "/shop?category=haldi", label: "Haldi & Mehendi", cat: "haldi" },
  { href: "/shop?category=corporate", label: "Corporate", cat: "corporate" },
  { href: "/shop?category=anniversary", label: "Anniversary", cat: "anniversary" },
  { href: "/contact", label: "Contact Us", type: "exact" },
];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-20" />;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl">
      <div className="backdrop-blur-md bg-white/70 rounded-full border border-white/40 shadow-lg px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="font-serif text-2xl font-bold text-foreground">
            LUXE
          </Link>

          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => {
              // Check if this specific link is the active category
              const isActive = (link.cat && currentCategory === link.cat) || 
                               (link.type === "shop-all" && !currentCategory && window.location.pathname === "/shop");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-1 ${
                    isActive 
                    ? "text-black font-bold border-b-2 border-black" 
                    : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4 border-l pl-4 border-black/10">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Member</span>
                  <span className="text-sm font-medium whitespace-nowrap">{user.name}</span>
                </div>
                <button onClick={logout} className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground/70 hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 group">
                <User className="w-5 h-5 text-foreground/70 group-hover:text-foreground" />
                <span className="text-sm font-medium hidden sm:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}