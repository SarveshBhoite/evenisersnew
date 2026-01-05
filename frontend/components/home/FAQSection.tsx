"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How far in advance should I book?",
    answer: "For weddings, we recommend 6-12 months. For smaller events, 2-3 months is sufficient.",
  },
  {
    question: "Do you travel for destination weddings?",
    answer: "Yes! We specialize in destination weddings across Goa, Udaipur, Jaipur, and Kerala.",
  },
  {
    question: "Can I customize the packages?",
    answer: "Absolutely. All packages are starting points. We tailor every detail to your vision.",
  },
  {
    question: "What is your refund policy?",
    answer: "Full refund 30 days prior. 50% refund 15-30 days prior. No refund under 15 days.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 px-6 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left: Image */}
        <div className="relative h-[600px] w-full rounded-[2rem] overflow-hidden shadow-2xl hidden md:block">
           {/* Use a nice vertical image of a flower arrangement or event setup */}
           <Image 
             src="/luxury-fashion-minimalist-beige-aesthetic.jpg" 
             alt="Event Planning" 
             fill 
             className="object-cover"
           />
           <div className="absolute inset-0 bg-black/20" />
           <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="font-serif text-3xl">Expert Guidance</h3>
              <p className="text-white/80 mt-2 text-sm">We are here to answer every query to ensure your peace of mind.</p>
           </div>
        </div>

        {/* Right: Text & Accordion */}
        <div>
          <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold">
            Common Questions
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-8 text-zinc-900">
            Everything you need to know
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-zinc-100 last:border-0">
                <AccordionTrigger className="text-left font-serif text-xl py-6 hover:text-[#D4AF37] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-500 leading-relaxed text-base pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}