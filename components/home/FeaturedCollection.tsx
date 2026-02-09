"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export function FeaturedCollection() {
  const [categorySections, setCategorySections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const targetCategories = ["wedding", "birthday", "haldi", "corporate", "anniversary", "babywelcome", "namingceremony", "romantic", "babyshower", "bridetobe", "agedtoperfection"];

  useEffect(() => {
    const fetchAndOrganizeEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        const allProducts = Array.isArray(res.data) ? res.data : (res.data.products || []);

        const sections = targetCategories.map((cat) => {
          const filtered = allProducts.filter((p: any) => p.category === cat);
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          return {
            title: cat.charAt(0).toUpperCase() + cat.slice(1),
            slug: cat,
            items: shuffled.slice(0, 4)
          };
        });

        setCategorySections(sections);
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
    <div className="bg-white">
      {categorySections.map((section) => (
        section.items.length > 0 && (
          <section key={section.slug} className="py-12 md:py-16 px-4 md:px-6 border-b border-zinc-100 last:border-0">
            <div className="max-w-7xl mx-auto">
              
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-2">
                <div>
                  <span className="text-zinc-400 uppercase tracking-widest text-[10px] md:text-xs font-bold">
                    Curated Collection
                  </span>
                  <h2 className="font-serif text-2xl md:text-4xl font-bold mt-2 text-zinc-900">
                    {section.title} Highlights
                  </h2>
                </div>
                {/* Desktop View All Link */}
                <Link 
                  href={`/shop?category=${section.slug}`}
                  className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline"
                >
                  View All {section.title} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* MOBILE: Horizontal Scroll Carousel 
                  DESKTOP: Standard Grid 
              */}
              <div className="
                flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 snap-x snap-mandatory 
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:pb-0 sm:mx-0 sm:px-0 sm:overflow-visible
              ">
                {section.items.map((event: any) => (
                  <Link 
                    key={event._id} 
                    href={`/product/${event._id}`} 
                    className="group relative min-w-[280px] w-[85vw] sm:w-auto sm:min-w-0 snap-center"
                  >
                    {/* Image Card */}
                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 shadow-md bg-zinc-100 border border-zinc-100">
                      <Image
                        src={event.image?.startsWith("http") ? event.image : `${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
                        alt={event.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-700"
                      />
                      
                      {/* Mobile-Only Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider sm:hidden shadow-sm">
                         {section.title}
                      </div>

                      {/* Desktop Hover Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block shadow-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-black">View Details</span>
                            <ArrowRight className="w-4 h-4 text-black" />
                          </div>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="space-y-1 px-1">
                        <h3 className="font-serif text-lg md:text-xl font-bold text-zinc-900 leading-tight line-clamp-1 group-hover:text-zinc-600 transition-colors">
                          {event.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-zinc-500 text-xs md:text-sm flex items-center gap-1 font-medium">
                              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Setup Included
                          </p>
                          <p className="font-bold text-sm md:text-base text-black">
                              ₹{event.price.toLocaleString()}
                          </p>
                        </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile View All Button (Bottom) */}
              <div className="mt-2 sm:hidden">
                <Button asChild variant="outline" className="w-full rounded-full border-zinc-200 h-12 font-bold text-zinc-700">
                   <Link href={`/shop?category=${section.slug}`}>View All {section.title}</Link>
                </Button>
              </div>

            </div>
          </section>
        )
      ))}
    </div>
  );
}