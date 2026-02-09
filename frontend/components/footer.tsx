"use client";

import Link from "next/link";
import { Calendar, MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* 1. BRAND & SOCIALS (Spans 2 cols on Desktop) */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-3xl font-bold mb-6 italic block text-black">
              EVENISERS
            </Link>
            <p className="text-zinc-500 max-w-sm leading-relaxed mb-8 text-sm">
              Transforming spaces and creating memories. We are a full-service event
              management and decoration agency, dedicated to making your special moments timeless.
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-black hover:text-white hover:border-black transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-black hover:text-white hover:border-black transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-black hover:text-white hover:border-black transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. SERVICES LIST */}
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-zinc-900">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><Link href="/shop?category=wedding" className="hover:text-black transition-colors">Wedding Decor</Link></li>
              <li><Link href="/shop?category=birthday" className="hover:text-black transition-colors">Birthday Themes</Link></li>
              <li><Link href="/shop?category=babywelcome" className="hover:text-black transition-colors">Baby Welcome</Link></li>
              <li><Link href="/shop?category=namingceremony" className="hover:text-black transition-colors">Naming Ceremony</Link></li>
              <li><Link href="/shop?category=haldi" className="hover:text-black transition-colors">Haldi & Rituals</Link></li>
              <li><Link href="/shop?category=corporate" className="hover:text-black transition-colors">Corporate Events</Link></li>
              <li><Link href="/shop?category=anniversary" className="hover:text-black transition-colors">Anniversary</Link></li>
              <li><Link href="/shop?category=romantic" className="hover:text-black transition-colors">Romantic Decor</Link></li>
            </ul>
          </div>

          {/* 3. COMPANY & LEGAL (New Pages) */}
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-zinc-900">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-zinc-500 font-medium">
              <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/why" className="hover:text-black transition-colors">Why Evenizers</Link></li>
              <li className="pt-4 block font-bold text-xs uppercase tracking-[0.2em] text-zinc-900">Legal</li>
              <li><Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-black transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* 4. OFFICE & CONTACT */}
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-zinc-900">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-tight">102 Luxury Tower,<br />MG Road, Pune, MH</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 shrink-0" />
                <span>info@evenisers.com</span>
              </li>
              <li className="flex gap-3 items-center text-xs text-zinc-400 mt-4">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Mon – Sat: 10AM - 7PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest text-center md:text-left">
            © 2025 Evenisers Events. All rights reserved.
          </p>
          <div className="flex gap-6 text-[10px] text-zinc-400 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
            <Link href="/sitemap" className="hover:text-black">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}