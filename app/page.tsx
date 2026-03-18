"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Play, Sparkles, MapPin, Calendar, Users, Award, ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { CityShowcase } from "@/components/home/CityShowcase";
import { FAQSection } from "@/components/home/FAQSection";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

// Wavy SVG Divider Component
const WaveDivider = ({ 
  fill = "#FDFCF8", 
  flip = false,
  variant = 1 
}: { 
  fill?: string; 
  flip?: boolean;
  variant?: 1 | 2 | 3 | 4;
}) => {
  const waves = {
    1: "M0,64 C220,120 440,20 660,64 C880,108 1100,20 1200,64 L1200,120 L0,120 Z",
    2: "M0,32 Q300,96 600,32 T1200,32 L1200,120 L0,120 Z",
    3: "M0,64 C150,96 300,32 450,64 C600,96 750,32 900,64 C1050,96 1150,48 1200,64 L1200,120 L0,120 Z",
    4: "M0,48 C200,96 400,0 600,48 C800,96 1000,0 1200,48 L1200,120 L0,120 Z"
  };

  return (
    <div className={`absolute ${flip ? 'top-0 rotate-180' : 'bottom-0'} left-0 w-full overflow-hidden leading-none z-10`}>
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="relative block w-full h-12 md:h-20"
      >
        <path d={waves[variant]} fill={fill} />
      </svg>
    </div>
  );
};

