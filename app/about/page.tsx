"use client";

import Image from "next/image";
import { 
  Star, 
  Target, 
  Heart, 
  Rocket, 
  Handshake, 
  CheckCircle2, 
  Music, 
  Camera, 
  Utensils, 
  Mic2,
  Users,
  User
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. HERO SECTION (UPDATED: Collage Layout) */}
      <section className="relative pt-22 pb-20 md:pt-38 md:pb-32 px-6 overflow-hidden bg-zinc-50/50">
        
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT: TEXT CONTENT */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">Since 2018</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-zinc-900 leading-[1.1] mb-6">
              We Craft <br />
              <span className="italic text-[#D4AF37] relative inline-block">
                Memories
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#D4AF37]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span> 
              <br /> Not Just Events.
            </h1>
            
            <p className="text-zinc-600 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
              From intimate gatherings to grand celebrations, Evenizers transforms your vision into flawless reality. Seamless planning, creative decor, and unforgettable experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                     {[1,2,3].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-zinc-200 relative overflow-hidden">
                           <Image src={`/avatar-${i}.jpg`} alt="User" fill className="object-cover" /> 
                           {/* (Note: If you don't have avatars, these grey circles still look good as placeholders) */}
                        </div>
                     ))}
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-lg leading-none">50k+</p>
                     <p className="text-xs text-zinc-500 uppercase tracking-wide">Happy Clients</p>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: IMAGE COLLAGE (The "Attractive" Part) */}
          <div className="relative h-[400px] md:h-[500px] w-full hidden md:block">
             {/* Image 1: Main (Center) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-84 h-100 bg-zinc-200 rounded-[2rem] shadow-2xl rotate-0 z-20 overflow-hidden border-[6px] border-white">
                <Image 
                  src="/hero-wedding.jpg" // Replace with a Wedding Image
                  alt="Wedding Decor" 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-700"
                />
             </div>

             {/* Image 2: Left Tilted */}
             <div className="absolute top-1/2 left-1/2 -translate-x-[80%] -translate-y-[40%] w-76 h-92 bg-zinc-300 rounded-[2rem] shadow-xl -rotate-6 z-10 overflow-hidden border-[6px] border-white opacity-90">
                <Image 
                  src="/hero-bday.jpg" // Replace with Birthday Image
                  alt="Birthday Decor" 
                  fill 
                  className="object-cover"
                />
             </div>

             {/* Image 3: Right Tilted */}
             <div className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[60%] w-76 h-92 bg-zinc-300 rounded-[2rem] shadow-xl rotate-6 z-10 overflow-hidden border-[6px] border-white opacity-90">
                <Image 
                  src="/hero-corporate.jpg" // Replace with Corporate/Stage Image
                  alt="Corporate Event" 
                  fill 
                  className="object-cover"
                />
             </div>

             {/* Decorative Elements */}
             <Star className="absolute top-5 right-0 w-22 h-22 text-[#D4AF37] animate-spin-slow opacity-20" />
             <div className="absolute bottom-5 left-10 w-24 h-24 bg-[#D4AF37] rounded-full blur-3xl opacity-20 animate-pulse" />
          </div>

        </div>
      </section>

      {/* 2. THE STORY (Split Layout) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] md:aspect-square bg-zinc-100 rounded-[3rem] overflow-hidden">
             {/* Placeholder for a high-quality team or event image */}
            <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center text-zinc-400">
                <Image 
                  src="/placeholder-event.jpg" 
                  alt="Our Journey" 
                  fill 
                  className="object-cover opacity-80 hover:scale-105 transition-transform duration-700" 
                />
            </div>
            {/* Floating Badge */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-[200px]">
              <div className="text-4xl font-bold font-serif mb-1">50k+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Events Executed</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-black"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Our Story</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              A Vision of Seamless Celebration
            </h2>
            <div className="space-y-6 text-zinc-600 leading-relaxed">
              <p>
                Evenizers.com was established in 2018 in Pune with a simple beginning and a powerful vision — to make event celebrations seamless, creative, and memorable for every client. What started as a small event décor and management service with just two team members has today evolved into a rapidly growing event solutions platform.
              </p>
              <p>
                Our growth journey is driven by dedication, continuous innovation, and strong customer relationships. We have expanded our professional team, upgraded event materials, and developed complete end-to-end solutions aligned with modern trends.
              </p>
              <p className="font-medium text-black">
                Today, Evenizers.com proudly operates as a digital and e-commerce-based event service platform, making event planning accessible across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES MARQUEE / GRID */}
      <section className="py-24 bg-zinc-950 text-white rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4 block">What We Do</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold">
              Comprehensive Event Solutions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
             {services.map((service, i) => (
                <div key={i} className="group p-6 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors cursor-default">
                    <service.icon className="w-8 h-8 mb-4 text-[#D4AF37] opacity-80 group-hover:opacity-100" />
                    <h3 className="font-serif text-lg md:text-xl mb-2">{service.title}</h3>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider group-hover:text-white transition-colors">{service.category}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. VALUES & PROMISE */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
                
                {/* Left: Values */}
                <div>
                    <h3 className="font-serif text-3xl font-bold mb-8">Our Core Values</h3>
                    <p className="text-zinc-600 mb-10 leading-relaxed">
                        At Evenizers.com, we understand that every event represents emotions, memories, and special life moments. We follow a strong Client-First Approach.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {values.map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                    <p className="text-xs text-zinc-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Vision & Promise Cards */}
                <div className="space-y-6">
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-zinc-100 shadow-xl shadow-zinc-200/50">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-6">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold mb-4">Our Vision</h4>
                        <p className="text-zinc-600 leading-relaxed">
                            To become one of India’s most trusted and technologically advanced event management platforms by expanding our service network and adopting modern event solutions.
                        </p>
                    </div>

                    <div className="bg-[#D4AF37] p-8 md:p-10 rounded-[2rem] shadow-xl text-white">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white mb-6">
                            <Handshake className="w-6 h-6" />
                        </div>
                        <h4 className="font-serif text-2xl font-bold mb-4">Our Promise</h4>
                        <p className="leading-relaxed opacity-90">
                             We promise to deliver events with dedication, creativity, and precision. Our experienced team continuously strives to transform every celebration into a flawless experience.
                        </p>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* 5. FOUNDER'S MESSAGE */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block p-2 px-6 border rounded-full text-xs font-bold uppercase tracking-widest mb-12">
                Leadership
            </div>
            
            <div className="relative">
                <span className="absolute top-0 left-0 text-9xl font-serif text-zinc-100 -z-10 select-none">“</span>
                
                <h2 className="font-serif text-2xl md:text-4xl leading-relaxed text-zinc-800 mb-10">
                    Evenizers.com is built on passion, perseverance, and the trust of our customers. 
                    From a humble beginning to expanding across India, this journey has been possible because 
                    of our supportive clients and hardworking team.
                </h2>
                
                <p className="text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                    We sincerely thank everyone who believed in our vision. We remain committed to delivering innovative, 
                    high-quality, and customer-focused event solutions in the years to come.
                </p>

                <div className="flex flex-col items-center">
                    {/* Placeholder for Signature/Image */}
                    <div className="w-20 h-20 bg-zinc-100 rounded-full mb-4 overflow-hidden relative">
                         <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                             <User className="w-8 h-8" />
                         </div>
                    </div>
                    <div className="text-lg font-bold font-serif">Kailas Chavan</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Founder & Director</div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}

// DATA ARRAYS

const services = [
    { title: "Weddings", category: "Full Management", icon: Heart },
    { title: "Birthdays", category: "Theme Decor", icon: Star },
    { title: "Baby Shower", category: "Traditional", icon: Users },
    { title: "Corporate", category: "Professional", icon: Target },
    { title: "Catering", category: "Hospitality", icon: Utensils },
    { title: "Photography", category: "Memories", icon: Camera },
    { title: "Music & DJ", category: "Entertainment", icon: Music },
    { title: "Anchoring", category: "Hosting", icon: Mic2 },
];

const values = [
    { title: "On-Time Execution", desc: "We value time as much as you do." },
    { title: "Trend-Based Concepts", desc: "Always updated with modern aesthetics." },
    { title: "Vendor Relationships", desc: "Strong network of trusted partners." },
    { title: "Transparency", desc: "Clear communication at every step." },
    { title: "Professional Planning", desc: "Structured approach to chaos." },
    { title: "Continuous Innovation", desc: "Better service with every event." },
];