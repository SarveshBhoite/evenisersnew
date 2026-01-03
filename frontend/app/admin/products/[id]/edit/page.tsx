"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Save,
  Loader2,
  Upload,
  Clock,
  ListChecks,
  Tag,
  Banknote,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "wedding",
    description: "",
    image: "",
    setupTime: "",
    included: "",
  });

  // ✅ FIXED: axios-style fetch
  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      setForm({
        name: data.name || "",
        price: data.price?.toString() || "",
        category: data.category || "wedding",
        description: data.description || "",
        image: data.image || "",
        setupTime: data.setupTime || "",
        included: data.included || "",
      });

      if (data.image) {
        const fullImageUrl = data.image.startsWith("http")
          ? data.image
          : `${process.env.NEXT_PUBLIC_API_URL}${data.image}`;
        setPreview(fullImageUrl);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Package details could not be loaded",
        variant: "destructive",
      });
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

  // ✅ FIXED: axios PUT
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("setupTime", form.setupTime);
    formData.append("included", form.included);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await axios.put(`${API_URL}/admin/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Success",
        description: "Package updated successfully!",
      });

      router.push("/admin/products");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50/50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/products")}
          className="mb-6 p-0 flex gap-2 text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Button>

        <div className="bg-white rounded-[2rem] p-8 shadow-xl border">
          <form onSubmit={submitHandler} className="space-y-8">
            <div className="grid lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 space-y-5">
                <Label>Package Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />

                <Label>Price</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                />

                <Label>Setup Time</Label>
                <Input
                  value={form.setupTime}
                  onChange={(e) =>
                    setForm({ ...form, setupTime: e.target.value })
                  }
                />

                <Label>Included</Label>
                <Input
                  value={form.included}
                  onChange={(e) =>
                    setForm({ ...form, included: e.target.value })
                  }
                />

                <Label>Description</Label>
                <textarea
                  className="w-full min-h-[120px] border rounded-xl p-3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="lg:col-span-2">
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={400}
                    height={500}
                    className="rounded-xl object-cover"
                  />
                )}

                <label className="block mt-4">
                  <input type="file" hidden onChange={handleFileChange} />
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" /> Replace Image
                  </Button>
                </label>
              </div>
            </div>

            <Button type="submit" disabled={updating} className="w-full h-14">
              {updating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
