"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, LayoutDashboard, Home, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// 1. Interface for Links
interface NavLinkItem {
  href: string;
  label: string;
  type?: string;
  cat?: string;
}

function NavbarContent() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [isOpen, setIsOpen] = useState(false);

  // 2. Define Links
  const baseLinks: NavLinkItem[] = [
    { href: "/", label: "Home", type: "exact" },
    { href: "/shop", label: "All Packages", type: "shop-all" },
    { href: "/shop?category=wedding", label: "Wedding", cat: "wedding" },
    { href: "/shop?category=birthday", label: "Birthday", cat: "birthday" },
    { href: "/shop?category=haldi", label: "Haldi", cat: "haldi" }, // Shortened label for better fit
    { href: "/shop?category=corporate", label: "Corporate", cat: "corporate" },
    { href: "/shop?category=anniversary", label: "Anniversary", cat: "anniversary" },
  ];

  // Logic: Admin gets Dashboard, User gets Contact
  const finalLink: NavLinkItem =
    user?.role === "admin"
      ? { href: "/admin/dashboard", label: "Dashboard", type: "exact" }
      : { href: "/contact", label: "Contact Us", type: "exact" };

  const navLinks = [...baseLinks, finalLink];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl transition-all duration-300">
      <div className="backdrop-blur-md bg-white/80 rounded-full border border-white/40 shadow-lg px-6 py-3 md:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* LEFT: LOGO */}
          <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-foreground shrink-0 tracking-tight">
            LUXE
          </Link>

          {/* MIDDLE: DESKTOP NAV LINKS */}
          {/* Changed 'justify-center' to 'justify-end md:justify-center' and managed width better */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 flex-1 justify-center px-4">
            {navLinks.map((link) => {
              const isActive =
                (link.cat && currentCategory === link.cat) ||
                (link.type === "shop-all" && !currentCategory && window.location.pathname === "/shop") ||
                (link.type === "exact" && window.location.pathname === link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-1 whitespace-nowrap ${
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

          {/* RIGHT: ACTIONS (Cart + User) */}
          {/* Added 'shrink-0' so this section NEVER gets squished */}
          <div className="flex items-center gap-3 md:gap-5 shrink-0">
            <Link href="/cart" className="relative group p-1">
              <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP USER INFO */}
            <div className="hidden sm:flex items-center">
              {user ? (
                <div className="flex items-center gap-3 border-l pl-4 border-black/10">
                  <div className="flex flex-col items-end hidden md:flex min-w-[80px]">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {/* Using slice to ensure extremely long names don't break layout */}
                      {user.name.length > 15 ? user.name.slice(0, 15) + "..." : user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground/70 hover:text-destructive"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 group ml-4 whitespace-nowrap">
                  <User className="w-5 h-5 text-foreground/70 group-hover:text-foreground" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* MOBILE HAMBURGER MENU */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 -mr-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                {/* SIDEBAR CONTENT */}
                <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col p-6">
                    <SheetHeader className="text-left mb-6 border-b pb-4">
                        <SheetTitle className="font-serif text-3xl font-bold tracking-tight">LUXE</SheetTitle>
                    </SheetHeader>

                    {/* User Info Mobile Card */}
                    {user && (
                        <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl mb-2">
                            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-serif text-xl">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">{user.name}</span>
                                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                    {user.role} Account
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto py-2">
                      {navLinks.map((link) => {
                         const isActive =
                         (link.cat && currentCategory === link.cat) ||
                         (link.type === "shop-all" && !currentCategory && window.location.pathname === "/shop") ||
                         (link.type === "exact" && window.location.pathname === link.href);

                        return (
                            <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-lg px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                                isActive 
                                ? "bg-black text-white font-medium shadow-md" 
                                : "text-foreground/80 hover:bg-accent hover:text-foreground"
                            }`}
                            >
                            {link.label === "Home" && <Home className="w-5 h-5 opacity-70" />}
                            {link.label === "Dashboard" && <LayoutDashboard className="w-5 h-5 opacity-70" />}
                            {link.label.includes("Packages") && <Package className="w-5 h-5 opacity-70" />}
                            
                            {link.label}
                            </Link>
                        )
                      })}
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t pt-6 mt-auto">
                      {user ? (
                        <button 
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="w-full flex items-center justify-center gap-2 text-destructive font-medium p-3 hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                      ) : (
                        <Link 
                            href="/login" 
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium p-3 rounded-full hover:bg-black/90 transition-colors shadow-lg"
                        >
                            <User className="w-5 h-5" /> Sign In
                        </Link>
                      )}
                    </div>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl">
        <div className="backdrop-blur-md bg-white/70 rounded-full border border-white/40 shadow-lg px-6 py-3">
           <div className="h-8 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div />}>
      <NavbarContent />
    </Suspense>
  );
}