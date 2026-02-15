"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Upload, Type, IndianRupee, Tag, Clock, 
  CheckCircle2, Info, Percent, Plus, Trash2, HelpCircle, 
  Loader2, XCircle, X, Image as ImageIcon 
} from "lucide-react";
import { toast } from "sonner";
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
    { label: "Aged To Perfection", value: "agedtoperfection" },
    { label: "House Warming", value: "housewarming" },
    { label: "Bride To Be", value: "bridetobe" },
    { label: "Romantic", value: "romantic" },
    { label: "Corporate", value: "corporate" },
    { label: "Catering", value: "catering" },
    { label: "Games", value: "games" },
];

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- Basic Fields ---
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "wedding",
    theme: "", 
    description: "",
    setupTime: "",
    discount: "",
  });

  // --- Dynamic Lists (Tags) State ---
  const [includedList, setIncludedList] = useState<string[]>([]);
  const [includedInput, setIncludedInput] = useState("");

  const [notIncludedList, setNotIncludedList] = useState<string[]>([]);
  const [notIncludedInput, setNotIncludedInput] = useState("");

  const [careList, setCareList] = useState<string[]>([]);
  const [careInput, setCareInput] = useState("");

  // --- FAQs State ---
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // --- Images State ---
  const [images, setImages] = useState<File[]>([]);

  // ✅ DERIVED STATE: Get available themes for current category
  const availableThemes = useMemo(() => {
      const selectedCat = CATEGORY_OPTIONS.find(c => c.value === formData.category);
      return selectedCat?.themes || [];
  }, [formData.category]);

  // --- Handlers ---

  // 1. Basic Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Tag Logic (Add on Enter)
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

  // 3. FAQs Logic
  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };
  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));

  // 4. Image Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("theme", formData.theme); 
    data.append("description", formData.description);
    data.append("setupTime", formData.setupTime);
    data.append("discount", formData.discount || "0");

    data.append("included", includedList.join(", "));
    data.append("notIncluded", notIncludedList.join(", "));
    data.append("careInfo", careList.join(", "));

    const validFaqs = faqs.filter(f => f.question.trim() !== "");
    data.append("faqs", JSON.stringify(validFaqs));

    images.forEach((file) => {
      data.append("images", file);
    });

    try {
      await axios.post(`${API_URL}/admin/products/events`, data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" 
        },
      });

      toast.success("Decoration Package Created!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create package.");
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* --- LEFT COLUMN: Basic Info --- */}
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Type className="w-3 h-3" /> Package Title
                    </label>
                    <input required name="name" className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                        value={formData.name} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <IndianRupee className="w-3 h-3" /> Price (INR)
                    </label>
                    <input required type="number" name="price" className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                        value={formData.price} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Setup Duration
                    </label>
                    <input name="setupTime" className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                        placeholder="e.g. 4 Hours" value={formData.setupTime} onChange={handleChange} />
                </div>
            </div>

            {/* --- RIGHT COLUMN: Options --- */}
            <div className="space-y-8">
                {/* CATEGORY DROPDOWN */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Event Category
                    </label>
                    <select name="category" className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                        value={formData.category} onChange={handleChange}>
                        {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* ✅ SMART THEME INPUT (Dropdown or Text) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Tag className="w-3 h-3" /> Theme / Sub-Category
                    </label>
                    {availableThemes.length > 0 ? (
                        <select 
                            name="theme" 
                            className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                            value={formData.theme} 
                            onChange={handleChange}
                        >
                            <option value="">-- Select a Theme --</option>
                            {availableThemes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    ) : (
                        <input 
                            name="theme" 
                            className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                            placeholder="Optional custom theme..." 
                            value={formData.theme} 
                            onChange={handleChange} 
                        />
                    )}
                </div>

                {/* DISCOUNT */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <Percent className="w-3 h-3" /> Discount % (Optional)
                    </label>
                    <input type="number" name="discount" className="w-full bg-zinc-50 border-0 rounded-2xl p-4 focus:ring-2 ring-black outline-none font-bold text-black transition-all"
                        placeholder="0" value={formData.discount} onChange={handleChange} />
                </div>

                {/* IMAGES */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Gallery Images
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-[58px] border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:border-black transition-colors bg-zinc-50">
                        <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-bold text-zinc-400">
                                {images.length > 0 ? `${images.length} Files Selected` : "Upload Multiple Images"}
                            </span>
                        </div>
                        <input type="file" multiple className="hidden" onChange={handleImageChange} />
                    </label>
                </div>
            </div>

            {/* --- FULL WIDTH SECTIONS --- */}

            {/* DESCRIPTION */}
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detailed Description</label>
                <textarea required rows={4} name="description" className="w-full bg-zinc-50 border-0 rounded-[2rem] p-6 focus:ring-2 ring-black outline-none font-medium text-black transition-all"
                    value={formData.description} onChange={handleChange} />
            </div>

            {/* --- DYNAMIC LISTS --- */}

            {/* INCLUDED ITEMS */}
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> What's Included
                </label>
                <div className="bg-zinc-50 p-4 rounded-[2rem] border-0 transition-all focus-within:ring-2 ring-black">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {includedList.map((item, i) => (
                            <span key={i} className="bg-white border border-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
                                {item} 
                                <button type="button" onClick={() => removeTag(i, includedList, setIncludedList)}>
                                    <X className="w-3 h-3 text-zinc-400 hover:text-red-500" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <input 
                        className="w-full bg-transparent outline-none font-bold text-sm placeholder:text-zinc-300 placeholder:font-medium"
                        placeholder="Type item and press Enter..."
                        value={includedInput}
                        onChange={(e) => setIncludedInput(e.target.value)}
                        onKeyDown={(e) => addTag(e, includedInput, setIncludedInput, includedList, setIncludedList)}
                    />
                </div>
            </div>

            {/* NOT INCLUDED */}
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-500" /> Not Included
                </label>
                <div className="bg-zinc-50 p-4 rounded-[2rem] border-0 transition-all focus-within:ring-2 ring-black">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {notIncludedList.map((item, i) => (
                            <span key={i} className="bg-white border border-zinc-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm text-red-500 animate-fade-in">
                                {item} 
                                <button type="button" onClick={() => removeTag(i, notIncludedList, setNotIncludedList)}>
                                    <X className="w-3 h-3 text-zinc-400 hover:text-black" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <input 
                        className="w-full bg-transparent outline-none font-bold text-sm placeholder:text-zinc-300 placeholder:font-medium"
                        placeholder="Type exclusion and press Enter..."
                        value={notIncludedInput}
                        onChange={(e) => setNotIncludedInput(e.target.value)}
                        onKeyDown={(e) => addTag(e, notIncludedInput, setNotIncludedInput, notIncludedList, setNotIncludedList)}
                    />
                </div>
            </div>

            {/* CARE INFO */}
            <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Care & Safety
                </label>
                <div className="bg-zinc-50 p-4 rounded-[2rem] border-0 transition-all focus-within:ring-2 ring-black">
                    <div className="flex flex-col gap-2 mb-2">
                        {careList.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-white px-4 py-2 rounded-xl text-xs font-medium border border-zinc-100 shadow-sm animate-fade-in">
                                {item}
                                <button type="button" onClick={() => removeTag(i, careList, setCareList)}>
                                    <Trash2 className="w-3 h-3 text-zinc-300 hover:text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <input 
                        className="w-full bg-transparent outline-none font-bold text-sm placeholder:text-zinc-300 placeholder:font-medium"
                        placeholder="Type safety point and press Enter..."
                        value={careInput}
                        onChange={(e) => setCareInput(e.target.value)}
                        onKeyDown={(e) => addTag(e, careInput, setCareInput, careList, setCareList)}
                    />
                </div>
            </div>

            {/* FAQS */}
            <div className="md:col-span-2 space-y-6 pt-8 border-t-2 border-dashed border-zinc-100">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                        <HelpCircle className="w-3 h-3" /> Frequently Asked Questions
                    </label>
                    <button type="button" onClick={addFaq} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-colors">
                        <Plus className="w-3 h-3" /> Add Question
                    </button>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="flex gap-4 items-start bg-zinc-50 p-6 rounded-[2rem] animate-fade-in">
                            <div className="flex-1 space-y-3">
                                <input 
                                    placeholder="Question (e.g. Is transport included?)"
                                    className="w-full bg-white border-0 rounded-xl p-3 text-sm font-bold shadow-sm focus:ring-1 ring-black/20 outline-none"
                                    value={faq.question}
                                    onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                                />
                                <textarea 
                                    placeholder="Answer"
                                    rows={2}
                                    className="w-full bg-white border-0 rounded-xl p-3 text-sm font-medium shadow-sm focus:ring-1 ring-black/20 outline-none"
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
                disabled={loading}
                className="w-full h-20 bg-black text-white rounded-full text-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-6 h-6" />
                    <span>Publishing...</span>
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