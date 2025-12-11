"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/ui/animated-counter"

export function CartView() {
  const { state, dispatch } = useAppStore()

  const subtotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }, [state.cart])

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
    } else {
      dispatch({ type: "UPDATE_CART_ITEM", payload: { id: itemId, quantity: newQuantity } })
    }
  }

  if (state.cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mb-6" />
        </motion.div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some delicious pizzas to get started</p>
        <Link href="/menu">
          <Button className="bg-primary hover:bg-primary/90">
            Browse Menu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-serif text-3xl font-bold text-foreground mb-8"
      >
        Your Cart
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {state.cart.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.pizza.image || "/placeholder.svg"}
                    alt={item.pizza.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{item.pizza.name}</h3>
                  {item.selectedToppings.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">+ Extra: </span>
                      {item.selectedToppings.map((t) => t.name).join(", ")}
                    </p>
                  )}
                  <p className="text-lg font-bold text-primary mt-2">${item.totalPrice.toFixed(2)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 rounded-xl bg-card border border-border p-6"
          >
            <h2 className="font-serif text-xl font-bold text-foreground mb-6">Order Summary</h2>

            {/* Totals */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <AnimatedCounter value={Math.round(subtotal * 100) / 100} prefix="$" className="text-primary" />
              </div>
            </div>

            <Link href="/checkout">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
                <Button className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Earn {Math.floor(subtotal)} points with this order!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
