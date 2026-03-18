"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight, Phone } from "lucide-react";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// MONUMENT SVG COMPONENTS
// ═══════════════════════════════════════════════════════════

const GatewayOfIndia = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <path d="M50 5 L55 5 L55 15 L58 15 L58 5 L63 5 L63 15 L66 15 L66 20 L34 20 L34 15 L37 15 L37 5 L42 5 L42 15 L45 15 L45 5Z" />
    <path d="M25 20 L75 20 L75 25 L25 25Z" />
    <path d="M22 35 L78 35 L78 45 L22 45Z" />
    <rect x="25" y="45" width="8" height="60" />
    <rect x="67" y="45" width="8" height="60" />
    <path d="M33 45 L67 45 L67 55 Q50 75 33 55Z" />
    <rect x="33" y="55" width="34" height="50" />
    <rect x="15" y="105" width="70" height="10" />
  </svg>
);

const IndiaGate = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="15" y="100" width="70" height="15" />
    <rect x="18" y="90" width="64" height="10" />
    <rect x="20" y="20" width="12" height="70" />
    <rect x="68" y="20" width="12" height="70" />
    <path d="M20 20 L80 20 L80 30 L20 30Z" />
    <path d="M15 15 L85 15 L85 20 L15 20Z" />
    <path d="M32 30 L68 30 L68 40 Q50 60 32 40Z" />
    <rect x="45" y="5" width="10" height="10" />
    <path d="M40 5 L60 5 L55 0 L45 0Z" />
  </svg>
);

const VidhanaSoudha = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="10" y="100" width="80" height="15" />
    <rect x="15" y="85" width="70" height="15" />
    <rect x="15" y="45" width="10" height="40" />
    <rect x="30" y="45" width="10" height="40" />
    <rect x="45" y="45" width="10" height="40" />
    <rect x="60" y="45" width="10" height="40" />
    <rect x="75" y="45" width="10" height="40" />
    <rect x="10" y="40" width="80" height="5" />
    <rect x="5" y="35" width="90" height="5" />
    <path d="M50 5 L90 35 L10 35Z" />
    <circle cx="50" cy="12" r="5" />
  </svg>
);

// Charminar - Hyderabad
const Charminar = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="15" y="105" width="70" height="10" />
    <rect x="20" y="45" width="60" height="60" />
    <path d="M35 105 L35 65 Q50 50 65 65 L65 105Z" opacity="0.4" />
    {/* Four Minarets */}
    <rect x="15" y="12" width="8" height="93" />
    <rect x="77" y="12" width="8" height="93" />
    <rect x="35" y="22" width="6" height="23" />
    <rect x="59" y="22" width="6" height="23" />
    {/* Minaret Domes */}
    <ellipse cx="19" cy="10" rx="5" ry="7" />
    <ellipse cx="81" cy="10" rx="5" ry="7" />
    <ellipse cx="38" cy="20" rx="4" ry="5" />
    <ellipse cx="62" cy="20" rx="4" ry="5" />
    {/* Spires */}
    <line x1="19" y1="3" x2="19" y2="0" stroke="currentColor" strokeWidth="2" />
    <line x1="81" y1="3" x2="81" y2="0" stroke="currentColor" strokeWidth="2" />
    <rect x="20" y="42" width="60" height="5" />
  </svg>
);

// Marina Lighthouse - Chennai
const MarinaLighthouse = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="30" y="110" width="40" height="8" />
    <path d="M38 110 L42 30 L58 30 L62 110Z" />
    <rect x="35" y="25" width="30" height="8" />
    <rect x="38" y="18" width="24" height="8" />
    {/* Light dome */}
    <path d="M40 18 Q50 5 60 18Z" />
    <circle cx="50" cy="14" r="3" opacity="0.5" />
    {/* Light rays */}
    <line x1="50" y1="8" x2="50" y2="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <line x1="40" y1="10" x2="35" y2="5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <line x1="60" y1="10" x2="65" y2="5" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    {/* Windows */}
    <rect x="45" y="40" width="10" height="8" rx="5" opacity="0.4" />
    <rect x="45" y="58" width="10" height="8" rx="5" opacity="0.4" />
    <rect x="44" y="76" width="12" height="8" rx="6" opacity="0.4" />
    <rect x="43" y="94" width="14" height="8" rx="7" opacity="0.4" />
    {/* Waves */}
    <path d="M5 115 Q25 108 45 115 T85 115" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
    <path d="M10 118 Q30 112 50 118 T90 118" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.15" />
  </svg>
);

