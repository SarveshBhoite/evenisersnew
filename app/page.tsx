"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Calendar, MapPin, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const API_URL = "https://evenisersnew.onrender.com/api";

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic decoration packages from your backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        // Take only the top 4 for the "Featured" section
        setFeaturedEvents(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    { name: "Weddings", image: "/wedding-category.jpg", href: "/shop?category=wedding" },
    { name: "Birthdays", image: "/birthday-category.jpg", href: "/shop?category=birthday" },
    { name: "Corporate", image: "/corporate-category.jpg", href: "/shop?category=corporate" },
  ];

  return (
    <div className="min-h-screen bg-pink text-zinc-900">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-event-decoration.jpg" // Add a high-quality wedding/event photo
            alt="Luxury Event Decoration"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto text-white">
          <span className="uppercase tracking-[0.3em] text-sm mb-4 block animate-fade-in">Exquisite Moments</span>
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-8 leading-tight">
            Crafting Your <br /> Perfect Celebration
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 font-light">
            From intimate gatherings to grand galas, we provide premium decoration and management services tailored to your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full border-white bg-white text-black hover:bg-white/10 px-10 h-14">
              <Link href="/shop">Explore Packages</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white text-black hover:bg-white/10 px-10 h-14 backdrop-blur-md">
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- STATS / WHY US --- */}
      <section className="py-16 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><h4 className="text-3xl font-serif font-bold">500+</h4><p className="text-zinc-500 text-sm">Events Managed</p></div>
          <div><h4 className="text-3xl font-serif font-bold">12+</h4><p className="text-zinc-500 text-sm">Years Experience</p></div>
          <div><h4 className="text-3xl font-serif font-bold">100%</h4><p className="text-zinc-500 text-sm">Happy Clients</p></div>
          <div><h4 className="text-3xl font-serif font-bold">24/7</h4><p className="text-zinc-500 text-sm">Support</p></div>
        </div>
      </section>

      {/* --- EVENT CATEGORIES --- */}
      <section className="py-24 px-6 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">Our Specialities</h2>
              <p className="text-zinc-500 mt-2">Tailored experiences for every milestone</p>
            </div>
            <Link href="/shop" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl">
                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <h3 className="text-white text-3xl font-serif font-bold mb-2">{cat.name}</h3>
                  <p className="text-white/70 text-sm group-hover:text-white transition-colors">Discover Packages &rarr;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- DYNAMIC FEATURED PACKAGES --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Signature Themes</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4">Featured Decorations</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="aspect-[3/4] bg-zinc-100 rounded-3xl animate-pulse" />)
            ) : (
              featuredEvents.map((event: any) => (
                <Link key={event._id} href={`/product/${event._id}`} className="group">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-lg">
                    <Image 
                      src={event.image?.startsWith('http') ? event.image : `https://evenisersnew.onrender.com${event.image}`} 
                      alt={event.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {event.category}
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-bold group-hover:text-zinc-600 transition-colors">{event.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-zinc-500 text-sm flex items-center gap-1"><Sparkles className="w-3 h-3"/> Setup Incl.</p>
                    <p className="font-bold">₹{event.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- BOOKING BANNER --- */}
      <section className="bg-black py-20 px-6 mx-6 rounded-[3rem] my-24 text-white text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Planning a Wedding?</h2>
        <p className="text-zinc-400 mb-10 max-w-xl mx-auto">Our 2025-26 wedding slots are filling up fast. Contact our lead designers to secure your date today.</p>
        <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-zinc-200 px-10">
          <Link href="/contact">Inquire Now</Link>
        </Button>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { name: "Ananya Iyer", role: "Bride", quote: "The floral mandap they designed was beyond my dreams. Truly the best decorators in town." },
            { name: "Rajesh Mehra", role: "Corporate HR", quote: "Exceptional coordination for our annual gala. Professional, timely, and creative." },
            { name: "Sneha Kapoor", role: "Mother", quote: "The birthday theme for my son's first year was so magical. Every detail was perfect." }
          ].map((t, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="flex gap-1 mb-6 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-zinc-900 text-zinc-900" />)}
              </div>
              <p className="text-lg font-serif italic mb-6">"{t.quote}"</p>
              <p className="font-bold text-sm uppercase tracking-widest">{t.name}</p>
              <p className="text-zinc-500 text-xs">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-zinc-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h3 className="font-serif text-3xl font-bold mb-6 italic">LUXE EVENTS</h3>
            <p className="text-zinc-500 max-w-sm leading-relaxed mb-6">
              Transforming spaces and creating memories. We are a full-service event management and decoration agency.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">In</div>
              <div className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer">Ig</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em]">Services</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li><Link href="/shop?category=wedding">Wedding Decor</Link></li>
              <li><Link href="/shop?category=birthday">Birthday Themes</Link></li>
              <li><Link href="/shop?category=corporate">Corporate Events</Link></li>
              <li><Link href="/shop?category=haldi">Haldi & Rituals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em]">Our Office</h4>
            <ul className="space-y-4 text-sm text-zinc-600">
              <li className="flex gap-2"><MapPin className="w-4 h-4" /> 102 Luxury Tower, MG Road, Pune</li>
              <li className="flex gap-2"><Calendar className="w-4 h-4" /> Available Mon-Sat</li>
              <li className="flex gap-2"><Users className="w-4 h-4" /> info@luxeevents.com</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t mt-16 pt-8 text-center text-[10px] text-zinc-400 uppercase tracking-widest">
          &copy; 2025 Luxe Event Management. Handcrafted for your special day.
        </div>
      </footer>
    </div>
  );
}