"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, MapPin, ChevronDown, Search, X, Loader2, LayoutGrid } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation, CITIES } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- HELPERS ---
const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 
const API_URL = `${SERVER_URL}/api`; 

interface NavLinkItem {
  href: string;
  label: string;
  type?: string;
  cat?: string;
}

function NavbarContent() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { city, setCity } = useLocation();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  
  const [isOpen, setIsOpen] = useState(false);
  
  // --- SEARCH STATES ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const baseLinks: NavLinkItem[] = [
    { href: "/", label: "Home", type: "exact" },
    { href: "/shop", label: "All Packages", type: "shop-all" },
    { href: "/shop?category=wedding", label: "Wedding", cat: "wedding" },
    { href: "/shop?category=birthday", label: "Birthday", cat: "birthday" },
    { href: "/shop?category=haldi", label: "Haldi", cat: "haldi" },
    { href: "/shop?category=corporate", label: "Corporate", cat: "corporate" },
    { href: "/shop?category=anniversary", label: "Anniversary", cat: "anniversary" },
  ];

  const finalLink: NavLinkItem =
    user?.role === "admin"
      ? { href: "/admin/dashboard", label: "Dashboard", type: "exact" }
      : { href: "/contact", label: "Contact Us", type: "exact" };

  const navLinks = [...baseLinks, finalLink];

  // Close search if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Input
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsSearching(true);
        const lowerTerm = searchTerm.toLowerCase();

        // 1. Local Search: Check Categories
        const categoryMatches = baseLinks
          .filter(link => link.cat && link.label.toLowerCase().includes(lowerTerm))
          .map(link => ({
            _id: `cat-${link.cat}`,
            name: link.label,
            category: "Category",
            image: null,
            type: "category",
            link: link.href
          }));

        // 2. API Search: Fetch Products
        try {
          const res = await fetch(`${API_URL}/products?search=${searchTerm}`);
          const products = await res.json();
          setSearchResults([...categoryMatches, ...products]);
        } catch (error) {
          console.error("Search error", error);
          setSearchResults(categoryMatches);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl transition-all duration-300">
      <div className="backdrop-blur-xl bg-white/80 rounded-full border border-white/50 shadow-2xl px-6 py-3 md:px-8 relative">
        <div className="flex items-center justify-between gap-4">
          
          {/* LEFT: LOGO & LOCATION */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-foreground tracking-tight">
                LUXE
            </Link>

            <div className="hidden md:block">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 text-sm font-semibold  hover:bg-black/10 transition-all px-4 py-2 rounded-full text-foreground/80 outline-none">
                            <MapPin className="w-4 h-4 text-red-500" />
                            {city}
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[180px] bg-white/95 backdrop-blur-md border-none shadow-xl rounded-xl p-2 mt-2">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 mb-1">Select Location</div>
                        {CITIES.map((c) => (
                            <DropdownMenuItem 
                                key={c} 
                                onClick={() => setCity(c)}
                                className={`cursor-pointer rounded-lg px-2 py-2 mb-1 ${city === c ? "bg-black text-white font-medium focus:bg-black focus:text-white" : "hover:bg-accent"}`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    {c}
                                    {city === c && <MapPin className="w-3 h-3" />}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          {/* MIDDLE: LINKS (Hidden when Search is Open) */}
          {!isSearchOpen && (
              <div className="hidden lg:flex items-center gap-5 xl:gap-8 flex-1 justify-center px-4 transition-opacity duration-300">
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
          )}

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            
            {/* SEARCH COMPONENT (FIXED) */}
            <div ref={searchRef} className={`relative flex items-center transition-all ${isSearchOpen ? 'w-full md:w-[350px]' : 'w-auto'}`}>
                {isSearchOpen ? (
                    // Logic Change: This container anchors the input to the navbar center
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] md:w-[350px] z-50">
                        
                        {/* 1. Input Field - Stays Centered */}
                        <div className="bg-white shadow-lg rounded-full flex items-center px-4 py-2 border border-black/10 h-10">
                            <Search className="w-4 h-4 text-black mr-2 shrink-0" />
                            <input 
                                autoFocus
                                type="text"
                                placeholder="Search 'Wedding'..."
                                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70 h-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {isSearching ? (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2 shrink-0" />
                            ) : (
                                <X 
                                    className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-red-500 ml-2 shrink-0" 
                                    onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }}
                                />
                            )}
                        </div>

                        {/* 2. Dropdown Results - Hangs BELOW the input */}
                        {searchTerm.length > 1 && (
                            <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden max-h-[400px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    <div className="flex flex-col p-2 gap-1">
                                        {searchResults.map((item: any) => {
                                            const isCategory = item.type === "category";
                                            return (
                                                <div 
                                                    key={item._id} 
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        setSearchTerm("");
                                                        if (isCategory) {
                                                            router.push(item.link);
                                                        } else {
                                                            router.push(`/product/${item._id}`);
                                                        }
                                                    }}
                                                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                                                        isCategory ? "bg-white border border-black/5 hover:border-black/20" : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className={`h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${isCategory ? "bg-black/5" : "bg-gray-200"}`}>
                                                        {isCategory ? (
                                                            <LayoutGrid className="w-5 h-5 text-black/60" />
                                                        ) : (
                                                            <img 
                                                                src={item.image ? `${SERVER_URL}${item.image}` : "/placeholder.jpg"} 
                                                                alt={item.name} 
                                                                className="h-full w-full object-cover" 
                                                            />
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm ${isCategory ? "font-bold text-black" : "font-semibold text-foreground"}`}>
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                            {isCategory ? "Go to Category" : item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    !isSearching && <div className="p-6 text-center text-sm text-muted-foreground">No matches found</div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <Search className="w-5 h-5 text-foreground/70" />
                    </button>
                )}
            </div>

            {/* CART */}
            <Link href="/cart" className="relative group p-1">
              <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER PROFILE */}
            <div className="hidden sm:flex items-center">
              {user ? (
                <div className="flex items-center gap-3 border-l pl-4 border-black/10">
                  <div className="flex flex-col items-end hidden md:flex min-w-[80px]">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {user.name.length > 15 ? user.name.slice(0, 15) + "..." : user.name}
                    </span>
                  </div>
                  <button onClick={logout} className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground/70 hover:text-destructive">
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

            {/* MOBILE MENU TRIGGER */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 -mr-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col p-6">
                    <SheetHeader className="text-left mb-6 border-b pb-4">
                        <SheetTitle className="font-serif text-3xl font-bold tracking-tight">LUXE</SheetTitle>
                    </SheetHeader>

                    {/* Mobile Location Selector */}
                    <div className="mb-6">
                        <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Select City</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CITIES.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCity(c)}
                                    className={`text-sm py-2 px-3 rounded-md border transition-all ${
                                        city === c 
                                        ? "bg-black text-white border-black" 
                                        : "bg-transparent border-border hover:bg-accent"
                                    }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

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

                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto py-2">
                      {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg px-4 py-3 rounded-lg hover:bg-accent transition-all flex items-center gap-3"
                        >
                            {link.label}
                        </Link>
                      ))}
                    </div>

                    <div className="border-t pt-6 mt-auto">
                      {user ? (
                        <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 text-destructive font-medium p-3">
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                      ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 bg-black text-white font-medium p-3 rounded-full">
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
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl"><div className="backdrop-blur-md bg-white/70 rounded-full border border-white/40 shadow-lg px-6 py-3"><div className="h-8 w-full" /></div></div>;
  return <Suspense fallback={<div />}><NavbarContent /></Suspense>;
}