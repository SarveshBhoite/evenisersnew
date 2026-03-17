"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Gamepad2, Mic, Tent, Ticket, ArrowRight, Zap, Users, Sparkles, ShieldCheck, Phone, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function GamesPage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto rotate showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activities = [
    { title: "Carnival & Arcade", desc: "Classic ring toss, shooting hoops, and retro arcade machines that bring nostalgic joy to every event.", icon: Ticket, img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop" },
    { title: "VR & Tech Zones", desc: "Immersive virtual reality setups and interactive gaming consoles for a futuristic experience.", icon: Gamepad2, img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop" },
    { title: "Kids Inflatables", desc: "Safe, massive bouncing castles and soft play areas designed for toddlers and young children.", icon: Tent, img: "https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=1000&auto=format&fit=crop" },
    { title: "Live Entertainers", desc: "Magicians, clowns, emcees, and tattoo artists to keep the crowd laughing and engaged.", icon: Mic, img: "https://images.unsplash.com/photo-1533174000222-edfe3bac9eb3?q=80&w=1000&auto=format&fit=crop" },
  ];

  const gameTypes = [
    { name: "Arcade Zone", emoji: "🕹️" },
    { name: "Board Games", emoji: "🎲" },
    { name: "VR Arena", emoji: "🥽" },
    { name: "Bouncy Castle", emoji: "🏰" },
    { name: "Magic Show", emoji: "🎩" },
    { name: "Photo Booth", emoji: "📸" },
    { name: "Laser Tag", emoji: "🔫" },
    { name: "Ring Toss", emoji: "🎯" },
    { name: "Face Paint", emoji: "🎨" },
    { name: "Puppet Show", emoji: "🧸" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO - Full Width Image Grid with Overlay Text
      ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
    HERO - Golden White Theme
═══════════════════════════════════════════════════════════ */}
<section className="relative pt-28 md:pt-32 pb-16 overflow-hidden bg-gradient-to-br from-[#FDFCF8] via-[#FBF9F3] to-[#F5EFE6]">
  {/* Background Decorations */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl" style={{
      background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)"
    }} />
    <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl" style={{
      background: "radial-gradient(circle, rgba(184,134,11,0.25) 0%, transparent 70%)"
    }} />
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.5) 1px, transparent 0)",
      backgroundSize: "40px 40px"
    }} />

    {/* Floating Game SVGs */}
    <svg className="absolute top-32 left-10 w-16 h-16 text-[#D4AF37]/15 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }} viewBox="0 0 40 40">
      <rect x="5" y="10" width="30" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="14" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="28" cy="17" r="2" fill="currentColor" />
      <circle cx="25" cy="23" r="2" fill="currentColor" />
    </svg>

    <svg className="absolute top-48 right-16 w-12 h-12 text-[#D4AF37]/15 animate-pulse hidden lg:block" viewBox="0 0 40 40">
      <rect x="8" y="8" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(15, 20, 20)" />
      <circle cx="14" cy="16" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="26" cy="24" r="2" fill="currentColor" opacity="0.5" />
    </svg>

    <svg className="absolute bottom-32 left-24 w-10 h-10 text-[#D4AF37]/15 animate-bounce hidden lg:block" style={{ animationDuration: '4s', animationDelay: '1s' }} viewBox="0 0 40 40">
      <polygon points="20,2 25,15 38,15 28,24 32,38 20,30 8,38 12,24 2,15 15,15" fill="currentColor" />
    </svg>

    <svg className="absolute bottom-48 right-32 w-14 h-14 text-[#D4AF37]/10 animate-spin hidden lg:block" style={{ animationDuration: '20s' }} viewBox="0 0 40 40">
      <polygon points="20,5 23,17 35,20 23,23 20,35 17,23 5,20 17,17" fill="currentColor" />
    </svg>

    <div className="absolute top-60 right-1/4 w-20 h-20 rounded-full border-2 border-dashed border-[#D4AF37]/15 animate-spin hidden lg:block" style={{ animationDuration: '25s' }} />
  </div>

  <div className="relative max-w-7xl mx-auto px-4 md:px-6">
    {/* Top Badge */}
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-[#D4AF37]/20 shadow-lg rounded-full">
        <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#B8860B]">Games & Activities</span>
      </div>
    </div>

    {/* Headline */}
    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-center leading-[0.95] mb-6">
      <span className="text-zinc-900">Unleash The</span>
      <span className="block relative">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">Fun.</span>
        {/* Underline */}
        <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 md:w-48 h-4" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
          <path d="M0,8 Q25,2 50,8 T100,8" stroke="url(#gameHeroLine)" strokeWidth="3" strokeLinecap="round" />
          <defs>
            <linearGradient id="gameHeroLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    </h1>

    <p className="text-center text-zinc-500 text-base md:text-lg max-w-xl mx-auto mb-10">
      From high-tech VR setups to classic carnival stalls. Activities that keep guests of all ages engaged.
    </p>

    {/* CTA */}
    <div className="flex justify-center gap-4 mb-16">
      <Link href="/contact">
        <Button className="group bg-zinc-900 hover:bg-[#D4AF37] text-white px-8 py-7 rounded-full font-bold text-base shadow-xl transition-all duration-500">
          Book Entertainment
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
      <a href="tel:+919876543210" className="hidden md:flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-[#D4AF37] transition-colors">
        <span className="w-12 h-12 rounded-full border-2 border-zinc-200 hover:border-[#D4AF37] flex items-center justify-center transition-colors">
          <Phone className="w-5 h-5" />
        </span>
        <span className="text-sm font-medium">Call Us</span>
      </a>
    </div>

    {/* Image Mosaic Grid */}
    <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[220px] md:h-[320px] lg:h-[380px]">
      {activities.map((act, i) => {
        const spans = [
          "col-span-5 row-span-2",
          "col-span-4 row-span-1",
          "col-span-3 row-span-1",
          "col-span-7 row-span-1",
        ];
        return (
          <div 
            key={i} 
            className={`${spans[i]} relative overflow-hidden group cursor-pointer border border-zinc-200 hover:border-[#D4AF37]/40 transition-all shadow-lg hover:shadow-xl`}
            onClick={() => setActiveIndex(i)}
          >
            <Image src={act.img} alt={act.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent group-hover:from-black/30 transition-colors" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg">
                <act.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xs md:text-sm drop-shadow-lg">{act.title}</span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Quick Stats Below Grid */}
    <div className="flex justify-center gap-8 md:gap-16 mt-10 pt-8 border-t border-zinc-200/50">
      {[
        { val: "100+", label: "Game Options" },
        { val: "All Ages", label: "Kids to Adults" },
        { val: "100%", label: "Safe & Fun" },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl md:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#D4AF37] to-[#B8860B]">{stat.val}</p>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ═══════════════════════════════════════════════════════════
          SCROLLING MARQUEE - Game Types Ticker
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-gradient-to-r from-[#D4AF37]/5 via-white to-[#D4AF37]/5 border-b border-zinc-100 overflow-hidden">
        <div className="flex animate-scroll-left gap-6">
          {[...gameTypes, ...gameTypes, ...gameTypes].map((game, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0 px-4 py-2">
              <span className="text-2xl">{game.emoji}</span>
              <span className="text-sm font-bold text-zinc-600 uppercase tracking-wider whitespace-nowrap">{game.name}</span>
              <span className="text-[#D4AF37] mx-2">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ACTIVITIES - Full Width Stacked Showcase
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-[#FBF7F0]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <span className="inline-block w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full mb-4" />
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
                Our <span className="italic text-[#B8860B]">Zones</span>
              </h2>
            </div>
            {/* Tab Selector */}
            <div className="flex gap-2">
              {activities.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-serif font-bold text-sm transition-all duration-300 ${
                    activeIndex === i
                      ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white shadow-lg shadow-[#D4AF37]/20'
                      : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Active Showcase Card - Full Width */}
          <div className="relative bg-white border border-zinc-200 overflow-hidden group hover:border-[#D4AF37]/30 transition-all shadow-xl">
            <div className="grid md:grid-cols-2">
              {/* Image Side */}
              <div className="relative h-[300px] md:h-[450px] overflow-hidden">
                <Image
                  src={activities[activeIndex].img}
                  alt={activities[activeIndex].title}
                  fill
                  className="object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:bg-gradient-to-r md:from-transparent md:to-white" />
                
                {/* Floating Number */}
                <div className="absolute top-6 left-6">
                  <span className="text-8xl md:text-9xl font-serif font-bold text-white/20">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Icon Badge */}
                <div className="absolute bottom-6 left-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-xl">
                  {(() => {
                    const Icon = activities[activeIndex].icon;
                    return <Icon className="w-7 h-7 text-white" />;
                  })()}
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Zone {String(activeIndex + 1).padStart(2, '0')}
                </span>
                
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                  {activities[activeIndex].title}
                </h3>
                
                <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-8">
                  {activities[activeIndex].desc}
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['All Ages', 'Indoor/Outdoor', 'Staff Included', 'Customizable'].map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href="/contact" className="inline-flex items-center gap-2 text-[#B8860B] font-bold text-sm uppercase tracking-wider hover:text-[#D4AF37] transition-colors group/link">
                  Book This Zone
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-zinc-100">
              <div 
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / activities.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Thumbnail Strip Below */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {activities.map((act, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative h-20 md:h-28 overflow-hidden transition-all duration-300 ${
                  activeIndex === i 
                    ? 'ring-2 ring-[#D4AF37] shadow-lg' 
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <Image src={act.img} alt={act.title} fill className="object-cover" />
                <div className={`absolute inset-0 transition-colors ${
                  activeIndex === i ? 'bg-[#D4AF37]/10' : 'bg-black/30'
                }`} />
                <span className="absolute bottom-2 left-2 text-[9px] md:text-[10px] font-bold text-white uppercase tracking-wider">
                  {act.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS - Score Counter Style
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.4) 1px, transparent 0)",
            backgroundSize: "30px 30px"
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 md:px-6">
          {/* Scoreboard Style */}
          <div className="text-center mb-10">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase">Your Event Score</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "100+", label: "Game Options", icon: "🎮" },
              { val: "50+", label: "Events Done", icon: "🎪" },
              { val: "ALL", label: "Age Groups", icon: "👨‍👩‍👧‍👦" },
              { val: "100%", label: "Fun Guaranteed", icon: "🎉" },
            ].map((stat, i) => (
              <div key={i} className="relative bg-white/5 border border-white/10 p-6 text-center group hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all">
                {/* Emoji */}
                <span className="text-3xl block mb-3 group-hover:scale-125 group-hover:animate-bounce transition-transform" style={{ animationDuration: '1s' }}>
                  {stat.icon}
                </span>
                {/* Score */}
                <p className="text-3xl md:text-4xl font-serif font-bold text-[#D4AF37] mb-1">{stat.val}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p>
                
                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/30" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          WHY US - Horizontal Card Scroll
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <ShieldCheck className="w-4 h-4" />
              Why Choose Us
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              Safe. Supervised. <span className="italic text-[#B8860B]">Spectacular.</span>
            </h2>
          </div>

          {/* Horizontal Feature Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                icon: Users, 
                title: "For Every Age Group",
                desc: "From toddler-safe soft play zones to adrenaline-pumping VR experiences for adults. We cover everyone.",
                img: "https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=800&auto=format&fit=crop"
              },
              { 
                icon: ShieldCheck, 
                title: "100% Safe & Supervised",
                desc: "Every zone comes with trained staff ensuring safety, managing queues, and keeping energy high.",
                img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop"
              },
              { 
                icon: Sparkles, 
                title: "Fully Customizable",
                desc: "Choose your games, themes, and setup style. We adapt to any venue size and event type.",
                img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop"
              },
              { 
                icon: Zap, 
                title: "Non-Stop Energy",
                desc: "Our entertainers and game masters keep the crowd engaged from start to finish. Zero dull moments.",
                img: "https://images.unsplash.com/photo-1533174000222-edfe3bac9eb3?q=80&w=800&auto=format&fit=crop"
              },
            ].map((item, i) => (
              <div key={i} className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-xl transition-all">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white sm:bg-gradient-to-r sm:from-transparent sm:to-white/80" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 md:p-6 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-3 group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all">
                      <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 mb-2 group-hover:text-[#B8860B] transition-colors">{item.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS - Game Board Path
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-white to-[#FBF7F0] relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">How To Book</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              Your <span className="italic text-[#B8860B]">Game Plan</span>
            </h2>
          </div>

          {/* Steps - Connected Path */}
          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37] to-[#D4AF37]/30" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {[
                { step: "01", title: "Tell Us", desc: "Share your event size, venue, and audience age group", emoji: "📋" },
                { step: "02", title: "We Design", desc: "Our team creates a custom entertainment package", emoji: "🎨" },
                { step: "03", title: "We Setup", desc: "Professional installation and safety checks", emoji: "🛠️" },
                { step: "04", title: "Game On!", desc: "Sit back while your guests have the time of their lives", emoji: "🎉" },
              ].map((item, i) => (
                <div key={i} className="relative text-center group">
                  {/* Step Circle */}
                  <div className="relative mx-auto w-16 h-16 mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/30 animate-spin" style={{ animationDuration: '20s' }} />
                    {/* Inner circle */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{item.emoji}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">Step {item.step}</span>
                  <h4 className="font-bold text-zinc-900 text-lg mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          GAME CATEGORIES GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900">
              Popular <span className="italic text-[#B8860B]">Activities</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {gameTypes.map((game, i) => (
              <div key={i} className="group bg-zinc-50 border border-zinc-200 p-4 md:p-5 text-center hover:border-[#D4AF37] hover:shadow-lg hover:bg-white transition-all cursor-pointer">
                <span className="text-3xl md:text-4xl block mb-2 group-hover:scale-125 transition-transform duration-300 group-hover:animate-bounce" style={{ animationDuration: '0.8s', animationIterationCount: '2' }}>
                  {game.emoji}
                </span>
                <h4 className="font-bold text-xs text-zinc-700 group-hover:text-[#B8860B] transition-colors uppercase tracking-wider">{game.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA - Clean Bottom Section
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-[#B8860B]/10 blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
            backgroundSize: "30px 30px"
          }} />
        </div>

        {/* Floating Game Elements */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {['🎮', '🎲', '🎯', '🎪', '🎭', '🕹️'].map((emoji, i) => (
            <span 
              key={i}
              className="absolute text-2xl opacity-20 animate-bounce"
              style={{
                top: `${15 + i * 12}%`,
                left: `${5 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto text-center px-4 md:px-6">
          <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Zap className="w-4 h-4 fill-[#D4AF37]" />
            Ready to Play?
          </span>

          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Let's Make It
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
              Unforgettable
            </span>
          </h2>

          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Tell us about your event and we'll create the perfect entertainment package.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white font-bold uppercase tracking-wider shadow-xl shadow-[#D4AF37]/20 transition-all rounded-full"
            >
              <Link href="/contact">
                Get a Free Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-10 border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-wider rounded-full"
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