// Bibi Ka Maqbara - Chhatrapati Sambhajinagar
const BibiKaMaqbara = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="10" y="108" width="80" height="8" />
    <rect x="15" y="100" width="70" height="8" />
    <rect x="20" y="50" width="60" height="50" />
    {/* Main Dome */}
    <ellipse cx="50" cy="38" rx="22" ry="25" />
    <path d="M50 13 L52 8 L50 5 L48 8Z" />
    {/* Entrance Arch */}
    <path d="M38 100 L38 65 Q50 52 62 65 L62 100Z" opacity="0.4" />
    {/* Side Domes */}
    <ellipse cx="28" cy="48" rx="7" ry="8" />
    <ellipse cx="72" cy="48" rx="7" ry="8" />
    {/* Minarets */}
    <rect x="8" y="35" width="6" height="65" />
    <rect x="86" y="35" width="6" height="65" />
    <ellipse cx="11" cy="32" rx="4" ry="5" />
    <ellipse cx="89" cy="32" rx="4" ry="5" />
    <line x1="11" y1="27" x2="11" y2="22" stroke="currentColor" strokeWidth="1.5" />
    <line x1="89" y1="27" x2="89" y2="22" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// Sabarmati Ashram Gate - Ahmedabad
const SabarmatiAshram = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="5" y="108" width="90" height="8" />
    {/* Main Building */}
    <rect x="15" y="50" width="70" height="58" />
    <path d="M15 50 L50 25 L85 50Z" />
    {/* Pillars */}
    <rect x="20" y="55" width="6" height="45" />
    <rect x="32" y="55" width="6" height="45" />
    <rect x="62" y="55" width="6" height="45" />
    <rect x="74" y="55" width="6" height="45" />
    {/* Door */}
    <path d="M42 100 L42 68 Q50 58 58 68 L58 100Z" opacity="0.4" />
    {/* Windows */}
    <rect x="22" y="62" width="8" height="10" rx="4" opacity="0.4" />
    <rect x="70" y="62" width="8" height="10" rx="4" opacity="0.4" />
    {/* Spinning Wheel Symbol */}
    <circle cx="50" cy="38" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
    <line x1="50" y1="32" x2="50" y2="44" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="44" y1="38" x2="56" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

// Victoria Memorial - Kolkata
const VictoriaMemorial = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="5" y="108" width="90" height="8" />
    <rect x="10" y="95" width="80" height="13" />
    {/* Main Building */}
    <rect x="20" y="55" width="60" height="40" />
    {/* Pillars */}
    <rect x="22" y="58" width="5" height="32" />
    <rect x="33" y="58" width="5" height="32" />
    <rect x="62" y="58" width="5" height="32" />
    <rect x="73" y="58" width="5" height="32" />
    {/* Main Dome */}
    <ellipse cx="50" cy="40" rx="20" ry="25" />
    <path d="M50 15 L52 10 L50 5 L48 10Z" />
    {/* Side Domes */}
    <ellipse cx="25" cy="52" rx="8" ry="10" />
    <ellipse cx="75" cy="52" rx="8" ry="10" />
    {/* Entrance */}
    <path d="M40 95 L40 70 Q50 62 60 70 L60 95Z" opacity="0.4" />
    {/* Windows */}
    <rect x="26" y="65" width="6" height="8" rx="3" opacity="0.4" />
    <rect x="68" y="65" width="6" height="8" rx="3" opacity="0.4" />
  </svg>
);

