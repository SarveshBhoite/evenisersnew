"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, MapPin, ChevronDown, Search, X, Loader2, LayoutGrid, Package, Lock, ChevronRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation, CITIES } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LocationModal } from "./LocationModal";
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

// ✅ DATA: UNCHANGED
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
    { label: "Aged To Perfection", href: "/shop?category=agedtoperfection", icon: "🍚" },
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

    // ALL STATE - UNCHANGED
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // ✅ SCROLL DIRECTION DETECTION
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show navbar when near top (< 100px)
            if (currentScrollY < 100) {
                setIsVisible(true);
            } 
            // Hide on scroll DOWN, Show on scroll UP
            else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
            
            // Set global variable for sticky elements to sync
            document.documentElement.style.setProperty(
                '--navbar-offset', 
                currentScrollY < 100 || (currentScrollY < lastScrollY) ? '88px' : '0px'
            );
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // ALL LINKS - UNCHANGED
    const mainLinks = [
        { href: "/", label: "Home" },
        { href: "/shop", label: "All Packages" },
    ];

    const finalLink = (user?.role === "admin" || user?.role === "employee")
        ? { href: "/admin/dashboard", label: "Dashboard" }
        : { href: "/contact", label: "Contact Us" };

    // ALL HANDLERS - UNCHANGED
    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsCategoryOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsCategoryOpen(false);
            setHoveredCategory(null);
        }, 200);
    };

    // ALL EFFECTS - UNCHANGED
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
        <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
            isVisible ? 'top-6 opacity-100' : '-top-24 opacity-0'
        } ${isSearchOpen ? 'w-[95%] max-w-5xl' : 'w-[95%] md:w-[85%] lg:w-[75%] max-w-5xl'}`}>
            <div className="backdrop-blur-xl bg-white/85 rounded-full border border-white/60 shadow-xl px-6 py-3 relative">
                <div className="flex items-center justify-between">

                    {/* ═══ LEFT: Logo & Location ═══ */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logobg.png"
                                alt="Evenizers Logo"
                                width={100}
                                height={100}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </Link>

                        <div className="hidden md:block h-6 w-[1px] bg-zinc-300 mx-1" />

                        {/* CITY DROPDOWN - Styled */}
                        <div className="hidden md:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none">
                                    <div
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer px-2.5 py-1.5 rounded-md bg-zinc-100/50 text-zinc-500 hover:text-[#B8860B] border border-transparent hover:border-[#D4AF37]/30"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                                        {city}
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </div>
                                </DropdownMenuTrigger>

                                {/* ✅ PREMIUM CITY DROPDOWN */}
                                <DropdownMenuContent align="start" className="w-[480px] bg-white backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-zinc-100 mt-4">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 px-3 py-2.5 mb-1">
                                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                            <MapPin className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Select City</span>
                                    </div>
                                    <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-2" />
                                    
                                    <div className="grid grid-cols-2 gap-1 px-1">
                                        {CITIES.map((c) => (
                                            <DropdownMenuItem 
                                                key={c} 
                                                onClick={() => setCity(c)} 
                                                className={`cursor-pointer rounded-xl py-2.5 px-4 text-sm font-medium transition-all ${
                                                    city === c 
                                                        ? "bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/5 text-[#B8860B] border border-[#D4AF37]/20" 
                                                        : "hover:bg-zinc-50 text-zinc-700"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className={`w-3.5 h-3.5 ${city === c ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
                                                        {c}
                                                    </div>
                                                    {city === c && (
                                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                                    )}
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* ═══ MIDDLE: Links (Desktop) ═══ */}
                    {!isSearchOpen && (
                        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-[#B8860B] hover:bg-[#D4AF37]/5 transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* ✅ PREMIUM CATEGORIES DROPDOWN */}
                            <div
                                className="relative pb-2 -mb-2"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all cursor-pointer outline-none ${
                                    isCategoryOpen ? 'text-[#B8860B] bg-[#D4AF37]/10' : 'text-zinc-500 hover:text-[#B8860B] hover:bg-[#D4AF37]/5'
                                }`}>
                                    Categories 
                                    <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isCategoryOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[620px] bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        
                                        {/* Arrow */}
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-zinc-100" />
                                        
                                        {/* Header */}
                                        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-zinc-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-zinc-900">Event Categories</h4>
                                                    <p className="text-[10px] text-zinc-400">Browse all celebration types</p>
                                                </div>
                                            </div>
                                            <Link 
                                                href="/shop" 
                                                className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#D4AF37] transition-colors"
                                            >
                                                View All →
                                            </Link>
                                        </div>

                                        {/* Categories Grid */}
                                        <div className="p-4 grid grid-cols-2 gap-1">
                                            {CATEGORY_DATA.map((cat) => (
                                                <div
                                                    key={cat.label}
                                                    className="relative group/item"
                                                    onMouseEnter={() => setHoveredCategory(cat.label)}
                                                >
                                                    <Link
                                                        href={cat.href}
                                                        className={`flex items-center justify-between gap-3 p-3 rounded-xl transition-all ${
                                                            hoveredCategory === cat.label 
                                                                ? 'bg-gradient-to-r from-[#D4AF37]/10 to-transparent' 
                                                                : 'hover:bg-zinc-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl group-hover/item:scale-110 transition-transform">{cat.icon}</span>
                                                            <span className={`font-semibold text-sm transition-colors ${
                                                                hoveredCategory === cat.label ? 'text-[#B8860B]' : 'text-zinc-700 group-hover/item:text-zinc-900'
                                                            }`}>
                                                                {cat.label}
                                                            </span>
                                                        </div>
                                                        {cat.themes && (
                                                            <ChevronRight className={`w-4 h-4 transition-colors ${
                                                                hoveredCategory === cat.label ? 'text-[#D4AF37]' : 'text-zinc-300'
                                                            }`} />
                                                        )}
                                                    </Link>

                                                    {/* ✅ PREMIUM THEME FLYOUT */}
                                                    {cat.themes && hoveredCategory === cat.label && (
                                                        <div className="absolute top-0 left-full ml-2 w-64 bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-left-2 duration-200">
                                                            {/* Flyout Header */}
                                                            <div className="px-4 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-b border-zinc-100">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg">{cat.icon}</span>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-zinc-900">{cat.label}</p>
                                                                        <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Select Theme</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="p-2">
                                                                {cat.themes.map((theme) => (
                                                                    <Link
                                                                        key={theme.value}
                                                                        href={`/shop?category=festival&theme=${theme.value}`}
                                                                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-[#D4AF37]/5 hover:text-[#B8860B] transition-all group/theme"
                                                                    >
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover/theme:bg-[#D4AF37] transition-colors" />
                                                                        {theme.label}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={finalLink.href}
                                className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-[#B8860B] hover:bg-[#D4AF37]/5 transition-all"
                            >
                                {finalLink.label}
                            </Link>
                        </div>
                    )}

                    {/* ═══ RIGHT: Actions ═══ */}
                    <div className="flex items-center gap-2 shrink-0 justify-end">

                        {/* Search - Styled */}
                        <div ref={searchRef} className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-[180px] md:w-[250px]' : 'w-auto'}`}>
                            {isSearchOpen ? (
                                <div className="relative w-full">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search events..."
                                        className="w-full bg-zinc-100/80 border border-zinc-200 rounded-full pl-9 pr-8 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]/50 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
                                    <X className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-black" onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }} />

                                    {/* ✅ PREMIUM SEARCH RESULTS */}
                                    {searchTerm.length > 1 && (
                                        <div className="absolute top-full right-0 w-[300px] mt-3 bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden max-h-[350px] overflow-y-auto z-[60]">
                                            {/* Search Header */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-[#D4AF37]/5 to-transparent border-b border-zinc-100 sticky top-0 bg-white">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                    {isSearching ? 'Searching...' : `${searchResults.length} Results`}
                                                </p>
                                            </div>
                                            
                                            {searchResults.length > 0 ? (
                                                <div className="flex flex-col p-2 gap-0.5">
                                                    {searchResults.map((item: any) => (
                                                        <div 
                                                            key={item._id} 
                                                            onClick={() => { 
                                                                setIsSearchOpen(false); 
                                                                setSearchTerm(""); 
                                                                router.push(item.type === "category" ? item.link : `/product/${item._id}`); 
                                                            }} 
                                                            className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-[#D4AF37]/5 transition-all group/result"
                                                        >
                                                            <div className={`h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${
                                                                item.type === "category" 
                                                                    ? 'bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10' 
                                                                    : 'bg-zinc-100'
                                                            }`}>
                                                                {item.type === "category" 
                                                                    ? <LayoutGrid className="w-4 h-4 text-[#D4AF37]" /> 
                                                                    : <img 
                                                                        src={item.image ? (item.image.startsWith("http") ? item.image : `${SERVER_URL}${item.image}`) : "/placeholder.jpg"} 
                                                                        className="h-full w-full object-cover" 
                                                                        alt="" 
                                                                      />
                                                                }
                                                            </div>
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <span className="text-sm font-bold text-zinc-800 line-clamp-1 group-hover/result:text-[#B8860B] transition-colors">
                                                                    {item.name}
                                                                </span>
                                                                <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                                                                    {item.type === "category" ? "Category" : item.category}
                                                                </span>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover/result:text-[#D4AF37] flex-shrink-0 transition-colors" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : !isSearching && (
                                                <div className="p-6 text-center">
                                                    <Search className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
                                                    <p className="text-xs text-zinc-400">No results found</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button onClick={() => setIsSearchOpen(true)} className="p-2.5 hover:bg-[#D4AF37]/10 rounded-full transition-colors group">
                                    <Search className="w-4.5 h-4.5 text-zinc-600 group-hover:text-[#D4AF37]" />
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <Link href="/cart" className="relative group p-2.5 hover:bg-[#D4AF37]/10 rounded-full transition-colors">
                            <ShoppingCart className="w-4.5 h-4.5 text-zinc-600 group-hover:text-[#D4AF37]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* ✅ PREMIUM USER DROPDOWN */}
                        <div className="hidden md:block pl-2 border-l border-zinc-200 ml-1">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none">
                                        <Avatar className="h-9 w-9 border-2 border-[#D4AF37]/30 shadow-sm hover:border-[#D4AF37] hover:scale-105 transition-all cursor-pointer">
                                            <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white font-serif font-bold text-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-white backdrop-blur-xl shadow-2xl border border-zinc-100 mt-4">
                                        {/* User Info Header */}
                                        <div className="px-3 py-3 mb-1 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl border border-[#D4AF37]/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-bold text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                                                    <p className="text-[10px] text-zinc-500 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenuItem 
                                            className="cursor-pointer rounded-xl py-3 text-sm font-medium hover:bg-[#D4AF37]/5 hover:text-[#B8860B] transition-all" 
                                            onClick={() => router.push('/user/profile')}
                                        >
                                            <User className="mr-3 h-4 w-4 text-zinc-400" /> My Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="cursor-pointer rounded-xl py-3 text-sm font-medium hover:bg-[#D4AF37]/5 hover:text-[#B8860B] transition-all" 
                                            onClick={() => router.push('/user/my-orders')}
                                        >
                                            <Package className="mr-3 h-4 w-4 text-zinc-400" /> My Orders
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="cursor-pointer rounded-xl py-3 text-sm font-medium hover:bg-[#D4AF37]/5 hover:text-[#B8860B] transition-all" 
                                            onClick={() => router.push('/user/change-password')}
                                        >
                                            <Lock className="mr-3 h-4 w-4 text-zinc-400" /> Change Password
                                        </DropdownMenuItem>
                                        
                                        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent my-1" />
                                        
                                        <DropdownMenuItem 
                                            className="cursor-pointer rounded-xl py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all" 
                                            onClick={logout}
                                        >
                                            <LogOut className="mr-3 h-4 w-4" /> Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login" className="flex items-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-5 py-2 rounded-full text-xs font-bold hover:from-[#D4AF37] hover:to-[#B8860B] transition-all shadow-lg shadow-zinc-900/20 hover:shadow-[#D4AF37]/30">
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu - UNCHANGED LOGIC, STYLED */}
                        <div className="md:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2 h-9 w-9 hover:bg-[#D4AF37]/10">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] flex flex-col p-0 overflow-y-auto">
                                    {/* Mobile Header */}
                                    <SheetHeader className="text-left p-6 border-b border-zinc-100">
                                        <SheetTitle>
                                            <Image
                                                src="/logobg.png"
                                                alt="Evenizers Logo"
                                                width={40}
                                                height={40}
                                                className="h-10 w-auto object-contain"
                                            />
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        {/* User Card */}
                                        {user && (
                                            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-4 mb-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Avatar className="h-10 w-10 border-2 border-[#D4AF37]/30">
                                                        <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white font-serif">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-zinc-900">{user.name}</span>
                                                        <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">{user.role}</span>
                                                    </div>
                                                </div>

                                                <div className="grid gap-1">
                                                    <Link href="/user/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-[#B8860B]">
                                                        <User className="w-4 h-4" /> My Profile
                                                    </Link>
                                                    <Link href="/user/my-orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-[#B8860B]">
                                                        <Package className="w-4 h-4" /> My Orders
                                                    </Link>
                                                    <Link href="/user/change-password" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm p-2 hover:bg-white rounded-lg transition-colors text-zinc-600 hover:text-[#B8860B]">
                                                        <Lock className="w-4 h-4" /> Change Password
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Links */}
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] uppercase font-bold text-[#D4AF37] mb-2 px-2 tracking-widest">Browse</p>
                                            {mainLinks.map((link) => (
                                                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="px-3 py-2.5 rounded-xl hover:bg-[#D4AF37]/5 font-medium text-zinc-800 flex items-center gap-3 hover:text-[#B8860B] transition-all">
                                                    {link.label}
                                                </Link>
                                            ))}
                                            
                                            <div className="h-px bg-gradient-to-r from-[#D4AF37]/20 via-zinc-200 to-transparent my-3" />
                                            <p className="text-[10px] uppercase font-bold text-[#D4AF37] mb-2 px-2 tracking-widest">Events</p>

                                            {CATEGORY_DATA.map((link) => (
                                                <div key={link.label}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => !link.themes && setIsOpen(false)}
                                                        className="px-3 py-2.5 rounded-xl hover:bg-[#D4AF37]/5 font-medium text-zinc-600 flex items-center justify-between group hover:text-[#B8860B] transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-lg">{link.icon}</span> {link.label}
                                                        </div>
                                                    </Link>

                                                    {link.themes && (
                                                        <div className="pl-12 pr-2 pb-2 space-y-1">
                                                            {link.themes.map(theme => (
                                                                <Link
                                                                    key={theme.value}
                                                                    href={`/shop?category=festival&theme=${theme.value}`}
                                                                    onClick={() => setIsOpen(false)}
                                                                    className="block text-xs font-medium text-zinc-500 py-1.5 px-3 rounded-lg hover:bg-[#D4AF37]/5 hover:text-[#B8860B] border-l-2 border-zinc-200 hover:border-[#D4AF37] transition-all"
                                                                >
                                                                    {theme.label}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mobile Footer */}
                                    <div className="border-t border-zinc-100 p-6">
                                        {!user ? (
                                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white font-bold p-3 rounded-xl hover:from-[#D4AF37] hover:to-[#B8860B] transition-all">
                                                Sign In
                                            </Link>
                                        ) : (
                                            <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 font-bold p-3 rounded-xl transition-colors">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
                <LocationModal manualOpen={isLocationModalOpen} setManualOpen={setIsLocationModalOpen} />
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