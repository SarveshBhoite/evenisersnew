"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  Database, 
  Server, 
  Cookie, 
  Share2, 
  Clock, 
  UserCheck, 
  Mail, 
  FileText,
  Globe2
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HEADER */}
      <section className="pt-36 pb-16 md:pt-48 md:pb-24 px-6 border-b border-zinc-100 bg-zinc-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-6">
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Data Protection</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-zinc-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Your trust is our priority. We are committed to protecting your personal information 
            with transparency and strict security standards.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_300px] gap-16">
            
            {/* LEFT COLUMN: MAIN CONTENT */}
            <div className="space-y-16">
                
                {/* 1. Intro & Scope */}
                <div className="prose prose-zinc max-w-none">
                    <p className="text-zinc-600 leading-relaxed">
                        Evenizers.com ("Company", "We", "Us") respects your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform. It is prepared in accordance with the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection Act, 2023</strong> (India).
                    </p>
                </div>

                {/* 2. Information We Collect */}
                <Section title="Information We Collect" icon={Database}>
                    <div className="grid sm:grid-cols-2 gap-6 mt-6">
                        <Card title="Personal Data">
                            Full Name, Mobile Number, Email Address, Billing Details.
                        </Card>
                        <Card title="Event Details">
                            Event Date, Venue Address, Guest Count, Theme Preferences.
                        </Card>
                        <Card title="Technical Data">
                            IP Address, Browser Type, Device Info, Cookies.
                        </Card>
                    </div>
                </Section>

                {/* 3. Purpose */}
                <Section title="How We Use Your Data" icon={FileText}>
                    <ul className="space-y-3 mt-4 text-zinc-600 text-sm list-disc pl-5 marker:text-[#D4AF37]">
                        <li>Processing event bookings and coordinating with vendors.</li>
                        <li>Sending booking confirmations, invoices, and updates.</li>
                        <li>Improving platform performance and user experience.</li>
                        <li>Legal compliance and fraud prevention.</li>
                    </ul>
                </Section>

                {/* 4. Sharing */}
                <Section title="Data Sharing" icon={Share2}>
                    <p className="text-zinc-600 mb-4 text-sm">We do not sell your personal data. Information is shared only when necessary:</p>
                    <div className="space-y-4">
                        <ListItem title="Vendors" text="Relevant event details are shared with assigned vendors for execution." />
                        <ListItem title="Payment Partners" text="Processed through secure, encrypted third-party gateways." />
                        <ListItem title="Legal Authorities" text="Disclosed if required by law or regulatory bodies." />
                    </div>
                </Section>

                {/* 5. Security & Retention */}
                <Section title="Security & Retention" icon={ShieldCheck}>
                    <p className="text-zinc-600 text-sm mb-4">
                        We implement secure hosting, encrypted payments, and strict access controls. 
                        Data is retained only as long as required for service delivery and legal compliance, 
                        then securely deleted.
                    </p>
                </Section>

                {/* 6. Cookies */}
                <Section title="Cookies & Tracking" icon={Cookie}>
                    <p className="text-zinc-600 text-sm">
                        We use cookies to improve website functionality and understand user preferences. 
                        You may disable cookies in your browser, though some features may not work properly.
                    </p>
                </Section>

                {/* 7. Contact */}
                <div className="bg-zinc-900 text-white p-8 rounded-2xl mt-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-serif text-xl font-bold">Contact Privacy Team</h3>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">
                        For privacy-related queries, data correction requests, or grievances:
                    </p>
                    <div className="space-y-2 text-sm font-medium">
                        <p>📧 info@evenisers.com</p>
                        <p>📞 +91 98765 43210</p>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: QUICK NAV / HIGHLIGHTS (Sticky) */}
            <div className="hidden md:block">
                <div className="sticky top-32 space-y-6">
                    <div className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-400 mb-4">Quick Summary</h4>
                        <ul className="space-y-4 text-sm font-medium text-zinc-700">
                            <li className="flex items-center gap-3">
                                <Globe2 className="w-4 h-4 text-[#D4AF37]" />
                                Data stored in India
                            </li>
                            <li className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-[#D4AF37]" />
                                Encrypted Payments
                            </li>
                            <li className="flex items-center gap-3">
                                <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                                No Data Selling
                            </li>
                            <li className="flex items-center gap-3">
                                <Server className="w-4 h-4 text-[#D4AF37]" />
                                GDPR Aligned
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-6 rounded-2xl">
                        <Eye className="w-6 h-6 text-[#D4AF37] mb-3" />
                        <h4 className="font-serif text-lg font-bold text-zinc-900 mb-2">Your Rights</h4>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                            You have the right to access, correct, or request deletion of your data at any time.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

// -------------------
// HELPER COMPONENTS
// -------------------

function Section({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-zinc-600" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-zinc-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function Card({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
            <h4 className="font-bold text-sm text-zinc-900 mb-2">{title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">{children}</p>
        </div>
    );
}

function ListItem({ title, text }: { title: string, text: string }) {
    return (
        <div className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
            <div>
                <span className="font-bold text-zinc-900 text-sm">{title}: </span>
                <span className="text-zinc-600 text-sm">{text}</span>
            </div>
        </div>
    );
}