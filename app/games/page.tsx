"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Gamepad2, Mic, Tent, Ticket, ArrowRight, Zap, Users, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function GamesPage() {
  const activities = [
    { title: "Carnival & Arcade", desc: "Classic ring toss, shooting hoops, and retro arcade machines.", icon: Ticket, color: "bg-purple-500", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop" },
    { title: "VR & Tech Zones", desc: "Immersive virtual reality setups and interactive gaming consoles.", icon: Gamepad2, color: "bg-blue-500", img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop" },
    { title: "Kids Inflatables", desc: "Safe, massive bouncing castles and soft play areas for toddlers.", icon: Tent, color: "bg-pink-500", img: "https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=1000&auto=format&fit=crop" },
    { title: "Live Entertainers", desc: "Magicians, clowns, emcees, and tattoo artists to keep the crowd engaged.", icon: Mic, color: "bg-yellow-500", img: "https://images.unsplash.com/photo-1533174000222-edfe3bac9eb3?q=80&w=1000&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-purple-500 selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0 opacity-40">
          {/* Abstract colorful background elements instead of a dark image */}
          <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-20 w-[50vw] h-[50vw] bg-yellow-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-bounce">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">Bring The Energy</span>
          </div>
          <h1 className="font-black text-5xl md:text-8xl mb-6 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400">
            Unleash the Fun.
          </h1>
          <p className="text-lg md:text-xl text-zinc-200 font-medium max-w-2xl mx-auto mb-10">
            From high-tech VR setups to classic carnival stalls and live entertainers. We provide activities that keep guests of all ages laughing and engaged.
          </p>
          <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-zinc-200 px-10 h-14 text-lg font-black shadow-2xl transition-all hover:scale-110">
            <Link href="/contact">Book Entertainment</Link>
          </Button>
        </div>
      </section>

      {/* --- ACTIVITIES GRID (Playful Cards) --- */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="font-black text-4xl md:text-5xl text-zinc-900 tracking-tight">Activities & Zones</h2>
              <p className="text-zinc-500 font-medium mt-2">Customized setups for your venue size.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((item, idx) => (
              <div key={idx} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-zinc-100 hover:-translate-y-3">
                <div className="relative h-56 w-full overflow-hidden p-2">
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                    <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  {/* Floating Icon */}
                  <div className={`absolute top-6 right-6 ${item.color} text-white p-3 rounded-full shadow-lg transform group-hover:rotate-12 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-8 pt-4">
                  <h3 className="font-black text-xl text-zinc-900 mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-zinc-500 text-sm font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY BOOK WITH US (Vibrant Banner) --- */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-purple-600 to-indigo-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <Sparkles className="absolute top-10 right-10 w-32 h-32 text-white/10 rotate-12" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-black text-4xl md:text-5xl mb-6 leading-tight">Safe. Supervised. Spectacular.</h2>
              <p className="text-purple-100 text-lg mb-8 font-medium leading-relaxed">
                Every game setup comes with our trained staff to ensure safety, manage crowds, and make sure everyone gets a turn to play.
              </p>
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <Users className="w-8 h-8 text-yellow-400 mb-2" />
                  <p className="font-black text-xl">All Ages</p>
                  <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mt-1">Kids to Adults</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <ShieldCheck className="w-8 h-8 text-green-400 mb-2" />
                  <p className="font-black text-xl">100% Safe</p>
                  <p className="text-xs text-purple-200 uppercase font-bold tracking-wider mt-1">Supervised Zones</p>
                </div>
              </div>
            </div>
            {/* Playful Image Grid inside banner */}
            <div className="grid grid-cols-2 gap-4 h-full">
               <div className="relative h-48 md:h-full rounded-3xl overflow-hidden mt-8">
                  <Image src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop" alt="Arcade" fill className="object-cover" />
               </div>
               <div className="relative h-48 md:h-full rounded-3xl overflow-hidden mb-8">
                  <Image src="https://images.unsplash.com/photo-1588693959606-a23e59549f05?q=80&w=1000&auto=format&fit=crop" alt="Bouncy Castle" fill className="object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- INQUIRY CTA --- */}
      <section className="py-24 px-6 text-center">
        <h2 className="font-black text-4xl md:text-5xl mb-4 text-zinc-900 tracking-tight">Ready to Play?</h2>
        <p className="text-zinc-500 mb-10 text-lg font-medium max-w-xl mx-auto">
          Tell us about your event size, audience age group, and venue. We will send you a customized entertainment package.
        </p>
        <Button asChild size="lg" className="rounded-full bg-purple-600 text-white hover:bg-purple-700 px-10 h-14 text-base font-black shadow-xl shadow-purple-900/20 transition-all hover:scale-105 border-0">
          <Link href="/contact">Get a Free Quote</Link>
        </Button>
      </section>
      
    </div>
  );
}