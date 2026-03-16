"use client";

import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const CITIES = [
  { 
    name: "Mumbai", 
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop", 
    desc: "City of Dreams",
    events: "5000+"
  },
  { 
    name: "Delhi", 
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", 
    desc: "Heritage Capital",
    events: "4500+"
  },
  { 
    name: "Bangalore", 
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop", 
    desc: "Garden City",
    events: "3800+"
  },
  { 
    name: "Goa", 
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop", 
    desc: "Tropical Paradise",
    events: "2000+"
  },
  { 
    name: "Pune", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "Cultural Hub",
    events: "3200+"
  },
  { 
    name: "Jaipur", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "Pink City",
    events: "2800+"
  },
];

export function CityShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 bg-[#FDFCF8] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Header - Unique Layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-6">
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200 shadow-sm">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                  Pan India Presence
                </span>
              </div>
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent max-w-[200px]" />
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900">
              Cities We<br className="hidden md:block" />
              <span className="text-[#B8860B] italic">Transform</span>
            </h2>
          </div>
          
          {/* Stats */}
          <div className="flex gap-8 md:gap-12">
            <div className="text-center md:text-right">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37]">25+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Cities</p>
            </div>
            <div className="text-center md:text-right">
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF37]">30K+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Events</p>
            </div>
          </div>
        </div>

        {/* Cities Grid - Hexagonal Inspired Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CITIES.map((city, index) => (
            <div 
              key={city.name} 
              className={`group relative ${index === 0 || index === 3 ? 'md:mt-8' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className="relative h-[220px] md:h-[320px] overflow-hidden cursor-pointer transition-all duration-500"
                style={{
                  borderRadius: index % 2 === 0 
                    ? "60% 40% 40% 60% / 60% 30% 70% 40%" 
                    : "40% 60% 60% 40% / 40% 60% 40% 60%",
                  transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Image */}
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">
                        {city.desc}
                      </span>
                    </div>
                    
                    {/* City Name */}
                    <h3 className="text-white font-serif text-2xl md:text-4xl font-bold mb-2">
                      {city.name}
                    </h3>
                    
                    {/* Events Count - Visible on Hover */}
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[#D4AF37] text-sm font-bold">{city.events} Events</span>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Border Effect */}
                <div 
                  className="absolute inset-2 border border-white/20 pointer-events-none transition-all duration-500 group-hover:inset-4"
                  style={{
                    borderRadius: index % 2 === 0 
                      ? "55% 45% 45% 55% / 55% 35% 65% 45%" 
                      : "45% 55% 55% 45% / 45% 55% 45% 55%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-500 mb-4">Can't find your city?</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-sm font-bold uppercase tracking-wider">
            <span>Request Your Location</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}