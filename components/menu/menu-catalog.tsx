"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Wine, Cake } from "lucide-react"
import type { Pizza, Topping, Drink, Dessert } from "@/lib/types"
import { pizzas, drinks, desserts } from "@/lib/data/pizzas"
import { useAppDispatch } from "@/lib/store/app-store"
import { PizzaCard } from "@/components/pizza/pizza-card"
import { CustomizeModal } from "@/components/pizza/customize-modal"
import { DrinkCard } from "./drink-card"
import { DessertCard } from "./dessert-card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type PizzaCategory = "all" | "classic" | "specialty" | "vegetarian" | "premium"

const categories: { id: PizzaCategory; label: string }[] = [
  { id: "all", label: "All Pizzas" },
  { id: "classic", label: "Classic" },
  { id: "specialty", label: "Specialty" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "premium", label: "Premium" },
]

export function MenuCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<PizzaCategory>("all")
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const filteredPizzas = useMemo(() => {
    if (selectedCategory === "all") return pizzas
    return pizzas.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

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

  const handleAddDrink = (drink: Drink) => {
    toast({
      title: "Added to cart",
      description: `${drink.name} has been added to your cart.`,
    })
  }

  const handleAddDessert = (dessert: Dessert) => {
    toast({
      title: "Added to cart",
      description: `${dessert.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pizzas Section */}
      <section className="mb-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-6"
        >
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold text-foreground">Our Pizzas</h2>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedCategory === cat.id
                  ? cat.id === "premium"
                    ? "bg-amber-500 text-amber-950"
                    : "bg-primary text-primary-foreground"
                  : cat.id === "premium"
                    ? "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPizzas.map((pizza, index) => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                index={index}
                onCustomize={handleCustomize}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Drinks Section */}
      <section className="mb-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <Wine className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold text-foreground">Drinks</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {drinks.map((drink, index) => (
            <DrinkCard key={drink.id} drink={drink} index={index} onAdd={handleAddDrink} />
          ))}
        </div>
      </section>

      {/* Desserts Section */}
      <section>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <Cake className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold text-foreground">Desserts</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {desserts.map((dessert, index) => (
            <DessertCard key={dessert.id} dessert={dessert} index={index} onAdd={handleAddDessert} />
          ))}
        </div>
      </section>

      <CustomizeModal
        pizza={selectedPizza}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
