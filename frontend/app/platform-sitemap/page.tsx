"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LayoutGrid, Info, HelpCircle, Mail, MapPin, Shield, FileText, Gift, Sparkles, Home, ChevronRight } from "lucide-react"

export default function SitemapPage() {
  const sections = [
    {
      title: "Main Explorer",
      icon: Home,
      links: [
        { name: "Home Page", href: "/" },
        { name: "All Packages", href: "/shop" },
        { name: "Special Offers", href: "/shop?sort=discount" },
      ]
    },
    {
      title: "Who We Are",
      icon: Info,
      links: [
        { name: "Our Story (About Us)", href: "/about" },
        { name: "Why Evenizers", href: "/why" },
        { name: "Contact Support", href: "/contact" },
      ]
    },
    {
      title: "Celebration Types",
      icon: Sparkles,
      links: [
        { name: "Birthday Decor", href: "/shop?category=birthday" },
        { name: "Wedding Planning", href: "/shop?category=wedding" },
        { name: "Engagement Sets", href: "/shop?category=engagement" },
        { name: "Haldi & Mehandi", href: "/shop?category=haldi-mehandi" },
        { name: "Anniversary Themes", href: "/shop?category=anniversary" },
        { name: "Festivals & Events", href: "/shop?category=festival" },
      ]
    },
    {
      title: "Life Milestones",
      icon: LayoutGrid,
      links: [
        { name: "Baby Shower", href: "/shop?category=babyshower" },
        { name: "Baby Welcome", href: "/shop?category=babywelcome" },
        { name: "Naming Ceremony", href: "/shop?category=namingceremony" },
        { name: "Annaprashan", href: "/shop?category=annaprashan" },
        { name: "House Warming", href: "/shop?category=housewarming" },
        { name: "Aged To Perfection", href: "/shop?category=agedtoperfection" },
      ]
    },
    {
      title: "Exclusive Services",
      icon: Gift,
      links: [
        { name: "Corporate Bookings", href: "/corporate" },
        { name: "Premium Catering", href: "/catering" },
        { name: "Bride To Be", href: "/shop?category=bridetobe" },
        { name: "Romantic Surprises", href: "/shop?category=romantic" },
        { name: "Games & Entertainment", href: "/games" },
      ]
    },
    {
      title: "Account & Partner",
      icon: MapPin,
      links: [
        { name: "Customer Login", href: "/login" },
        { name: "Be a Partner (Vendor)", href: "/vendor" },
        { name: "Partner Registration", href: "/signup" },
      ]
    },
    {
      title: "Policy & Legal",
      icon: Shield,
      links: [
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Refund & Cancellation", href: "/refund-policy" },
      ]
    }
  ]

  return (
    <div className="min-h-screen relative bg-[#FDFCF8] selection:bg-[#D4AF37] selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-12 h-px bg-zinc-200" />
              <span className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em]">Navigation Hub</span>
              <span className="w-12 h-px bg-zinc-200" />
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-zinc-900 mb-6">
              Platform <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Sitemap</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Explore every corner of Evenizers—from stunning event themes and corporate services to our core policies.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
              <div 
                key={idx} 
                className="group p-8 bg-white border border-zinc-100 rounded-[2rem] hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-500">
                    <section.icon className="w-6 h-6 text-[#D4AF37] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-[#B8860B] transition-colors duration-500">
                    {section.title}
                  </h3>
                </div>

                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link 
                        href={link.href}
                        className="flex items-center justify-between text-zinc-500 hover:text-black font-medium transition-all group/link"
                      >
                        <span className="text-sm">{link.name}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-200 group-hover/link:text-[#D4AF37] group-hover/link:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Box */}
          <div className="mt-16 p-10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-[3rem] text-center relative overflow-hidden">
             {/* Decorations */}
             <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
             <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#B8860B]/10 blur-3xl" />

             <h2 className="relative font-serif text-3xl font-bold text-white mb-4">
               Can&apos;t find what you are looking for?
             </h2>
             <p className="relative text-zinc-400 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
               Our event experts are always available to help you navigate through our services and find the perfect package for your celebration.
             </p>
             <Link 
              href="/contact"
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-all"
             >
               Get Direct Assistance
             </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
