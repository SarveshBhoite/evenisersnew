"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Gamepad2, Mic, Tent, Ticket, ArrowRight, Zap, Users, Sparkles, ShieldCheck, ArrowDown, Star, Phone, CheckCircle2 } from "lucide-react";
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

export default function GamesPage() {
  const [activeActivity, setActiveActivity] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SAME DATA - UNCHANGED
  const activities = [
    { title: "Carnival & Arcade", desc: "Classic ring toss, shooting hoops, and retro arcade machines that bring nostalgic joy to every event.", icon: Ticket, img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop" },
    { title: "VR & Tech Zones", desc: "Immersive virtual reality setups and interactive gaming consoles for a futuristic experience.", icon: Gamepad2, img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop" },
    { title: "Kids Inflatables", desc: "Safe, massive bouncing castles and soft play areas designed for toddlers and young children.", icon: Tent, img: "https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=1000&auto=format&fit=crop" },
    { title: "Live Entertainers", desc: "Magicians, clowns, emcees, and tattoo artists to keep the crowd laughing and engaged.", icon: Mic, img: "https://images.unsplash.com/photo-1533174000222-edfe3bac9eb3?q=80&w=1000&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-72 h-72 rounded-full bg-[#B8860B]/10 blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />

          {/* Floating Game Elements */}
          <svg className="absolute top-20 left-10 w-16 h-16 text-[#D4AF37]/20 animate-bounce hidden lg:block" style={{ animationDuration: '3s' }} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="14" cy="16" r="3" fill="currentColor" />
            <circle cx="26" cy="16" r="3" fill="currentColor" />
            <path d="M12 26 Q20 32 28 26" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>

          <svg className="absolute top-40 right-20 w-12 h-12 text-[#D4AF37]/15 animate-pulse hidden lg:block" viewBox="0 0 40 40">
            <polygon points="20,2 25,15 38,15 28,24 32,38 20,30 8,38 12,24 2,15 15,15" fill="currentColor" />
          </svg>

          <svg className="absolute bottom-40 left-20 w-14 h-14 text-[#D4AF37]/20 animate-bounce hidden lg:block" style={{ animationDuration: '4s', animationDelay: '1s' }} viewBox="0 0 40 40">
            <rect x="5" y="10" width="30" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="14" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="28" cy="17" r="2" fill="currentColor" />
            <circle cx="25" cy="23" r="2" fill="currentColor" />
          </svg>

          <svg className="absolute bottom-60 right-40 w-10 h-10 text-[#D4AF37]/15 animate-spin hidden lg:block" style={{ animationDuration: '15s' }} viewBox="0 0 40 40">
            <polygon points="20,5 23,17 35,20 23,23 20,35 17,23 5,20 17,17" fill="currentColor" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh]">

            {/* Left Content */}
            <div className="relative z-10 order-2 lg:order-1 pb-12 lg:pb-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 mb-8">
                <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37]">
                  Entertainment Zone
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] mb-6">
                Unleash
                <span className="block">
                  <span className="relative inline-block">
                    The
                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none" fill="none">
                      <path d="M0,8 Q25,2 50,8 T100,8" stroke="url(#gameUnderline)" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gameUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#B8860B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
                  Fun.
                </span>
              </h1>

              <p className="text-white/60 text-base md:text-lg max-w-md mb-10 leading-relaxed">
                From high-tech VR setups to classic carnival stalls and live entertainers. Activities that keep guests of all ages laughing and engaged.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/contact">
                  <Button className="group bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-white px-8 py-7 rounded-full font-bold text-base shadow-xl shadow-[#D4AF37]/20 transition-all duration-500">
                    Book Entertainment
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

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
                  { val: "100+", label: "Game Options" },
                  { val: "All Ages", label: "Kids to Adults" },
                  { val: "100%", label: "Safe & Fun" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl md:text-3xl font-serif font-bold text-[#D4AF37]">{stat.val}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image + Game Graphics */}
            <div className="relative order-1 lg:order-2 h-[400px] md:h-[500px] lg:h-[600px]">
              {/* Main Image */}
              <div className="absolute top-[5%] right-0 w-[80%] h-[70%] z-10">
                <div className="relative w-full h-full p-[3px] rounded-3xl bg-gradient-to-br from-[#D4AF37] via-[#B8860B] to-[#D4AF37]">
                  <div className="relative w-full h-full rounded-[calc(1.5rem-3px)] overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop"
                      alt="Games & Activities"
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
                    src="https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=800&auto=format&fit=crop"
                    alt="Kids Fun"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">100+</p>
                      <p className="text-[9px] text-zinc-500">Games</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Game Controller SVG */}
              <div className="absolute top-0 left-[15%] hidden lg:block">
                <svg width="60" height="60" viewBox="0 0 60 60" className="text-[#D4AF37] opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>
                  <rect x="10" y="18" width="40" height="24" rx="12" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="22" cy="30" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <line x1="22" y1="26" x2="22" y2="34" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="18" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="38" cy="27" r="2.5" fill="currentColor" opacity="0.5" className="animate-pulse" />
                  <circle cx="42" cy="33" r="2.5" fill="currentColor" opacity="0.5" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                </svg>
              </div>

              {/* Floating Dice */}
              <div className="absolute bottom-[35%] right-[5%] hidden lg:block">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#D4AF37] opacity-25 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <rect x="5" y="5" width="30" height="30" rx="5" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(15, 20, 20)" />
                  <circle cx="14" cy="14" r="2" fill="currentColor" opacity="0.5" />
                  <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5" />
                  <circle cx="26" cy="26" r="2" fill="currentColor" opacity="0.5" />
                </svg>
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
          ACTIVITIES - Interactive Grid with Animated Icons
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] via-white to-[#FBF7F0]">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-[#D4AF37]" />
              What We Offer
              <span className="w-8 h-px bg-[#D4AF37]" />
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-4">
              Activities & <span className="italic text-[#B8860B]">Zones</span>
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Customized entertainment setups for your venue size and audience
            </p>
          </div>

          {/* Desktop: Interactive Split View */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* Left - Active Image */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={activities[activeActivity].img}
                alt={activities[activeActivity].title}
                fill
                className="object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg">
                    {(() => {
                      const Icon = activities[activeActivity].icon;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-white">
                    {activities[activeActivity].title}
                  </h3>
                </div>
                <p className="text-white/80 text-base max-w-md">{activities[activeActivity].desc}</p>
              </div>
            </div>

            {/* Right - Selectable Cards */}
            <div className="flex flex-col gap-4 justify-center">
              {activities.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveActivity(idx)}
                  className={`group cursor-pointer relative bg-white border-2 overflow-hidden transition-all duration-300 ${
                    activeActivity === idx
                      ? 'border-[#D4AF37] shadow-lg'
                      : 'border-zinc-200 hover:border-[#D4AF37]/30'
                  }`}
                >
                  {/* Gold accent */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#B8860B] transition-opacity ${
                    activeActivity === idx ? 'opacity-100' : 'opacity-0'
                  }`} />

                  {/* Subtle BG image */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${
                    activeActivity === idx ? 'opacity-[0.06]' : 'opacity-[0.03]'
                  }`}>
                    <Image src={item.img} alt="" fill className="object-cover" />
                  </div>

                  <div className="relative p-5 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      activeActivity === idx
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-zinc-100 group-hover:bg-[#D4AF37]/10'
                    }`}>
                      <item.icon className={`w-5 h-5 transition-colors ${
                        activeActivity === idx ? 'text-white' : 'text-zinc-400 group-hover:text-[#D4AF37]'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 transition-colors ${
                        activeActivity === idx ? 'text-[#B8860B]' : 'text-zinc-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 flex-shrink-0 mt-1 transition-all ${
                      activeActivity === idx 
                        ? 'text-[#D4AF37] translate-x-0 opacity-100' 
                        : 'text-zinc-300 -translate-x-2 opacity-0 group-hover:opacity-50 group-hover:translate-x-0'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Scroll Cards */}
          <div className="lg:hidden -mx-4">
            <div className="flex gap-4 overflow-x-auto px-4 pb-6 scrollbar-hide snap-x snap-mandatory">
              {activities.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-[280px] bg-white border border-zinc-200 overflow-hidden shadow-lg snap-start group hover:border-[#D4AF37]/30 transition-all">
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
          WHY BOOK WITH US - Dark Section
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#B8860B]/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                <ShieldCheck className="w-4 h-4" />
                Safety First
              </span>

              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                Safe. Supervised.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] italic">
                  Spectacular.
                </span>
              </h2>

              <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                Every game setup comes with our trained staff to ensure safety, manage crowds, and make sure everyone has an amazing time.
              </p>

              {/* Feature Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Users, title: "All Ages", desc: "Activities for kids, teens, and adults" },
                  { icon: ShieldCheck, title: "100% Safe", desc: "Supervised zones with trained staff" },
                  { icon: Sparkles, title: "Customized", desc: "Tailored to your event theme" },
                  { icon: Zap, title: "High Energy", desc: "Non-stop entertainment for hours" },
                ].map((f, i) => (
                  <div key={i} className="group p-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 flex items-center justify-center mb-3 group-hover:from-[#D4AF37] group-hover:to-[#B8860B] transition-all">
                      <f.icon className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{f.title}</h4>
                    <p className="text-xs text-white/40">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Image Grid */}
            <div className="grid grid-cols-2 gap-4 h-[400px] md:h-[500px]">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl mt-8">
                <Image src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop" alt="Arcade" fill className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl mb-8">
                <Image src="https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=800&auto=format&fit=crop" alt="Bouncy Castle" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <WaveDivider fill="#FDFCF8" variant={1} />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          GAME TYPES QUICK VIEW
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 px-4 md:px-6 bg-gradient-to-b from-[#FDFCF8] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Popular</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">
              Game <span className="italic text-[#B8860B]">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Arcade", emoji: "🕹️" },
              { name: "Board Games", emoji: "🎲" },
              { name: "VR Zone", emoji: "🥽" },
              { name: "Bouncy Castle", emoji: "🏰" },
              { name: "Magic Show", emoji: "🎩" },
              { name: "Photo Booth", emoji: "📸" },
            ].map((game, i) => (
              <div key={i} className="group bg-white border border-zinc-200 p-6 text-center hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300">
                <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300 group-hover:animate-bounce" style={{ animationDuration: '1s' }}>
                  {game.emoji}
                </span>
                <h4 className="font-bold text-sm text-zinc-800 group-hover:text-[#B8860B] transition-colors">{game.name}</h4>
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
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop"
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
            Ready to Play?
          </span>

          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Let's Make Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]">
              Event Unforgettable
            </span>
          </h2>

          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Tell us about your event size, audience, and venue. We'll send you a customized entertainment package.
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