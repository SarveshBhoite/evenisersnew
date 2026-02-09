"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  CreditCard, 
  CalendarX, 
  RotateCcw, 
  ShieldAlert, 
  Palette, 
  Banknote, 
  Ban, 
  Headphones, 
  CheckCircle2, 
  AlertCircle, 
  XCircle 
} from "lucide-react";

export default function RefundPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="pt-36 pb-16 md:pt-48 md:pb-24 px-6 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-6">
            <Banknote className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Fair & Transparent</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-6">
            Refund & Cancellation Policy
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We understand plans change. Our policy is designed to balance flexibility for you with 
            fairness to our vendors and operational teams.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* 1. VISUAL TIMELINE (The "Traffic Light" System) */}
          <div className="mb-20">
            <h2 className="font-serif text-2xl font-bold mb-8 text-center">Cancellation Timelines</h2>
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* SAFE ZONE */}
                <div className="bg-green-50/50 border border-green-100 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="w-24 h-24 text-green-600" /></div>
                    <div className="relative z-10">
                        <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Safe Zone</div>
                        <h3 className="text-xl font-bold mb-4">5+ Days Before</h3>
                        <p className="text-sm text-green-900 mb-4 font-medium">Refund processed after standard deductions.</p>
                        <ul className="text-xs text-green-800 space-y-1 list-disc pl-4">
                            <li>Vendor blocking charges deducted</li>
                            <li>Admin service charges deducted</li>
                        </ul>
                    </div>
                </div>

                {/* CAUTION ZONE */}
                <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><AlertCircle className="w-24 h-24 text-orange-600" /></div>
                    <div className="relative z-10">
                        <div className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">Caution Zone</div>
                        <h3 className="text-xl font-bold mb-4">2 - 5 Days Before</h3>
                        <p className="text-sm text-orange-900 mb-4 font-medium">Partial refund provided.</p>
                        <ul className="text-xs text-orange-800 space-y-1 list-disc pl-4">
                            <li>Arrangements are finalized</li>
                            <li>Higher deductions apply</li>
                            <li>Depends on customization level</li>
                        </ul>
                    </div>
                </div>

                {/* DANGER ZONE */}
                <div className="bg-red-50/50 border border-red-100 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><XCircle className="w-24 h-24 text-red-600" /></div>
                    <div className="relative z-10">
                        <div className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Non-Refundable</div>
                        <h3 className="text-xl font-bold mb-4">&lt; 48 Hours</h3>
                        <p className="text-sm text-red-900 mb-4 font-medium">Generally no refund provided.</p>
                        <ul className="text-xs text-red-800 space-y-1 list-disc pl-4">
                            <li>Manpower scheduled</li>
                            <li>Materials dispatched</li>
                            <li>Vendor bookings locked</li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>

          {/* 2. DETAILED POLICIES GRID */}
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Left Column */}
            <div className="space-y-12">
                <PolicyItem 
                    icon={CreditCard} 
                    title="Booking Confirmation" 
                    text="All bookings are confirmed only after receiving the required advance payment. Once confirmed, our team immediately begins vendor allocation and material procurement."
                />
                
                <PolicyItem 
                    icon={RotateCcw} 
                    title="Rescheduling Policy" 
                    text="You can request a date change up to 48 hours before the event. Approval depends on vendor availability. If vendors are unavailable for the new date, we will try to find suitable alternatives."
                />

                <PolicyItem 
                    icon={ShieldAlert} 
                    title="Vendor/Operational Issues" 
                    text="In rare cases (emergencies, weather, safety), Evenizers reserves the right to reschedule or cancel. In such events, we offer a full rescheduling option or a refund based on preparation status."
                />
            </div>

            {/* Right Column */}
            <div className="space-y-12">
                <PolicyItem 
                    icon={Palette} 
                    title="Customized Services" 
                    text="For themes requiring personalized props or advance material preparation, refund eligibility depends strictly on the work progress and costs already incurred."
                />

                <PolicyItem 
                    icon={Banknote} 
                    title="Processing Time" 
                    text="Approved refunds are processed within 7–10 working days via the original payment method."
                />

                <PolicyItem 
                    icon={Ban} 
                    title="Non-Refundable Cases" 
                    text="Refunds are not applicable for: Incorrect details provided by customer, venue permission denials, customer unavailability, or last-minute service changes."
                />
            </div>

          </div>

          {/* 3. SUPPORT CTA */}
          <div className="mt-20 bg-zinc-900 text-white p-10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
             <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <Headphones className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-bold text-lg">Need Assistance?</span>
                </div>
                <p className="text-zinc-400 text-sm max-w-md">
                    Our team works closely with you to avoid cancellations. 
                    Contact us for rescheduling support.
                </p>
             </div>
             <a href="/contact" className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-[#D4AF37] hover:text-white transition-all">
                Contact Support
             </a>
          </div>

        </div>
      </section>

    </div>
  );
}

// Helper Component for consistency
function PolicyItem({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
                <h3 className="font-serif text-lg font-bold text-zinc-900 mb-2">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
            </div>
        </div>
    );
}