"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CorporateBookingModal } from "@/components/corporate-booking-modal";
import { Button } from "@/components/ui/button";
import {
  Building2, Rocket, Users2, Trophy, Gift, Mic2,
  CheckCircle2, Briefcase, Sparkles, ArrowRight, ArrowDown,
  Phone, Star, ShieldCheck, Target, Zap
} from "lucide-react";

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

// Service Card Component
function ServiceCard({ icon: Icon, title, desc, index }: { icon: any; title: string; desc: string; index: number }) {
  return (
    <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
      {/* Top gold accent */}
      <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="p-6 md:p-8">
        {/* Number */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm">
            <Icon className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <span className="text-5xl font-serif font-bold text-zinc-100 group-hover:text-[#D4AF37]/20 transition-colors">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
          {title}
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>

        {/* Learn More */}
        <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
          Learn More <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

export default function CorporatePage() {
  // STATE - UNCHANGED
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SERVICE DATA - UNCHANGED
  const services = [
    { icon: Mic2, title: "Conferences & Seminars", desc: "Seamless execution of annual meetings, leadership summits, and training programs with full technical support." },
    { icon: Rocket, title: "Product Launches", desc: "High-impact launch experiences that generate buzz and strengthen brand visibility." },
    { icon: Users2, title: "Team Building", desc: "Creative engagement programs to improve collaboration, motivation, and workplace culture." },
    { icon: Trophy, title: "Award Ceremonies", desc: "Elegant recognition nights designed to honor excellence and inspire employees." },
    { icon: Building2, title: "Office Inaugurations", desc: "Ribbon-cutting ceremonies and anniversary celebrations that showcase your milestone success." },
    { icon: Gift, title: "Corporate Gifting", desc: "Customized premium gifting solutions to strengthen employee and client relationships." },
  ];

  const capabilities = [
    "Event Concept & Theme",
    "Venue Selection & Setup",
    "Stage Design & Production",
    "Vendor Management",
    "AV & Technical Support",
    "Catering & Hospitality",
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      <Navbar />
      {/* MODAL - UNCHANGED */}
      <CorporateBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Decorations */}
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 mb-8">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                  Evenizers Corporate
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6">
                Impactful
                <span className="block">Experiences</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] italic">
                  That Inspire.
                </span>
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-md mb-10 leading-relaxed">
                We specialize in designing world-class corporate events that reflect your brand identity. From product launches to conferences, we handle it all.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white px-8 py-4 font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#D4AF37]/20 transition-all duration-500 flex items-center gap-2"
                >
                  Plan Your Event
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a href="tel:+919876543210" className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white transition-colors">
                  <span className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-[#D4AF37] transition-colors">
                    <Phone className="w-5 h-5" />
                  </span>
                  <span className="text-sm font-medium">Call Us</span>
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
                {[
                  { val: "10+", label: "Years Exp." },
                  { val: "200+", label: "Corporate Events" },
                  { val: "50+", label: "Brands Served" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">{stat.val}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px]">
              <div className="absolute top-[5%] right-0 w-[80%] h-[75%] z-10">
                <div className="relative w-full h-full p-[3px] rounded-3xl bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">
                  <div className="relative w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden">
                    <Image
                      src="/premium-leather-handbag.jpg"
                      alt="Corporate Event"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Image */}
              <div className="absolute bottom-[5%] left-0 w-[45%] h-[40%] z-20">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-zinc-900 shadow-2xl">
                  <Image
                    src="/premium-leather-handbag.jpg"
                    alt="Meeting"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Award</p>
                      <p className="text-[9px] text-zinc-500">Winning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce hidden lg:flex">
          <span className="text-xs text-white/40 uppercase tracking-widest">Explore</span>
          <ArrowDown className="w-4 h-4 text-[#D4AF37]" />
        </div>

        <WaveDivider fill="#FDFCF8" variant={1} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES GRID
      ═══════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════
    SERVICES GRID - White Cards, Visible Images, Animated Icons
═══════════════════════════════════════════════════════════ */}
<section className="relative py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] via-white to-[#FBF7F0]">
  <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  }} />

  <div className="max-w-7xl mx-auto relative">
    {/* Header */}
    <div className="text-center mb-16">
      <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
        <span className="w-8 h-px bg-[#D4AF37]" />
        What We Offer
        <span className="w-8 h-px bg-[#D4AF37]" />
      </span>
      <h2 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-4">
        Corporate <span className="italic text-[#B8860B]">Services</span>
      </h2>
      <p className="text-zinc-500 max-w-xl mx-auto">
        Creativity, precision, and professionalism at every step of your business journey.
      </p>
    </div>

    {/* Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

      {/* ═══ 1. Conferences & Seminars ═══ */}
      <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
        <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        {/* Always Visible Background Image */}
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
          <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover" />
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Animated Microphone Icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm overflow-hidden">
              <svg width="28" height="28" viewBox="0 0 40 40" className="text-zinc-500 group-hover:text-white transition-colors">
                {/* Mic Body */}
                <rect x="15" y="6" width="10" height="18" rx="5" fill="currentColor" className="group-hover:animate-pulse" />
                {/* Mic Stand */}
                <path d="M12 20 Q12 30 20 30 Q28 30 28 20" stroke="currentColor" strokeWidth="2.5" fill="none" />
                <line x1="20" y1="30" x2="20" y2="36" stroke="currentColor" strokeWidth="2.5" />
                <line x1="14" y1="36" x2="26" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                {/* Sound Waves - Always Animating */}
                <path d="M30 12 Q34 18 30 24" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" className="animate-pulse" />
                <path d="M33 9 Q38 18 33 27" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
              </svg>
            </div>

            {/* Floating Animated SVG - Sound Waves */}
            <div className="opacity-20 group-hover:opacity-60 transition-opacity duration-500">
              <svg width="55" height="45" viewBox="0 0 70 55" className="text-[#D4AF37]">
                {/* Equalizer Bars */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <rect
                    key={i}
                    x={5 + i * 9}
                    y={25 - (i % 3 === 0 ? 15 : i % 3 === 1 ? 10 : 20)}
                    width="5"
                    rx="2"
                    height={i % 3 === 0 ? 30 : i % 3 === 1 ? 20 : 40}
                    fill="currentColor"
                    opacity={0.3 + (i * 0.08)}
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s`, animationDuration: `${0.8 + i * 0.2}s` }}
                  />
                ))}
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
            Conferences & Seminars
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Seamless execution of annual meetings, leadership summits, and training programs with full technical support.
          </p>

          <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ═══ 2. Product Launches ═══ */}
      <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
        <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
          <Image src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover" />
        </div>

        {/* Sparkle Particles - Always visible, stronger on hover */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 bg-[#D4AF37]/20 group-hover:bg-[#D4AF37]/40 rounded-full animate-ping transition-colors" style={{
              top: `${15 + i * 18}%`,
              right: `${8 + i * 6}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2.5s'
            }} />
          ))}
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Animated Rocket Icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm overflow-hidden">
              <svg width="26" height="26" viewBox="0 0 36 36" className="text-zinc-500 group-hover:text-white transition-colors animate-bounce" style={{ animationDuration: '3s' }}>
                {/* Rocket Body */}
                <path d="M18 4 Q21 4 23 10 L24 22 Q18 28 12 22 L13 10 Q15 4 18 4Z" fill="currentColor" />
                <circle cx="18" cy="14" r="2.5" fill="white" opacity="0.3" />
                {/* Wings */}
                <path d="M12 20 L6 26 L12 25Z" fill="currentColor" opacity="0.7" />
                <path d="M24 20 L30 26 L24 25Z" fill="currentColor" opacity="0.7" />
                {/* Flame */}
                <path d="M15 26 Q18 34 21 26" fill="currentColor" opacity="0.5" className="animate-pulse" />
              </svg>
            </div>

            {/* Floating Animated - Launch Effect */}
            <div className="opacity-20 group-hover:opacity-60 transition-opacity duration-500">
              <svg width="55" height="45" viewBox="0 0 70 55" className="text-[#D4AF37]">
                {/* Upward Arrows - Launch */}
                <path d="M20 40 L20 15 L14 22" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" className="animate-pulse" />
                <path d="M35 45 L35 10 L29 17" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                <path d="M50 40 L50 15 L44 22" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                {/* Stars */}
                <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="60" cy="20" r="1.5" fill="currentColor" opacity="0.2" className="animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
            Product Launches
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            High-impact launch experiences that generate buzz and strengthen brand visibility.
          </p>

          <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ═══ 3. Team Building ═══ */}
      <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
        <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
          <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover" />
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Animated People Icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm overflow-hidden">
              <svg width="28" height="28" viewBox="0 0 40 40" className="text-zinc-500 group-hover:text-white transition-colors">
                {/* Center Person */}
                <circle cx="20" cy="12" r="4.5" fill="currentColor" className="animate-pulse" style={{ animationDuration: '2s' }} />
                <path d="M13 20 Q20 16 27 20 L29 30 L11 30Z" fill="currentColor" opacity="0.8" />
                {/* Left Person */}
                <circle cx="8" cy="15" r="3.5" fill="currentColor" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.3s', animationDuration: '2s' }} />
                <path d="M3 22 Q8 19 13 22 L14 30 L2 30Z" fill="currentColor" opacity="0.4" />
                {/* Right Person */}
                <circle cx="32" cy="15" r="3.5" fill="currentColor" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '2s' }} />
                <path d="M27 22 Q32 19 37 22 L38 30 L26 30Z" fill="currentColor" opacity="0.4" />
              </svg>
            </div>

            {/* Floating Network Lines */}
            <div className="opacity-20 group-hover:opacity-60 transition-opacity duration-500">
              <svg width="55" height="45" viewBox="0 0 70 55" className="text-[#D4AF37]">
                <circle cx="35" cy="15" r="4" fill="currentColor" opacity="0.4" className="animate-pulse" />
                <circle cx="15" cy="35" r="3" fill="currentColor" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                <circle cx="55" cy="35" r="3" fill="currentColor" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                <line x1="35" y1="19" x2="18" y2="33" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" className="animate-pulse" />
                <line x1="35" y1="19" x2="52" y2="33" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <line x1="18" y1="35" x2="52" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" className="animate-pulse" style={{ animationDelay: '1s' }} />
                {/* Gear */}
                <circle cx="35" cy="45" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" className="animate-spin" style={{ animationDuration: '10s', transformOrigin: '35px 45px' }} />
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
            Team Building
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Creative engagement programs to improve collaboration, motivation, and workplace culture.
          </p>

          <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ═══ 4. Award Ceremonies ═══ */}
      <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
        <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
          <Image src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover" />
        </div>

        {/* Confetti - Always visible faintly */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute animate-bounce" style={{
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              background: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#B8860B' : '#F4D03F',
              top: `${8 + i * 12}%`,
              right: `${5 + i * 5}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random()}s`,
              borderRadius: i % 2 === 0 ? '50%' : '1px',
              opacity: 0.15,
            }} />
          ))}
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Animated Trophy Icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm overflow-hidden">
              <svg width="26" height="26" viewBox="0 0 36 36" className="text-zinc-500 group-hover:text-white transition-colors">
                <path d="M12 8 L24 8 L22 20 Q18 24 14 20Z" fill="currentColor" className="group-hover:animate-pulse" />
                <rect x="16" y="22" width="4" height="5" fill="currentColor" />
                <rect x="13" y="27" width="10" height="3" rx="1" fill="currentColor" />
                <path d="M12 10 Q6 10 6 16 Q6 20 12 19" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
                <path d="M24 10 Q30 10 30 16 Q30 20 24 19" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
                {/* Star on top */}
                <polygon points="18,2 19.5,5.5 23,5.5 20,7.5 21,11 18,9 15,11 16,7.5 13,5.5 16.5,5.5" fill="currentColor" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
              </svg>
            </div>

            {/* Floating Star & Sparkle */}
            <div className="opacity-20 group-hover:opacity-60 transition-opacity duration-500">
              <svg width="55" height="45" viewBox="0 0 70 55" className="text-[#D4AF37]">
                <polygon points="35,5 38,15 48,15 40,21 43,31 35,25 27,31 30,21 22,15 32,15" fill="currentColor" opacity="0.3" className="animate-pulse" />
                <polygon points="15,20 16.5,24 21,24 17.5,27 18.5,31 15,28 11.5,31 12.5,27 9,24 13.5,24" fill="currentColor" opacity="0.2" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <polygon points="55,25 56.5,29 61,29 57.5,32 58.5,36 55,33 51.5,36 52.5,32 49,29 53.5,29" fill="currentColor" opacity="0.2" className="animate-pulse" style={{ animationDelay: '1s' }} />
                {/* Sparkle lines */}
                <line x1="35" y1="38" x2="35" y2="44" stroke="currentColor" strokeWidth="1.5" opacity="0.3" className="animate-pulse" />
                <line x1="32" y1="41" x2="38" y2="41" stroke="currentColor" strokeWidth="1.5" opacity="0.3" className="animate-pulse" />
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
            Award Ceremonies
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Elegant recognition nights designed to honor excellence and inspire employees.
          </p>

          <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ═══ 5. Office Inaugurations ═══ */}
      <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
        <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
          <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover" />
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Animated Building Icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm overflow-hidden">
              <svg width="26" height="26" viewBox="0 0 36 36" className="text-zinc-500 group-hover:text-white transition-colors">
                <rect x="8" y="10" width="20" height="22" fill="currentColor" opacity="0.9" />
                <rect x="5" y="7" width="26" height="4" fill="currentColor" />
                {/* Windows - animate individually */}
                {[0, 1, 2].map(row => [0, 1].map(col => (
                  <rect key={`${row}-${col}`} x={12 + col * 8} y={14 + row * 7} width="5" height="4" rx="0.5" fill="white" opacity="0.4"
                    className="animate-pulse" style={{ animationDelay: `${(row * 2 + col) * 0.2}s`, animationDuration: '2s' }} />
                )))}
                {/* Door */}
                <rect x="15" y="25" width="6" height="7" fill="white" opacity="0.3" />
                {/* Ribbon */}
                <path d="M3 20 Q18 17 33 20" stroke="#EF4444" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDuration: '3s' }} />
                <circle cx="18" cy="19" r="1.5" fill="#EF4444" opacity="0.8" />
              </svg>
            </div>

            {/* Floating Building SVG */}
            <div className="opacity-20 group-hover:opacity-60 transition-opacity duration-500">
              <svg width="55" height="45" viewBox="0 0 70 55" className="text-[#D4AF37]">
                {/* Cityscape */}
                <rect x="5" y="25" width="12" height="25" fill="currentColor" opacity="0.2" />
                <rect x="20" y="15" width="14" height="35" fill="currentColor" opacity="0.3" />
                <rect x="37" y="20" width="10" height="30" fill="currentColor" opacity="0.25" />
                <rect x="50" y="28" width="15" height="22" fill="currentColor" opacity="0.2" />
                {/* Windows that blink */}
                {[0, 1, 2].map(i => (
                  <rect key={i} x={24 + i * 4} y={20 + i * 5} width="2" height="2" fill="currentColor" opacity="0.5" className="animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
                ))}
                {/* Flag on top */}
                <line x1="27" y1="15" x2="27" y2="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M27 8 L35 11 L27 14" fill="currentColor" opacity="0.4" className="animate-pulse" style={{ animationDuration: '2s' }} />
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
            Office Inaugurations
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Ribbon-cutting ceremonies and anniversary celebrations that showcase your milestone success.
          </p>

          <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* ═══ 6. Corporate Gifting ═══ */}
      <div className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl transition-all duration-500">
        <div className="h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700">
          <Image src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop" alt="" fill className="object-cover" />
        </div>

        <div className="relative p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            {/* Animated Gift Icon */}
            <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#D4AF37] group-hover:to-[#B8860B] group-hover:border-transparent transition-all duration-300 shadow-sm overflow-hidden">
              <svg width="26" height="26" viewBox="0 0 36 36" className="text-zinc-500 group-hover:text-white transition-colors">
                {/* Box */}
                <rect x="8" y="17" width="20" height="14" fill="currentColor" opacity="0.8" />
                {/* Lid - bounces */}
                <rect x="6" y="13" width="24" height="5" rx="1" fill="currentColor" className="group-hover:animate-bounce" style={{ animationDuration: '2s' }} />
                {/* Ribbon */}
                <rect x="16" y="13" width="4" height="18" fill="currentColor" opacity="0.4" />
                {/* Bow */}
                <ellipse cx="18" cy="12" rx="6" ry="4" fill="currentColor" opacity="0.7" />
                <circle cx="18" cy="12" r="2" fill="white" opacity="0.3" />
                {/* Sparkles */}
                <g className="animate-pulse">
                  <line x1="5" y1="7" x2="5" y2="11" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                  <line x1="3" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                </g>
                <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <line x1="31" y1="5" x2="31" y2="9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                  <line x1="29" y1="7" x2="33" y2="7" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                </g>
              </svg>
            </div>

            {/* Floating Gift Sparkles */}
            <div className="opacity-20 group-hover:opacity-60 transition-opacity duration-500">
              <svg width="55" height="45" viewBox="0 0 70 55" className="text-[#D4AF37]">
                {/* Multiple Gift Boxes */}
                <rect x="10" y="30" width="15" height="12" fill="currentColor" opacity="0.2" />
                <rect x="8" y="27" width="19" height="4" fill="currentColor" opacity="0.25" />
                <rect x="40" y="25" width="18" height="16" fill="currentColor" opacity="0.15" />
                <rect x="38" y="22" width="22" height="4" fill="currentColor" opacity="0.2" />
                {/* Sparkle Crosses */}
                <g className="animate-pulse">
                  <line x1="30" y1="10" x2="30" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                  <line x1="26" y1="14" x2="34" y2="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                </g>
                <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <line x1="55" y1="8" x2="55" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
                  <line x1="51" y1="12" x2="59" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
                </g>
                <g className="animate-pulse" style={{ animationDelay: '1s' }}>
                  <line x1="12" y1="12" x2="12" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                  <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                </g>
              </svg>
            </div>
          </div>

          <h3 className="font-bold text-lg md:text-xl text-zinc-900 mb-3 group-hover:text-[#B8860B] transition-colors">
            Corporate Gifting
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Customized premium gifting solutions to strengthen employee and client relationships.
          </p>

          <div className="flex items-center gap-1 mt-5 text-xs font-bold text-zinc-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
            Learn More <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <WaveDivider fill="#18181b" variant={2} />
