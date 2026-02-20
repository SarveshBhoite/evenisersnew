"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLoginPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "employee") {
      router.push("/admin/dashboard")
    }
  }, [user, router])

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Login</h1>
      <p>Please login as admin</p>
      {/* admin login form here */}
    </div>
  )
}
