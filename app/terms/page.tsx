"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  FileText, 
  CalendarCheck, 
  Handshake, 
  Palette, 
  Clock, 
  CreditCard, 
  UserCheck, 
  AlertTriangle, 
  Camera, 
  Headphones,
  ShieldCheck,
  Box // ✅ Added for the new section
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="pt-32 pb-12 md:pt-48 md:pb-20 px-6 bg-white border-b border-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Effective Feb 2025</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-6">
            Terms and Conditions
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before booking. Our goal is to ensure transparency 
            and a seamless event experience for you.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-16">
            
            {/* Intro */}
            <div className="prose prose-zinc max-w-none">
                <p className="text-lg leading-relaxed text-zinc-600">
                    Welcome to <strong>Evenizers.com</strong>. By booking or using our services, you agree to the following terms. 
                    We are committed to providing smooth, high-quality event services while maintaining clarity between customers, 
                    vendors, and our management team.
                </p>
            </div>

            <div className="h-px bg-zinc-200" />

            {/* Terms Sections */}
            <div className="space-y-12">
                {termsData.map((section, index) => (
                    <div key={index} className="flex gap-6 md:gap-8">
                        {/* Icon Column */}
                        <div className="shrink-0 hidden md:block">
                            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                                <section.icon className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Text Column */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4 md:mb-3">
                                <section.icon className="w-5 h-5 text-zinc-900 md:hidden" />
                                <h3 className="font-serif text-xl font-bold text-zinc-900">{section.title}</h3>
                            </div>
                            
                            <div className="text-zinc-600 leading-relaxed text-sm md:text-base space-y-3">
                                {section.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TRUST STATEMENT BOX */}
            <div className="mt-20 p-8 md:p-10 bg-white border border-[#D4AF37]/20 rounded-2xl shadow-xl shadow-[#D4AF37]/5 text-center">
                <ShieldCheck className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
                <h4 className="font-serif text-xl font-bold mb-3">Our Promise</h4>
                <p className="text-zinc-600 italic">
                    “Our goal is to make every celebration smooth, memorable, and stress-free while maintaining transparency and service quality for our customers across India.”
                </p>
            </div>

        </div>
      </section>

    </div>
  );
}

// DATA
const termsData = [
    {
        title: "Service Overview",
        icon: FileText,
        content: (
            <p>Evenizers.com is an all-India event planning and decoration platform. We connect customers with professional event vendors and service providers, coordinating execution through our internal team to ensure quality standards across multiple cities.</p>
        )
    },
    {
        title: "Booking & Confirmation",
        icon: CalendarCheck,
        content: (
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-300">
                <li>Bookings must be confirmed via Evenizers.com or authorized representatives.</li>
                <li>A booking is considered confirmed only after receiving the required <strong>advance payment</strong>.</li>
                <li>Customers must provide accurate event details (date, time, location) at booking.</li>
                <li>Additional services requested post-booking may incur extra charges.</li>
            </ul>
        )
    },
    {
        title: "Vendor Execution",
        icon: Handshake,
        content: (
            <p>We work with verified vendors. For each event, we assign a suitable vendor based on location and availability. A service agreement exists between us and the vendor to ensure your event runs smoothly under our monitoring.</p>
        )
    },
    {
        title: "Decoration & Variations",
        icon: Palette,
        content: (
            <>
                <p className="mb-2">We strive to match the images/packages selected. However, minor variations may occur due to:</p>
                <ul className="list-disc pl-5 space-y-1 marker:text-zinc-300">
                    <li>Flower availability or seasonal color changes.</li>
                    <li>Balloon shade differences (matte/gloss/lighting effects).</li>
                    <li>Slight décor arrangement adjustments based on venue layout.</li>
                </ul>
                <p className="mt-2 text-xs text-zinc-400 uppercase tracking-wide font-bold">Note: Some images are for visualization purposes.</p>
            </>
        )
    },
    {
        title: "Changes & Cancellations",
        icon: Clock,
        content: (
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-300">
                <li>Changes to date/service must be informed <strong>48 hours</strong> prior.</li>
                <li>Evenizers reserves the right to reschedule/cancel due to safety, weather, or vendor emergencies (with prior notice).</li>
                <li>If we must cancel due to operational reasons, we will offer alternatives or applicable refunds.</li>
            </ul>
        )
    },
    {
        title: "Payments",
        icon: CreditCard,
        content: (
            <p>Advance payment is mandatory for confirmation. The remaining balance must be cleared as per the booking agreement before event execution. Prices may vary based on customization or last-minute additions.</p>
        )
    },
    {
        title: "Customer Responsibilities",
        icon: UserCheck,
        content: (
            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-300">
                <li>Providing accurate venue details and obtaining necessary permissions.</li>
                <li>Ensuring electricity points and space availability.</li>
                <li>Informing our team of any venue restrictions in advance.</li>
            </ul>
        )
    },
    // ✅ NEW SECTION ADDED HERE
    {
        title: "Rental & Reusable Material Responsibility",
        icon: Box, 
        content: (
            <p>
                All reusable décor materials, props, lighting equipment, stands, frames, and other assets supplied by Evenizers.com remain company property and are provided on a temporary usage basis. 
                Customers are responsible for ensuring the safety and proper handling of these materials until they are collected by the Evenizers team. 
                Any damage, loss, theft, or non-return of items may result in additional repair, replacement, or recovery charges payable by the customer.
            </p>
        )
    },
    {
        title: "Force Majeure",
        icon: AlertTriangle,
        content: (
            <p>Evenizers.com is not liable for delays or cancellations caused by uncontrollable circumstances such as natural disasters, political disruptions, severe weather, or transportation failures. We will attempt to provide alternatives where possible.</p>
        )
    },
    {
        title: "Photography Usage",
        icon: Camera,
        content: (
            <p>We may use event photographs/videos for our portfolio or marketing unless the customer specifically requests privacy in writing before the event.</p>
        )
    },
    {
        title: "Support & Updates",
        icon: Headphones,
        content: (
            <p>For support, contact our official channels. We reserve the right to update these terms at any time to improve service quality.</p>
        )
    },
];