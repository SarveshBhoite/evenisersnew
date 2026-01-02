"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock, Plus, Sparkles, Star } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build the URL based on whether a category filter is active
        const url = category
          ? `${API_URL}/products?category=${encodeURIComponent(category)}`
          : `${API_URL}/products`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // Re-runs every time the category in URL changes

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-5xl font-bold text-center mb-4 capitalize">
            {category ? `${category} Collection` : "Shop Collection"}
          </h1>
          <p className="text-center text-muted-foreground mb-16">
            Luxury pieces curated for your style.
          </p>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No products found in this category.
              </p>
              <Link
                href="/shop"
                className="text-black underline mt-4 inline-block"
              >
                View All Products
              </Link>
            </div>
          ) : (
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map((product) => (
    <Link 
      key={product._id} 
      href={`/product/${product._id}`} 
      className="group bg-white border border-zinc-200 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
    >
      {/* 1. SQUARE IMAGE SECTION (1:1 Ratio) */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Image
          src={product.image ? `http://localhost:5000${product.image}` : "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Sharp Modern Badge */}
        <div className="absolute top-0 left-0">
          <div className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2">
            {product.category}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <span className="bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 shadow-xl">
            View Package
          </span>
        </div>
      </div>

      {/* 2. TEXT SECTION - BOLD & MINIMALIST */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1 text-zinc-700">
            {product.name}
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.15em]">
            Exquisite Event Setup
          </p>
        </div>

        {/* Feature Grid */}
        <div className="flex gap-4 border-y border-zinc-100 py-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-800 uppercase">Duration</span>
            <span className="text-[11px] ">4-6 Hours</span>
          </div>
          <div className="w-[1px] bg-zinc-100" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-800 uppercase">Includes</span>
            <span className="text-[11px]">Setup + Decor</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Fixed Price</span>
            <p className="text-2xl  text-black leading-none">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>
          
          <div className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>
          )}
        </div>
      </section>
    </div>
  );
}
