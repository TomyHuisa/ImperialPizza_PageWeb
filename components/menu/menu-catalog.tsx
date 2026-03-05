"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Wine, Cake, Loader2 } from "lucide-react"
import type { Pizza, Topping, Drink, Dessert } from "@/lib/types"
import { pb } from "@/lib/data/pocketbase"
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
  
  // Estados para los datos de PocketBase
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [drinks, setDrinks] = useState<Drink[]>([])
  const [desserts, setDesserts] = useState<Dessert[]>([])
  const [toppings, setToppings] = useState<Topping[]>([])
  const [loading, setLoading] = useState(true)

  const dispatch = useAppDispatch()
  const { toast } = useToast()

  // Cargar datos desde PocketBase
  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true)
        const [pizzaRes, drinkRes, dessertRes, toppingRes] = await Promise.all([
          pb.collection("pizzas").getFullList({ sort: "-created" }),
          pb.collection("drinks").getFullList({ sort: "-created" }),
          pb.collection("desserts").getFullList({ sort: "-created" }),
          pb.collection("toppings").getFullList({ sort: "name" }),
        ])

        // Formateamos las pizzas para incluir la URL real de la imagen de PocketBase
        const formattedPizzas = pizzaRes.map(record => ({
          ...record,
          id: record.id,
          image: record.image ? pb.files.getUrl(record, record.image) : "/placeholder.svg",
        })) as unknown as Pizza[]

        const formattedDrinks = drinkRes.map(record => ({
          ...record,
          id: record.id,
          image: record.image ? pb.files.getUrl(record, record.image) : "/placeholder.svg",
        })) as unknown as Drink[]

        const formattedDesserts = dessertRes.map(record => ({
          ...record,
          id: record.id,
          image: record.image ? pb.files.getUrl(record, record.image) : "/placeholder.svg",
        })) as unknown as Dessert[]

        const formattedToppings = toppingRes.map(record => ({
          id: record.id,
          name: record.name,
          price: record.price,
          category: record.category,
        })) as Topping[]

        setPizzas(formattedPizzas)
        setDrinks(formattedDrinks)
        setDesserts(formattedDesserts)
        setToppings(formattedToppings)
      } catch (error) {
        console.error("Error cargando el menú:", error)
        toast({
          title: "Error",
          description: "No se pudo conectar con el servidor.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [toast])

  const filteredPizzas = useMemo(() => {
    if (selectedCategory === "all") return pizzas
    return pizzas.filter((pizza) => pizza.category === selectedCategory)
  }, [selectedCategory, pizzas])

  const handleCustomize = (pizza: Pizza) => {
    setSelectedPizza(pizza)
    setIsModalOpen(true)
  }

  const handleAddToCart = (pizza: Pizza, toppings: Topping[], quantity: number) => {
    // Calcular precio total: pizza base + toppings
    const toppingsPrice = toppings.reduce((sum, t) => sum + t.price, 0)
    const totalPrice = (pizza.price + toppingsPrice) * quantity

    const cartItem = {
      id: `${pizza.id}-${Date.now()}`,
      pizza,
      quantity,
      selectedToppings: toppings,
      totalPrice,
    }

    dispatch({ type: "ADD_TO_CART", payload: cartItem })
    toast({
      title: "Added to cart",
      description: `${quantity}x ${pizza.name} with custom toppings`,
    })
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
      description: `${pizza.name} has been added to your order.`,
    })
  }

  const handleAddDrink = (drink: Drink) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: `${drink.id}-${Date.now()}`,
        pizza: { ...drink, category: "classic", toppings: [], available: true } as any,
        quantity: 1,
        selectedToppings: [],
        totalPrice: drink.price,
      },
    })
    toast({ title: "Added to cart", description: `${drink.name} has been added.` })
  }

  const handleAddDessert = (dessert: Dessert) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: `${dessert.id}-${Date.now()}`,
        pizza: { ...dessert, category: "classic", toppings: [], available: true } as any,
        quantity: 1,
        selectedToppings: [],
        totalPrice: dessert.price,
      },
    })
    toast({ title: "Added to cart", description: `${dessert.name} has been added.` })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading our delicious menu...</p>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {/* Pizzas Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-3xl font-bold text-foreground">Our Pizzas</h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPizzas.length === 0 ? (
          <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">No pizzas found in this category.</p>
          </div>
        ) : (
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
        )}
      </section>

      {/* Drinks Section */}
      <section>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <Wine className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-3xl font-bold text-foreground">Drinks</h2>
        </motion.div>

        {drinks.length === 0 ? (
          <p className="text-muted-foreground italic">No drinks available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {drinks.map((drink, index) => (
              <DrinkCard key={drink.id} drink={drink} index={index} onAdd={handleAddDrink} />
            ))}
          </div>
        )}
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

        {desserts.length === 0 ? (
          <p className="text-muted-foreground italic">No desserts available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {desserts.map((dessert, index) => (
              <DessertCard key={dessert.id} dessert={dessert} index={index} onAdd={handleAddDessert} />
            ))}
          </div>
        )}
      </section>

      <CustomizeModal
        pizza={selectedPizza}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        toppings={toppings}
      />
    </div>
  )
}