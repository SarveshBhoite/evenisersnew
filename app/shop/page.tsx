"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { useSearchParams } from "next/navigation";
import { 
  ArrowRight, 
  Filter, 
  Grid3X3, 
  LayoutGrid, 
  Sparkles, 
  ChevronDown, 
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  IndianRupee
} from "lucide-react";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// Category list for filter
const CATEGORIES = [
  { name: "All", slug: "" },
  { name: "Birthdays", slug: "birthday" },
  { name: "Weddings", slug: "wedding" },
  { name: "Haldi & Mehandi", slug: "haldi-mehandi" },
  { name: "Engagement", slug: "engagement" },
  { name: "Anniversary", slug: "anniversary" },
  { name: "Festivals", slug: "festival" },
  { name: "Baby Shower", slug: "babyshower" },
  { name: "Baby Welcome", slug: "babywelcome" },
  { name: "Naming Ceremony", slug: "namingceremony" },
  { name: "Annaprashan", slug: "annaprashan" },
  { name: "Aged To Perfection", slug: "agedtoperfection" },
  { name: "House Warming", slug: "housewarming" },
  { name: "Bride To Be", slug: "bridetobe" },
  { name: "Romantic", slug: "romantic" },
  { name: "Corporate", slug: "corporate" },
];

// Price ranges for filter
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
  { label: "₹20,000 - ₹50,000", min: 20000, max: 50000 },
  { label: "Above ₹50,000", min: 50000, max: Infinity },
];

