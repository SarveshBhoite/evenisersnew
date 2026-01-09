"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, MapPin, ChevronDown, Search, X, Loader2, LayoutGrid, Package, Lock, Settings } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 
const API_URL = `${SERVER_URL}/api`; 

interface NavLinkItem { href: string; label: string; type?: string; cat?: string; }

function NavbarContent() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { city, setCity } = useLocation();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  
  const [isOpen, setIsOpen] = useState(false);
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

  // ... Search Logic (Kept Same) ...
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setIsSearching(true);
        const lowerTerm = searchTerm.toLowerCase();
        const categoryMatches = baseLinks
          .filter(link => link.cat && link.label.toLowerCase().includes(lowerTerm))
          .map(link => ({
            _id: `cat-${link.cat}`, name: link.label, category: "Category", image: null, type: "category", link: link.href
          }));

        try {
          const res = await fetch(`${API_URL}/products?search=${searchTerm}`);
          const products = await res.json();
          setSearchResults([...categoryMatches, ...products]);
        } catch (error) {
          console.error("Search error", error);
          setSearchResults(categoryMatches);
        } finally { setIsSearching(false); }
      } else { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl transition-all duration-300">
      <div className="backdrop-blur-xl bg-white/80 rounded-full border border-white/50 shadow-2xl px-4 py-3 md:px-8 relative">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          {/* LEFT: LOGO & LOCATION */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link href="/" className="font-serif text-lg md:text-2xl font-bold text-foreground tracking-tight sm:ml-3 lg:ml-0">Evenisers</Link>
            <div className="hidden md:block">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 text-sm font-semibold hover:bg-black/10 transition-all px-4 py-2 rounded-full text-foreground/80 outline-none">
                            <MapPin className="w-4 h-4 text-red-500" />{city}<ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[180px] bg-white/95 backdrop-blur-md border-none shadow-xl rounded-xl p-2 mt-2">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 mb-1">Select Location</div>
                        {CITIES.map((c) => (
                            <DropdownMenuItem key={c} onClick={() => setCity(c)} className={`cursor-pointer rounded-lg px-2 py-2 mb-1 ${city === c ? "bg-black text-white font-medium focus:bg-black focus:text-white" : "hover:bg-accent"}`}>
                                <div className="flex items-center justify-between w-full">{c}{city === c && <MapPin className="w-3 h-3" />}</div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          {/* MIDDLE: LINKS (Desktop Only) */}
          {!isSearchOpen && (
              <div className="hidden lg:flex items-center gap-5 xl:gap-8 flex-1 justify-center px-4 transition-opacity duration-300">
                {navLinks.map((link) => {
                  const isActive = (link.cat && currentCategory === link.cat) || (link.type === "shop-all" && !currentCategory && window.location.pathname === "/shop") || (link.type === "exact" && window.location.pathname === link.href);
                  return (
                    <Link key={link.href} href={link.href} className={`text-sm font-medium transition-all relative py-1 whitespace-nowrap ${isActive ? "text-black font-bold border-b-2 border-black" : "text-foreground/70 hover:text-foreground"}`}>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
          )}

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            
            {/* SEARCH */}
            <div ref={searchRef} className={`relative flex items-center transition-all ${isSearchOpen ? 'w-full md:w-[350px]' : 'w-auto'}`}>
                {isSearchOpen ? (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] md:w-[350px] z-50">
                        <div className="bg-white shadow-lg rounded-full flex items-center px-4 py-2 border border-black/10 h-10">
                            <Search className="w-4 h-4 text-black mr-2 shrink-0" />
                            <input autoFocus type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70 h-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2 shrink-0" /> : <X className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-red-500 ml-2 shrink-0" onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} />}
                        </div>
                        {searchTerm.length > 1 && (
                            <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden max-h-[400px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    <div className="flex flex-col p-2 gap-1">
                                        {searchResults.map((item: any) => (
                                            <div key={item._id} onClick={() => { setIsSearchOpen(false); setSearchTerm(""); router.push(item.type === "category" ? item.link : `/product/${item._id}`); }} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${item.type === "category" ? "bg-white border border-black/5 hover:border-black/20" : "hover:bg-gray-50"}`}>
                                                <div className={`h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${item.type === "category" ? "bg-black/5" : "bg-gray-200"}`}>
                                                    {item.type === "category" ? <LayoutGrid className="w-5 h-5 text-black/60" /> : <img src={item.image ? `${SERVER_URL}${item.image}` : "/placeholder.jpg"} alt={item.name} className="h-full w-full object-cover" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm ${item.type === "category" ? "font-bold text-black" : "font-semibold text-foreground"}`}>{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{item.type === "category" ? "Go to Category" : item.category}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !isSearching && <div className="p-6 text-center text-sm text-muted-foreground">No matches found</div>}
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors"><Search className="w-5 h-5 text-foreground/70" /></button>
                )}
            </div>

            {/* CART */}
            <Link href="/cart" className="relative group p-2">
              <ShoppingCart className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              {cartCount > 0 && <span className="absolute -top-0 -right-0 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
            </Link>

            {/* 🚨 DESKTOP ONLY: USER PROFILE DROPDOWN */}
            <div className="hidden md:flex items-center border-l pl-4 border-black/10 ml-1">
              {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-xs font-bold text-black leading-none">{user.name.split(' ')[0]}</p>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{user.role}</p>
                            </div>
                            <Avatar className="h-9 w-9 border border-zinc-200 group-hover:border-black transition-colors">
                                <AvatarFallback className="bg-black text-white font-serif">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white shadow-xl border-zinc-100 mt-2">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push('/user/profile')}>
                            <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push('/user/my-orders')}>
                            <Package className="mr-2 h-4 w-4" /> My Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-lg" onClick={() => router.push('/user/change-password')}>
                            <Lock className="mr-2 h-4 w-4" /> Change Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="flex items-center gap-2 group ml-2 whitespace-nowrap">
                  <User className="w-5 h-5 text-foreground/70 group-hover:text-foreground" />
                  <span className="hidden sm:inline text-sm font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* 🚨 MOBILE HAMBURGER MENU */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 -mr-2"><Menu className="h-6 w-6" /></Button></SheetTrigger>
                
                <SheetContent side="right" className="w-[300px] flex flex-col p-6">
                    <SheetHeader className="text-left mb-6 border-b pb-4"><SheetTitle className="font-serif text-3xl font-bold">Evenisers</SheetTitle></SheetHeader>
                    
                    {/* 1. Mobile Location */}
                    <div className="mb-6">
                        <label className="text-xs font-bold uppercase text-muted-foreground mb-2 block">Select City</label>
                        <div className="grid grid-cols-2 gap-2">
                            {CITIES.map((c) => (
                                <button key={c} onClick={() => setCity(c)} className={`text-sm py-2 px-3 rounded-md border transition-all ${city === c ? "bg-black text-white border-black" : "bg-transparent border-border hover:bg-accent"}`}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. USER AVATAR CARD (Inside Hamburger) */}
                    {user && (
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-10 w-10 border border-zinc-200">
                                    <AvatarFallback className="bg-black text-white font-serif">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-black">{user.name}</span>
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{user.role} Account</span>
                                </div>
                            </div>
                            
                            {/* USER LINKS */}
                            <div className="grid gap-1">
                                <Link href="/user/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-black">
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                <Link href="/user/my-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-black">
                                    <Package className="w-4 h-4" /> My Orders
                                </Link>
                                <Link href="/user/change-password" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-black">
                                    <Lock className="w-4 h-4" /> Password
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* 3. Main Navigation Links */}
                    <div className="flex flex-col gap-1 flex-1 overflow-y-auto py-2">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 px-2">Menu</p>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-base px-3 py-2 rounded-lg hover:bg-accent transition-all flex items-center gap-3 font-medium text-zinc-800">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* 4. Footer Actions */}
                    <div className="border-t pt-4 mt-auto">
                        {!user && (
                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold p-3 rounded-xl">
                                <User className="w-5 h-5" /> Sign In
                            </Link>
                        )}
                        {user && (
                             <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 font-bold p-3 rounded-xl transition-colors">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
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