"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  CalendarDays, 
  Share2, 
  Info, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/api";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductById(id as string)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          toast.error("Failed to load product details.");
          setLoading(false);
        });
    }
  }, [id]);

  // --- DYNAMIC DATA FETCHING LOGIC ---
  // Converts the 'included' string from Admin into a list of points
 const inclusions = product?.included 
  ? product.included.split(',').map((item: string) => item.trim()).filter(Boolean)
  : [];

  const handleAddToCart = () => {
    if (!product?._id) {
      toast.error("Product not ready.");
      return;
    }
    addToCart(product._id.toString(), quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
        <p className="text-zinc-400 font-medium animate-pulse uppercase tracking-widest text-xs">Loading Details...</p>
      </div>
    );
  }

  if (!product) return <div className="pt-40 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* LEFT: Visual Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[4/5] md:aspect-video lg:aspect-[8/5] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-zinc-100">
              <Image
                src={product.image ? `http://localhost:5000${product.image}` : "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/50">
                  {product.category}
                </span>
              </div>
            </div>
            
            {/* Dynamic Setup & Quality Grid */}
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 flex flex-col items-center text-center">
                  <Clock className="w-5 h-5 mb-2 text-zinc-400" />
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Setup Time</span>
                  <span className="text-sm font-bold text-black">{product.setupTime || "TBD"}</span>
               </div>
               <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 flex flex-col items-center text-center">
                  <ShieldCheck className="w-5 h-5 mb-2 text-zinc-400" />
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Quality</span>
                  <span className="text-sm font-bold text-black">Premium</span>
               </div>
               <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 flex flex-col items-center text-center">
                  <CalendarDays className="w-5 h-5 mb-2 text-zinc-400" />
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-tight">Status</span>
                  <span className="text-sm font-bold text-black">Available</span>
               </div>
            </div>
          </div>

          {/* RIGHT: Content & Booking Card */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="ml-2 text-sm font-bold text-zinc-400">4.9/5.0</span>
                </div>
                <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <Share2 className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <h1 className="text-5xl font-serif font-bold leading-tight text-zinc-900 capitalize">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif font-bold text-black">₹{product.price?.toLocaleString()}</span>
                <span className="text-zinc-400 line-through text-lg font-light">₹{(product.price * 1.2).toLocaleString()}</span>
              </div>
            </div>

            {/* Description - Fetched from DB */}
            <div className="space-y-4">
              <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Package Details
              </h3>
              <p className="text-zinc-600 leading-relaxed text-lg font-light">
                {product.description}
              </p>
            </div>

            {/* Inclusions - Fetched and Split from DB 'included' field */}
            {inclusions.length > 0 && (
  <div className="space-y-4 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
    <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-zinc-400">
      <CheckCircle2 className="w-4 h-4" /> What's Included
    </h3>
    <div className="grid grid-cols-1 gap-3">
      {inclusions.map((item: string, idx: number) => (
        <div key={idx} className="flex items-center gap-3 text-zinc-700">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm font-medium">{item}</span>
        </div>
      ))}
    </div>
  </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full rounded-full h-20 bg-black text-white text-xl font-bold hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-black/10"
                onClick={handleAddToCart}
              >
                Add to Cart — ₹{(product.price * quantity).toLocaleString()}
              </Button>
              
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}