</section>

      {/* ═══════════════════════════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#B8860B]/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left Image */}
            <div className="relative">
              <div className="relative h-[400px] md:h-[550px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/premium-leather-handbag.jpg"
                  alt="Corporate Meeting"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 md:-right-10 bg-white p-5 shadow-2xl z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-serif font-bold text-zinc-900">10+</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                <Target className="w-4 h-4" />
                End-to-End Solutions
              </span>

              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                We Manage
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
                  Every Detail.
                </span>
              </h2>

              <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                Corporate events strengthen company culture and build brand reputation. We transform your vision into extraordinary experiences.
              </p>

              {/* Capabilities Grid */}
              <div className="grid sm:grid-cols-2 gap-3 mb-10">
                {capabilities.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-white/80 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm uppercase tracking-wider group hover:text-[#F4D03F] transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                Discuss Your Requirements
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <WaveDivider fill="#FDFCF8" variant={1} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROCESS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Process</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              How We <span className="italic text-[#B8860B]">Work</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Brief", desc: "Share your event goals, audience, and brand guidelines", icon: Briefcase },
              { step: "02", title: "Concept", desc: "We create a unique event concept aligned with your vision", icon: Sparkles },
              { step: "03", title: "Execute", desc: "End-to-end management from setup to breakdown", icon: Zap },
              { step: "04", title: "Deliver", desc: "A flawless event that exceeds expectations", icon: Trophy },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
                )}
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">Step {item.step}</span>
                <h4 className="font-bold text-zinc-900 mt-1 mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CLIENTS / TRUST SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] font-bold mb-8">
            Trusted By Leading Organizations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { val: "200+", label: "Events Delivered" },
              { val: "50+", label: "Brands Served" },
              { val: "100%", label: "Client Satisfaction" },
              { val: "25+", label: "Cities Covered" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-zinc-50 border border-zinc-100">
                <p className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#D4AF37] to-[#B8860B]">
                  {stat.val}
                </p>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/premium-leather-handbag.jpg"
            alt="Background"
            fill
            className="object-cover opacity-15"
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
            Let's Collaborate
          </span>

          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Plan Your Next
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
              Corporate Event
            </span>
          </h2>

          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Partner with Evenizers to create unforgettable experiences that inspire and strengthen your brand.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white font-bold uppercase tracking-wider shadow-xl shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
            >
              Contact Us Today
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="tel:+919876543210"
              className="h-14 px-10 border-2 border-white/30 text-white hover:bg-white/10 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}