"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Ensure these paths match where you saved the files
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { CityShowcase } from "@/components/home/CityShowcase";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  
  const categoriesList = [
    // { name: "Weddings", image: "/luxury-silk-scarf.png", href: "/shop?category=wedding" },
    { name: "Birthdays", image: "/luxury-cashmere-blazer.jpg", href: "/shop?category=birthday" },
    // { name: "Corporate", image: "/luxury-mens-fashion-minimalist.jpg", href: "/shop?category=corporate" },
    // { name: "Haldi", image: "/luxury-leather-belt.jpg", href: "/shop?category=haldi" },
    // { name: "Anniversary", image: "/designer-sunglasses-luxury.jpg", href: "/shop?category=anniversary" },
    { name: "Baby Welcome", image: "/luxury-fashion-store-interior-beige.jpg", href: "/shop?category=babywelcome" },
    { name: "Naming Ceremony", image: "/luxury-fashion-accessories.jpg", href: "/shop?category=namingceremony" },
    { name: "Romantic", image: "/luxury-fashion-accessories.jpg", href: "/shop?category=romantic" },
    { name: "Baby Shower", image: "/luxury-fashion-accessories.jpg", href: "/shop?category=babyshower" },
    { name: "Bride To Be", image: "/luxury-fashion-accessories.jpg", href: "/shop?category=bridetobe" },
    { name: "Aged to Perfection", image: "/luxury-fashion-accessories.jpg", href: "/shop?category=agedtoperfection" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-zinc-900 selection:bg-[#D4AF37] selection:text-white">
      <Navbar />

      {/* --- HERO SECTION (Kept Small as requested) --- */}
      <section className="relative h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-event-decoration.jpg"
            alt="Luxury Event Decoration"
            fill
            className="object-cover brightness-[0.6]"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-3 max-w-5xl mx-auto text-white mt-16">
          <span className="uppercase tracking-[0.3em] text-xs md:text-sm mb-3 block animate-fade-in text-white/90 font-medium">
            Exquisite Moments
          </span>
          <h1 className="font-serif text-3xl md:text-6xl font-bold mb-0 leading-tight drop-shadow-xl">
            Crafting Your Perfect Celebration
          </h1>
        </div>
      </section>

      {/* --- CATEGORY GRID (Immediately Visible) --- */}
      <section className="py-16 px-4 md:px-6 relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900">
                Our Specialities
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Curated experiences for every milestone
              </p>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Premium Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
            {categoriesList.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative h-[250px] md:h-[220px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Elegant Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-lg md:text-xl font-serif font-bold mb-1">
                    {cat.name}
                  </h3>
                  <div className="h-0.5 w-12 bg-white/50 mb-2 group-hover:w-full transition-all duration-500" />
                  <p className="text-white/80 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Explore
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS (Soft Gradient - No Black) --- */}
      <section className="py-16 bg-gradient-to-r from-rose-50 via-white to-orange-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
          {[
             { label: "Events Crafted", val: "30K+" },
             { label: "Years Experience", val: "12+" },
             { label: "Happy Clients", val: "100%" },
          ].map((stat, i) => (
            <div key={i}>
              <h4 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#D4AF37] to-[#B8860B] drop-shadow-sm">
                {stat.val}
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-3 tracking-[0.25em] uppercase font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- DYNAMIC COLLECTIONS --- */}
      <FeaturedCollection />

      {/* --- CITIES WE SERVE --- */}
      <CityShowcase />

      {/* --- BOOKING BANNER --- */}
      <section className="relative py-24 px-6 mx-4 md:mx-6 rounded-[2.5rem] my-20 overflow-hidden text-center shadow-2xl">
        <div className="absolute inset-0 z-0">
             <Image src="/hero-event-decoration.jpg" alt="Background" fill className="object-cover brightness-[0.3]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-white">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 leading-tight">
             Planning a Wedding in 2026?
            </h2>
            <p className="text-zinc-300 mb-10 text-lg font-light">
             Dates are filling up fast. Secure your consultation with our lead designers today.
            </p>
            <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-black hover:bg-zinc-200 px-10 h-14 text-base font-bold"
            >
                <Link href="/contact">Check Availability</Link>
            </Button>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <FAQSection />

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 px-6 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto">
             <div className="mb-16 text-center">
                <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold">Testimonials</span>
                <h2 className="font-serif text-4xl mt-3 text-zinc-900">Client Stories</h2>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                    name: "Ananya Iyer",
                    role: "Bride",
                    quote: "The floral mandap they designed was beyond my dreams. It felt like walking into a fairytale. Truly the best decorators.",
                    },
                    {
                    name: "Rajesh Mehra",
                    role: "Corporate HR",
                    quote: "Exceptional coordination for our annual gala. The lighting and stage setup were world-class. Professional & timely.",
                    },
                    {
                    name: "Sneha Kapoor",
                    role: "Mother",
                    quote: "The theme execution for my son's first year was so magical. Every detail, from the entrance to the cake table, was perfect.",
                    },
                ].map((t, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group">
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                            ))}
                        </div>
                        <p className="text-lg font-serif italic text-zinc-600 mb-8 leading-relaxed group-hover:text-zinc-900 transition-colors">"{t.quote}"</p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center font-serif font-bold text-[#D4AF37]">
                                {t.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm uppercase tracking-widest">{t.name}</p>
                                <p className="text-zinc-400 text-xs">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}