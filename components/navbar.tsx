"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, MapPin, ChevronDown, Search, X, Loader2, LayoutGrid, Package, Lock, ChevronRight } from "lucide-react";
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
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 
const API_URL = `${SERVER_URL}/api`; 

// ✅ DATA: All Categories & Themes
const CATEGORY_DATA = [
    { label: "Birthday", href: "/shop?category=birthday", icon: "🎂" },
    { label: "Wedding", href: "/shop?category=wedding", icon: "💍" },
    { label: "Haldi & Mehandi", href: "/shop?category=haldi-mehandi", icon: "✨" },
    { label: "Engagement", href: "/shop?category=engagement", icon: "💍" },
    { label: "Anniversary", href: "/shop?category=anniversary", icon: "🥂" },
    { 
        label: "Festivals & Events", 
        href: "/shop?category=festival", 
        icon: "🪔",
        themes: [
            { label: "Diwali Celebration", value: "diwali" },
            { label: "Holi Festival", value: "holi" },
            { label: "Ganesh Chaturthi", value: "ganesh-chaturthi" },
            { label: "Makar Sankranti / Lohri", value: "makar-sankranti" },
            { label: "Christmas Decoration", value: "christmas" },
            { label: "Republic / Independence Day", value: "national-event" },
            { label: "New Year Decoration", value: "new-year" }
        ]
    },
    { label: "Baby Shower", href: "/shop?category=babyshower", icon: "🍼" },
    { label: "Baby Welcome", href: "/shop?category=babywelcome", icon: "👶" },
    { label: "Naming Ceremony", href: "/shop?category=namingceremony", icon: "🕯️" },
    { label: "Annaprashan", href: "/shop?category=annaprashan", icon: "🍚" },
    { label: "House Warming", href: "/shop?category=housewarming", icon: "🏠" },
    { label: "Bride To Be", href: "/shop?category=bridetobe", icon: "👰" },
    { label: "Romantic", href: "/shop?category=romantic", icon: "🌹" },
    { label: "Corporate", href: "/corporate", icon: "🏢" },
    { label: "Catering", href: "/catering", icon: "🍽️" },
    { label: "Games", href: "/games", icon: "🎮" },
];

