"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Coffee, Flame, Wine, ShieldCheck, ChefHat, Leaf, Sparkles, Star, Phone, ArrowDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Wavy Divider
const WaveDivider = ({ fill = "#FDFCF8", variant = 1 }: { fill?: string; variant?: 1 | 2 }) => {
  const waves = {
    1: "M0,64 C220,120 440,20 660,64 C880,108 1100,20 1200,64 L1200,120 L0,120 Z",
    2: "M0,48 C200,96 400,0 600,48 C800,96 1000,0 1200,48 L1200,120 L0,120 Z"
  };
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-24">
        <path d={waves[variant]} fill={fill} />
      </svg>
    </div>
  );
};

export default function CateringPage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeOffering, setActiveOffering] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SAME DATA - UNCHANGED
  const offerings = [
    { title: "Live Counters", desc: "Interactive stations serving fresh pasta, chaat, and global street food prepared right before your eyes.", icon: Flame, img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop" },
    { title: "Premium Buffets", desc: "Multi-cuisine spreads designed for grand weddings and corporate galas with 50+ dish options.", icon: Utensils, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop" },
    { title: "High Tea & Snacks", desc: "Elegant evening setups with artisan teas, pastries, and savory bites for intimate gatherings.", icon: Coffee, img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop" },
    { title: "Plated Dinners", desc: "Luxurious multi-course sit-down meals with dedicated butler service for a royal experience.", icon: Wine, img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000&auto=format&fit=crop" },
  ];

  const features = [
    { title: "100% Food Safety", icon: ShieldCheck, desc: "FSSAI certified with strict hygiene protocols at every stage." },
    { title: "Farm Fresh", icon: Leaf, desc: "Locally sourced, farm-to-table ingredients for authentic flavors." },
    { title: "Expert Chefs", icon: ChefHat, desc: "Award-winning chefs specializing in multi-cuisine preparation." },
    { title: "Custom Menus", icon: Utensils, desc: "Fully customized menus tailored to your event theme & preferences." },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - Split Asymmetric Design
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-72 h-72 rounded-full bg-[#B8860B]/10 blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh]">
            
            {/* Left Content */}
            <div className="relative z-10 order-2 lg:order-1 pb-12 lg:pb-0">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 mb-8">
                <ChefHat className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                  Culinary Excellence
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6">
                A Feast
                <span className="block">
                  <span className="relative inline-block">
                    For The
                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                      <path d="M0,8 Q25,2 50,8 T100,8" stroke="url(#heroUnderline)" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="heroUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#B8860B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
                  Senses.
                </span>
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-md mb-10 leading-relaxed">
                Elevate your events with bespoke catering services. From vibrant live counters to luxurious plated dinners, we craft menus that leave a lasting impression.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/contact">
                  <Button className="group bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white px-8 py-7 rounded-full font-bold text-base shadow-xl shadow-[#D4AF37]/20 transition-all duration-500">
                    Request a Tasting
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <a href="tel:+919876543210" className="flex items-center gap-3 px-4 py-2 text-white/70 hover:text-white transition-colors">
                  <span className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-[#D4AF37] transition-colors">
                    <Phone className="w-5 h-5" />
                  </span>
                  <span className="text-sm font-medium">Call Us</span>
                </a>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                {[
                  { val: "500+", label: "Events Served" },
                  { val: "50+", label: "Menu Options" },
                  { val: "4.9", label: "Client Rating" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">{stat.val}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image Collage */}
            <div className="relative order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div className="absolute top-[5%] right-0 w-[75%] h-[70%] z-10">
                <div className="relative w-full h-full p-[3px] rounded-3xl bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">
                  <div className="relative w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000&auto=format&fit=crop"
                      alt="Premium Catering"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Image */}
              <div className="absolute bottom-[5%] left-0 w-[45%] h-[45%] z-20">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-zinc-900 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop"
                    alt="Fine Dining"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">FSSAI</p>
                      <p className="text-[9px] text-zinc-500">Certified</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Ring */}
              <div className="absolute top-0 left-[20%] w-20 h-20 rounded-full border-2 border-dashed border-[#D4AF37]/30 animate-spin hidden lg:block" style={{ animationDuration: '25s' }} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce hidden lg:flex">
          <span className="text-xs text-white/40 uppercase tracking-widest">Explore</span>
          <ArrowDown className="w-4 h-4 text-[#D4AF37]" />
        </div>

        <WaveDivider fill="#FDFCF8" variant={1} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          OFFERINGS SECTION - Interactive Cards
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] via-white to-[#FBF7F0]">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="max-w-7xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-[#D4AF37]" />
              Our Menu
              <span className="w-8 h-px bg-[#D4AF37]" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-4">
              Gastronomic <span className="italic text-[#B8860B]">Offerings</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              From casual gatherings to grand celebrations, our diverse menu options cater to every palate
            </p>
          </div>

          {/* Desktop: Interactive Split View */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* Left - Large Active Image */}
            <div className="relative h-[550px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={offerings[activeOffering].img}
                alt={offerings[activeOffering].title}
                fill
                className="object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg">
                    {(() => {
                      const Icon = offerings[activeOffering].icon;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white">
                    {offerings[activeOffering].title}
                  </h3>
                </div>
                <p className="text-white/80 text-base max-w-md leading-relaxed">
                  {offerings[activeOffering].desc}
                </p>
              </div>
            </div>

            {/* Right - Selectable List */}
            <div className="flex flex-col gap-4 justify-center">
              {offerings.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveOffering(idx)}
                  className={`group cursor-pointer p-6 border-2 transition-all duration-300 ${
                    activeOffering === idx
                      ? 'border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent shadow-lg'
                      : 'border-zinc-200 bg-white hover:border-[#D4AF37]/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      activeOffering === idx
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-zinc-100 group-hover:bg-[#D4AF37]/10'
                    }`}>
                      <item.icon className={`w-6 h-6 transition-colors ${
                        activeOffering === idx ? 'text-white' : 'text-zinc-400 group-hover:text-[#D4AF37]'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl mb-1 transition-colors ${
                        activeOffering === idx ? 'text-[#B8860B]' : 'text-zinc-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 flex-shrink-0 mt-1 transition-all ${
                      activeOffering === idx 
                        ? 'text-[#D4AF37] translate-x-0 opacity-100' 
                        : 'text-zinc-300 -translate-x-2 opacity-0 group-hover:opacity-50 group-hover:translate-x-0'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Horizontal Scroll Cards */}
          <div className="lg:hidden -mx-4">
            <div className="flex gap-4 overflow-x-auto px-4 pb-6 scrollbar-hide snap-x snap-mandatory">
              {offerings.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-[280px] bg-white border border-zinc-200 overflow-hidden shadow-lg snap-start group hover:border-[#D4AF37]/30 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-zinc-900 mb-2">{item.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <WaveDivider fill="#18181b" variant={2} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY CHOOSE US - Dark Section
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#B8860B]/5 blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                Why Choose Us
              </span>

              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                More Than Food.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] italic">
                  It's an Experience.
                </span>
              </h2>

              <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                We source the freshest ingredients and employ master chefs to ensure every bite is a celebration. Hygiene, presentation, and taste are our core pillars.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {features.map((feature, i) => (
                  <div 
                    key={i} 
                    className="group p-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 flex items-center justify-center mb-4 group-hover:from-[#D4AF37] group-hover:to-[#B8860B] transition-all">
                      <feature.icon className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative h-[400px] md:h-[550px]">
                {/* Main Image */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop" 
                    alt="Chefs Cooking" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-5 shadow-2xl z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                      <ChefHat className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif font-bold text-zinc-900">15+</p>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Expert Chefs</p>
                    </div>
                  </div>
                </div>

                {/* Top Right Badge */}
                <div className="absolute -top-4 -right-4 md:-right-6 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-4 shadow-xl z-10">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-bold">FSSAI</p>
                      <p className="text-[9px] opacity-80">Certified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WaveDivider fill="#FDFCF8" variant={1} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MENU HIGHLIGHTS - Horizontal Showcase
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-[#D4AF37]" />
              Cuisines
              <span className="w-8 h-px bg-[#D4AF37]" />
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              Cuisines We <span className="italic text-[#B8860B]">Master</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "North Indian", emoji: "🍛" },
              { name: "South Indian", emoji: "🥘" },
              { name: "Chinese", emoji: "🥡" },
              { name: "Continental", emoji: "🍝" },
              { name: "Mughlai", emoji: "🍖" },
              { name: "Desserts", emoji: "🍰" },
            ].map((cuisine, i) => (
              <div
                key={i}
                className="group bg-white border border-zinc-200 p-6 text-center hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300"
              >
                <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300">
                  {cuisine.emoji}
                </span>
                <h4 className="font-bold text-sm text-zinc-800 group-hover:text-[#B8860B] transition-colors">
                  {cuisine.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-[#FBF7F0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">How It Works</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              Simple <span className="italic text-[#B8860B]">Process</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Consultation", desc: "Share your event details, guest count, and preferences" },
              { step: "02", title: "Menu Design", desc: "Our chefs create a customized menu for your approval" },
              { step: "03", title: "Tasting", desc: "Experience a complimentary tasting session" },
              { step: "04", title: "Event Day", desc: "Sit back and enjoy while we handle everything" },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector Line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
                )}
                
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h4 className="font-bold text-zinc-900 mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-zinc-900/90" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center px-4 md:px-6">
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Sparkles className="w-4 h-4" />
            Get Started
          </span>
          
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Create
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
              Your Perfect Menu?
            </span>
          </h2>
          
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Let our culinary experts design the perfect dining experience. From guest counts to dietary needs, we handle it all.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white font-bold uppercase tracking-wider shadow-xl shadow-[#D4AF37]/20 transition-all"
            >
              <Link href="/contact">
                Get a Custom Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-10 border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-wider"
            >
              <a href="tel:+919876543210">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}