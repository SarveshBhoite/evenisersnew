"use client";

import { useState } from "react";
import { X, Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CorporateBookingModal({ isOpen, onClose }: ModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    eventType: "Conference",
    date: "",
    guestCount: "",
    message: ""
  });

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // 1. Format the message for the Admin
    const fullMessage = `
      📁 COMPANY DETAILS:
      -------------------
      Name: ${formData.name}
      Company: ${formData.companyName}
      Phone: ${formData.phone}
      
      📅 EVENT DETAILS:
      -----------------
      Type: ${formData.eventType}
      Date: ${formData.date}
      Guests: ${formData.guestCount}
      
      📝 MESSAGE:
      -----------
      ${formData.message}
    `;

    try {
      // 2. Send to existing Contact API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `🏢 Corporate Inquiry: ${formData.companyName} (${formData.eventType})`,
          message: fullMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Request Sent!", description: "Our corporate team will contact you shortly." });
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        {/* Header */}
        <div className="bg-zinc-900 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl font-bold">Plan Your Corporate Event</h3>
            <p className="text-zinc-400 text-xs mt-1">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Your Name</label>
                <input required name="name" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="John Doe" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Company Name</label>
                <input required name="companyName" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="Acme Corp" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Official Email</label>
                <input required type="email" name="email" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="john@company.com" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Phone</label>
                <input required type="tel" name="phone" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="+91 98765..." />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase">Event Type</label>
             <select name="eventType" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                <option>Conference / Seminar</option>
                <option>Product Launch</option>
                <option>Team Building / Retreat</option>
                <option>Award Ceremony</option>
                <option>Office Party / Celebration</option>
                <option>Corporate Gifting</option>
                <option>Other</option>
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Tentative Date</label>
                <input type="date" name="date" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase">Guest Count</label>
                <input type="number" name="guestCount" onChange={handleChange} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="e.g. 100" />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-zinc-500 uppercase">Requirements / Message</label>
             <textarea name="message" onChange={handleChange} rows={3} className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="Tell us about your theme, budget, or specific needs..." />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Request</>}
          </button>

        </form>
      </div>
    </div>
  );
}