function NavbarContent() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { city, setCity } = useLocation();
  const searchParams = useSearchParams();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // ✅ States for Hover Menu
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // 🚨 Ref for delay
  
  const searchRef = useRef<HTMLDivElement>(null);

  const mainLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "All Packages" },
  ];

  const finalLink = user?.role === "admin"
      ? { href: "/admin/dashboard", label: "Dashboard" }
      : { href: "/contact", label: "Contact Us" };

  // ✅ HOVER HANDLERS (The Fix)
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
        setIsCategoryOpen(false);
        setHoveredCategory(null);
    }, 200); // 200ms delay to bridge the gap
  };

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
        
        const categoryMatches = CATEGORY_DATA
          .filter(link => link.label.toLowerCase().includes(lowerTerm))
          .map(link => ({
            _id: `cat-${link.label}`, name: link.label, category: "Category", image: null, type: "category", link: link.href
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
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isSearchOpen ? 'w-[95%] max-w-5xl' : 'w-[95%] md:w-[85%] lg:w-[75%] max-w-5xl'}`}>
      <div className="backdrop-blur-xl bg-white/85 rounded-full border border-white/60 shadow-xl px-6 py-3 relative">
        <div className="flex items-center justify-between">
          
          {/* --- LEFT: Logo & Location --- */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-foreground tracking-tight">
              Evenizers
            </Link>

            <div className="hidden md:block h-6 w-[1px] bg-zinc-300 mx-1"></div>
            
            <div className="hidden md:block">
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black transition-colors cursor-pointer bg-zinc-100/50 px-3 py-1.5 rounded-md">
                            <MapPin className="w-3.5 h-3.5 text-red-500" />
                            {city}
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </div>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent align="start" className="w-64 bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-xl border-zinc-100 mt-2">
                        <div className="text-xs font-bold uppercase text-zinc-400 px-3 py-2 mb-1 tracking-wider">Select City</div>
                        {CITIES.map((c) => (
                            <DropdownMenuItem key={c} onClick={() => setCity(c)} className={`cursor-pointer rounded-2xl py-3 px-4 text-base font-medium transition-colors ${city === c ? "bg-black text-white focus:bg-black focus:text-white" : "hover:bg-zinc-50 text-zinc-700"}`}>
                                <div className="flex items-center justify-between w-full">
                                    {c}
                                    {city === c && <MapPin className="w-4 h-4" />}
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>

          {/* --- MIDDLE: Links (Desktop) --- */}
          {!isSearchOpen && (
              <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                {mainLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-black hover:bg-black/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* ✅ HOVERABLE CATEGORIES DROPDOWN WITH DELAY FIX */}
                <div 
                    className="relative pb-2 -mb-2" // 🚨 Added padding bottom to bridge gap physically too
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all cursor-pointer outline-none ${isCategoryOpen ? 'text-black bg-black/5' : 'text-zinc-500 hover:text-black hover:bg-black/5'}`}>
                         Categories <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}/>
                    </button>

                    {isCategoryOpen && (
                        // Horizontal Grid Dropdown
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-zinc-100 grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-200">
                             
                             {/* Decorative Arrow */}
                             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-zinc-100"></div>

                             {CATEGORY_DATA.map((cat) => (
                                <div 
                                    key={cat.label}
                                    className="relative group/item"
                                    onMouseEnter={() => setHoveredCategory(cat.label)}
                                >
                                    <Link 
                                        href={cat.href} 
                                        className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl group-hover/item:scale-110 transition-transform">{cat.icon}</span>
                                            <span className="font-semibold text-sm text-zinc-700 group-hover/item:text-black">{cat.label}</span>
                                        </div>
                                        {/* Show Arrow if it has themes */}
                                        {cat.themes && <ChevronRight className="w-4 h-4 text-zinc-300 group-hover/item:text-black" />}
                                    </Link>

                                    {/* ✅ THEME FLYOUT */}
                                    {cat.themes && hoveredCategory === cat.label && (
                                        <div className="absolute top-0 left-full ml-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 p-2 overflow-hidden z-50 animate-in fade-in slide-in-from-left-2">
                                            <div className="text-[10px] font-bold uppercase text-zinc-400 px-3 py-2 mb-1 tracking-wider border-b border-zinc-50">Select Theme</div>
                                            {cat.themes.map((theme) => (
                                                <Link 
                                                    key={theme.value}
                                                    href={`/shop?category=festival&theme=${theme.value}`}
                                                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-black transition-colors"
                                                >
                                                    {theme.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                             ))}
                        </div>
                    )}
                </div>

                <Link 
                  href={finalLink.href} 
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-black hover:bg-black/5 transition-all"
                >
                  {finalLink.label}
                </Link>
              </div>
          )}

          {/* --- RIGHT: Actions --- */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Search */}
            <div ref={searchRef} className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-[180px] md:w-[250px]' : 'w-auto'}`}>
                {isSearchOpen ? (
                    <div className="relative w-full">
                        <input 
                            autoFocus 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full bg-zinc-100/80 border-none rounded-full pl-9 pr-8 py-2 text-xs font-medium outline-none focus:ring-1 ring-black/10" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <X className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-black" onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} />
                        
                        {searchTerm.length > 1 && (
                            <div className="absolute top-full right-0 w-[280px] mt-3 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden max-h-[300px] overflow-y-auto z-[60]">
                                {searchResults.length > 0 ? (
                                    <div className="flex flex-col p-2 gap-1">
                                        {searchResults.map((item: any) => (
                                            <div key={item._id} onClick={() => { setIsSearchOpen(false); setSearchTerm(""); router.push(item.type === "category" ? item.link : `/product/${item._id}`); }} className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-zinc-50 transition-colors">
                                                <div className="h-8 w-8 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100 flex items-center justify-center">
                                                    {item.type === "category" ? <LayoutGrid className="w-4 h-4 text-zinc-400" /> : <img src={item.image ? (item.image.startsWith("http") ? item.image : `${SERVER_URL}${item.image}`) : "/placeholder.jpg"} className="h-full w-full object-cover" alt="" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-zinc-800 line-clamp-1">{item.name}</span>
                                                    <span className="text-[9px] font-bold uppercase text-zinc-400">{item.type === "category" ? "Category" : item.category}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !isSearching && <div className="p-4 text-center text-xs text-zinc-400">No matches found</div>}
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => setIsSearchOpen(true)} className="p-2.5 hover:bg-zinc-100 rounded-full transition-colors">
                        <Search className="w-4.5 h-4.5 text-zinc-600" />
                    </button>
                )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative group p-2.5 hover:bg-zinc-100 rounded-full transition-colors">
              <ShoppingCart className="w-4.5 h-4.5 text-zinc-600 group-hover:text-black" />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">{cartCount}</span>}
            </Link>

            {/* User Profile */}
            <div className="hidden md:block pl-2 border-l border-zinc-200 ml-1">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <Avatar className="h-9 w-9 border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                                <AvatarFallback className="bg-black text-white font-serif font-bold text-xs">
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-3xl p-3 bg-white/95 backdrop-blur-xl shadow-xl border-zinc-100 mt-2">
                            <div className="px-3 py-3 mb-2 bg-zinc-50 rounded-2xl">
                                <p className="text-sm font-bold text-black">{user.name}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">{user.email}</p>
                            </div>
                            <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 text-sm font-medium" onClick={() => router.push('/user/profile')}>
                                <User className="mr-3 h-4 w-4 text-zinc-500" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 text-sm font-medium" onClick={() => router.push('/user/my-orders')}>
                                <Package className="mr-3 h-4 w-4 text-zinc-500" /> My Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 text-sm font-medium" onClick={() => router.push('/user/change-password')}>
                                <Lock className="mr-3 h-4 w-4 text-zinc-500" /> Change Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-100 my-1" />
                            <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700" onClick={logout}>
                                <LogOut className="mr-3 h-4 w-4" /> Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Link href="/login" className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-black/20">
                        Sign In
                    </Link>
                )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild><Button variant="ghost" size="icon" className="-mr-2 h-9 w-9"><Menu className="h-6 w-6" /></Button></SheetTrigger>
                <SheetContent side="right" className="w-[300px] flex flex-col p-6 overflow-y-auto">
                    <SheetHeader className="text-left mb-6 border-b pb-4"><SheetTitle className="font-serif text-3xl font-bold">Evenizers</SheetTitle></SheetHeader>
                    
                    {user && (
                        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10 border border-zinc-200">
                                    <AvatarFallback className="bg-black text-white font-serif">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-black">{user.name}</span>
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{user.role}</span>
                                </div>
                            </div>
                            
                            <div className="grid gap-1">
                                <Link href="/user/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-black">
                                    <User className="w-4 h-4" /> My Profile
                                </Link>
                                <Link href="/user/my-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-black">
                                    <Package className="w-4 h-4" /> My Orders
                                </Link>
                                <Link href="/user/change-password" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-black">
                                    <Lock className="w-4 h-4" /> Change Password
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 px-2">Browse</p>
                        {mainLinks.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-medium text-zinc-800 flex items-center gap-3">
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-zinc-100 my-2" />
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2 px-2">Events</p>
                        
                        {/* ✅ Mobile Category Rendering */}
                        {CATEGORY_DATA.map((link) => (
                            <div key={link.label}>
                                <Link 
                                    href={link.href} 
                                    onClick={() => !link.themes && setIsOpen(false)} 
                                    className="px-3 py-2.5 rounded-xl hover:bg-zinc-50 font-medium text-zinc-600 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{link.icon}</span> {link.label}
                                    </div>
                                </Link>
                                
                                {/* ✅ Mobile Sub-Themes List */}
                                {link.themes && (
                                    <div className="pl-12 pr-2 pb-2 space-y-1">
                                        {link.themes.map(theme => (
                                            <Link 
                                                key={theme.value} 
                                                href={`/shop?category=festival&theme=${theme.value}`}
                                                onClick={() => setIsOpen(false)}
                                                className="block text-xs font-medium text-zinc-500 py-1.5 px-3 rounded-lg hover:bg-zinc-50 hover:text-black border-l border-zinc-200"
                                            >
                                                {theme.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 mt-6">
                        {!user ? (
                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 bg-black text-white font-bold p-3 rounded-xl">Sign In</Link>
                        ) : (
                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 font-bold p-3 rounded-xl">Sign Out</button>
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
  if (!mounted) return <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-5xl h-[60px] bg-white/50 rounded-full animate-pulse" />;
  return <Suspense fallback={<div />}><NavbarContent /></Suspense>;
}