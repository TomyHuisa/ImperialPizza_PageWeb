"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Plus, Package } from "lucide-react"
import type { Drink } from "@/lib/types"
import { useStock } from "@/lib/store/stock-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DrinkCardProps {
  drink: Drink
  index: number
  onAdd: (drink: Drink) => void
}

export function DrinkCard({ drink, index, onAdd }: DrinkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { state: stockState } = useStock()

  const currentStock = stockState.drinkStock[drink.id] ?? drink.stock
  const isInStock = currentStock > 0

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <div
        className={cn(
          "relative rounded-lg overflow-hidden bg-card border border-border shadow-sm",
          "transition-shadow duration-300 hover:shadow-md",
          !isInStock && "opacity-60",
        )}
      >
        <div className="relative aspect-square overflow-hidden">
          {!imageLoaded && <div className="absolute inset-0 animate-shimmer bg-muted" />}
          <Image
            src={drink.image || "/placeholder.svg"}
            alt={drink.name}
            fill
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0",
              !isInStock && "grayscale",
            )}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />

          {!isInStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/60">
              <span className="px-2 py-1 bg-card text-foreground font-semibold rounded text-xs">Out of Stock</span>
            </div>
          )}

          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-card/90 backdrop-blur">
            <Package className="h-2.5 w-2.5 text-muted-foreground" />
            <span className={cn("text-xs", currentStock <= 5 ? "text-destructive" : "text-muted-foreground")}>
              {currentStock}
            </span>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm text-foreground truncate">{drink.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{drink.description}</p>

          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary">${drink.price.toFixed(2)}</span>
            {isInStock && (
              <Button size="sm" onClick={() => onAdd(drink)} className="h-7 px-2 text-xs">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
