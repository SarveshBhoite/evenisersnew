"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronLeft, 
  Save, 
  Loader2, 
  Upload, 
  Type, 
  IndianRupee, 
  Tag, 
  Clock, 
  CheckCircle2, 
  Info, 
  Percent, 
  HelpCircle, 
  Plus, 
  Trash2, 
  X, 
  XCircle,
  Image as ImageIcon 
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// ✅ CONSTANT: Categories with their specific themes
const CATEGORY_OPTIONS = [
    { label: "Birthday", value: "birthday", themes: ["Kids Theme", "Adult Setup", "First Birthday", "Milestone (30th/50th)"] },
    { label: "Wedding", value: "wedding" },
    { label: "Haldi & Mehandi", value: "haldi-mehandi" },
    { label: "Engagement", value: "engagement" },
    { label: "Anniversary", value: "anniversary", themes: ["Silver Jubilee (25th)", "Golden Jubilee (50th)", "Romantic Dinner"] },
    { 
        label: "Festivals & Events", 
        value: "festival", 
        themes: [
            "Diwali Celebration", 
            "Holi Festival", 
            "Ganesh Chaturthi", 
            "Makar Sankranti / Lohri", 
            "Christmas Decoration", 
            "Republic / Independence Day", 
            "New Year Decoration"
        ] 
    },
    { label: "Baby Shower", value: "babyshower" },
    { label: "Baby Welcome", value: "babywelcome" },
    { label: "Naming Ceremony", value: "namingceremony" },
    { label: "Annaprashan", value: "annaprashan" },
    { label: "House Warming", value: "housewarming" },
    { label: "Bride To Be", value: "bridetobe" },
    { label: "Aged To Perfection", value: "agedtoperfection" },
    { label: "Romantic", value: "romantic" },
    { label: "Corporate", value: "corporate" },
    { label: "Catering", value: "catering" },
    { label: "Games", value: "games" },
];

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // --- States ---
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "wedding",
    theme: "", // ✅ Store Theme
    description: "",
    setupTime: "",
    discount: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]); 

  const [includedList, setIncludedList] = useState<string[]>([]);
  const [includedInput, setIncludedInput] = useState("");

  const [notIncludedList, setNotIncludedList] = useState<string[]>([]);
  const [notIncludedInput, setNotIncludedInput] = useState("");

  const [careList, setCareList] = useState<string[]>([]);
  const [careInput, setCareInput] = useState("");

  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // ✅ DERIVED STATE: Smart Theme Dropdown
  const availableThemes = useMemo(() => {
      const selectedCat = CATEGORY_OPTIONS.find(c => c.value === form.category);
      return selectedCat?.themes || [];
  }, [form.category]);

  // --- 1. FETCH DATA ---
  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      // ✅ Populate Form (Including Theme)
      setForm({
        name: data.name || "",
        price: data.price?.toString() || "",
        category: data.category || "wedding",
        theme: data.theme || "", // <--- THIS POPULATES IT
        description: data.description || "",
        setupTime: data.setupTime || "",
        discount: data.discount?.toString() || "",
      });

      if (data.included) setIncludedList(data.included.split(",").map((s: string) => s.trim()).filter(Boolean));
      if (data.notIncluded) setNotIncludedList(data.notIncluded.split(",").map((s: string) => s.trim()).filter(Boolean));
      if (data.careInfo) setCareList(data.careInfo.split(",").map((s: string) => s.trim()).filter(Boolean));

      if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
        setFaqs(data.faqs);
      }

      let imgs: string[] = [];
      if (data.images && data.images.length > 0) {
        imgs = data.images;
      } else if (data.image) {
        imgs = [data.image];
      }
      setExistingImages(imgs);

    } catch (err) {
      toast.error("Package details could not be loaded");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (id && token) fetchProduct();
  }, [id, token, fetchProduct]);

  // --- 2. HANDLERS ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (e: React.KeyboardEvent, input: string, setInput: (v: string) => void, list: string[], setList: (l: string[]) => void) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      setList([...list, input.trim()]);
      setInput("");
    }
  };
  const removeTag = (index: number, list: string[], setList: (l: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };
  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  // --- 3. SUBMIT ---
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("theme", form.theme); // ✅ SEND THEME TO BACKEND
    formData.append("description", form.description);
    formData.append("setupTime", form.setupTime);
    formData.append("discount", form.discount);

    formData.append("included", includedList.join(", "));
    formData.append("notIncluded", notIncludedList.join(", "));
    formData.append("careInfo", careList.join(", "));
    
    const validFaqs = faqs.filter(f => f.question.trim() !== "");
    formData.append("faqs", JSON.stringify(validFaqs));
    
    formData.append("existingImages", JSON.stringify(existingImages));

    if (newFiles.length > 0) {
        newFiles.forEach(file => formData.append("images", file));
    }

    try {
      await axios.put(`${API_URL}/admin/products/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Package updated successfully!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update package");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <Loader2 className="animate-spin w-10 h-10 text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FDFCFB]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <button
          onClick={() => router.push("/admin/products")}
          className="flex items-center gap-2 text-zinc-400 hover:text-black mb-8 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </button>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100">
          <header className="mb-10">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-black">
              Edit Package
            </h1>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mt-2">
              Update details for {form.name}
            </p>
          </header>

          <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* --- LEFT COLUMN --- */}
            <div className="space-y-8">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Type className="w-3 h-3" /> Package Title
                    </Label>
                    <Input 
                        required 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        className="bg-zinc-50 border-0 h-14 rounded-2xl font-bold text-black focus-visible:ring-black transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <IndianRupee className="w-3 h-3" /> Price (INR)
                    </Label>
                    <Input 
                        required 
                        type="number" 
                        name="price" 
                        value={form.price} 
                        onChange={handleChange} 
                        className="bg-zinc-50 border-0 h-14 rounded-2xl font-bold text-black focus-visible:ring-black transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Setup Duration
                    </Label>
                    <Input 
                        name="setupTime" 
                        value={form.setupTime} 
                        onChange={handleChange} 
                        className="bg-zinc-50 border-0 h-14 rounded-2xl font-bold text-black focus-visible:ring-black transition-all"
                    />
                </div>
            </div>

            {/* --- RIGHT COLUMN --- */}
            <div className="space-y-8">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Category
                    </Label>
                    <select 
                        name="category" 
                        value={form.category} 
                        onChange={handleChange}
                        className="flex h-14 w-full rounded-2xl border-0 bg-zinc-50 px-3 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    >
                        {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* ✅ SMART THEME INPUT */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Theme / Sub-Category
                    </Label>
                    {availableThemes.length > 0 ? (
                        <select 
                            name="theme" 
                            className="flex h-14 w-full rounded-2xl border-0 bg-zinc-50 px-3 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-all"
                            value={form.theme} 
                            onChange={handleChange}
                        >
                            <option value="">-- Select a Theme --</option>
                            {availableThemes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    ) : (
                        <Input 
                            name="theme" 
                            placeholder="Optional custom theme..."
                            value={form.theme} 
                            onChange={handleChange} 
                            className="bg-zinc-50 border-0 h-14 rounded-2xl font-bold text-black focus-visible:ring-black transition-all"
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Percent className="w-3 h-3" /> Discount %
                    </Label>
                    <Input 
                        type="number" 
                        name="discount" 
                        placeholder="0" 
                        value={form.discount} 
                        onChange={handleChange} 
                        className="bg-zinc-50 border-0 h-14 rounded-2xl font-bold text-black focus-visible:ring-black transition-all"
                    />
                </div>

                {/* IMAGES SECTION */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Gallery Images
                    </Label>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {existingImages.map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 flex-shrink-0 group bg-white">
                                    <Image 
                                            src={
                                                img.startsWith("http") 
                                                ? img 
                                                : `${process.env.NEXT_PUBLIC_API_URL}${img}`
                                            } 
                                            alt="Existing" 
                                            fill 
                                            className="object-cover" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => removeExistingImage(idx)}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                                    >
                                        <Trash2 className="w-5 h-5 text-white hover:text-red-400 scale-90 group-hover:scale-100 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* New Files */}
                    {newFiles.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {newFiles.map((file, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs font-bold bg-zinc-50 p-3 rounded-xl border border-zinc-100 animate-fade-in">
                                    <span className="truncate max-w-[150px] text-zinc-600">{file.name}</span>
                                    <button type="button" onClick={() => removeNewFile(idx)} className="text-zinc-400 hover:text-red-500">
                                        <XCircle className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label className="flex flex-col items-center justify-center w-full h-[58px] border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:border-black hover:bg-zinc-50 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                                {newFiles.length > 0 ? "Add More" : "Upload New"}
                            </span>
                        </div>
                        <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detailed Description</Label>
                <Textarea 
                    required 
                    rows={4} 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    className="bg-zinc-50 border-0 rounded-[2rem] p-6 text-base font-medium text-black focus-visible:ring-black resize-none transition-all"
                />
            </div>

            {/* DYNAMIC LISTS */}
            <div className="md:col-span-2 space-y-3 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-3 h-3" /> Included Items
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {includedList.map((item, i) => (
                        <span key={i} className="bg-white border border-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
                            {item} 
                            <button type="button" onClick={() => removeTag(i, includedList, setIncludedList)}>
                                <X className="w-3 h-3 text-zinc-400 hover:text-red-500 transition-colors" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input 
                        className="bg-white border-zinc-200 h-10 text-sm font-medium focus-visible:ring-black" 
                        placeholder="Type item and press Enter..." 
                        value={includedInput} 
                        onChange={(e) => setIncludedInput(e.target.value)} 
                        onKeyDown={(e) => addTag(e, includedInput, setIncludedInput, includedList, setIncludedList)}
                    />
                    <Button type="button" size="sm" className="h-10 px-4 rounded-xl font-bold bg-zinc-900" onClick={() => {if(includedInput) {setIncludedList([...includedList, includedInput]); setIncludedInput("");}}}>
                        Add
                    </Button>
                </div>
            </div>

            <div className="md:col-span-2 space-y-3 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                    <XCircle className="w-3 h-3" /> Not Included
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {notIncludedList.map((item, i) => (
                        <span key={i} className="bg-white border border-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm text-red-500 animate-fade-in">
                            {item} 
                            <button type="button" onClick={() => removeTag(i, notIncludedList, setNotIncludedList)}>
                                <X className="w-3 h-3 text-zinc-400 hover:text-black transition-colors" />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input 
                        className="bg-white border-zinc-200 h-10 text-sm font-medium focus-visible:ring-black"
                        placeholder="Type exclusion and press Enter..." 
                        value={notIncludedInput} 
                        onChange={(e) => setNotIncludedInput(e.target.value)} 
                        onKeyDown={(e) => addTag(e, notIncludedInput, setNotIncludedInput, notIncludedList, setNotIncludedList)}
                    />
                    <Button type="button" size="sm" variant="destructive" className="h-10 px-4 rounded-xl font-bold" onClick={() => {if(notIncludedInput) {setNotIncludedList([...notIncludedList, notIncludedInput]); setNotIncludedInput("");}}}>
                        Add
                    </Button>
                </div>
            </div>

            <div className="md:col-span-2 space-y-3 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-400">
                    <Info className="w-3 h-3" /> Care & Safety
                </Label>
                <div className="flex flex-col gap-2 mb-2">
                    {careList.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-white px-4 py-2 rounded-xl text-xs font-medium border border-zinc-100 shadow-sm animate-fade-in">
                            {item} 
                            <button type="button" onClick={() => removeTag(i, careList, setCareList)}>
                                <Trash2 className="w-3 h-3 text-zinc-300 hover:text-red-500 transition-colors" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input 
                        className="bg-white border-zinc-200 h-10 text-sm font-medium focus-visible:ring-black"
                        placeholder="Type safety point and press Enter..." 
                        value={careInput} 
                        onChange={(e) => setCareInput(e.target.value)} 
                        onKeyDown={(e) => addTag(e, careInput, setCareInput, careList, setCareList)}
                    />
                    <Button type="button" size="sm" variant="outline" className="h-10 px-4 rounded-xl font-bold" onClick={() => {if(careInput) {setCareList([...careList, careInput]); setCareInput("");}}}>
                        Add
                    </Button>
                </div>
            </div>

            {/* FAQs */}
            <div className="md:col-span-2 space-y-6 pt-8 border-t-2 border-dashed border-zinc-100">
                <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-400">
                        <HelpCircle className="w-3 h-3" /> Frequently Asked Questions
                    </Label>
                    <Button type="button" size="sm" variant="ghost" onClick={addFaq} className="text-[10px] font-bold uppercase tracking-widest h-8 bg-black text-white hover:bg-zinc-800 hover:text-white rounded-full transition-colors">
                        <Plus className="w-3 h-3 mr-1" /> Add Question
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="flex gap-4 items-start bg-zinc-50 p-6 rounded-[2rem] animate-fade-in">
                            <div className="flex-1 space-y-3">
                                <Input 
                                    placeholder="Question (e.g. Is transport included?)"
                                    className="bg-white border-0 h-10 rounded-xl font-bold text-sm shadow-sm focus-visible:ring-black/10"
                                    value={faq.question}
                                    onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                                />
                                <Textarea 
                                    placeholder="Answer"
                                    rows={2}
                                    className="bg-white border-0 rounded-xl p-3 text-sm font-medium shadow-sm focus-visible:ring-black/10 resize-none"
                                    value={faq.answer}
                                    onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                                />
                            </div>
                            <button type="button" onClick={() => removeFaq(index)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors mt-2">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* SUBMIT */}
            <div className="md:col-span-2 pt-6">
              <Button
                disabled={updating}
                className="w-full h-20 bg-black text-white rounded-full text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
              >
                {updating ? (
                  <>
                    <Loader2 className="animate-spin w-6 h-6" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Package
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}