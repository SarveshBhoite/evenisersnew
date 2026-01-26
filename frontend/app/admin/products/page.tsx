"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Import Input
import {
  Plus,
  Trash2,
  Edit,
  Package,
  Loader2,
  Clock,
  IndianRupee,
  ArrowLeft,
  Filter,
  Search, // Added Search icon
  X, // Added X icon for clearing
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface DecorationProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  setupTime?: string;
  included?: string;
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<DecorationProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Filter & Search State ---
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 New Search State

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && typeof data === "object" && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("API returned non-array data:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Connection failed",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Remove this decoration package?")) return;

    try {
      await axios.delete(`${API_URL}/admin/products/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({ title: "Deleted", description: "Package removed" });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  // --- FILTER LOGIC (Category + Search) ---
  const categories = ["All", "Wedding", "Anniversary", "Haldi", "Birthday", "Corporate"];

  const filteredProducts = products.filter((p) => {
    // 1. Check Category
    const matchesCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // 2. Check Search (Name or ID)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                          p._id.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-10 mb-8 gap-4">
          <div>
            <Link
                className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors font-bold uppercase text-xs tracking-widest mb-2" 
                href={"/admin/dashboard"}        
            >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-serif font-bold text-zinc-900">Product Catalog</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             {/* 🔍 SEARCH BAR */}
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Search package or ID..." 
                    className="pl-9 pr-8 h-12 rounded-full border-zinc-200 bg-white shadow-sm focus-visible:ring-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
             </div>

             <Button
                onClick={() => router.push("/admin/products/new")}
                className="bg-black text-white rounded-full px-6 h-12 shadow-lg shadow-black/10 hover:scale-[1.02] transition-all font-bold tracking-wide shrink-0"
             >
                <Plus className="w-4 h-4 mr-2" /> Add Package
             </Button>
          </div>
        </div>

        {/* --- CATEGORY FILTER --- */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-4 text-zinc-400 font-bold uppercase text-[10px] tracking-widest shrink-0">
                    <Filter className="w-4 h-4" /> Filter By:
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                            selectedCategory === cat
                                ? "bg-black text-white border-black shadow-md"
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-black hover:text-black"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold uppercase text-gray-400">
                    Package Design
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase text-gray-400">
                    Category
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase text-gray-400">
                    Pricing
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase text-gray-400">
                    Setup Time
                  </th>
                  <th className="px-8 py-5 text-right text-xs font-bold uppercase text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <Loader2 className="animate-spin w-8 h-8 mx-auto text-gray-300" />
                      <p className="text-gray-400 mt-4 text-sm font-medium">
                        Refreshing your catalog...
                      </p>
                    </td>
                  </tr>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      className="group hover:bg-gray-50/50 transition-all"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-inner flex-shrink-0">
                            <img
                              src={
                                p.image?.startsWith("http")
                                  ? p.image
                                  : `${process.env.NEXT_PUBLIC_API_URL}${p.image}`
                              }
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight line-clamp-1 max-w-[200px]">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono tracking-tighter">
                              REF: {p._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm">
                        <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-bold uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center font-bold text-gray-900">
                          <IndianRupee className="w-3 h-3" />
                          <span>{p.price.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-500 text-sm italic">
                          <Clock className="w-3.5 h-3.5" />
                          {p.setupTime || "TBD"}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              router.push(`/admin/products/${p._id}/edit`)
                            }
                            className="p-2.5 text-gray-500 hover:text-black hover:bg-white rounded-full border border-transparent hover:border-gray-100 transition-all shadow-sm"
                            title="Edit Package"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="max-w-xs mx-auto flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Package className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-gray-900 font-semibold text-lg">
                          No Products Found
                        </h3>
                        <p className="text-gray-400 text-sm mt-1 mb-6">
                           Try adjusting your search or filter.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                          className="rounded-full border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}