"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CorporateBookingModal } from "@/components/corporate-booking-modal";
import { 
  Building2, 
  Rocket, 
  Users2, 
  Trophy, 
  Gift, 
  Mic2, 
  CheckCircle2, 
  Briefcase 
} from "lucide-react";

export default function CorporatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <CorporateBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/premium-leather-handbag.jpg" // Using your placeholder
            alt="Corporate Event" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">Evenizers Corporate</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
             Impactful Experiences <br/>
             <span className="text-[#D4AF37] italic">That Inspire.</span>
          </h1>
          
          <p className="text-zinc-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            We specialize in designing world-class corporate events that reflect your brand identity. 
            From product launches to conferences, we handle it all.
          </p>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#D4AF37] hover:bg-white hover:text-black text-white px-10 py-4 rounded-full font-bold tracking-wide transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            Plan Your Event
          </button>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-24 px-6 bg-white rounded-t-[3rem] -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-serif text-4xl font-bold text-zinc-900 mb-4">Our Corporate Services</h2>
             <p className="text-zinc-500 max-w-2xl mx-auto">
               We deliver creativity, precision, and professionalism at every step of your business journey.
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <ServiceCard 
                icon={Mic2} 
                title="Conferences & Seminars" 
                desc="Seamless execution of annual meetings, leadership summits, and training programs with full technical support." 
             />
             <ServiceCard 
                icon={Rocket} 
                title="Product Launches" 
                desc="High-impact launch experiences that generate buzz and strengthen brand visibility." 
             />
             <ServiceCard 
                icon={Users2} 
                title="Team Building" 
                desc="Creative engagement programs to improve collaboration, motivation, and workplace culture." 
             />
             <ServiceCard 
                icon={Trophy} 
                title="Award Ceremonies" 
                desc="Elegant recognition nights designed to honor excellence and inspire employees." 
             />
             <ServiceCard 
                icon={Building2} 
                title="Office Inaugurations" 
                desc="Ribbon-cutting ceremonies and anniversary celebrations that showcase your milestone success." 
             />
             <ServiceCard 
                icon={Gift} 
                title="Corporate Gifting" 
                desc="Customized premium gifting solutions to strengthen employee and client relationships." 
             />
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US & EXPERTISE */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
           
           {/* Left: Image */}
           <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl group">
              <Image 
                src="/premium-leather-handbag.jpg" 
                alt="Corporate Meeting" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-4 text-white">
                      <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-2xl">
                        10+
                      </div>
                      <div>
                        <div className="font-bold text-lg">Years Experience</div>
                        <div className="text-zinc-400 text-sm">In Corporate Management</div>
                      </div>
                  </div>
              </div>
           </div>

           {/* Right: Content */}
           <div>
              <div className="inline-block px-4 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6">
                End-to-End Solutions
              </div>
              <h2 className="font-serif text-4xl font-bold text-zinc-900 mb-6">
                 We Manage Every Detail <br/> So You Don't Have To.
              </h2>
              <p className="text-zinc-600 mb-8 leading-relaxed">
                 Corporate events strengthen company culture and build brand reputation. Evenizers transforms your vision into extraordinary experiences with measurable results.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                 {[
                    "Event Concept & Theme",
                    "Venue Selection & Setup",
                    "Stage Design & Production",
                    "Vendor Management",
                    "AV & Technical Support",
                    "Catering & Hospitality"
                 ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                        <span className="text-zinc-800 font-medium">{item}</span>
                    </div>
                 ))}
              </div>

              <div className="mt-10">
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 text-zinc-900 font-bold border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors"
                 >
                    <Briefcase className="w-5 h-5" />
                    Discuss Your Requirements
                 </button>
              </div>
           </div>

        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-24 px-6 bg-zinc-900 text-center">
         <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
               Let’s Plan Your Next <br/> <span className="text-[#D4AF37]">Corporate Event</span>
            </h2>
            <p className="text-zinc-400 mb-10 text-lg">
               Partner with Evenizers to create unforgettable experiences that inspire people and strengthen your brand presence.
            </p>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-white text-zinc-900 px-12 py-4 rounded-full font-bold text-lg hover:bg-[#D4AF37] hover:text-white transition-all shadow-lg"
            >
               Contact Us Today
            </button>
         </div>
      </section>

    </div>
  );
}

// Helper Card Component
function ServiceCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-3xl hover:shadow-xl hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors shadow-sm">
                <Icon className="w-7 h-7 text-zinc-600 group-hover:text-white" />
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-900 mb-3">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}