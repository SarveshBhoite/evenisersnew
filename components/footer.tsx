"use client";

import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        
        {/* BRAND */}
        <div className="col-span-2">
          <h3 className="font-serif text-3xl font-bold mb-6 italic">
            Evenisers EVENTS
          </h3>
          <p className="text-zinc-500 max-w-sm leading-relaxed mb-6">
            Transforming spaces and creating memories. We are a full-service event
            management and decoration agency.
          </p>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
              In
            </div>
            <div className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">
              Ig
            </div>
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em]">
            Services
          </h4>
          <ul className="space-y-4 text-sm text-zinc-600">
            <li><Link href="/shop?category=wedding">Wedding Decor</Link></li>
            <li><Link href="/shop?category=birthday">Birthday Themes</Link></li>
            <li><Link href="/shop?category=corporate">Corporate Events</Link></li>
            <li><Link href="/shop?category=haldi">Haldi & Rituals</Link></li>
            <li><Link href="/shop?category=anniversary">Anniversary Designs</Link></li>
          </ul>
        </div>

        {/* OFFICE */}
        <div>
          <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em]">
            Our Office
          </h4>
          <ul className="space-y-4 text-sm text-zinc-600">
            <li className="flex gap-2">
              <MapPin className="w-4 h-4" />
              102 Luxury Tower, MG Road, Pune
            </li>
            <li className="flex gap-2">
              <Calendar className="w-4 h-4" />
              Available Mon–Sat
            </li>
            <li className="flex gap-2">
              <Users className="w-4 h-4" />
              info@Evenisersevents.com
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t mt-16 pt-8 text-center text-[10px] text-zinc-400 uppercase tracking-widest">
        © 2025 Evenisers Event Management. Handcrafted for your special day.
      </div>
    </footer>
  );
}