// Blob SVG Shape Component
const BlobShape = ({ className = "", fill = "#D4AF37" }: { className?: string; fill?: string }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <path
      fill={fill}
      d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.2C64.8,55.2,53.8,66.6,40.5,74.1C27.2,81.6,11.6,85.2,-3.6,90.5C-18.8,95.8,-33.6,102.8,-46.8,99.4C-60,96,-71.6,82.2,-79.4,66.8C-87.2,51.4,-91.2,34.4,-91.8,17.5C-92.4,0.6,-89.6,-16.2,-83.4,-31.4C-77.2,-46.6,-67.6,-60.2,-54.8,-68.2C-42,-76.2,-26,-78.6,-10.3,-76.6C5.4,-74.6,30.6,-83.6,44.7,-76.4Z"
      transform="translate(100 100)"
    />
  </svg>
);

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeCategorySlugs, setActiveCategorySlugs] = useState<Set<string>>(new Set());
  const [categoryImages, setCategoryImages] = useState<Map<string, string>>(new Map());
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch products to determine active categories and their primary images
    const fetchActiveCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const products = Array.isArray(res.data) ? res.data : (res.data.products || []);
        
        const slugs = new Set<string>();
        const imagesMap = new Map<string, string>();
        
        products.forEach((p: any) => {
          const slug = String(p.category).toLowerCase().trim();
          slugs.add(slug);
          // Store first product image found for this category
          if (!imagesMap.has(slug) && p.image) {
            imagesMap.set(slug, p.image);
          }
        });
        
        setActiveCategorySlugs(slugs);
        setCategoryImages(imagesMap);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoadingCats(false);
      }
    };

    fetchActiveCategories();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fullCategoriesList = [
    { name: "Birthdays", image: "/category/birthday.jpg", href: "/shop?category=birthday", slug: "birthday" },
    { name: "Weddings", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop", href: "/shop?category=wedding", slug: "wedding" },
    { name: "Haldi & Mehandi", image: "/category/haldimehandi.jpg", href: "/shop?category=haldi-mehandi", slug: "haldi-mehandi" },
    { name: "Engagement", image: "/category/engagement.jpg", href: "/shop?category=engagement", slug: "engagement" },
    { name: "Anniversary", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop", href: "/shop?category=anniversary", slug: "anniversary" },
    { name: "Festivals", image: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?q=80&w=2060&auto=format&fit=crop", href: "/shop?category=festival", slug: "festival" },
    { name: "Baby Shower", image: "/category/babyshower.jpg", href: "/shop?category=babyshower", slug: "babyshower" },
    { name: "Baby Welcome", image: "/category/babywelcome.jpg", href: "/shop?category=babywelcome", slug: "babywelcome" },
    { name: "Naming Ceremony", image: "/category/namingceremony.jpg", href: "/shop?category=namingceremony", slug: "namingceremony" },
    { name: "Annaprashan", image: "/category/annaprashan.png", href: "/shop?category=annaprashan", slug: "annaprashan" },
    { name: "Aged To Perfection", image: "/category/agedtoperfection.jpg", href: "/shop?category=agedtoperfection", slug: "agedtoperfection" },
    { name: "House Warming", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop", href: "/shop?category=housewarming", slug: "housewarming" },
    { name: "Bride To Be", image: "/category/bridetobe.jpg", href: "/shop?category=bridetobe", slug: "bridetobe" },
    { name: "Romantic", image: "/category/romantic.jpg", href: "/shop?category=romantic", slug: "romantic" },
    { name: "Corporate", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop", href: "/corporate", slug: "corporate" },
    { name: "Catering", image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop", href: "/catering", slug: "catering" },
  ];

  const categoriesList = useMemo(() => {
    const list = fullCategoriesList.map(cat => ({
      ...cat,
      // Priority 1: Use first product image from API
      // Priority 2: Use local category image (already in cat.image)
      // Priority 3: Default is birthday.jpg if nothing else exists
      image: (categoryImages.get(cat.slug) || cat.image || "/category/birthday.jpg")
    }));

    // Partition full list into available and unavailable
    const available = list.filter(cat => activeCategorySlugs.has(cat.slug));
    const unavailable = list.filter(cat => !activeCategorySlugs.has(cat.slug));
    
    // Combine them, putting available ones at the front
    return [...available, ...unavailable];
  }, [activeCategorySlugs, categoryImages]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Unique Asymmetric Design
      ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
    HERO SECTION - Desktop: Asymmetric | Mobile: Content + Wavy Carousel
═══════════════════════════════════════════════════════════ */}
<section className="relative min-h-screen lg:min-h-screen pt-16 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#FDFCF8] via-[#FBF9F3] to-[#F5EFE6]">
  
  {/* Animated Background Elements */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div 
      className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
      style={{ 
        background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
        transform: mounted ? `translateY(${scrollY * 0.1}px)` : 'none'
      }}
    />
    <div 
      className="absolute top-1/2 -left-48 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl"
      style={{ 
        background: "radial-gradient(circle, rgba(184,134,11,0.25) 0%, transparent 70%)",
        transform: mounted ? `translateY(${scrollY * -0.05}px)` : 'none'
      }}
    />
    
    <svg className="absolute top-20 left-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
      <pattern id="heroPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <circle cx="30" cy="30" r="1.5" fill="#D4AF37" />
        <circle cx="0" cy="0" r="1" fill="#B8860B" />
        <circle cx="60" cy="60" r="1" fill="#B8860B" />
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#heroPattern)" />
    </svg>

    <svg className="absolute top-32 right-10 w-48 h-48 opacity-20 hidden lg:block" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="8 4" className="animate-spin-slow" style={{ animationDuration: '60s' }} />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#B8860B" strokeWidth="0.5" strokeDasharray="4 8" className="animate-spin-slow" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
    </svg>
  </div>

  <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-16">
    
    {/* ═══════════════════════════════════════════════════════════
        MOBILE LAYOUT (< lg screens)
    ═══════════════════════════════════════════════════════════ */}
    <div className="lg:hidden">
      
      {/* Mobile: Content First */}
      <div className="text-center mb-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 shadow-lg mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-700">
            Premium Event Designers
          </span>
        </div>

        {/* Mobile Headline */}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-zinc-900 mb-6">
          <span className="block">Crafting</span>
          <span className="block">
            <span className="relative inline-block">
              Magical
              <svg 
                className="absolute -bottom-1 left-0 w-full h-3" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
                fill="none"
              >
                <path 
                  d="M0,8 Q25,2 50,8 T100,8" 
                  stroke="url(#underlineGradientMobile)" 
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underlineGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#B8860B]">
            Moments
          </span>
        </h1>

        {/* Mobile Subtext */}
        <p className="text-zinc-600 text-base leading-relaxed max-w-md mx-auto mb-8">
          Transform your celebrations into 
          <span className="font-medium text-zinc-800"> unforgettable experiences</span>
        </p>

        {/* Mobile CTA */}
        <Link href="/shop">
          <Button className="w-full sm:w-auto group relative bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-6 rounded-full font-semibold overflow-hidden transition-all duration-500 shadow-xl shadow-zinc-900/20">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Explore Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE: Wavy Image Carousel Banner
      ════════════════════════════════════════════════════════ */}
      <div className="relative mt-8 -mx-4">
        {/* Wavy SVG Top Border */}
        <svg className="w-full h-6 text-[#D4AF37]/20" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path 
            d="M0,20 C100,35 200,5 300,20 C400,35 500,5 600,20 C700,35 800,5 900,20 C1000,35 1100,5 1200,20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          />
        </svg>
        
        {/* Scrolling Carousel */}
        <div className="relative overflow-hidden py-4 bg-gradient-to-r from-[#D4AF37]/5 via-[#B8860B]/5 to-[#D4AF37]/5">
          {/* First Row - Scrolling Left */}
          <div className="flex gap-4 animate-scroll-left mb-4">
            {(categoriesList.length > 0 ? [...categoriesList, ...categoriesList] : []).map((cat, i) => (
              <div 
                key={`row1-${i}`} 
                className="relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-lg"
                style={{
                  transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})`,
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-bold truncate">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Second Row - Scrolling Right */}
          <div className="flex gap-4 animate-scroll-right">
            {(categoriesList.length > 0 ? [...categoriesList.slice().reverse(), ...categoriesList.slice().reverse()] : []).map((cat, i) => (
              <div 
                key={`row2-${i}`} 
                className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-lg"
                style={{
                  transform: `rotate(${i % 2 === 0 ? '3deg' : '-3deg'})`,
                }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-bold truncate">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Gradient Fade Edges */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FDFCF8] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FDFCF8] to-transparent z-10 pointer-events-none" />
        </div>
        
        {/* Wavy SVG Bottom Border */}
        <svg className="w-full h-6 text-[#D4AF37]/20" viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path 
            d="M0,20 C100,5 200,35 300,20 C400,5 500,35 600,20 C700,5 800,35 900,20 C1000,5 1100,35 1200,20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          />
        </svg>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse z-20" />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-3 h-3 rounded-full bg-[#B8860B] animate-pulse z-20" />
      </div>

      {/* Stats Row - Compact */}
      <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-zinc-200/50">
        <div className="text-center">
          <p className="text-2xl font-serif font-bold text-[#D4AF37]">7+</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Years</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-serif font-bold text-[#D4AF37]">50K+</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Events</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-serif font-bold text-[#D4AF37]">16</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Cities</p>
        </div>
      </div>
    </div>

    {/* ═══════════════════════════════════════════════════════════
        DESKTOP LAYOUT (lg+ screens) - UNCHANGED (minus trust indicators)
    ═══════════════════════════════════════════════════════════ */}
    <div className="hidden lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[80vh]">
      
      {/* Left Content Column - Desktop */}
      <div className="lg:col-span-5 relative z-20">
        
        {/* Floating Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 shadow-lg mb-6"
          style={{ 
            transform: mounted ? `translateY(${scrollY * 0.05}px)` : 'none',
            transition: 'transform 0.1s ease-out'
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-700">
            Premium Event Designers
          </span>
        </div>

        {/* Main Headline */}
        <div className="relative mb-8">
          <h1 className="font-serif text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-zinc-900">
            <span className="block">Crafting</span>
            <span className="block">
              <span className="relative inline-block">
                Magical
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-4" 
                  viewBox="0 0 100 12" 
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path 
                    d="M0,8 Q25,2 50,8 T100,8" 
                    stroke="url(#underlineGradient)" 
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="50%" stopColor="#B8860B" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C5A028] to-[#B8860B]">
              Moments
            </span>
          </h1>
          
          <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent rounded-full" />
        </div>

        {/* Subheadline */}
        <p className="text-zinc-600 text-lg lg:text-xl max-w-md mb-10 leading-relaxed font-light">
          Transform your celebrations into 
          <span className="font-medium text-zinc-800"> unforgettable experiences</span>. 
          From intimate gatherings to grand festivities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/shop">
            <Button className="group relative bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-7 rounded-full font-semibold text-base overflow-hidden transition-all duration-500 shadow-xl shadow-zinc-900/20">
              <span className="relative z-10 flex items-center gap-2">
                Explore Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </Link>
          
          <Link href="/about">
            <button className="group flex items-center gap-3 px-2 py-2 text-zinc-700 hover:text-zinc-900 transition-colors">
              <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-zinc-100 group-hover:border-[#D4AF37] shadow-lg transition-all duration-300">
                <Play className="w-5 h-5 fill-zinc-700 group-hover:fill-[#D4AF37] ml-0.5 transition-colors" />
                <span className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 animate-ping opacity-0 group-hover:opacity-100" />
              </span>
              <span className="text-sm font-semibold">Watch Our Story</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Right Image Column - Desktop (All your scattered images) */}
      <div className="lg:col-span-7 relative h-[650px]">
        
        {/* Main Hero Image */}
        <div 
          className="absolute top-[10%] right-[10%] w-[60%] h-[65%] z-10"
          style={{ 
            transform: mounted ? `translateY(${scrollY * -0.03}px)` : 'none',
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="relative w-full h-full p-[3px] rounded-[2.5rem] bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">
            <div className="relative w-full h-full rounded-[calc(2.5rem-3px)] overflow-hidden bg-zinc-100">
              <Image src="/hero-event-decoration.jpg" alt="Luxury Event" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          </div>

          <div 
            className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-2xl border border-zinc-100 z-20"
            style={{ 
              transform: mounted ? `translateY(${scrollY * 0.08}px)` : 'none',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-zinc-900">7+</p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Years Legacy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image 1 - Circle */}
        <div 
          className="absolute bottom-[5%] left-[2%] w-48 h-48 z-20"
          style={{ transform: mounted ? `translateY(${scrollY * 0.05}px)` : 'none' }}
        >
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '15s' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="circleGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="46" fill="none" stroke="url(#circleGradient1)" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-3 rounded-full overflow-hidden border-[3px] border-white shadow-xl">
              <Image src="/category/birthday.jpg" alt="Birthday" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Image 2 - Hexagon */}
        <div 
          className="absolute top-[2%] left-[8%] w-36 h-36 z-20"
          style={{ transform: mounted ? `translateY(${scrollY * 0.04}px)` : 'none' }}
        >
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
              <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" fill="none" stroke="url(#hexGradient)" strokeWidth="2" strokeDasharray="10 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-3 overflow-hidden" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
              <Image src="/category/birthday.jpg" alt="Birthday" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Image 3 - Diamond */}
        <div 
          className="absolute top-[0%] right-[2%] w-32 h-32 z-20"
          style={{ transform: mounted ? `translateY(${scrollY * -0.03}px)` : 'none' }}
        >
          <div className="relative w-full h-full" style={{ transform: 'rotate(45deg)' }}>
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '18s' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="92" height="92" rx="12" ry="12" fill="none" stroke="url(#squareGradient)" strokeWidth="2" strokeDasharray="12 6" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-3 rounded-xl overflow-hidden border-2 border-white shadow-xl">
              <Image src="/category/romantic.jpg" alt="Romantic" fill className="object-cover" style={{ transform: 'rotate(-45deg) scale(1.5)' }} />
            </div>
          </div>
        </div>

        {/* Image 4 - Small Circle */}
        <div 
          className="absolute top-[50%] right-[0%] w-28 h-28 z-20"
          style={{ transform: mounted ? `translateY(${scrollY * 0.06}px)` : 'none' }}
        >
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="circleGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B8860B" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="46" fill="none" stroke="url(#circleGradient2)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <Image src="/category/babyshower.jpg" alt="Baby Shower" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Image 5 - Pentagon */}
        <div 
          className="absolute bottom-[2%] right-[20%] w-32 h-32 z-20"
          style={{ transform: mounted ? `translateY(${scrollY * 0.04}px)` : 'none' }}
        >
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '22s' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="pentaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
              </defs>
              <polygon points="50,2 97,35 80,95 20,95 3,35" fill="none" stroke="url(#pentaGradient)" strokeWidth="2" strokeDasharray="8 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-3 overflow-hidden" style={{ clipPath: "polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%)" }}>
              <Image src="/category/bridetobe.jpg" alt="Bride To Be" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Image 6 - Octagon */}
        <div 
          className="absolute top-[35%] left-[0%] w-28 h-28 z-20"
          style={{ transform: mounted ? `translateY(${scrollY * -0.05}px)` : 'none' }}
        >
          <div className="relative w-full h-full">
            <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="octaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B8860B" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
              <polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="none" stroke="url(#octaGradient)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-2 overflow-hidden" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}>
              <Image src="/category/haldimehandi.jpg" alt="Haldi" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[25%] right-[35%]">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
        </div>
        <div className="absolute top-[45%] left-[25%]">
          <div className="w-2 h-2 rounded-full bg-[#B8860B] animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="absolute bottom-[25%] right-[35%]">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]/70 animate-bounce" style={{ animationDelay: '0.8s' }} />
        </div>
        <svg className="absolute bottom-[30%] left-[30%] w-20 h-20 opacity-25" viewBox="0 0 100 100">
          <path d="M10,50 Q50,10 90,50" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>

    {/* Scroll Indicator - Desktop Only */}
    <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce">
      <span className="text-xs text-zinc-400 uppercase tracking-widest">Scroll</span>
      <ArrowDown className="w-4 h-4 text-[#D4AF37]" />
    </div>
  </div>

  {/* Wave Divider */}
  <WaveDivider fill="#FFFFFF" variant={1} />
</section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORY SECTION - With Gradient Background
      ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
    CATEGORY SECTION - Desktop: Grid | Mobile: Horizontal Scroll + Mini Grid
═══════════════════════════════════════════════════════════ */}
<section className="relative py-16 md:py-28 px-4 md:px-6 bg-gradient-to-b from-white via-white to-[#FBF7F0]">
  
  {/* Subtle Pattern Overlay */}
  <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }} />
  </div>

  <div className="max-w-7xl mx-auto relative">
    
    {/* Section Header */}
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 gap-4">
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-block w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full" />
          <span className="text-[#B8860B] text-xs font-bold tracking-[0.2em] uppercase">Our Expertise</span>
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-zinc-900">
          Event <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Specialities</span>
        </h2>
        <p className="text-zinc-500 mt-3 text-sm md:text-lg max-w-md">
          Curated experiences for every milestone
        </p>
      </div>
      <Link
        href="/shop"
        className="hidden md:flex group items-center gap-3 text-sm font-bold uppercase tracking-wider text-zinc-600 hover:text-[#D4AF37] transition-colors"
      >
        <span>Explore All</span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-current group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-white transition-all duration-300">
          <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </div>

    {/* ════════════════════════════════════════════════════════
        MOBILE: Horizontal Scroll Featured + Mini Grid
    ════════════════════════════════════════════════════════ */}
    {/* ════════════════════════════════════════════════════════
    MOBILE: Horizontal Scroll Featured + Mini Grid
════════════════════════════════════════════════════════ */}
<div className="md:hidden">
  {/* Featured - Horizontal Scroll (7 items) */}
  <div className="relative -mx-4 mb-6">
    <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide snap-x snap-mandatory">
      {categoriesList.slice(0, 7).map((cat, index) => (
        <Link
          key={cat.name}
          href={cat.href}
          className="group relative flex-shrink-0 w-[200px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg snap-start"
        >
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            className="object-cover transition-transform duration-500 group-active:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold">
              <Sparkles className="w-3 h-3" />
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-serif text-lg font-bold leading-tight mb-1">
              {cat.name}
            </h3>
            <div className="h-0.5 w-8 bg-[#D4AF37] rounded-full" />
          </div>
        </Link>
      ))}
    </div>
    
    {/* Scroll Hint */}
    <div className="flex justify-center gap-1 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#D4AF37]' : 'bg-zinc-200'}`} />
      ))}
    </div>
  </div>

  {/* Remaining Categories - Compact 3-Column Grid (9 items) */}
  <div className="grid grid-cols-3 gap-2">
    {categoriesList.slice(7).map((cat) => (
      <Link
        key={cat.name}
        href={cat.href}
        className="group relative bg-white rounded-xl p-2 border border-zinc-100 hover:border-[#D4AF37]/30 hover:shadow-lg transition-all text-center"
      >
        <div className="relative w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2 border-zinc-100 group-hover:border-[#D4AF37] transition-colors">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            className="object-cover"
          />
        </div>
        <h4 className="text-[10px] font-bold text-zinc-700 leading-tight line-clamp-2">
          {cat.name}
        </h4>
      </Link>
    ))}
  </div>

  {/* Mobile View All Button */}
  <Link href="/shop" className="block mt-6">
    <Button variant="outline" className="w-full rounded-full border-zinc-200 h-12 font-bold text-zinc-700">
      View All Categories
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </Link>
</div>

    {/* ════════════════════════════════════════════════════════
        DESKTOP: Original Grid Layout
    ════════════════════════════════════════════════════════ */}
    <div className="hidden md:block">
      {/* Main Category Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {categoriesList.slice(0, 8).map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute top-0 right-0 w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M100,0 L100,100 L0,0 Z" fill="rgba(212,175,55,0.2)" />
              </svg>
            </div>

            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold">
                <Sparkles className="w-3 h-3" />
                Premium
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                <h3 className="text-white font-serif text-2xl font-bold leading-tight mb-2">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-8 bg-[#D4AF37] group-hover:w-16 transition-all duration-500 rounded-full" />
                  <span className="text-[#D4AF37] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute inset-3 border border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-500 pointer-events-none" />
          </Link>
        ))}
      </div>

      {/* Secondary Categories */}
      <div className="grid grid-cols-8 gap-4">
        {categoriesList.slice(8).map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative bg-white border border-zinc-100 rounded-2xl p-4 hover:border-[#D4AF37]/30 hover:shadow-xl hover:bg-gradient-to-br hover:from-white hover:to-[#FBF7F0] transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden border-2 border-zinc-100 group-hover:border-[#D4AF37] transition-colors shadow-sm">
              <Image
                src={cat.image}
                alt={cat.name}
                width={56}
                height={56}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h4 className="text-xs font-bold text-zinc-700 group-hover:text-[#B8860B] transition-colors leading-tight">
              {cat.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  </div>

  {/* Wave Divider */}
  <WaveDivider fill="#18181b" variant={2} />
</section>

      {/* ═══════════════════════════════════════════════════════════
          STATS SECTION - Dark with Gradient
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#B8860B]/10 blur-3xl" />
          
          {/* Dot Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.5) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              Our Journey
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white">
              Numbers That <span className="text-[#D4AF37]">Speak</span>
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Calendar, val: "50K+", label: "Events Crafted" },
              { icon: Users, val: "1k+", label: "Happy Families" },
              { icon: Award, val: "7+", label: "Years Excellence" },
              { icon: MapPin, val: "16", label: "Cities Covered" },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 text-center"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Number */}
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                  {stat.val}
                </h4>
                
                {/* Label */}
                <p className="text-white/60 text-sm tracking-wider uppercase font-medium">
                  {stat.label}
                </p>

                {/* Corner Decoration */}
                <div className="absolute top-4 right-4 w-6 h-6">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-[#D4AF37]/30">
                    <path d="M0,0 L24,0 L24,24" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <WaveDivider fill="#FDFCF8" variant={3} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED COLLECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <FeaturedCollection />

      {/* ═══════════════════════════════════════════════════════════
          CITY SHOWCASE
      ═══════════════════════════════════════════════════════════ */}
      <CityShowcase />

      {/* ═══════════════════════════════════════════════════════════
          BOOKING BANNER - Gradient Design
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-8 md:py-12 px-4 md:px-8 bg-gradient-to-b from-[#FBF7F0] to-[#F5EFE6]">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              
              {/* Left - Image */}
              <div className="relative h-[280px] md:h-[450px]">
                <Image 
                  src="/hero-event-decoration.jpg" 
                  alt="Wedding Planning" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-900/80 via-zinc-900/50 to-transparent" />
                
                {/* Decorative Frame */}
                <div className="absolute inset-6 md:inset-8 border border-white/20 rounded-2xl pointer-events-none" />
                
                {/* Badge */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">2026 Dates</p>
                      <p className="text-xs text-zinc-500">Booking Open</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
                
                <span className="relative text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                  Limited Offer
                </span>
                <h2 className="relative font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                  Planning Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">Dream Wedding?</span>
                </h2>
                <p className="relative text-zinc-400 mb-8 text-base md:text-lg max-w-md leading-relaxed">
                  2026 dates are filling rapidly. Book your consultation today and receive <span className="text-[#D4AF37] font-semibold">15% off</span> on early bookings.
                </p>
                
                <div className="relative flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white px-8 h-14 font-bold shadow-lg shadow-[#D4AF37]/20 transition-all duration-500"
                  >
                    <Link href="/contact">Book Consultation</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full border-white/20 text-black hover:bg-white/10 px-8 h-14"
                  >
                    <Link href="/shop?category=wedding">View Packages</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#F5EFE6] via-[#FDFCF8] to-white">
        <FAQSection />
        <WaveDivider fill="#FDFCF8" variant={4} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS - Gradient Background
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 px-4 md:px-6 bg-gradient-to-br from-[#FDFCF8] via-[#FBF9F3] to-[#F5EFE6] overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-[#D4AF37]/10 hidden lg:block" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#D4AF37]/5 blur-2xl hidden lg:block" />
        
        <div className="max-w-7xl mx-auto relative">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              Testimonials
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              Stories From
              <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Happy Clients</span>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Ananya Iyer",
                role: "Bride, Mumbai",
                quote: "The floral mandap they designed was beyond my dreams. It felt like walking into a fairytale. Truly the best decorators in the city.",
                image: "/category/wedding.jpg"
              },
              {
                name: "Rajesh Mehra",
                role: "Corporate HR, Delhi",
                quote: "Exceptional coordination for our annual gala. The lighting and stage setup were world-class. Professional & timely execution.",
                image: "/category/agedtoperfection.jpg"
              },
              {
                name: "Sneha Kapoor",
                role: "Mother, Bangalore",
                quote: "The theme execution for my son's first birthday was magical. Every detail, from the entrance to the cake table, was absolutely perfect.",
                image: "/category/birthday.jpg"
              },
            ].map((t, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-3xl p-7 md:p-9 shadow-lg hover:shadow-2xl transition-all duration-500 border border-zinc-100/50"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-6xl font-serif text-[#D4AF37]/10 leading-none">
                  "
                </div>

                {/* Stars */}
                <div className="relative flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="relative text-lg font-serif italic text-zinc-600 mb-8 leading-relaxed group-hover:text-zinc-800 transition-colors">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="relative flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#D4AF37]/30 shadow-md">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{t.name}</p>
                    <p className="text-sm text-zinc-500">{t.role}</p>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Wave Divider */}
        <WaveDivider fill="#18181b" variant={1} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA - Dark Gradient
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero-event-decoration.jpg"
            alt="Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-zinc-900" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 md:px-6">
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6 px-5 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Sparkles className="w-4 h-4" />
            Start Your Journey
          </span>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Let's Create
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">Something Beautiful</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Every celebration deserves to be extraordinary. Share your vision with us, 
            and watch as we transform it into an unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-zinc-900 hover:bg-[#D4AF37] hover:text-white px-10 h-16 text-lg font-bold transition-all duration-500 shadow-xl"
            >
              <Link href="/contact">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/30 text-black hover:bg-white/10 px-10 h-16 text-lg"
            >
              <Link href="/shop">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}