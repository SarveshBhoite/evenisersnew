"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export function FeaturedCollection() {
  const [categorySections, setCategorySections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const targetCategories = [
    "birthday", "wedding", "haldi-mehandi", "engagement", "festival",
    "anniversary", "babyshower", "babywelcome", "namingceremony",
    "annaprashan", "agedtoperfection", "housewarming", "bridetobe",
    "romantic", "corporate", "catering"
  ];

  const formatTitle = (slug: string) => {
    const titles: Record<string, string> = {
      "haldi-mehandi": "Haldi & Mehandi",
      "bridetobe": "Bride To Be",
      "babywelcome": "Baby Welcome",
      "namingceremony": "Naming Ceremony",
      "babyshower": "Baby Shower",
      "housewarming": "House Warming",
      "agedtoperfection": "Aged To Perfection",
    };
    return titles[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  useEffect(() => {
    const fetchAndOrganizeEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const allProducts = Array.isArray(res.data) ? res.data : (res.data.products || []);

        const sections = targetCategories.map((cat) => {
          const filtered = allProducts.filter((p: any) => p.category === cat);
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          return {
            title: formatTitle(cat),
            slug: cat,
            items: shuffled.slice(0, 5)
          };
        });

        setCategorySections(sections.filter(s => s.items.length > 0));
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndOrganizeEvents();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-7xl bg-gray-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCF8]">
      {categorySections.map((section, sectionIndex) => (
        <section 
          key={section.slug} 
          className={`py-16 md:py-24 px-4 md:px-6 relative ${
            sectionIndex % 2 === 0 ? 'bg-white' : 'bg-[#FDFCF8]'
          }`}
        >
          {/* Decorative Element */}
          {sectionIndex % 3 === 0 && (
            <div className="absolute top-10 right-10 w-32 h-32 border border-[#D4AF37]/10 rounded-full hidden lg:block" />
          )}

          <div className="max-w-7xl mx-auto">
            {/* Section Header - Alternating Layouts */}
            <div className={`flex flex-col ${sectionIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-end justify-between mb-10 gap-4`}>
              <div className={`relative ${sectionIndex % 2 !== 0 ? 'md:text-right' : ''}`}>
                {/* Accent Line */}
                <div className={`absolute top-0 ${sectionIndex % 2 === 0 ? '-left-4' : '-right-4'} w-1 h-12 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full hidden md:block`} />
                
                <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase">
                  Curated {section.title}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2 text-zinc-900">
                  {section.title}{" "}
                  <span className="italic text-[#B8860B]">Collection</span>
                </h2>
              </div>
              
              <Link 
                href={`/shop?category=${section.slug}`}
                className="group hidden md:flex items-center gap-3 text-sm font-bold uppercase tracking-wider hover:text-[#D4AF37] transition-colors"
              >
                <span>View All</span>
                <span className="w-10 h-10 rounded-full border border-current flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            {/* Products Grid - Unique Card Shapes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {section.items.map((event: any, index: number) => (
                <Link 
                  key={event._id} 
                  href={`/product/${event._id}`} 
                  className={`group relative ${
                    index === 0 ? 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2' : ''
                  }`}
                >
                  <div 
                    className={`relative overflow-hidden bg-zinc-100 ${
                      index === 0 ? 'aspect-square md:aspect-[4/5]' : 'aspect-[3/4]'
                    }`}
                    style={{
                      borderRadius: index === 0 
                        ? "2rem" 
                        : index === 1 
                          ? "2rem 0.5rem 2rem 0.5rem" 
                          : index === 2 
                            ? "0.5rem 2rem 0.5rem 2rem"
                            : "1rem"
                    }}
                  >
                    <Image
                      src={event.image?.startsWith("http") ? event.image : `${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#D4AF37] hover:text-white shadow-lg">
                      <Heart className="w-4 h-4" />
                    </button>

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        Premium
                      </span>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
                        <h3 className={`text-white font-serif font-bold leading-tight mb-2 ${
                          index === 0 ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
                        }`}>
                          {event.name}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-white/80 text-sm font-bold">
                            ₹{event.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-medium">View</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Border on Hover */}
                    <div 
                      className="absolute inset-3 border border-white/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        borderRadius: index === 0 
                          ? "1.5rem" 
                          : index === 1 
                            ? "1.5rem 0.25rem 1.5rem 0.25rem" 
                            : index === 2 
                              ? "0.25rem 1.5rem 0.25rem 1.5rem"
                              : "0.75rem"
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-8 md:hidden">
              <Button asChild variant="outline" className="w-full rounded-full border-zinc-300 h-14 font-bold">
                <Link href={`/shop?category=${section.slug}`}>
                  View All {section.title}
                </Link>
              </Button>
            </div>
          </div>

          {/* Section Divider - Wave Pattern */}
          {sectionIndex < categorySections.length - 1 && (
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none hidden md:block">
              <svg 
                viewBox="0 0 1200 30" 
                preserveAspectRatio="none" 
                className="relative block w-full h-4"
              >
                <path 
                  d="M0,15 Q300,30 600,15 T1200,15 L1200,30 L0,30 Z" 
                  fill={sectionIndex % 2 === 0 ? '#FDFCF8' : '#FFFFFF'}
                />
              </svg>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}