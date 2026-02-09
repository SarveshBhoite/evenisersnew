"use client";

import Image from "next/image";
import { 
  ShieldCheck, 
  Globe2, 
  Palette, 
  Clock, 
  Layers, 
  Users, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2 
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function WhyUsPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 px-6 bg-zinc-50 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-zinc-200/50 rounded-full blur-[80px] -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">The Evenizers Advantage</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 leading-[1.1] mb-8">
            Why We Are The <br />
            <span className="italic text-zinc-400">Preferred</span> Choice.
          </h1>
          
          <p className="text-zinc-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Choosing the right event partner is essential. We combine experience, creativity, and execution 
            to ensure your celebration is not just successful, but effortless.
          </p>
        </div>
      </section>

      {/* 2. STATS BAR (Trust Signals) */}
      <section className="py-10 border-y border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-100">
                {[
                    { number: "09+", label: "Years Experience" },
                    { number: "50k+", label: "Events Executed" },
                    { number: "100+", label: "Cities Covered" },
                    { number: "100%", label: "Success Rate" },
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <span className="font-serif text-3xl md:text-4xl font-bold text-zinc-900 mb-1">{stat.number}</span>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 3. THE "WHY" GRID (Bento Layout) */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-16 md:text-center max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Crafted for Excellence</h2>
                <p className="text-zinc-500">We don't just manage events; we engineer experiences. Here is what makes Evenizers different.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, i) => (
                    <div 
                        key={i} 
                        className={`group p-8 rounded-[2rem] border border-zinc-100 bg-white hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all duration-500 relative overflow-hidden ${feature.span ? 'md:col-span-2 lg:col-span-1' : ''}`}
                    >
                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="w-6 h-6 text-zinc-700 group-hover:text-[#D4AF37] transition-colors" />
                            </div>
                            
                            <h3 className="font-serif text-xl font-bold mb-3 text-zinc-900">{feature.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. THE PROMISE (Dark Section) */}
      <section className="py-24 px-6 bg-zinc-900 text-white rounded-t-[3rem] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
                <HeartHandshake className="w-8 h-8 text-[#D4AF37]" />
            </div>
            
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 leading-tight">
                “We don’t just organize events — we create <span className="text-[#D4AF37]">unforgettable celebrations</span>.”
            </h2>
            
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-12">
                This is our promise to you. From the first consultation to the final guest leaving, 
                we are dedicated to perfection, transparency, and your absolute happiness.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-[#D4AF37]/20">
                    Plan My Event
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300">
                    Contact Us
                </button>
            </div>
        </div>
      </section>

    </div>
  );
}

// DATA
const features = [
    {
        title: "Proven Experience & Trust",
        desc: "With 9+ years of industry experience and 50,000+ successfully executed events, Evenizers.com has built strong credibility. We handle events of all sizes with confidence.",
        icon: ShieldCheck,
        span: false
    },
    {
        title: "Nationwide Network",
        desc: "Operating across 100+ cities in India, we make it easy to manage events at multiple locations through a single platform. Our vendor network ensures consistent quality.",
        icon: Globe2,
        span: false
    },
    {
        title: "Creative Solutions",
        desc: "From traditional celebrations to modern theme events, our team delivers personalized décor and event concepts tailored specifically to your unique vision.",
        icon: Palette,
        span: false
    },
    {
        title: "Reliable Execution",
        desc: "We understand timing is everything. Our structured planning process and trained execution team ensure smooth event delivery without delays or complications.",
        icon: Clock,
        span: false
    },
    {
        title: "End-to-End Management",
        desc: "Decoration, entertainment, catering, photography, and coordination — all under one platform. We make complex event planning simple and hassle-free.",
        icon: Layers,
        span: true // Takes more space on mobile/tablet
    },
    {
        title: "Professional Team",
        desc: "Our experienced and passionate team works closely with you to understand requirements. Our employees are committed to service excellence in every project.",
        icon: Users,
        span: false
    },
    {
        title: "Customer First",
        desc: "Happiness is our priority. We focus on transparent communication, quality service, and attention to detail to ensure every event is memorable.",
        icon: HeartHandshake,
        span: false
    },
    {
        title: "Future-Ready Tech",
        desc: "Continuously evolving by adopting modern trends, digital booking systems, and innovative concepts to provide convenient and advanced solutions.",
        icon: Sparkles,
        span: false
    },
];