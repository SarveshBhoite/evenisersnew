"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { 
  Package, 
  ShoppingBag, 
  Users, 
  IndianRupee, 
  ArrowUpRight, 
  Truck
} from "lucide-react"

export default function AdminDashboard() {
  const adminCards = [
    {
      title: "Manage Products",
      href: "/admin/products",
      icon: <Package className="w-6 h-6" />,
      desc: "Add, edit, or remove inventory items"
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="w-6 h-6" />,
      desc: "Track shipments and order status"
    },
    {
      title: "Registered Users",
      href: "/admin/users",
      icon: <Users className="w-6 h-6" />,
      desc: "Manage customer accounts and roles"
    },
    {
      title: "Vendors & Partners", // --- NEW CARD ---
      href: "/admin/vendors",
      icon: <Truck className="w-6 h-6" />,
      desc: "Manage connected vendors per city"
    },
    {
      title: "Total Revenue",
      href: "/admin/revenue", // Add link if you have a report page
      icon: <IndianRupee className="w-6 h-6" />,
      desc: "View earnings and sales reports"
    }
  ]

  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-32 px-6">
        {/* Header Section - Matching Contact Page Style */}
        <div className="mb-16 mt-10">
          <h1 className="font-serif text-5xl font-bold mb-4">Admin Dashboard</h1>
         
        </div>

        {/* Grid Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adminCards.map((card, index) => (
            <Link 
              key={index} 
              href={card.href}
              className="group relative bg-card p-8 rounded-2xl shadow-md border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="font-serif text-2xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>

      
      </div>
    </div>
  )
}