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

  const targetCategories = ["wedding", "birthday", "haldi", "corporate", "anniversary"];

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
          <section key={section.slug} className="py-16 px-6 border-b border-zinc-100 last:border-0">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-zinc-400 uppercase tracking-widest text-xs font-bold">
                    Curated Collection
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
                    {section.title} Highlights
                  </h2>
                </div>
                <Link 
                  href={`/shop?category=${section.slug}`}
                  className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline"
                >
                  View All {section.title} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.items.map((event: any) => (
                  <Link key={event._id} href={`/product/${event._id}`} className="group">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-lg bg-zinc-100">
                      <Image
                        src={event.image?.startsWith("http") ? event.image : `${process.env.NEXT_PUBLIC_API_URL}${event.image}`}
                        alt={event.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                         <div className="flex justify-between items-center">
                            <span className="font-bold text-sm">View Details</span>
                            <ArrowRight className="w-4 h-4" />
                         </div>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold group-hover:text-zinc-600 transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-zinc-500 text-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Setup Incl.
                      </p>
                      <p className="font-bold">
                        ₹{event.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 sm:hidden text-center">
                <Button asChild variant="outline" className="rounded-full w-full">
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