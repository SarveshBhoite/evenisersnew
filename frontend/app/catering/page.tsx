"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Coffee, Flame, Wine, ShieldCheck, ChefHat, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CateringPage() {
  const offerings = [
    { title: "Live Counters", desc: "Interactive stations serving fresh pasta, chaat, and global street food.", icon: Flame, img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop" },
    { title: "Premium Buffets", desc: "Multi-cuisine spreads designed for grand weddings and corporate galas.", icon: Utensils, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop" },
    { title: "High Tea & Snacks", desc: "Elegant evening setups with artisan teas, pastries, and savory bites.", icon: Coffee, img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop" },
    { title: "Plated Dinners", desc: "Luxurious multi-course sit-down meals with dedicated butler service.", icon: Wine, img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1000&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-900 selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2000&auto=format&fit=crop"
            alt="Premium Catering"
            fill
            className="object-cover brightness-[0.4] hover:scale-105 transition-transform duration-[10s]"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in">
            <ChefHat className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white/90">Culinary Excellence</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-[1.1] drop-shadow-2xl">
            A Feast for the Senses.
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Elevate your events with our bespoke catering services. From vibrant live counters to luxurious plated dinners, we craft menus that leave a lasting impression.
          </p>
          <Button asChild size="lg" className="rounded-full bg-orange-600 text-white hover:bg-orange-700 px-8 h-14 text-base font-bold shadow-xl shadow-orange-900/20 transition-all hover:scale-105 border-0">
            <Link href="/contact">Request a Tasting <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      {/* --- OUR OFFERINGS (Hover Lift Grid) --- */}
      <section className="py-24 px-6 relative z-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-4">Our Gastronomic Offerings</h2>
            <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerings.map((item, idx) => (
              <div key={idx} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-zinc-100">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white p-2.5 rounded-xl shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-zinc-900 mb-2">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US (Earthy Split Layout) --- */}
      <section className="py-24 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              More than just food. <br/><span className="text-orange-400 italic">It's an experience.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              We source the freshest ingredients and employ master chefs to ensure every bite is a celebration. Hygiene, presentation, and taste are our core pillars.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { title: "100% Food Safety", icon: ShieldCheck, desc: "Strict hygiene protocols maintained." },
                { title: "Fresh Ingredients", icon: Leaf, desc: "Farm-to-table sourcing." },
                { title: "Expert Chefs", icon: ChefHat, desc: "Masters of multi-cuisine cooking." },
                { title: "Custom Menus", icon: Utensils, desc: "Tailored to your event theme." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-zinc-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[600px] rounded-[3rem] overflow-hidden border border-zinc-800">
            <Image src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop" alt="Chefs Cooking" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* --- INQUIRY CTA --- */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-zinc-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-zinc-900">Curating Your Menu?</h2>
          <p className="text-zinc-500 mb-10 text-lg">
            Let our culinary experts design the perfect dining experience for your guests. From guest counts to dietary restrictions, we handle it all.
          </p>
          <Button asChild size="lg" className="rounded-full bg-zinc-900 text-white hover:bg-orange-600 px-10 h-14 text-base font-bold transition-all">
            <Link href="/contact">Get a Custom Quote</Link>
          </Button>
        </div>
      </section>
      
    </div>
  );
}