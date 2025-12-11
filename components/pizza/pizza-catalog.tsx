"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Pizza, Topping } from "@/lib/types"
import { pizzas } from "@/lib/data/pizzas"
import { useAppDispatch } from "@/lib/store/app-store"
import { PizzaCard } from "./pizza-card"
import { CustomizeModal } from "./customize-modal"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { useToast } from "@/hooks/use-toast"

export function PizzaCatalog() {
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleCustomize = (pizza: Pizza) => {
    setSelectedPizza(pizza)
    setIsModalOpen(true)
  }

  const handleQuickAdd = (pizza: Pizza) => {
    const cartItem = {
      id: `${pizza.id}-${Date.now()}`,
      pizza,
      quantity: 1,
      selectedToppings: [],
      totalPrice: pizza.price,
    }
    dispatch({ type: "ADD_TO_CART", payload: cartItem })
    toast({
      title: "Added to cart",
      description: `${pizza.name} has been added to your cart.`,
    })
  }

  const handleAddToCart = (pizza: Pizza, selectedToppings: Topping[], quantity: number) => {
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0)
    const cartItem = {
      id: `${pizza.id}-${Date.now()}`,
      pizza,
      quantity,
      selectedToppings,
      totalPrice: (pizza.price + toppingsPrice) * quantity,
    }
    dispatch({ type: "ADD_TO_CART", payload: cartItem })
    toast({
      title: "Added to cart",
      description: `${pizza.name} with ${selectedToppings.length} extra toppings has been added.`,
    })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Our Imperial Selection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Handcrafted with the finest ingredients, each pizza is a masterpiece of Italian tradition
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza, index) => (
            <PizzaCard
              key={pizza.id}
              pizza={pizza}
              index={index}
              onCustomize={handleCustomize}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>

      <CustomizeModal
        pizza={selectedPizza}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </section>
  )
}

export function PizzaCatalogSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-12 w-80 mx-auto rounded animate-shimmer bg-muted mb-4" />
          <div className="h-6 w-96 mx-auto rounded animate-shimmer bg-muted" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
