"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Sparkles, ArrowRight, Clock, Send, MessageSquare, User, AtSign, FileText, CheckCircle2, Star } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

export default function ContactPage() {
  // STATE - UNCHANGED
  const [loading, setLoading] = useState(false)

  // HANDLER - UNCHANGED (fixed the axios call syntax)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Message sent! The admin will contact you soon.")
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(212,175,55,0.06) 100%)`
        }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="pt-28 md:pt-32 pb-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">

          {/* ═══════════════════════════════════════════════════════
              MAIN LAYOUT - Split Design
          ═══════════════════════════════════════════════════════ */}
          <div className="grid lg:grid-cols-5 bg-white border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden">

            {/* ═══ LEFT PANEL - Contact Info ═══ */}
            <div className="lg:col-span-2 relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
              {/* Gold accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]" />

              {/* Decorations */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
                <div className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full bg-[#B8860B]/10 blur-3xl" />
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,175,55,0.3) 1px, transparent 0)",
                  backgroundSize: "32px 32px"
                }} />
              </div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">
                    Contact Us
                  </span>
                </div>

                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                  Let's Plan
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">
                    Something Amazing
                  </span>
                </h2>

                <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-sm">
                  Have a question or ready to book your event? Reach out to us and our team will get back to you within 24 hours.
                </p>

                {/* Contact Details */}
                <div className="space-y-6">
                  <a href="tel:+919876543210" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/30 transition-all">
                      <Phone className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Phone</p>
                      <p className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">+91 98765 43210</p>
                      <p className="text-white/40 text-xs mt-0.5">Mon - Sat, 10am - 7pm</p>
                    </div>
                  </a>

                  <a href="mailto:hello@evenizers.com" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/30 transition-all">
                      <Mail className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Email</p>
                      <p className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">hello@evenizers.com</p>
                      <p className="text-white/40 text-xs mt-0.5">We reply within 24 hours</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Office</p>
                      <p className="text-white font-medium">Mumbai, Maharashtra</p>
                      <p className="text-white/40 text-xs mt-0.5">Pan India Services</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Hours</p>
                      <p className="text-white font-medium">Mon - Sat</p>
                      <p className="text-white/40 text-xs mt-0.5">10:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Trust */}
              <div className="relative mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">30K+</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">Events</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">4.9</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" /> Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT PANEL - Contact Form ═══ */}
            <div className="lg:col-span-3 p-6 md:p-10 lg:p-12 bg-gradient-to-b from-white to-[#FDFCF8]">

              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[#B8860B] text-xs font-bold uppercase tracking-[0.2em]">Contact</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-zinc-900">Get in Touch</h1>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-zinc-900 mb-1">Send a Message</h2>
                <p className="text-zinc-500 text-sm">Fill in the form and we'll get back to you shortly</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Full Name
                    </Label>
                    <div className="relative group">
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Your full name"
                        className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                      <AtSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Subject
                  </Label>
                  <div className="relative group">
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder="What's this about?"
                      className="h-12 bg-zinc-50 border-2 border-zinc-200 rounded-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Your Message
                  </Label>
                  <div className="relative group">
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us about your event, guest count, preferred date..."
                      className="bg-zinc-50 border-2 border-zinc-200 rounded-none resize-none focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/10 transition-all text-sm"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full h-14 bg-zinc-900 hover:bg-[#D4AF37] text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/20"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </span>
                  )}
                </Button>

                {/* Quick Response Promise */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Quick Response
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Within 24 Hours
                  </span>
                </div>
              </form>

              {/* Quick Contact Cards */}
              <div className="mt-10 pt-8 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-4 text-center">Or Reach Us Directly</p>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="tel:+919876543210" 
                    className="group flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                      <Phone className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Call Us</p>
                      <p className="text-[10px] text-zinc-500">+91 98765 43210</p>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/919876543210" 
                    target="_blank"
                    className="group flex items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                      <MessageSquare className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">WhatsApp</p>
                      <p className="text-[10px] text-zinc-500">Chat with us</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Terms */}
              <p className="text-center text-[10px] text-zinc-400 mt-6">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="text-[#B8860B] hover:underline">Terms</Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-[#B8860B] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}