const HawaMahal = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="20" y="105" width="60" height="10" />
    <rect x="25" y="20" width="50" height="85" />
    {[0, 1, 2, 3, 4].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <rect key={`${row}-${col}`} x={30 + col * 12} y={25 + row * 16} width="8" height="12" rx="4" opacity="0.5" />
      ))
    )}
    <path d="M25 20 L30 10 L35 20Z" />
    <path d="M40 20 L50 5 L60 20Z" />
    <path d="M65 20 L70 10 L75 20Z" />
    <circle cx="50" cy="8" r="3" />
    <rect x="48" y="0" width="4" height="5" />
  </svg>
);

const ShaniwarWada = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="10" y="100" width="80" height="15" />
    <rect x="15" y="40" width="70" height="60" />
    <rect x="35" y="70" width="30" height="30" opacity="0.5" />
    <path d="M15 40 L50 15 L85 40Z" />
    <rect x="20" y="45" width="8" height="12" opacity="0.5" />
    <rect x="35" y="45" width="8" height="12" opacity="0.5" />
    <rect x="57" y="45" width="8" height="12" opacity="0.5" />
    <rect x="72" y="45" width="8" height="12" opacity="0.5" />
    <path d="M25 40 L30 30 L35 40Z" />
    <path d="M45 40 L50 30 L55 40Z" />
    <path d="M65 40 L70 30 L75 40Z" />
    <rect x="48" y="5" width="4" height="10" />
    <path d="M45 5 L50 0 L55 5Z" />
  </svg>
);

// Surat Diamond Bourse
const SuratDiamond = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="10" y="108" width="80" height="8" />
    {/* Modern Building */}
    <path d="M20 108 L20 35 Q50 15 80 35 L80 108Z" />
    {/* Glass Panels */}
    {[0, 1, 2, 3, 4].map(i => (
      <rect key={i} x="28" y={42 + i * 13} width="44" height="8" rx="1" opacity="0.3" />
    ))}
    {/* Diamond on top */}
    <polygon points="50,5 60,18 50,25 40,18" fill="currentColor" opacity="0.8" />
    <polygon points="50,5 55,14 50,18 45,14" fill="currentColor" opacity="0.5" />
    {/* Door */}
    <rect x="40" y="88" width="20" height="20" opacity="0.4" />
  </svg>
);

// Bara Imambara - Lucknow
const BaraImambara = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="5" y="108" width="90" height="8" />
    <rect x="10" y="50" width="80" height="58" />
    {/* Main Arches */}
    <path d="M15 108 L15 60 Q27 48 39 60 L39 108Z" opacity="0.4" />
    <path d="M39 108 L39 58 Q50 45 61 58 L61 108Z" opacity="0.4" />
    <path d="M61 108 L61 60 Q73 48 85 60 L85 108Z" opacity="0.4" />
    {/* Top Domes */}
    <ellipse cx="50" cy="38" rx="15" ry="18" />
    <path d="M50 20 L51 16 L50 12 L49 16Z" />
    <ellipse cx="25" cy="45" rx="8" ry="10" />
    <ellipse cx="75" cy="45" rx="8" ry="10" />
    {/* Minarets */}
    <rect x="5" y="25" width="5" height="83" />
    <rect x="90" y="25" width="5" height="83" />
    <ellipse cx="7.5" cy="23" rx="4" ry="5" />
    <ellipse cx="92.5" cy="23" rx="4" ry="5" />
  </svg>
);

