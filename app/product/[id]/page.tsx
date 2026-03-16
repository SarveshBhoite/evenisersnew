"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
    Star, Clock, ShieldCheck, CalendarDays, Share2, CheckCircle2, Loader2,
    Leaf, Truck, BadgePercent, ChevronLeft, ChevronRight, XCircle, ArrowRight, HelpCircle, Sparkles, ZoomIn
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

export default function ProductPage() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { token } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // Image Slider State
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [showZoom, setShowZoom] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState<'faq' | 'care'>('faq');

    // Auth Modal State
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setImageLoaded(false);
            setImageDimensions(null);
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

    // Reset image state when changing images
    useEffect(() => {
        setImageLoaded(false);
        setImageDimensions(null);
    }, [activeImageIndex]);

    const fetchSimilarProducts = async (category: string, currentId: string) => {
        try {
            const res = await axios.get(`${API_URL}/products?category=${category}`);
            const all = Array.isArray(res.data) ? res.data : res.data.products;
            const filtered = all.filter((p: any) => p._id !== currentId);
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

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    };
    
    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    // Handle image load to get dimensions
    const handleImageLoad = useCallback((e: any) => {
        const { naturalWidth, naturalHeight } = e.target;
        setImageDimensions({ width: naturalWidth, height: naturalHeight });
        setImageLoaded(true);
    }, []);

    // Calculate container style based on image dimensions
    const getContainerStyle = () => {
        if (!imageDimensions) {
            // Default aspect ratio while loading
            return { aspectRatio: '4/3' };
        }

        const { width, height } = imageDimensions;
        const aspectRatio = width / height;

        // For very wide images (panoramic)
        if (aspectRatio > 2) {
            return { aspectRatio: '2/1' };
        }
        // For wide/landscape images
        if (aspectRatio > 1.3) {
            return { aspectRatio: '4/3' };
        }
        // For square-ish images
        if (aspectRatio >= 0.8 && aspectRatio <= 1.3) {
            return { aspectRatio: '1/1' };
        }
        // For portrait images
        if (aspectRatio >= 0.6) {
            return { aspectRatio: '3/4' };
        }
        // For very tall/portrait images
        return { aspectRatio: '2/3' };
    };

    const getCurrentImageUrl = () => {
        if (allImages.length === 0) return "/placeholder.svg";
        const img = allImages[activeImageIndex];
        return img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`;
    };

    const discountPercent = product?.discount || 0;
    const originalPrice = product?.price || 0;
    const finalPrice = discountPercent > 0
        ? originalPrice - (originalPrice * (discountPercent / 100))
        : originalPrice;

    const handleAddToCart = () => {
        if (!token) {
            setShowAuthModal(true);
            return;
        }
        if (!product?._id) return;
        addToCart(product._id.toString(), quantity);
        toast.success(`${product.name} added to cart!`);
        router.push("/cart");
    };

    const handleAuthSuccess = (tokenValue: string) => {
        setShowAuthModal(false);
        if (!product?._id) return;
        addToCart(product._id.toString(), quantity, tokenValue);
        toast.success(`${product.name} added to cart!`);
        router.push("/cart");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FDFCF8]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/20 rounded-full" />
                    <div className="absolute inset-0 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-zinc-500 font-medium">Loading Experience...</p>
            </div>
        );
    }

    if (!product) return <div className="pt-40 text-center">Product not found.</div>;

    return (
        <div className="min-h-screen bg-[#FDFCF8] selection:bg-[#D4AF37] selection:text-white">
            <Navbar />

            {/* ════════════════════════════════════════════════════════
                FULLSCREEN ZOOM MODAL
            ════════════════════════════════════════════════════════ */}
            {showZoom && (
                <div 
                    className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10"
                    onClick={() => setShowZoom(false)}
                >
                    <button 
                        className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
                        onClick={() => setShowZoom(false)}
                    >
                        <XCircle className="w-8 h-8" />
                    </button>
                    
                    {/* Navigation in Zoom */}
                    {allImages.length > 1 && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    <div className="relative max-w-5xl max-h-[85vh] w-full h-full">
                        <Image
                            src={getCurrentImageUrl()}
                            alt={product.name}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Thumbnail Strip in Zoom */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {allImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        idx === activeImageIndex ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 md:px-6 pt-28 pb-32 lg:pb-24">

                {/* BACK BUTTON */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-zinc-500 hover:text-black transition-colors font-medium text-sm group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center mr-2 group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to Collection
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 mb-0 relative items-start">

                    {/* ════════════════════════════════════════════════════════
                        LEFT: ADAPTIVE IMAGE GALLERY (STICKY)
                    ════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28 h-fit">

                        {/* Main Image Container - ADAPTIVE */}
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37]/20 via-[#B8860B]/10 to-[#D4AF37]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Image Container - Adapts to image size */}
                            <div 
                                className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-50 to-white border border-zinc-200/50 shadow-xl transition-all duration-500"
                                style={getContainerStyle()}
                            >
                                {/* Loading Skeleton */}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                                            <span className="text-xs text-zinc-400">Loading image...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Main Image - object-contain ensures full visibility */}
                                <Image
                                    src={getCurrentImageUrl()}
                                    alt={product.name}
                                    fill
                                    className={`object-contain p-2 md:p-4 transition-all duration-500 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    priority
                                    onLoad={handleImageLoad}
                                />

                                {/* Subtle Pattern Background for empty space */}
                                <div 
                                    className="absolute inset-0 -z-10 opacity-30"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.15) 1px, transparent 0)`,
                                        backgroundSize: '24px 24px'
                                    }}
                                />

                                {/* Category Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/95 backdrop-blur-md px-4 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-zinc-100 text-zinc-800">
                                        {product.category}
                                    </span>
                                </div>

                                {/* Discount Badge */}
                                {discountPercent > 0 && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-[#D4AF37] text-white px-3 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-lg">
                                            -{discountPercent}% OFF
                                        </span>
                                    </div>
                                )}

                                {/* Zoom Button */}
                                <button
                                    onClick={() => setShowZoom(true)}
                                    className="absolute bottom-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-zinc-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#D4AF37] hover:text-white"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>

                                {/* Slider Arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); prevImage(); }} 
                                            className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-[#D4AF37] hover:text-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 border border-zinc-100"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); nextImage(); }} 
                                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-[#D4AF37] hover:text-white p-2 md:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 border border-zinc-100"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        
                                        {/* Dots Indicator */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {allImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveImageIndex(idx)}
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        idx === activeImageIndex 
                                                            ? 'w-8 bg-[#D4AF37]' 
                                                            : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {allImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                {allImages.map((img: string, idx: number) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start ${
                                            idx === activeImageIndex 
                                                ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 scale-105' 
                                                : 'border-zinc-200 opacity-60 hover:opacity-100 hover:border-zinc-300'
                                        }`}
                                    >
                                        <Image
                                            src={img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {idx === activeImageIndex && (
                                            <div className="absolute inset-0 bg-[#D4AF37]/10" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Quick Specs Grid */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {[
                                { icon: Clock, label: "Setup", value: product.setupTime || "2-3 Hrs", color: "text-blue-600 bg-blue-50" },
                                { icon: ShieldCheck, label: "Quality", value: "Premium", color: "text-green-600 bg-green-50" },
                                { icon: CalendarDays, label: "Status", value: "Available", color: "text-purple-600 bg-purple-50" },
                            ].map((spec, i) => (
                                <div 
                                    key={i} 
                                    className="bg-white p-4 md:p-5 rounded-xl md:rounded-2xl border border-zinc-100 flex flex-col items-center text-center hover:border-[#D4AF37]/30 hover:shadow-md transition-all group"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${spec.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                                        <spec.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] md:text-[10px] uppercase font-bold text-zinc-400 tracking-widest">{spec.label}</span>
                                    <span className="text-xs md:text-sm font-bold text-zinc-900">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════
                        RIGHT: CONTENT
                    ════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Header Section */}
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 bg-white border border-zinc-100 px-3 py-2 rounded-full shadow-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.round(product.rating || 0)
                                                    ? "fill-[#D4AF37] text-[#D4AF37]"
                                                    : "fill-zinc-200 text-zinc-200"
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-2 text-xs font-bold text-zinc-600">
                                        {product.rating?.toFixed(1)} ({product.numReviews} Reviews)
                                    </span>
                                </div>
                                <button className="p-3 hover:bg-zinc-100 rounded-full transition-colors group border border-transparent hover:border-zinc-200">
                                    <Share2 className="w-5 h-5 text-zinc-400 group-hover:text-[#D4AF37]" />
                                </button>
                            </div>

                            <div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] text-zinc-900 capitalize mb-5">
                                    {product.name}
                                </h1>

                                {/* Price Block */}
                                <div className="flex items-end gap-4 flex-wrap">
                                    <span className="text-4xl md:text-5xl font-serif font-bold text-zinc-900">
                                        ₹{finalPrice.toLocaleString()}
                                    </span>
                                    {discountPercent > 0 && (
                                        <div className="flex flex-col mb-1">
                                            <span className="text-lg md:text-xl text-zinc-400 line-through font-serif">
                                                ₹{originalPrice.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-3 py-1 uppercase tracking-wider">
                                                Save ₹{(originalPrice - finalPrice).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-zinc-400 mt-3 font-medium uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    Inclusive of all taxes & setup charges
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3 p-5 md:p-6 bg-gradient-to-br from-white to-zinc-50/50 rounded-2xl border border-zinc-100">
                            <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> The Experience
                            </h3>
                            <p className="text-zinc-600 leading-relaxed text-sm md:text-base">{product.description}</p>
                        </div>

                        {/* Inclusions & Exclusions */}
                        {(inclusions.length > 0 || exclusions.length > 0) && (
                            <div className="bg-white p-5 md:p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                                {inclusions.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-zinc-900 mb-4 pb-2 border-b border-zinc-100">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            What's Included
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {inclusions.map((item: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 text-zinc-700 group p-2 rounded-lg hover:bg-green-50/50 transition-colors">
                                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
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
                                        <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-zinc-400 mb-4 pb-2 border-b border-zinc-100">
                                            <XCircle className="w-4 h-4 text-red-400" />
                                            Not Included
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {exclusions.map((item: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 text-zinc-400 p-2">
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

                        {/* FAQ & Care Toggle Section */}
                        <div>
                            <div className="flex bg-zinc-100 p-1 rounded-full w-full sm:w-fit mb-6">
                                <button
                                    onClick={() => setActiveTab('faq')}
                                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                        activeTab === 'faq' 
                                            ? 'bg-zinc-900 text-white shadow-md' 
                                            : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                                >
                                    FAQs
                                </button>
                                <button
                                    onClick={() => setActiveTab('care')}
                                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                        activeTab === 'care' 
                                            ? 'bg-zinc-900 text-white shadow-md' 
                                            : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                                >
                                    Care Info
                                </button>
                            </div>

                            <div className="min-h-[120px]">
                                {activeTab === 'faq' ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {product.faqs && product.faqs.length > 0 ? (
                                            <Accordion type="single" collapsible className="w-full">
                                                {product.faqs.map((faq: any, i: number) => (
                                                    <AccordionItem key={i} value={`faq-${i}`} className="border-b border-zinc-100 last:border-0">
                                                        <AccordionTrigger className="font-medium text-sm md:text-base text-left py-4 hover:text-[#D4AF37] hover:no-underline transition-colors">
                                                            {faq.question}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-zinc-500 leading-relaxed pb-4 text-sm">
                                                            {faq.answer}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        ) : (
                                            <div className="p-6 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                                                <HelpCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                                                <p className="text-zinc-400 text-sm">No specific FAQs for this package.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 bg-[#FFFDF8] rounded-xl p-5 border border-[#F5E6CA]">
                                        {carePoints.length > 0 ? (
                                            <ul className="space-y-3">
                                                {carePoints.map((point: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-zinc-700 items-start">
                                                        <div className="mt-1.5 h-2 w-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                                                        <span className="text-sm leading-relaxed">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-zinc-400 text-sm text-center">No specific care instructions provided.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 py-4 border-t border-zinc-100">
                            {[
                                { icon: BadgePercent, text: "Best Price", color: "bg-blue-50 text-blue-600" },
                                { icon: Truck, text: "Fast Setup", color: "bg-orange-50 text-orange-600" },
                                { icon: Leaf, text: "Eco Friendly", color: "bg-green-50 text-green-600" },
                                { icon: ShieldCheck, text: "Verified", color: "bg-purple-50 text-purple-600" },
                            ].map((item, i) => (
                                <div 
                                    key={i} 
                                    className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl ${item.color} border border-transparent hover:border-current/20 transition-all`}
                                >
                                    <item.icon className="w-4 h-4 md:w-5 md:h-5 mb-1.5" />
                                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wide text-current">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        {/* ════════════════════════════════════════════════════════
    ACTION BUTTON - STICKY ON ALL SCREENS
════════════════════════════════════════════════════════ */}

{/* Mobile: Fixed at bottom */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-[100]">
    <Button 
        size="lg" 
        className="w-full h-14 bg-zinc-900 text-white text-base font-bold hover:bg-[#D4AF37] shadow-xl transition-all duration-300 rounded-xl" 
        onClick={handleAddToCart}
    >
        <Sparkles className="w-5 h-5 mr-2" />
        Book This Experience
    </Button>
</div>

{/* Desktop: Sticky at bottom of content column */}
<div className="hidden lg:block sticky bottom-6 z-50 mt-6">
    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-900/10">
        <Button 
            size="lg" 
            className="w-full h-16 bg-zinc-900 text-white text-lg font-bold hover:bg-[#D4AF37] shadow-xl transition-all duration-300 rounded-xl" 
            onClick={handleAddToCart}
        >
            <Sparkles className="w-5 h-5 mr-2" />
            Book This Experience
        </Button>
        
        {/* Quick info under button */}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Secure Booking
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                Instant Confirmation
            </span>
        </div>
    </div>
</div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════════
                    SIMILAR PRODUCTS
                ════════════════════════════════════════════════════════ */}
                {similarProducts.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-zinc-200">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2 block">Curated For You</span>
                                <h2 className="font-serif text-2xl md:text-4xl font-bold text-zinc-900">Similar Experiences</h2>
                            </div>
                            <Link 
                                href={`/shop?category=${product.category}`} 
                                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
                            >
                                View All 
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {similarProducts.map((p) => {
                                const discount = p.discount || 0;
                                const price = p.price;
                                const fprice = discount > 0 ? price - (price * discount) / 100 : price;

                                return (
                                    <Link
                                        key={p._id}
                                        href={`/product/${p._id}`}
                                        className="group bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-zinc-100">
                                            <Image
                                                src={
                                                    p.image
                                                        ? (p.image.startsWith("http") ? p.image : `${process.env.NEXT_PUBLIC_API_URL}${p.image}`)
                                                        : "/placeholder.svg"
                                                }
                                                alt={p.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            <div className="absolute top-0 left-0">
                                                <div className="bg-zinc-900 text-white text-[7px] md:text-[9px] font-bold uppercase tracking-wider px-2 py-1">
                                                    {p.category}
                                                </div>
                                            </div>

                                            {discount > 0 && (
                                                <div className="absolute top-0 right-0">
                                                    <div className="bg-[#D4AF37] text-white text-[7px] md:text-[9px] font-bold px-2 py-1">
                                                        -{discount}%
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="hidden md:block bg-white text-zinc-900 text-[10px] font-bold uppercase px-4 py-2">
                                                    View
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3 md:p-4">
                                            <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-tight text-zinc-800 mb-2 line-clamp-2 group-hover:text-[#B8860B] transition-colors">
                                                {p.name}
                                            </h3>

                                            <div className="flex items-end justify-between gap-2">
                                                <div>
                                                    <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase">
                                                        {discount > 0 ? "Offer" : "Price"}
                                                    </span>
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        <p className="text-sm md:text-lg font-bold text-zinc-900">
                                                            ₹{fprice.toLocaleString("en-IN")}
                                                        </p>
                                                        {discount > 0 && (
                                                            <p className="text-[9px] md:text-xs text-zinc-400 line-through">
                                                                ₹{price.toLocaleString("en-IN")}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="w-7 h-7 md:w-8 md:h-8 border-2 border-zinc-900 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-white transition-all">
                                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
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

            {/* Auth Modal */}
            {product && (
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                    product={{
                        _id: product._id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        discount: product.discount,
                        category: product.category,
                        rating: product.rating,
                        numReviews: product.numReviews
                    }}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}
        </div>
    );
}