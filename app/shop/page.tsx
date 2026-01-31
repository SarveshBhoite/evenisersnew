"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = category
          ? `${API_URL}/products?category=${encodeURIComponent(category)}`
          : `${API_URL}/products`;

        const res = await axios.get(url);
        
        // ✅ ONLY CHANGE: Randomly shuffle the products array
        const shuffledData = res.data.sort(() => 0.5 - Math.random());
        
        setProducts(shuffledData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-32 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-center mb-2 md:mb-4 capitalize">
            {category ? `${category} Collection` : "Shop Collection"}
          </h1>
          <p className="text-center text-sm md:text-base text-muted-foreground mb-8 md:mb-16">
            Luxury pieces curated for your style.
          </p>

          {loading ? (
            <div className="flex justify-center items-center min-h-100">
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
            // ✅ YOUR ORIGINAL GRID
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {products.map((product) => {
                // Calculate Discount
                const discount = product.discount || 0;
                const price = product.price;
                const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

                return (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="group bg-white border border-zinc-200 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-lg md:rounded-none"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-zinc-100">
                      <Image
                        src={
                          product.image
                            ? (product.image.startsWith("http") 
                                ? product.image 
                                : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`)
                            : "/placeholder.svg"
                        }
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute top-0 left-0">
                        <div className="bg-black text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 md:px-4 md:py-2">
                          {product.category}
                        </div>
                      </div>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-red-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-2 animate-pulse">
                            -{discount}%
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <span className="hidden md:block bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 shadow-xl">
                          View Package
                        </span>
                      </div>
                    </div>

                    {/* Text Content - Adjusted for Mobile */}
                    <div className="p-3 md:p-5 space-y-2 md:space-y-4">
                      <div>
                        <h3 className="text-sm md:text-xl font-black uppercase tracking-tighter leading-tight md:leading-none mb-1 text-zinc-700 truncate">
                          {product.name}
                        </h3>
                      </div>

                      {/* Specs - Hidden on Mobile (too wide for 2 cols) */}
                      <div className="hidden sm:flex gap-4 border-y border-zinc-100 py-3">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-800 uppercase">
                            Duration
                          </span>
                          <span className="text-[11px]">
                            {product.setupTime || "—"}
                          </span>
                        </div>

                        <div className="w-[1px] bg-zinc-100" />

                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-zinc-800 uppercase">
                            Includes
                          </span>
                          <span className="text-[11px] truncate max-w-[150px]">
                            {product.included
                              ? product.included.split(",").slice(0, 2).join(", ")
                              : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                            {discount > 0 ? "Deal Price" : "Fixed Price"}
                          </span>
                          
                          {/* Price Display */}
                          <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                            <p className="text-lg md:text-2xl text-black leading-none font-bold">
                              ₹{finalPrice.toLocaleString("en-IN")}
                            </p>
                            {discount > 0 && (
                                <p className="text-[10px] md:text-sm text-zinc-400 line-through decoration-zinc-400">
                                    ₹{price.toLocaleString("en-IN")}
                                </p>
                            )}
                          </div>
                        </div>

                        <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 rounded-full md:rounded-none">
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}