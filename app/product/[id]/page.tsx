"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { 
  Star, Clock, ShieldCheck, CalendarDays, Share2, Info, CheckCircle2, Loader2, 
  Leaf, Truck, BadgePercent, ChevronLeft, ChevronRight, XCircle, ArrowRight, HelpCircle, Sparkles
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

  // Tab State: 'faq' or 'care'
  const [activeTab, setActiveTab] = useState<'faq' | 'care'>('faq');

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
      // Fetch 4 items for the grid
      const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 4); 
      setSimilarProducts(shuffled);
    } catch (error) {
      console.error("Similar products error", error);
    }
  };

  const parseList = (str: string) => str ? str.split(',').map((item: string) => item.trim()).filter(Boolean) : [];
  const inclusions = parseList(product?.included);
  const exclusions = parseList(product?.notIncluded);
  const carePoints = parseList(product?.careInfo);

  const getAllImages = () => {
      if (!product) return [];
      let imgs: string[] = [];
      if (product.image) imgs.push(product.image);
      if (product.images && Array.isArray(product.images)) {
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFCF8]">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!product) return <div className="pt-40 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#D4AF37] selection:text-white">
      <Navbar />

      {/* Added pb-32 to main to ensure content isn't hidden behind the fixed mobile button */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-32 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-16 mb-24 relative items-start">
          
          {/* LEFT: Visual Gallery (STICKY) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-32 h-fit">
            
            {/* Main Image Container */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-[2.6rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[8/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-white/50">
                <Image
                    src={allImages.length > 0 ? `${process.env.NEXT_PUBLIC_API_URL}${allImages[activeImageIndex]}` : "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                
                <div className="absolute top-6 left-6 z-10">
                    <span className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-white/50 text-zinc-800">
                    {product.category}
                    </span>
                </div>

                {/* Slider Arrows */}
                {allImages.length > 1 && (
                    <>
                        <button onClick={(e) => { e.preventDefault(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 border border-white/20 text-white hover:text-black">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 border border-white/20 text-white hover:text-black">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {allImages.map((_, idx) => (
                                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                            ))}
                        </div>
                    </>
                )}
                </div>
            </div>
            
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {allImages.map((img:string, idx:number) => (
                        <div key={idx} onClick={() => setActiveImageIndex(idx)} 
                             className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 snap-start ${idx === activeImageIndex ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                            <Image src={`${process.env.NEXT_PUBLIC_API_URL}${img}`} alt="thumbnail" fill className="object-cover" />
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center text-center group hover:border-[#D4AF37]/30 transition-colors">
                  <Clock className="w-5 h-5 mb-2 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Setup</span>
                  <span className="text-sm font-bold text-zinc-900">{product.setupTime || "TBD"}</span>
               </div>
               <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center text-center group hover:border-[#D4AF37]/30 transition-colors">
                  <ShieldCheck className="w-5 h-5 mb-2 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Quality</span>
                  <span className="text-sm font-bold text-zinc-900">Premium</span>
               </div>
               <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col items-center text-center group hover:border-[#D4AF37]/30 transition-colors">
                  <CalendarDays className="w-5 h-5 mb-2 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Status</span>
                  <span className="text-sm font-bold text-green-600">Available</span>
               </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Header Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-white border border-stone-100 px-3 py-1.5 rounded-full shadow-sm">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />)}
                  <span className="ml-2 text-xs font-bold text-zinc-500">4.9 (120+ Reviews)</span>
                </div>
                <button className="p-3 hover:bg-stone-100 rounded-full transition-colors group">
                    <Share2 className="w-5 h-5 text-zinc-400 group-hover:text-black" />
                </button>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[0.9] text-zinc-900 capitalize mb-6">
                    {product.name}
                </h1>
                
                {/* Premium Price Block */}
                <div className="flex items-end gap-4">
                    <span className="text-5xl font-serif text-black">₹{finalPrice.toLocaleString()}</span>
                    {discountPercent > 0 && (
                        <div className="flex flex-col mb-1.5">
                            <span className="text-lg text-zinc-400 line-through font-serif decoration-red-400/50">₹{originalPrice.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                Limited Deal
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-medium uppercase tracking-wider">Inclusive of all taxes & setup charges</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> The Experience
              </h3>
              <p className="text-zinc-600 leading-loose text-lg font-light">{product.description}</p>
            </div>

            {/* Inclusions & Exclusions */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/20 space-y-8">
                {inclusions.length > 0 && (
                    <div>
                        <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-zinc-900 mb-4 border-b border-stone-100 pb-2">Included</h3>
                        <div className="grid grid-cols-1 gap-3">
                        {inclusions.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 text-zinc-700 group">
                                <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                
                {exclusions.length > 0 && (
                    <div>
                        <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-zinc-400 mb-4 border-b border-stone-100 pb-2">Not Included</h3>
                        <div className="grid grid-cols-1 gap-2">
                        {exclusions.map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 text-zinc-400">
                                <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                                </div>
                                <span className="text-sm font-medium line-through decoration-zinc-300">{item}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
              </div>
            )}

            {/* TOGGLE SECTION: FAQ & Care Info */}
            <div className="pt-6">
                <div className="flex bg-white border border-stone-200 p-1.5 rounded-full w-full sm:w-fit mb-8 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('faq')}
                        className={`flex-1 sm:flex-none px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeTab === 'faq' ? 'bg-black text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        FAQs
                    </button>
                    <button 
                        onClick={() => setActiveTab('care')}
                        className={`flex-1 sm:flex-none px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeTab === 'care' ? 'bg-black text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        Care Info
                    </button>
                </div>

                <div className="min-h-[150px]">
                    {activeTab === 'faq' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {product.faqs && product.faqs.length > 0 ? (
                                <Accordion type="single" collapsible className="w-full">
                                    {product.faqs.map((faq: any, i: number) => (
                                        <AccordionItem key={i} value={`faq-${i}`} className="border-b border-stone-100 last:border-0">
                                            <AccordionTrigger className="font-serif text-lg text-left py-5 hover:text-[#D4AF37] hover:no-underline transition-colors">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-zinc-500 leading-relaxed pb-6 text-base font-light">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-zinc-200">
                                    <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2"/>
                                    <p className="text-zinc-400 italic">No specific FAQs for this package.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-[#FFFDF5] rounded-3xl p-8 border border-[#F5E6CA]">
                            {carePoints.length > 0 ? (
                                <ul className="space-y-4">
                                    {carePoints.map((point: string, i: number) => (
                                        <li key={i} className="flex gap-4 text-zinc-700 items-start">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                                            <span className="text-sm font-medium leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-zinc-400 italic text-center">No specific care instructions provided.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* HIGHLIGHTED TRUST BADGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6 border-t border-stone-100">
                {[
                    { icon: BadgePercent, text: "Best Price", color: "bg-blue-50 text-blue-600" },
                    { icon: Truck, text: "Logistic", color: "bg-orange-50 text-orange-600" },
                    { icon: Leaf, text: "Eco Friendly", color: "bg-green-50 text-green-600" },
                    { icon: ShieldCheck, text: "100% Verified", color: "bg-purple-50 text-purple-600" },
                ].map((item, i) => (
                    <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl ${item.color} bg-opacity-50 border border-transparent hover:border-black/5 transition-all`}>
                        <item.icon className="w-5 h-5 mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-black/70">{item.text}</span>
                    </div>
                ))}
            </div>

            {/* ACTION BUTTON - FIXED MOBILE FIX */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-zinc-200 z-[100] lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:sticky lg:bottom-4">
              <Button size="lg" className="w-full rounded-full h-16 bg-black text-white text-lg font-bold hover:bg-[#D4AF37] hover:text-white shadow-2xl shadow-black/20 transition-all duration-500" onClick={handleAddToCart}>
                Book Event
              </Button>
            </div>

          </div>
        </div>

        {/* SIMILAR PRODUCTS (SHOP CARD DESIGN) */}
        {similarProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-stone-200">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2 block">Curated For You</span>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-zinc-900">Similar Experiences</h2>
                    </div>
                    <Link href={`/shop?category=${product.category}`} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors pb-1 border-b border-transparent hover:border-[#D4AF37]">
                        View Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                    </Link>
                </div>
                
                {/* 4 Column Grid Using Shop Card Design */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {similarProducts.map((p) => {
                        const discount = p.discount || 0;
                        const price = p.price;
                        const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

                        return (
                            <Link
                                key={p._id}
                                href={`/product/${p._id}`}
                                className="group bg-white border border-zinc-200 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
                            >
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                                    <Image
                                        src={
                                            p.image
                                                ? `${process.env.NEXT_PUBLIC_API_URL}${p.image}`
                                                : "/placeholder.svg"
                                        }
                                        alt={p.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute top-0 left-0">
                                        <div className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2">
                                            {p.category}
                                        </div>
                                    </div>

                                    {/* Discount Badge */}
                                    {discount > 0 && (
                                        <div className="absolute top-0 right-0">
                                            <div className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 animate-pulse">
                                                -{discount}% OFF
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <span className="bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 shadow-xl">
                                            View Package
                                        </span>
                                    </div>
                                </div>

                                {/* Text */}
                                <div className="p-5 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1 text-zinc-700">
                                            {p.name}
                                        </h3>
                                    </div>

                                    <div className="flex gap-4 border-y border-zinc-100 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-800 uppercase">
                                                Duration
                                            </span>
                                            <span className="text-[11px]">
                                                {p.setupTime || "—"}
                                            </span>
                                        </div>

                                        <div className="w-[1px] bg-zinc-100" />

                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-800 uppercase">
                                                Includes
                                            </span>
                                            <span className="text-[11px] truncate max-w-[150px]">
                                                {p.included
                                                    ? p.included.split(",")[0]
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">
                                                {discount > 0 ? "Deal Price" : "Fixed Price"}
                                            </span>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-2xl text-black leading-none">
                                                    ₹{finalPrice.toLocaleString("en-IN")}
                                                </p>
                                                {discount > 0 && (
                                                    <p className="text-sm text-zinc-400 line-through font-medium">
                                                        ₹{price.toLocaleString("en-IN")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        )}
      </main>
    </div>
  );
}