// Rock Garden / Open Hand - Chandigarh
const OpenHand = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    {/* Base/Pedestal */}
    <rect x="30" y="100" width="40" height="16" />
    <rect x="35" y="96" width="30" height="6" />
    {/* Pole */}
    <rect x="47" y="45" width="6" height="51" />
    {/* Open Hand */}
    <path d="M50 45 L50 20 Q48 15 45 20 L45 35" fill="currentColor" opacity="0.8" />
    <path d="M45 35 L45 18 Q43 12 40 18 L40 32" fill="currentColor" opacity="0.8" />
    <path d="M40 32 L40 22 Q38 16 35 22 L35 32" fill="currentColor" opacity="0.7" />
    <path d="M35 32 L35 28 Q33 23 30 28 L30 35 Q30 42 38 45 L50 45" fill="currentColor" opacity="0.7" />
    <path d="M50 45 L50 18 Q52 12 55 18 L55 30 Q55 38 60 42 Q65 35 65 28 Q62 22 60 28 L60 38" fill="currentColor" opacity="0.7" />
    {/* Circle base design */}
    <circle cx="50" cy="90" r="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
  </svg>
);

// Deekshabhoomi - Nagpur  
const Deekshabhoomi = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="10" y="108" width="80" height="8" />
    {/* Base Circle */}
    <ellipse cx="50" cy="100" rx="38" ry="8" />
    <rect x="12" y="65" width="76" height="35" />
    {/* Main Dome */}
    <ellipse cx="50" cy="50" rx="35" ry="30" />
    {/* Spire */}
    <rect x="48" y="15" width="4" height="10" />
    <path d="M46 15 L50 5 L54 15Z" />
    {/* Ring around dome */}
    <ellipse cx="50" cy="62" rx="30" ry="5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    {/* Entrance */}
    <path d="M40 100 L40 75 Q50 65 60 75 L60 100Z" opacity="0.4" />
    {/* Windows */}
    <circle cx="35" cy="55" r="4" opacity="0.3" />
    <circle cx="65" cy="55" r="4" opacity="0.3" />
  </svg>
);

// Trimbakeshwar - Nashik
const Trimbakeshwar = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="15" y="108" width="70" height="8" />
    <rect x="20" y="50" width="60" height="58" />
    {/* Main Shikhara (Temple Tower) */}
    <path d="M35 50 Q50 10 65 50Z" />
    <path d="M38 50 Q50 18 62 50Z" opacity="0.6" />
    {/* Kalash on top */}
    <rect x="48" y="8" width="4" height="6" />
    <ellipse cx="50" cy="7" rx="5" ry="3" />
    <path d="M47 4 L50 0 L53 4Z" />
    {/* Temple Door */}
    <path d="M38 108 L38 65 Q50 55 62 65 L62 108Z" opacity="0.4" />
    {/* Pillars */}
    <rect x="25" y="55" width="4" height="45" />
    <rect x="71" y="55" width="4" height="45" />
    {/* Steps */}
    <rect x="30" y="100" width="40" height="3" opacity="0.3" />
    <rect x="33" y="103" width="34" height="3" opacity="0.3" />
    <rect x="36" y="106" width="28" height="2" opacity="0.3" />
  </svg>
);

// Lakshmi Vilas Palace - Vadodara
const LakshmiVilas = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="5" y="108" width="90" height="8" />
    <rect x="10" y="55" width="80" height="53" />
    {/* Central Tower */}
    <rect x="38" y="25" width="24" height="30" />
    <path d="M38 25 L50 10 L62 25Z" />
    <rect x="47" y="5" width="6" height="8" />
    <ellipse cx="50" cy="5" rx="5" ry="3" />
    {/* Side Towers */}
    <rect x="10" y="35" width="15" height="20" />
    <path d="M10 35 L17.5 22 L25 35Z" />
    <rect x="75" y="35" width="15" height="20" />
    <path d="M75 35 L82.5 22 L90 35Z" />
    {/* Windows */}
    <rect x="15" y="40" width="6" height="8" rx="3" opacity="0.4" />
    <rect x="79" y="40" width="6" height="8" rx="3" opacity="0.4" />
    <rect x="42" y="30" width="6" height="8" rx="3" opacity="0.4" />
    <rect x="52" y="30" width="6" height="8" rx="3" opacity="0.4" />
    {/* Main Entrance */}
    <path d="M40 108 L40 70 Q50 60 60 70 L60 108Z" opacity="0.4" />
    {/* Decorative arches */}
    <path d="M18 55 Q22 48 26 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M74 55 Q78 48 82 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
  </svg>
);

