"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Edit,
  Package,
  Loader2,
  Clock,
  IndianRupee,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

// ✅ FIXED: proper env usage
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// 1. Define the interface for Decoration Packages
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

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ FIXED: axios uses res.data
      const data = res.data;

      // Preserve your existing safety logic
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
      // ✅ FIXED: proper axios DELETE
      await axios.delete(`${API_URL}/admin/products/${id}`, {
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

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-end mt-10 mb-5">
          <Button
            onClick={() => router.push("/admin/products/new")}
            className="bg-black text-white rounded-full px-8 h-12 shadow-lg shadow-black/10 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Package
          </Button>
        </div>

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
                ) : products.length > 0 ? (
                  products.map((p) => (
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
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
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
                          Empty Catalog
                        </h3>
                        <p className="text-gray-400 text-sm mt-1 mb-6">
                          You haven't added any decoration packages yet.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push("/admin/products/new")
                          }
                          className="rounded-full"
                        >
                          Get Started
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
