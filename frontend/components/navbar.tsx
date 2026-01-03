"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function NavbarContent() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  // Define base links
  const baseLinks = [
    { href: "/", label: "Home", type: "exact" },
    { href: "/shop", label: "All Packages", type: "shop-all" },
    { href: "/shop?category=wedding", label: "Wedding", cat: "wedding" },
    { href: "/shop?category=birthday", label: "Birthday", cat: "birthday" },
    { href: "/shop?category=haldi", label: "Haldi & Mehendi", cat: "haldi" },
    { href: "/shop?category=corporate", label: "Corporate", cat: "corporate" },
    { href: "/shop?category=anniversary", label: "Anniversary", cat: "anniversary" },
  ];

  // Logic: If Admin, show "Dashboard" instead of "Contact Us"
  const finalLink =
    user?.role === "admin"
      ? { href: "/admin/dashboard", label: "Dashboard", type: "exact" }
      : { href: "/contact", label: "Contact Us", type: "exact" };

  const navLinks = [...baseLinks, finalLink];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="backdrop-blur-md bg-white/70 rounded-full border border-white/40 shadow-lg px-6 py-4 md:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* LOGO */}
          <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-foreground shrink-0">
            LUXE
          </Link>

          {/* DESKTOP NAV LINKS (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive =
                (link.cat && currentCategory === link.cat) ||
                (link.type === "shop-all" && !currentCategory && window.location.pathname === "/shop") ||
                (link.type === "exact" && window.location.pathname === link.href);

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

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-3 md:gap-5">
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP USER SECTION */}
            <div className="hidden sm:flex items-center">
              {user ? (
                <div className="flex items-center gap-4 border-l pl-4 border-black/10">
                  <div className="flex flex-col items-end hidden md:flex">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground/70 hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 group ml-4">
                  <User className="w-5 h-5 text-foreground/70 group-hover:text-foreground" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* MOBILE HAMBURGER MENU */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="font-serif text-2xl font-bold border-b pb-4">
                      Menu
                    </div>
                    
                    {/* User Info Mobile */}
                    {user && (
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-lg">
                            <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-lg font-medium hover:text-black/70 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-auto">
                      {user ? (
                        <button 
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="flex items-center gap-2 text-destructive font-medium"
                        >
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                      ) : (
                        <Link 
                            href="/login" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 font-medium"
                        >
                            <User className="w-5 h-5" /> Sign In
                        </Link>
                      )}
                    </div>
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

// Main Export
export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
        <div className="backdrop-blur-md bg-white/70 rounded-full border border-white/40 shadow-lg px-6 py-4">
            {/* Simple skeleton to prevent layout shift */}
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