"use client"

import { useState } from "react" // 1. Import useState
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { toast } from "sonner" // Or your preferred toast library

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

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
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Message sent! The admin will contact you soon.")
        ;(e.target as HTMLFormElement).reset() // Clear the form
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
    <div className="min-h-screen pt-32 pb-16 ">
      <Navbar />
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl font-bold mb-2">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="flex justify-center items-center px-6 gap-12 flex-wrap md:flex-nowrap">
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            <h2 className="font-serif text-2xl font-bold mb-6">Send a Message</h2>
            
            {/* 2. Add onSubmit and input Names */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={6} required className="mt-2 resize-none" />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info (Remains the same as your code) */}
          <div className="space-y-8">
             {/* ... your existing Info UI ... */}
          </div>
        </div>
      </div>
    </div>
  )
}