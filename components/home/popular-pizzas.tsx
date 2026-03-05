"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Loader2 } from "lucide-react"
import type { Pizza, Topping } from "@/lib/types"
import { pb } from "@/lib/data/pocketbase"
import { useAppDispatch } from "@/lib/store/app-store"
import { PizzaCard } from "@/components/pizza/pizza-card"
import { CustomizeModal } from "@/components/pizza/customize-modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function PopularPizzas() {
  const [popularPizzas, setPopularPizzas] = useState<Pizza[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchPopular() {
      try {
        // Filtramos directamente en la consulta de PocketBase
        const records = await pb.collection("pizzas").getList(1, 3, {
          filter: 'popular = true && available = true',
        })

        const formatted = records.items.map(record => ({
          ...record,
          id: record.id,
          image: record.image ? pb.files.getUrl(record, record.image) : "/placeholder.svg",
        })) as unknown as Pizza[]

        setPopularPizzas(formatted)
      } catch (error) {
        console.error("Error al cargar pizzas populares:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPopular()
  }, [])

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
      description: `${pizza.name} has been added.`,
    })
  }

  if (loading) return null; // O un pequeño spinner

  // Si no hay nada en PocketBase, no mostramos la sección
  if (popularPizzas.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-3xl font-bold text-foreground">Most Popular</h2>
          </div>
          <Link href="/menu">
            <Button variant="outline" className="bg-transparent">
              View Full Menu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPizzas.map((pizza, index) => (
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
      />
    </section>
  )
}