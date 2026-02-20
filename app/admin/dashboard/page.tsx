"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { 
  Package, 
  ShoppingBag, 
  Users, 
  IndianRupee, 
  ArrowUpRight, 
  Truck,
  UserPlus
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function AdminDashboard() {
  const { user } = useAuth();

  const allAdminCards = [
    {
      title: "Manage Products",
      href: "/admin/products",
      icon: <Package className="w-6 h-6" />,
      desc: "Add, edit, or remove inventory items",
      permission_key: "products"
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingBag className="w-6 h-6" />,
      desc: "Track shipments and order status",
      permission_key: "orders"
    },
    {
      title: "Registered Users",
      href: "/admin/users",
      icon: <Users className="w-6 h-6" />,
      desc: "Manage customer accounts and roles",
      permission_key: "users"
    },
    {
      title: "Vendors & Partners",
      href: "/admin/vendors",
      icon: <Truck className="w-6 h-6" />,
      desc: "Manage connected vendors per city",
      permission_key: "vendors"
    },
    {
      title: "Total Revenue",
      href: "/admin/revenue",
      icon: <IndianRupee className="w-6 h-6" />,
      desc: "View earnings and sales reports",
      permission_key: "revenue"
    },
    {
      title: "Manage Employees",
      href: "/admin/employees",
      icon: <UserPlus className="w-6 h-6" />,
      desc: "Add and assign roles to employees",
      permission_key: "employee"
    }
  ]

  // Filter cards based on role and permissions
  const adminCards = allAdminCards.filter(card => {
    if (user?.role === "admin") return true; // Admin sees everything
    
    if (user?.role === "employee") {
      // @ts-ignore - Handle mixed card properties safely
      if (card.admin_only) return false; 
      // @ts-ignore
      if (user?.permissions?.includes(card.permission_key)) return true;
    }
    
    return false; // Default hide
  });

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