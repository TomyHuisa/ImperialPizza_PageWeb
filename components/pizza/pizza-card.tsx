"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Plus, Settings2, Package } from "lucide-react"
import type { Pizza } from "@/lib/types"
import { useStock } from "@/lib/store/stock-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PizzaCardProps {
  pizza: Pizza
  onCustomize: (pizza: Pizza) => void
  onQuickAdd: (pizza: Pizza) => void
  index: number
}

export function PizzaCard({ pizza, onCustomize, onQuickAdd, index }: PizzaCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { state: stockState } = useStock()

  const currentStock = stockState.pizzaStock[pizza.id] ?? pizza.stock
  const isInStock = currentStock > 0

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        damping: 25,
        stiffness: 200,
      }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div
        className={cn(
          "relative rounded-xl overflow-hidden bg-card border border-border shadow-sm",
          "transition-shadow duration-300 hover:shadow-lg",
          (!pizza.available || !isInStock) && "opacity-60",
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {!imageLoaded && <div className="absolute inset-0 animate-shimmer bg-muted" />}
          <Image
            src={pizza.image || "/placeholder.svg"}
            alt={pizza.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              "group-hover:scale-105",
              pizza.available && isInStock ? "" : "grayscale",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Unavailable Badge */}
          {(!pizza.available || !isInStock) && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="px-4 py-2 bg-card text-foreground font-semibold rounded-full text-sm">
                {!isInStock ? "Out of Stock" : "Not Available"}
              </span>
            </div>
          )}

          {/* Category Badge */}
          <span
            className={cn(
              "absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full backdrop-blur capitalize",
              pizza.category === "premium" ? "bg-amber-500/90 text-amber-950" : "bg-card/90 text-foreground",
            )}
          >
            {pizza.category}
          </span>

          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-card/90 backdrop-blur">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span
              className={cn("text-xs font-medium", currentStock <= 5 ? "text-destructive" : "text-muted-foreground")}
            >
              {currentStock}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 text-balance">{pizza.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{pizza.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">${pizza.price.toFixed(2)}</span>

            {pizza.available && isInStock && (
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon" onClick={() => onCustomize(pizza)} className="h-9 w-9">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" onClick={() => onQuickAdd(pizza)} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
