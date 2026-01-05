"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { 
  Star, Clock, ShieldCheck, CalendarDays, Share2, Info, CheckCircle2, Loader2, 
  Leaf, Truck, BadgePercent, ChevronLeft, ChevronRight, XCircle, ArrowRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Image Slider State
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductById(id as string)
        .then((data) => {
          setProduct(data);
          fetchSimilarProducts(data.category, data._id);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          toast.error("Failed to load product details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fetchSimilarProducts = async (category: string, currentId: string) => {
    try {
      const res = await axios.get(`${API_URL}/products?category=${category}`);
      const all = Array.isArray(res.data) ? res.data : res.data.products;
      const filtered = all.filter((p: any) => p._id !== currentId);
      const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 3); // Top 3 looks better in grid
      setSimilarProducts(shuffled);
    } catch (error) {
      console.error("Similar products error", error);
    }
  };

  const parseList = (str: string) => str ? str.split(',').map((item: string) => item.trim()).filter(Boolean) : [];
  const inclusions = parseList(product?.included);
  const exclusions = parseList(product?.notIncluded);

  // Helper to ensure Main Image is first
  const getAllImages = () => {
      if (!product) return [];
      let imgs: string[] = [];
      if (product.image) imgs.push(product.image);
      if (product.images && Array.isArray(product.images)) {
          // Add remaining images, avoiding duplicates of the main image
          product.images.forEach((img: string) => {
              if (img !== product.image) imgs.push(img);
          });
      }
      return imgs;
  };

  const allImages = getAllImages();

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const discountPercent = product?.discount || 0;
  const originalPrice = product?.price || 0;
  const finalPrice = discountPercent > 0 
    ? originalPrice - (originalPrice * (discountPercent / 100))
    : originalPrice;

  const handleAddToCart = () => {
    if (!product?._id) return;
    addToCart(product._id.toString(), quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!product) return <div className="pt-40 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-12 gap-16 mb-24 relative items-start">
          
          {/* LEFT: Visual Gallery (STICKY) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-32 h-fit">
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[8/5] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-zinc-100 bg-zinc-50">
              <Image
                src={allImages.length > 0 ? `${process.env.NEXT_PUBLIC_API_URL}${allImages[activeImageIndex]}` : "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500"
                priority
              />
              
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/50">
                  {product.category}
                </span>
              </div>

              {/* Slider Arrows */}
              {allImages.length > 1 && (
                <>
                    <button onClick={(e) => { e.preventDefault(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100">
                        <ChevronLeft className="w-5 h-5 text-black" />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-5 h-5 text-black" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((_, idx) => (
                            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
                        ))}
                    </div>
                </>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {allImages.map((img:string, idx:number) => (
                        <div key={idx} onClick={() => setActiveImageIndex(idx)} 
                             className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${idx === activeImageIndex ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${img}`} alt="thumbnail" fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* RIGHT: Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="ml-2 text-sm font-bold text-zinc-400">4.9/5.0</span>
                </div>
                <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><Share2 className="w-5 h-5 text-zinc-500" /></button>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-zinc-900 capitalize">
                {product.name}
              </h1>
              
              {/* Premium Price Block */}
              <div className="flex flex-col gap-1 border-l-4 border-black pl-4 py-1 bg-zinc-50 rounded-r-xl">
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Package Cost</span>
                 <div className="flex items-center gap-3">
                    <span className="text-4xl font-serif font-bold text-black">₹{finalPrice.toLocaleString()}</span>
                    {discountPercent > 0 && (
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-sm text-zinc-400 line-through">₹{originalPrice.toLocaleString()}</span>
                            <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                {discountPercent}% OFF
                            </span>
                        </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Overview
              </h3>
              <p className="text-zinc-600 leading-relaxed text-lg font-light">{product.description}</p>
            </div>

            {/* Inclusions & Exclusions */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 space-y-6">
                {inclusions.length > 0 && (
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-green-600 mb-3"><CheckCircle2 className="w-4 h-4" /> Included</h3>
                        <div className="grid grid-cols-1 gap-2">
                        {inclusions.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 text-zinc-700">
                            <div className="h-1.5 w-1.5 rounded-full bg-black flex-shrink-0" />
                            <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                {inclusions.length > 0 && exclusions.length > 0 && <div className="h-px bg-zinc-200" />}
                {exclusions.length > 0 && (
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-red-500 mb-3"><XCircle className="w-4 h-4" /> Not Included</h3>
                        <div className="grid grid-cols-1 gap-2">
                        {exclusions.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 text-zinc-500">
                            <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                            <span className="text-sm font-medium line-through decoration-zinc-400/50">{item}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
              </div>
            )}

            {/* FAQs Accordion */}
            <div className="pt-4">
                <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Common Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                    {/* Care Info (Moved here per request) */}
                    {product.careInfo && (
                        <AccordionItem value="care" className="border-b border-zinc-100">
                            <AccordionTrigger className="font-serif text-lg py-4">Care & Safety Info</AccordionTrigger>
                            <AccordionContent className="text-zinc-500 leading-relaxed pb-4">{product.careInfo}</AccordionContent>
                        </AccordionItem>
                    )}
                    {/* Dynamic FAQs */}
                    {product.faqs && product.faqs.length > 0 && product.faqs.map((faq: any, i: number) => (
                        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-zinc-100">
                            <AccordionTrigger className="font-serif text-lg text-left py-4">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-zinc-500 leading-relaxed pb-4">{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* ACTION & TRUST BAR */}
            <div className="space-y-6 pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md p-4 -mx-4 lg:static lg:bg-transparent lg:p-0">
              <Button size="lg" className="w-full rounded-full h-16 bg-black text-white text-lg font-bold hover:bg-zinc-800 shadow-xl" onClick={handleAddToCart}>
                Book Event — ₹{(finalPrice * quantity).toLocaleString()}
              </Button>
              <div className="flex justify-between items-center px-2 pt-2 text-center">
                 <div className="flex flex-col items-center gap-1"><BadgePercent className="w-4 h-4 text-zinc-400" /><span className="text-[9px] uppercase font-bold text-zinc-500">Best Price</span></div>
                 <div className="flex flex-col items-center gap-1"><Truck className="w-4 h-4 text-zinc-400" /><span className="text-[9px] uppercase font-bold text-zinc-500">Logistics</span></div>
                 <div className="flex flex-col items-center gap-1"><ShieldCheck className="w-4 h-4 text-zinc-400" /><span className="text-[9px] uppercase font-bold text-zinc-500">Verified</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* SIMILAR PRODUCTS (PREMIUM CARDS) */}
        {similarProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-zinc-100">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similarProducts.map((p) => (
                        <Link key={p._id} href={`/product/${p._id}`} className="group bg-white border border-zinc-100 hover:shadow-xl transition-all duration-500">
                            <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                                <Image 
                                    src={p.image ? `${process.env.NEXT_PUBLIC_API_URL}${p.image}` : "/placeholder.svg"} 
                                    alt={p.name} 
                                    fill 
                                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">{p.category}</div>
                                {p.discount > 0 && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">-{p.discount}%</div>
                                )}
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">View</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-xl font-bold mb-2 truncate text-zinc-800">{p.name}</h3>
                                <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold uppercase text-zinc-400">Starting From</span>
                                        <span className="text-lg font-bold">₹{p.price.toLocaleString()}</span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}