"use client";

import { Star, Sparkles } from "lucide-react";

export const MobileMarquee = () => {
  const items = [
    "✨ 50k+ Happy Clients",
    "📅 Book Now for 2025",
    "💍 Wedding & Corporate Experts",
    "🚀 India's #1 Event Platform",
    "💎 Premium Decor",
  ];

  return (
    // Only visible on mobile (md:hidden)
    <div className="md:hidden bg-zinc-900 text-white py-2 overflow-hidden border-b border-white/10 relative z-40">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Render list twice for seamless loop */}
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="mx-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
             {item}
          </div>
        ))}
      </div>

      {/* Marquee Animation Style */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};