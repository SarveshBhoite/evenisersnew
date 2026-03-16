"use client";

import Image from "next/image";
import { MapPin, ArrowUpRight, Phone } from "lucide-react";
import { useState } from "react";

// Monument SVG Components for each city
const GatewayOfIndia = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <path d="M50 5 L55 5 L55 15 L58 15 L58 5 L63 5 L63 15 L66 15 L66 20 L34 20 L34 15 L37 15 L37 5 L42 5 L42 15 L45 15 L45 5 L50 5Z" />
    <path d="M25 20 L75 20 L75 25 L25 25Z" />
    <path d="M20 25 L80 25 L80 35 L75 35 L75 30 L25 30 L25 35 L20 35Z" />
    <path d="M22 35 L78 35 L78 45 L22 45Z" />
    <rect x="25" y="45" width="8" height="60" />
    <rect x="67" y="45" width="8" height="60" />
    <path d="M33 45 L67 45 L67 55 Q50 75 33 55Z" />
    <rect x="33" y="55" width="34" height="50" />
    <path d="M38 75 L62 75 L62 105 L38 105Z" opacity="0.5" />
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
    <rect x="35" y="85" width="30" height="5" />
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
    <rect x="45" y="15" width="10" height="5" />
    <circle cx="50" cy="12" r="5" />
  </svg>
);

const GoaChurch = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="25" y="50" width="50" height="65" />
    <rect x="20" y="105" width="60" height="10" />
    <path d="M25 50 L50 25 L75 50Z" />
    <path d="M35 25 L50 5 L65 25Z" />
    <rect x="47" y="8" width="6" height="15" />
    <rect x="44" y="5" width="12" height="6" />
    <circle cx="50" cy="40" r="8" opacity="0.5" />
    <rect x="40" y="75" width="20" height="40" opacity="0.5" />
    <rect x="30" y="60" width="10" height="15" opacity="0.5" />
    <rect x="60" y="60" width="10" height="15" opacity="0.5" />
    <rect x="15" y="50" width="10" height="30" />
    <rect x="75" y="50" width="10" height="30" />
    <path d="M15 50 L20 40 L25 50Z" />
    <path d="M75 50 L80 40 L85 50Z" />
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

const HawaMahal = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="currentColor">
    <rect x="20" y="105" width="60" height="10" />
    <rect x="25" y="20" width="50" height="85" />
    {/* Windows pattern */}
    {[0, 1, 2, 3, 4].map((row) => (
      [0, 1, 2, 3].map((col) => (
        <rect 
          key={`${row}-${col}`}
          x={30 + col * 12} 
          y={25 + row * 16} 
          width="8" 
          height="12" 
          rx="4"
          opacity="0.5"
        />
      ))
    ))}
    {/* Top domes */}
    <path d="M25 20 L30 10 L35 20Z" />
    <path d="M40 20 L50 5 L60 20Z" />
    <path d="M65 20 L70 10 L75 20Z" />
    <circle cx="50" cy="8" r="3" />
    <rect x="48" y="0" width="4" height="5" />
  </svg>
);

const CITIES = [
  { 
    name: "Mumbai", 
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop", 
    desc: "City of Dreams",
    events: "5000+",
    monument: GatewayOfIndia,
    color: "#D4AF37"
  },
  { 
    name: "Delhi", 
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", 
    desc: "Heritage Capital",
    events: "4500+",
    monument: IndiaGate,
    color: "#B8860B"
  },
  { 
    name: "Bangalore", 
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop", 
    desc: "Garden City",
    events: "3800+",
    monument: VidhanaSoudha,
    color: "#D4AF37"
  },
  { 
    name: "Goa", 
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop", 
    desc: "Tropical Paradise",
    events: "2000+",
    monument: GoaChurch,
    color: "#B8860B"
  },
  { 
    name: "Pune", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "Cultural Hub",
    events: "3200+",
    monument: ShaniwarWada,
    color: "#D4AF37"
  },
  { 
    name: "Jaipur", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "Pink City",
    events: "2800+",
    monument: HawaMahal,
    color: "#B8860B"
  },
];

