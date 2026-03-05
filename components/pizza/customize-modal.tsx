"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, Pizza, Check } from "lucide-react"
import type { Pizza, Topping } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface CustomizeModalProps {
  pizza: Pizza | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (pizza: Pizza, toppings: Topping[], quantity: number) => void
  toppings: Topping[]
}

export function CustomizeModal({ pizza, isOpen, onClose, onAddToCart, toppings }: CustomizeModalProps) {
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([])
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    setSelectedToppings([])
    setQuantity(1)
  }, [pizza])

  if (!pizza) return null

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      const isSelected = prev.some(t => t.id === topping.id)
      if (isSelected) {
        return prev.filter(t => t.id !== topping.id)
      } else {
        if (prev.length >= 3) {
          toast({
            title: "Límite de toppings",
            description: "Solo puedes seleccionar hasta 3 toppings extra.",
            variant: "destructive",
          })
          return prev
        }
        return [...prev, topping]
      }
    })
  }

  // Agrupar toppings por categoría
  const toppingsByCategory = toppings.reduce((acc, topping) => {
    if (!acc[topping.category]) acc[topping.category] = []
    acc[topping.category].push(topping)
    return acc
  }, {} as Record<string, Topping[]>)

  const categoryNames: Record<string, string> = {
    meat: "Carnes",
    vegetable: "Verduras",
    cheese: "Quesos",
    sauce: "Salsas",
  }

  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0)
  const totalPrice = (pizza.price + toppingsTotal) * quantity

  const handleAddToCart = () => {
    onAddToCart(pizza, selectedToppings, quantity)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-xl shadow-xl z-50 border border-border max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <div className="flex items-center gap-2">
                <Pizza className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-lg font-bold">Personalizar {pizza.name}</h2>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-muted rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Precio base */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Precio base:</span>
                <span className="font-medium">${pizza.price.toFixed(2)}</span>
              </div>

              {/* Toppings por categoría */}
              <div>
                <h3 className="font-medium mb-2">Toppings extra (máx. 3)</h3>
                {Object.entries(toppingsByCategory).map(([category, cats]) => (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      {categoryNames[category] || category}
                    </h4>
                    <div className="space-y-2">
                      {cats.map((topping) => {
                        const isSelected = selectedToppings.some(t => t.id === topping.id)
                        return (
                          <button
                            key={topping.id}
                            onClick={() => toggleTopping(topping)}
                            className={cn(
                              "w-full flex items-center justify-between p-2 rounded-lg border transition-colors",
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center",
                                isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                              )}>
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span>{topping.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">+${topping.price.toFixed(2)}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cantidad */}
              <div>
                <h3 className="font-medium mb-2">Cantidad</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border flex gap-2 sticky bottom-0 bg-card">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary/90">
                Añadir al carrito
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}