// Sort options
const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Most Popular", value: "popular" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState<'compact' | 'large'>('compact');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [showOnlyDiscount, setShowOnlyDiscount] = useState(false);
  
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
        const shuffledData = res.data.sort(() => 0.5 - Math.random());
        setProducts(shuffledData);
        setFilteredProducts(shuffledData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Price filter
    if (selectedPriceRange.max !== Infinity || selectedPriceRange.min !== 0) {
      result = result.filter(p => {
        const finalPrice = p.discount > 0 ? p.price - (p.price * p.discount) / 100 : p.price;
        return finalPrice >= selectedPriceRange.min && finalPrice <= selectedPriceRange.max;
      });
    }

    // Discount filter
    if (showOnlyDiscount) {
      result = result.filter(p => p.discount > 0);
    }

    // Sorting
    switch (selectedSort.value) {
      case 'price_asc':
        result.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price - (a.price * a.discount) / 100 : a.price;
          const priceB = b.discount > 0 ? b.price - (b.price * b.discount) / 100 : b.price;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        result.sort((a, b) => {
          const priceA = a.discount > 0 ? a.price - (a.price * a.discount) / 100 : a.price;
          const priceB = b.discount > 0 ? b.price - (b.price * b.discount) / 100 : b.price;
          return priceB - priceA;
        });
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedPriceRange, selectedSort, showOnlyDiscount]);

  // Format category name for display
  const formatCategoryName = (slug: string) => {
    const found = CATEGORIES.find(c => c.slug === slug);
    return found ? found.name : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedPriceRange(PRICE_RANGES[0]);
    setSelectedSort(SORT_OPTIONS[0]);
    setShowOnlyDiscount(false);
  };

  const hasActiveFilters = selectedPriceRange !== PRICE_RANGES[0] || showOnlyDiscount || selectedSort !== SORT_OPTIONS[0];

  return (
    <div className="min-h-screen relative">
      {/* ════════════════════════════════════════════════════════
          GRADIENT BACKGROUND
      ════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              180deg, 
              rgba(212, 175, 55, 0.06) 0%, 
              rgba(212, 175, 55, 0.02) 10%,
              rgba(255, 255, 255, 1) 25%,
              rgba(255, 255, 255, 1) 75%,
              rgba(212, 175, 55, 0.02) 90%,
              rgba(212, 175, 55, 0.06) 100%
            )`
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <Navbar />

      {/* ════════════════════════════════════════════════════════
          COMPACT BANNER HERO
      ════════════════════════════════════════════════════════ */}
      <section className="pt-20 md:pt-24">
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-[#B8860B]/10 blur-3xl" />
            <svg className="absolute inset-0 w-full h-full opacity-10">
              <pattern id="shopPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#D4AF37" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#shopPattern)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left - Title */}
              <div>
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                  <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
                  <span>/</span>
                  <span className="text-white/80">Shop</span>
                  {category && (
                    <>
                      <span>/</span>
                      <span className="text-[#D4AF37] capitalize">{formatCategoryName(category)}</span>
                    </>
                  )}
                </div>

                <h1 className="font-serif text-2xl md:text-4xl font-bold text-white">
                  {category ? (
                    <span>{formatCategoryName(category)} <span className="text-[#D4AF37]">Collection</span></span>
                  ) : (
                    <span>All <span className="text-[#D4AF37]">Collections</span></span>
                  )}
                </h1>
              </div>

              {/* Right - Stats & Badge */}
              <div className="flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="w-2 h-2 bg-[#D4AF37] animate-pulse" />
                  <span className="text-xs md:text-sm font-medium text-white">
                    {loading ? "..." : `${filteredProducts.length} Packages`}
                  </span>
                </div>
                
                <div className="hidden md:flex items-center gap-3 text-white/60 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>4.9 Rated</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span>Trusted by 30K+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Golden Line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STICKY FILTER BAR - Fixed positioning
      ════════════════════════════════════════════════════════ */}
      <section className="sticky top-[64px] md:top-[72px] z-40 bg-white border-b border-zinc-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Main Filter Row */}
          <div className="flex items-center justify-between gap-3 py-3">
            
            {/* Left - Filter Toggles */}
            <div className="flex items-center gap-2">
              {/* Category Filter */}
              <button
                onClick={() => { setShowFilters(!showFilters); setShowSortMenu(false); }}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 border text-sm font-medium transition-all ${
                  showFilters ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-zinc-300 hover:border-zinc-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Categories</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* More Filters */}
              <div className="relative">
                <button
                  onClick={() => { setShowSortMenu(!showSortMenu); setShowFilters(false); }}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 border text-sm font-medium transition-all ${
                    showSortMenu ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-zinc-300 hover:border-zinc-400'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Active Filter Count */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Center - Active Filters Tags */}
            <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
              {category && (
                <Link
                  href="/shop"
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#B8860B] text-xs font-medium hover:bg-[#D4AF37]/20 transition-colors"
                >
                  <span className="capitalize">{formatCategoryName(category)}</span>
                  <X className="w-3 h-3" />
                </Link>
              )}
              {selectedPriceRange !== PRICE_RANGES[0] && (
                <button
                  onClick={() => setSelectedPriceRange(PRICE_RANGES[0])}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-200 transition-colors"
                >
                  <IndianRupee className="w-3 h-3" />
                  <span>{selectedPriceRange.label}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {showOnlyDiscount && (
                <button
                  onClick={() => setShowOnlyDiscount(false)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                >
                  <span>On Sale</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Right - Sort & Grid View */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 border border-zinc-300 text-sm font-medium hover:border-zinc-400 transition-all"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{selectedSort.label}</span>
                </button>
              </div>

              {/* Grid Toggle */}
              <div className="flex border border-zinc-300">
                <button
                  onClick={() => setGridView('compact')}
                  className={`p-2 transition-colors ${gridView === 'compact' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'}`}
                  title="Compact View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView('large')}
                  className={`p-2 transition-colors ${gridView === 'large' ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-100'}`}
                  title="Large View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Dropdown */}
          {showFilters && (
            <div className="py-4 border-t border-zinc-100 animate-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Browse by Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug ? `/shop?category=${cat.slug}` : '/shop'}
                    onClick={() => setShowFilters(false)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${
                      (category === cat.slug) || (!category && cat.slug === '')
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-50 border border-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Filters Dropdown */}
          {showSortMenu && (
            <div className="py-4 border-t border-zinc-100 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Price Range */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <IndianRupee className="w-3 h-3" />
                    Price Range
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPriceRange(range)}
                        className={`px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedPriceRange === range
                            ? 'bg-[#D4AF37] text-white'
                            : 'bg-zinc-50 border border-zinc-200 hover:border-[#D4AF37]'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ArrowUpDown className="w-3 h-3" />
                    Sort By
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSort(option)}
                        className={`px-3 py-1.5 text-xs font-medium transition-all ${
                          selectedSort === option
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-50 border border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Quick Filters
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowOnlyDiscount(!showOnlyDiscount)}
                      className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                        showOnlyDiscount
                          ? 'bg-green-600 text-white'
                          : 'bg-zinc-50 border border-zinc-200 hover:border-green-400 hover:text-green-600'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      On Sale Only
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs font-medium bg-zinc-50 border border-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center gap-1.5"
                    >
                      <Star className="w-3 h-3" />
                      Top Rated
                    </button>
                    <button
                      className="px-3 py-1.5 text-xs font-medium bg-zinc-50 border border-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center gap-1.5"
                    >
                      🔥 Trending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PRODUCTS GRID
      ════════════════════════════════════════════════════════ */}
      <section className="py-6 md:py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-[#D4AF37]/20" />
                <div className="absolute inset-0 border-2 border-[#D4AF37] border-t-transparent animate-spin" />
              </div>
              <p className="mt-4 text-zinc-500 text-sm">Loading Collections...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 border-2 border-dashed border-zinc-300 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">No Packages Found</h3>
              <p className="text-zinc-500 mb-6 text-sm">Try adjusting your filters</p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium hover:bg-[#D4AF37] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-3 md:gap-5 ${
              gridView === 'compact' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredProducts.map((product) => {
                const discount = product.discount || 0;
                const price = product.price;
                const finalPrice = discount > 0 ? price - (price * discount) / 100 : price;

                return (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="group relative bg-white border border-zinc-200 overflow-hidden hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image Container */}
                    <div className={`relative overflow-hidden bg-zinc-100 ${
                      gridView === 'large' ? 'aspect-[4/3]' : 'aspect-square'
                    }`}>
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
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-0 left-0">
                        <div className="bg-zinc-900 text-white text-[7px] md:text-[9px] font-bold uppercase tracking-wider px-2 py-1">
                          {product.category}
                        </div>
                      </div>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-[#D4AF37] text-white text-[7px] md:text-[9px] font-bold uppercase px-2 py-1">
                            -{discount}%
                          </div>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="hidden md:flex items-center gap-2 bg-white text-zinc-900 text-[10px] font-bold uppercase tracking-wider px-4 py-2">
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                          View Details
                        </span>
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-b-[24px] border-b-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content Section - With proper padding */}
                    <div className="p-3 md:p-4">
                      {/* Product Name */}
                      <h3 className={`font-bold uppercase tracking-tight leading-tight text-zinc-800 mb-2 line-clamp-2 group-hover:text-[#B8860B] transition-colors ${
                        gridView === 'large' ? 'text-base md:text-lg' : 'text-[11px] md:text-sm'
                      }`}>
                        {product.name}
                      </h3>

                      {/* Specs - With wrapped text */}
                      <div className={`border-t border-b border-zinc-100 py-2 mb-3 ${gridView === 'compact' ? 'hidden sm:block' : ''}`}>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="min-w-0">
                            <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                              Setup
                            </span>
                            <span className="block text-[10px] md:text-xs text-zinc-700 truncate">
                              {product.setupTime || "2-3 Hrs"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                              Includes
                            </span>
                            <span className="block text-[10px] md:text-xs text-zinc-700 truncate">
                              {product.included
                                ? product.included.split(",")[0]
                                : "Full Setup"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="block text-[7px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                            {discount > 0 ? "Offer Price" : "Starting"}
                          </span>
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <p className={`font-bold text-zinc-900 ${
                              gridView === 'large' ? 'text-xl md:text-2xl' : 'text-sm md:text-lg'
                            }`}>
                              ₹{finalPrice.toLocaleString("en-IN")}
                            </p>
                            {discount > 0 && (
                              <p className="text-[9px] md:text-xs text-zinc-400 line-through">
                                ₹{price.toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Arrow Button */}
                        <div className="flex-shrink-0 w-7 h-7 md:w-9 md:h-9 border-2 border-zinc-900 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-white transition-all duration-300">
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════════════════ */}
      {!loading && filteredProducts.length > 0 && (
        <section className="py-12 px-4 md:px-6 border-t border-zinc-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            <h3 className="font-serif text-xl md:text-2xl font-bold text-zinc-900 mb-2">
              Need a Custom Package?
            </h3>
            <p className="text-zinc-500 text-sm mb-6">
              We create personalized packages for your unique celebration
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-bold uppercase tracking-wider hover:bg-[#D4AF37] transition-colors"
              >
                Request Custom
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-zinc-900 text-zinc-900 text-sm font-bold uppercase tracking-wider hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Call Now
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}