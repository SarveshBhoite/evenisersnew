"use client";

import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";

const CITIES = [
  { 
    name: "Mumbai", 
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop", 
    desc: "City of Dreams" 
  },
  { 
    name: "Delhi", 
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", 
    desc: "Heritage" 
  },
  { 
    name: "Bangalore", 
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=800&auto=format&fit=crop", 
    desc: "Garden City" 
  },
  { 
    name: "Goa", 
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop", 
    desc: "Tropical Paradise" 
  },
  { 
    name: "Pune", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "Cultural Hub" 
  },
  { 
    name: "Jaipur", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "Pink City" 
  },
];

export function CityShowcase() {
  return (
    <section className="bg-zinc-50 py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-16 space-y-2 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Pan India Presence
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-6xl font-bold text-zinc-900">
            Iconic Destinations
          </h2>
        </div>

        {/* GRID LAYOUT UPDATED:
           - Mobile: grid-cols-2 (2 items per row)
           - Desktop: grid-cols-3 (3 items per row)
        */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {CITIES.map((city) => (
            <div 
              key={city.name} 
              className="group relative h-[200px] md:h-[300px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-md md:shadow-xl shadow-zinc-200 border border-white"
            >
              {/* Image */}
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
              
              {/* Decorative Border Frame (Hidden on Mobile for cleaner look) */}
              <div className="hidden md:block absolute inset-4 border border-white/20 rounded-[2rem] pointer-events-none" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-4 md:p-8">
                <div className="transform md:group-hover:-translate-y-2 transition-transform duration-500">
                  
                  {/* Label */}
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <div className="flex items-center gap-1 md:gap-2 text-[#D4AF37]">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 fill-[#D4AF37]" />
                        <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest text-white/90 truncate max-w-[80px] md:max-w-none">
                            {city.desc}
                        </span>
                    </div>
                    {/* Hover Arrow (Desktop Only) */}
                    <div className="hidden md:flex w-10 h-10 rounded-full bg-white/10 backdrop-blur-md items-center justify-center text-white opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* City Name */}
                  <h3 className="text-white font-serif text-xl md:text-4xl font-medium tracking-tight">
                    {city.name}
                  </h3>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}