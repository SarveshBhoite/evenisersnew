"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push("/admin/login")
      if (user?.role !== "admin") router.push("/")
    }
  }, [user, isLoading])

  if (isLoading || !user || user.role !== "admin") return null

  return <>{children}</>
}
