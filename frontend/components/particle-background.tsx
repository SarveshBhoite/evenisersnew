"use client";

import { useEffect, useState } from "react";

export const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{ id: number; top: number; left: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate 20 random particles
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100, // Random vertical position %
      left: Math.random() * 100, // Random horizontal position %
      size: Math.random() * 3 + 1, // Random size between 1px and 4px
      duration: Math.random() * 10 + 10, // Slow movement (10-20s)
      delay: Math.random() * 5, // Random delay
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-zinc-50/30">
      {/* 1. Subtle Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/20 via-zinc-50/20 to-transparent"></div>
      
      {/* 2. Floating Gold Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37] opacity-20"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s infinite ease-in-out alternate`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* 3. Global CSS for the animation (Injected here for simplicity) */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.4; }
          100% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};