// ═══════════════════════════════════════════════════════════
// CITIES DATA
// ═══════════════════════════════════════════════════════════
const CITIES = [
  { 
    name: "Mumbai", 
    image: "/cities/mumbai.jpg", 
    desc: "City of Dreams",
    events: "5000+",
    monument: GatewayOfIndia,
  },
  { 
    name: "Delhi NCR", 
    image: "/cities/delhi.jpg", 
    desc: "Heritage Capital",
    events: "4500+",
    monument: IndiaGate,
  },
  { 
    name: "Bengaluru", 
    image: "/cities/bengluru.jpg", 
    desc: "Garden City",
    events: "3800+",
    monument: VidhanaSoudha,
  },
  { 
    name: "Hyderabad", 
    image: "/cities/hyderabad.jpg", 
    desc: "City of Pearls",
    events: "2500+",
    monument: Charminar,
  },
  { 
    name: "Pune", 
    image: "/cities/pune.jpg", 
    desc: "Cultural Hub",
    events: "3200+",
    monument: ShaniwarWada,
  },
  { 
    name: "Chennai", 
    image: "/cities/chennai.jpg", 
    desc: "Gateway to South",
    events: "2200+",
    monument: MarinaLighthouse,
  },
  { 
    name: "Sambhajinagar", 
    image: "/cities/sambhajinagar.jpg", 
    desc: "City of Gates",
    events: "1500+",
    monument: BibiKaMaqbara,
  },
  { 
    name: "Ahmedabad", 
    image: "/cities/ahmedabad.jpg", 
    desc: "Heritage City",
    events: "1800+",
    monument: SabarmatiAshram,
  },
  { 
    name: "Kolkata", 
    image: "/cities/kolkata.jpg", 
    desc: "City of Joy",
    events: "2400+",
    monument: VictoriaMemorial,
  },
  { 
    name: "Jaipur", 
    image: "/cities/jaipur.jpg", 
    desc: "Pink City",
    events: "2800+",
    monument: HawaMahal,
  },
  { 
    name: "Surat", 
    image: "/cities/surat.jpg", 
    desc: "Diamond City",
    events: "1600+",
    monument: SuratDiamond,
  },
  { 
    name: "Lucknow", 
    image: "/cities/lucknow.jpg", 
    desc: "City of Nawabs",
    events: "1200+",
    monument: BaraImambara,
  },
  { 
    name: "Chandigarh", 
    image: "/cities/chandigarh.jpg", 
    desc: "The City Beautiful",
    events: "1400+",
    monument: OpenHand,
  },
  { 
    name: "Nagpur", 
    image: "/cities/nagpur.jpg", 
    desc: "Orange City",
    events: "1100+",
    monument: Deekshabhoomi,
  },
  { 
    name: "Nashik", 
    image: "/cities/nashik.jpg", 
    desc: "Wine Capital",
    events: "1000+",
    monument: Trimbakeshwar,
  },
  { 
    name: "Vadodara", 
    image: "/cities/vadodara.jpg", 
    desc: "Kala Nagari",
    events: "950+",
    monument: LakshmiVilas,
  },
];

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT - Layout unchanged, just updated data
// ═══════════════════════════════════════════════════════════
export function CityShowcase() {
  const [activeCity, setActiveCity] = useState<number>(0);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-white to-[#FBF7F0]">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 opacity-[0.03] hidden lg:block">
          <GatewayOfIndia className="w-32 h-32" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-[0.03] hidden lg:block">
          <HawaMahal className="w-40 h-40" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-[0.02] hidden lg:block">
          <Charminar className="w-28 h-28" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#B8860B]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm mb-6">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">Pan India Presence</span>
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-4">
            Cities We <span className="text-[#B8860B] italic">Transform</span>
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">Bringing magical celebrations to iconic cities across India</p>
          <div className="flex justify-center gap-12 mt-8">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37]">{CITIES.length}+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Cities</p>
            </div>
            <div className="w-px bg-zinc-200" />
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37]">30K+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Events</p>
            </div>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="relative -mx-4">
            <div className="flex gap-4 overflow-x-auto px-4 pb-6 scrollbar-hide snap-x snap-mandatory">
              {CITIES.map((city) => {
                const Monument = city.monument;
                return (
                  <div key={city.name} className="group relative flex-shrink-0 w-[260px] snap-center">
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-zinc-100">
                      <div className="relative h-[160px] overflow-hidden">
                        <Image src={city.image} alt={city.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-3 right-3 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                          <Monument className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="text-white/70 text-[10px] font-medium uppercase tracking-wider">{city.desc}</span>
                          <h3 className="text-white font-serif text-xl font-bold">{city.name}</h3>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xl font-serif font-bold text-[#D4AF37]">{city.events}</p>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Events</p>
                        </div>
                        <Link href="/contact">
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-[#D4AF37] transition-colors cursor-pointer">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop: Interactive Grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-6">
            {/* Left - Active City Preview */}
            <div className="col-span-5 relative">
              <div className="sticky top-24">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                  <div className="relative h-[400px]">
                    <Image src={CITIES[activeCity].image} alt={CITIES[activeCity].name} fill className="object-cover transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                        {CITIES[activeCity].desc}
                      </span>
                      <h3 className="text-white font-serif text-4xl font-bold mb-2">{CITIES[activeCity].name}</h3>
                      <p className="text-white/80 text-lg">{CITIES[activeCity].events} Events Delivered</p>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-24 h-24 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center">
                    {(() => {
                      const Monument = CITIES[activeCity].monument;
                      return <Monument className="w-16 h-16 text-[#D4AF37]" />;
                    })()}
                  </div>
                </div>
                <Link href="/contact">
                  <button className="w-full mt-6 py-4 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-colors">
                    <Phone className="w-5 h-5" />
                    Book Event in {CITIES[activeCity].name}
                  </button>
                </Link>
              </div>
            </div>

            {/* Right - City Grid */}
            <div className="col-span-7">
              <div className="grid grid-cols-4 gap-3">
                {CITIES.map((city, index) => {
                  const Monument = city.monument;
                  const isActive = activeCity === index;
                  return (
                    <div
                      key={city.name}
                      className={`group relative cursor-pointer transition-all duration-300 ${isActive ? 'scale-105 z-10' : 'hover:scale-102'}`}
                      onMouseEnter={() => setActiveCity(index)}
                    >
                      <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                        isActive ? 'shadow-xl ring-2 ring-[#D4AF37]' : 'shadow-md hover:shadow-lg'
                      }`}>
                        <div className="relative h-[140px]">
                          <Image src={city.image} alt={city.name} fill className="object-cover" />
                          <div className={`absolute inset-0 transition-opacity duration-300 ${
                            isActive ? 'bg-gradient-to-t from-[#D4AF37]/80 via-[#D4AF37]/30 to-transparent' : 'bg-gradient-to-t from-zinc-900/70 via-zinc-900/30 to-transparent'
                          }`} />
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-90 group-hover:opacity-60 group-hover:scale-95'
                          }`}>
                            <Monument className={`w-14 h-14 transition-colors ${isActive ? 'text-white' : 'text-white/50'}`} />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                            <h4 className="text-white font-bold text-xs leading-tight">{city.name}</h4>
                            <p className={`text-[9px] font-medium mt-0.5 ${isActive ? 'text-white/90' : 'text-white/50'}`}>{city.events}</p>
                          </div>
                        </div>
                      </div>
                      {isActive && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#D4AF37] rounded-full" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-5 rounded-xl bg-white border border-zinc-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm">Can't find your city?</p>
                    <p className="text-zinc-900 font-bold">We're expanding rapidly!</p>
                  </div>
                  <Link href="/contact">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-zinc-900 text-zinc-900 font-bold text-sm hover:bg-zinc-900 hover:text-white transition-all">
                      Request Location <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}