"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  Clock,
  Type,
  Tag,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// ✅ FIXED: correct env usage
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Wedding",
    description: "",
    setupTime: "",
    included: "",
  });

  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = formData.category || "Wedding";

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", finalCategory);
    data.append("description", formData.description);
    data.append("setupTime", formData.setupTime);
    data.append("included", formData.included);
    if (image) data.append("image", image);

    try {
      // ✅ FIXED: axios POST
      await axios.post(`${API_URL}/admin/products`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Decoration Package Created!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create package."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-24 pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-black">
              Create New Package
            </h1>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mt-2">
              Design your next premium event offering
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {/* NAME */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Type className="w-3 h-3" /> Package Title
              </label>
              <input
                required
                className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none transition-all font-bold text-black"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* PRICE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <IndianRupee className="w-3 h-3" /> Pricing (INR)
              </label>
              <input
                required
                type="number"
                className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none transition-all font-bold text-black"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Event Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
                <option value="haldi">Haldi</option>
                <option value="birthday">Birthday</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>

            {/* SETUP TIME */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Setup Duration
              </label>
              <input
                className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none transition-all font-bold text-black"
                value={formData.setupTime}
                onChange={(e) =>
                  setFormData({ ...formData, setupTime: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Detailed Description
              </label>
              <textarea
                required
                rows={4}
                className="w-full bg-zinc-50 border-0 rounded-[2rem] p-6 focus:ring-2 ring-black outline-none transition-all font-medium text-black"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* INCLUDED */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> Package Highlights
              </label>
              <textarea
                rows={2}
                className="w-full bg-zinc-50 border-0 rounded-2xl p-6 focus:ring-2 ring-black outline-none transition-all font-bold text-sm text-black"
                value={formData.included}
                onChange={(e) =>
                  setFormData({ ...formData, included: e.target.value })
                }
              />
            </div>

            {/* IMAGE */}
            <div className="md:col-span-2">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-200 rounded-[2rem] cursor-pointer">
                <Upload className="w-8 h-8 text-zinc-300 mb-3" />
                <p className="text-xs font-black uppercase tracking-tighter">
                  {image ? image.name : "Upload Hero Image"}
                </p>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2 pt-6">
              <Button
                disabled={loading}
                className="w-full h-20 bg-black text-white rounded-full text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-6 h-6" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  "Publish Package"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
