"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, Loader2, Upload, Clock, ListChecks, Tag, Banknote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

const API_URL = "${process.env.NEXT_PUBLIC_API_URL}/api";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "wedding",
    description: "",
    image: "", 
    setupTime: "",
    included: "",
  });

  // Using useCallback to fetch from ADMIN endpoint to get all fields
  const fetchProduct = useCallback(async () => {
    try {
      // FIX: Fetch from /admin/products/ to ensure we get 'included' and 'setupTime'
      const res = await axios.get(`${API_URL}/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch package");

      const data = await res.json();
      
      console.log("Full Data Received:", data); // Check your F12 console for these fields

      setForm({
        name: data.name || "",
        price: data.price?.toString() || "",
        category: data.category || "wedding",
        description: data.description || "",
        image: data.image || "",
        setupTime: data.setupTime || "", // This should now appear
        included: data.included ? data.included : "No included items found",   // This should now appear
      });

      if (data.image) {
        const fullImageUrl = data.image.startsWith('http') 
          ? data.image 
          : `${process.env.NEXT_PUBLIC_API_URL}${data.image}`;
        setPreview(fullImageUrl);
      }
    } catch (err) {
      toast({ title: "Error", description: "Package details could not be loaded", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (id && token) fetchProduct();
  }, [id, token, fetchProduct]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("setupTime", form.setupTime); // Explicitly sending
    formData.append("included", form.included);   // Explicitly sending
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const res = await axios.get(`${API_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast({ title: "Success", description: "Package updated successfully!" });
      router.push("/admin/products");
    } catch (err) {
      toast({ title: "Error", description: "Failed to update package", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6">
        <Button variant="ghost" onClick={() => router.push("/admin/products")} className="mb-6 p-0 flex gap-2 text-muted-foreground hover:bg-transparent">
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Button>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Edit Decoration Package</h1>
            <p className="text-muted-foreground mt-1">Update the details and imagery for this setup.</p>
          </header>

          <form onSubmit={submitHandler} className="space-y-10">
            <div className="grid lg:grid-cols-5 gap-12">
              
              <div className="lg:col-span-3 space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Tag className="w-4 h-4 text-primary" /> Package Name
                  </Label>
                  <Input 
                    value={form.name} 
                    className="h-12 rounded-xl"
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold">
                      <Banknote className="w-4 h-4 text-primary" /> Price (₹)
                    </Label>
                    <Input 
                      type="number" 
                      value={form.price} 
                      className="h-12 rounded-xl"
                      onChange={(e) => setForm({ ...form, price: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 font-semibold">
                      <Clock className="w-4 h-4 text-primary" /> Setup Time
                    </Label>
                    <Input 
                      value={form.setupTime} 
                      placeholder="e.g. 4-6 Hours"
                      className="h-12 rounded-xl"
                      onChange={(e) => setForm({ ...form, setupTime: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Decoration Category</Label>
                  <select 
                    className="w-full h-12 rounded-xl border bg-background px-3 text-sm focus:ring-2 focus:ring-black outline-none" 
                    value={form.category} 
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="haldi">Haldi</option>
                    <option value="corporate">Corporate</option>
                    <option value="anniversary">Anniversary</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold">
                    <ListChecks className="w-4 h-4 text-primary" /> What's Included?
                  </Label>
                  <Input 
                    value={form.included} 
                    placeholder="Fresh Flowers, LED Backdrops, Sofa..."
                    className="h-12 rounded-xl"
                    onChange={(e) => setForm({ ...form, included: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold">Package Description</Label>
                  <textarea 
                    className="w-full min-h-[150px] rounded-xl border px-3 py-3 text-sm focus:ring-2 focus:ring-black outline-none" 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    required
                  />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="sticky top-24">
                  <Label className="text-base font-semibold block mb-4 text-center lg:text-left">Gallery Preview</Label>
                  <div className="relative group flex flex-col items-center gap-6 p-6 border-2 border-dashed rounded-[2rem] bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    {preview ? (
                      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md border bg-white">
                        <Image src={preview} alt="Preview" fill className="object-cover transition-transform group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/5] flex items-center justify-center bg-gray-100 rounded-2xl">
                        <Loader2 className="animate-spin text-gray-300" />
                      </div>
                    )}
                    
                    <div className="w-full">
                      <label className="flex items-center justify-center gap-2 w-full h-12 bg-white border border-gray-200 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                        <Upload className="w-4 h-4" />
                        Replace Photo
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={updating} className="flex-1 bg-black text-white h-14 rounded-2xl text-lg font-medium shadow-xl shadow-black/10 hover:bg-zinc-800 transition-all">
                {updating ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} className="h-14 px-10 rounded-2xl text-lg font-medium">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}