"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()

  const subtotal = cartTotal
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 50) : 0
  const tax = subtotal * 0.05 // Adjusted to 5% for standard GST
  const total = subtotal + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 text-center py-24 bg-white rounded-3xl shadow-sm border mt-10">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="font-serif text-4xl font-bold mb-4 text-gray-900">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">It looks like you haven't added any packages yet.</p>
          <Button asChild size="lg" className="rounded-full px-10 h-14 bg-black text-white hover:bg-zinc-800">
            <Link href="/shop">
              Explore Collections <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gray-50/50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-serif text-4xl font-bold mb-10 text-gray-900">Shopping Cart ({cartItems.length})</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;

              return (
                <div key={product._id} className="flex gap-6 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 items-center transition-all hover:shadow-md">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border bg-gray-50 shrink-0">
                    <Image
                      src={product.image ? `http://localhost:5000${product.image}` : "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg truncate pr-4">{product.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                        onClick={() => removeFromCart(product._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <p className="font-serif text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center border border-gray-200 rounded-full px-1 py-1 bg-white shadow-sm">
                        <button 
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-32">
              <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900">Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (EST)</span>
                  <span className="font-medium text-gray-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Estimated Total</span>
                  <span className="text-2xl font-bold text-black">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button asChild className="w-full rounded-2xl h-16 text-lg font-bold bg-black hover:bg-zinc-800 shadow-lg shadow-black/10 transition-all active:scale-[0.98]">
                <Link href="/checkout">Checkout Now</Link>
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground grayscale opacity-60">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold">Protected Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}