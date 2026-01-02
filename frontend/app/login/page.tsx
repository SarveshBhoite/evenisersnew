"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext" // 1. Import the Auth Hook

export default function LoginPage() {
  const { login } = useAuth(); // 2. Destructure the login function
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isRegister && form.password !== form.confirmPassword) {
      return setError("Passwords do not match")
    }

    const endpoint = isRegister
      ? "https://evenisersnew.onrender.com/api/auth/signup"
      : "https://evenisersnew.onrender.com/api/auth/login"

    const payload = isRegister
      ? { name: form.name, email: form.email, password: form.password }
      : { email: form.email, password: form.password }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed")
      }

      if (isRegister) {
        // If they just signed up, switch to login mode or show success
        setIsRegister(false);
        alert("Registration successful! Please log in.");
      } else {
        // 3. Use the global login function to store user & token
        login(data.user, data.token); 
        // Note: router.push("/shop") is handled inside the login function in AuthContext
      }
      
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <Navbar />
      <div className="max-w-md mx-auto px-6">
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required className="mt-2" onChange={handleChange} />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required className="mt-2" onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="mt-2" onChange={handleChange} />
            </div>

            {isRegister && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  className="mt-2"
                  onChange={handleChange}
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <Button type="submit" size="lg" className="w-full rounded-full">
              {isRegister ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-accent hover:underline font-medium"
            >
              {isRegister ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}