export function CityShowcase() {
  const [activeCity, setActiveCity] = useState<number>(0);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-white to-[#FBF7F0]">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Monument Silhouettes */}
        <div className="absolute top-20 left-10 opacity-[0.03] hidden lg:block">
          <GatewayOfIndia className="w-32 h-32" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-[0.03] hidden lg:block">
          <HawaMahal className="w-40 h-40" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-[0.02] hidden lg:block">
          <IndiaGate className="w-24 h-24" />
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#B8860B]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        
        {/* ════════════════════════════════════════════════════════
            HEADER SECTION
        ════════════════════════════════════════════════════════ */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm mb-6">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
              Pan India Presence
            </span>
          </div>
          
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-4">
            Cities We <span className="text-[#B8860B] italic">Transform</span>
          </h2>
          
          <p className="text-zinc-500 max-w-md mx-auto">
            Bringing magical celebrations to iconic cities across India
          </p>

          {/* Stats Row */}
          <div className="flex justify-center gap-12 mt-8">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37]">25+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Cities</p>
            </div>
            <div className="w-px bg-zinc-200" />
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37]">30K+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Events</p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            MOBILE: Horizontal Scroll with Monument Cards
        ════════════════════════════════════════════════════════ */}
        <div className="md:hidden">
          {/* City Cards - Horizontal Scroll */}
          <div className="relative -mx-4">
            <div className="flex gap-4 overflow-x-auto px-4 pb-6 scrollbar-hide snap-x snap-mandatory">
              {CITIES.map((city, index) => {
                const Monument = city.monument;
                return (
                  <div
                    key={city.name}
                    className="group relative flex-shrink-0 w-[280px] snap-center"
                  >
                    {/* Card */}
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-zinc-100">
                      {/* Image Section */}
                      <div className="relative h-[180px] overflow-hidden">
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Monument Icon - Floating */}
                        <div className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <Monument className="w-10 h-10 text-[#D4AF37]" />
                        </div>
                        
                        {/* City Name on Image */}
                        <div className="absolute bottom-4 left-4">
                          <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
                            {city.desc}
                          </span>
                          <h3 className="text-white font-serif text-2xl font-bold">
                            {city.name}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-serif font-bold text-[#D4AF37]">{city.events}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">Events Delivered</p>
                          </div>
                          <button className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white hover:bg-[#D4AF37] transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Scroll Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {CITIES.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-colors ${i === 0 ? 'bg-[#D4AF37]' : 'bg-zinc-200'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            DESKTOP: Interactive Monument Grid
        ════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left Side - Large Active City Display */}
            <div className="col-span-5 relative">
              <div className="sticky top-24">
                {/* Active City Card */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white">
                  {/* Image */}
                  <div className="relative h-[400px]">
                    <Image
                      src={CITIES[activeCity].image}
                      alt={CITIES[activeCity].name}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                        {CITIES[activeCity].desc}
                      </span>
                      <h3 className="text-white font-serif text-4xl font-bold mb-2">
                        {CITIES[activeCity].name}
                      </h3>
                      <p className="text-white/80 text-lg">
                        {CITIES[activeCity].events} Events Delivered
                      </p>
                    </div>
                  </div>
                  
                  {/* Monument Display */}
                  <div className="absolute top-6 right-6 w-24 h-24 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center">
                    {(() => {
                      const Monument = CITIES[activeCity].monument;
                      return <Monument className="w-16 h-16 text-[#D4AF37]" />;
                    })()}
                  </div>
                </div>
                
                {/* CTA Button */}
                <button className="w-full mt-6 py-4 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-[#D4AF37] transition-colors">
                  <Phone className="w-5 h-5" />
                  Book Event in {CITIES[activeCity].name}
                </button>
              </div>
            </div>
            
            {/* Right Side - City Grid with Monuments */}
            <div className="col-span-7">
              <div className="grid grid-cols-3 gap-4">
                {CITIES.map((city, index) => {
                  const Monument = city.monument;
                  const isActive = activeCity === index;
                  
                  return (
                    <div
                      key={city.name}
                      className={`group relative cursor-pointer transition-all duration-500 ${
                        isActive ? 'scale-105 z-10' : 'hover:scale-102'
                      }`}
                      onMouseEnter={() => setActiveCity(index)}
                    >
                      {/* Card with Monument Focus */}
                      <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                        isActive 
                          ? 'shadow-2xl shadow-[#D4AF37]/20 ring-2 ring-[#D4AF37]' 
                          : 'shadow-lg hover:shadow-xl'
                      }`}>
                        {/* Background Image */}
                        <div className="relative h-[200px]">
                          <Image
                            src={city.image}
                            alt={city.name}
                            fill
                            className="object-cover"
                          />
                          <div className={`absolute inset-0 transition-opacity duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-t from-[#D4AF37]/90 via-[#D4AF37]/40 to-transparent' 
                              : 'bg-gradient-to-t from-zinc-900/80 via-zinc-900/40 to-transparent'
                          }`} />
                          
                          {/* Monument Silhouette - Large */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 group-hover:opacity-70 group-hover:scale-95'
                          }`}>
                            <Monument className={`w-20 h-20 transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-white/50'
                            }`} />
                          </div>
                          
                          {/* City Info */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                            <h4 className={`font-serif text-xl font-bold transition-colors ${
                              isActive ? 'text-white' : 'text-white'
                            }`}>
                              {city.name}
                            </h4>
                            <p className={`text-xs font-medium mt-1 transition-colors ${
                              isActive ? 'text-white/90' : 'text-white/60'
                            }`}>
                              {city.events}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#D4AF37] rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Bottom Info */}
              <div className="mt-8 p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-500 text-sm">Can't find your city?</p>
                    <p className="text-zinc-900 font-bold">We're expanding rapidly!</p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-900 hover:text-white transition-all">
                    <span>Request Location</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-20">
          <path 
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" 
            fill="#FDFCF8"
          />
        </svg>
      </div>
    </section>
  );
}