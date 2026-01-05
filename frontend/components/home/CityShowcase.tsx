"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

const CITIES = [
  { 
    name: "Mumbai", 
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop", 
    desc: "The City of Dreams" 
  },
  { 
    name: "Delhi", 
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", 
    desc: "Heritage & Culture" 
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
    desc: "Cultural Capital" 
  },
  { 
    name: "Jaipur", 
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop", 
    desc: "The Pink City" 
  },
];

export function CityShowcase() {
  return (
    <section className=" px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-zinc-400 uppercase tracking-widest text-xs font-bold">
            Locations
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4">
            Cities We Serve
          </h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
            From grand palaces to beachside resorts, we bring luxury execution to India's most iconic destinations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CITIES.map((city) => (
            <div 
              key={city.name} 
              className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 w-full p-4 text-center transform transition-transform duration-300 group-hover:-translate-y-2">
                <MapPin className="w-6 h-6 text-white mx-auto mb-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-white font-serif text-xl font-bold tracking-wide">
                  {city.name}
                </h3>
                <p className="text-white/70 text-xs uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    {city.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}