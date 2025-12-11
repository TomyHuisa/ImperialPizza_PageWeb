"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus } from "lucide-react"
import { createPortal } from "react-dom"
import type { Pizza, Topping } from "@/lib/types"
import { toppings } from "@/lib/data/pizzas"
import { Button } from "@/components/ui/button"
import { AnimatedCheckbox } from "@/components/ui/animated-checkbox"
import { useToast } from "@/hooks/use-toast"

interface CustomizeModalProps {
  pizza: Pizza | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (pizza: Pizza, selectedToppings: Topping[], quantity: number) => void
}

const MAX_TOPPINGS = 3

export function CustomizeModal({ pizza, isOpen, onClose, onAddToCart }: CustomizeModalProps) {
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([])
  const [quantity, setQuantity] = useState(1)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSelectedToppings([])
      setQuantity(1)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Watch for topping limit
  useEffect(() => {
    if (selectedToppings.length > MAX_TOPPINGS) {
      toast({
        title: "Maximum toppings reached",
        description: `You can only select up to ${MAX_TOPPINGS} extra toppings.`,
        variant: "destructive",
      })
      setSelectedToppings((prev) => prev.slice(0, MAX_TOPPINGS))
    }
  }, [selectedToppings, toast])

  const totalPrice = useMemo(() => {
    if (!pizza) return 0
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0)
    return (pizza.price + toppingsPrice) * quantity
  }, [pizza, selectedToppings, quantity])

  const handleToppingToggle = (topping: Topping, checked: boolean) => {
    if (checked) {
      if (selectedToppings.length >= MAX_TOPPINGS) {
        toast({
          title: "Maximum toppings reached",
          description: `You can only select up to ${MAX_TOPPINGS} extra toppings.`,
          variant: "destructive",
        })
        return
      }
      setSelectedToppings((prev) => [...prev, topping])
    } else {
      setSelectedToppings((prev) => prev.filter((t) => t.id !== topping.id))
    }
  }

  const handleAddToCart = () => {
    if (pizza) {
      onAddToCart(pizza, selectedToppings, quantity)
      onClose()
    }
  }

  if (!mounted) return null

  const toppingsByCategory = {
    meat: toppings.filter((t) => t.category === "meat"),
    vegetable: toppings.filter((t) => t.category === "vegetable"),
    cheese: toppings.filter((t) => t.category === "cheese"),
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && pizza && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-card shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur hover:bg-card transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh]">
              {/* Image */}
              <div className="relative w-full md:w-2/5 aspect-square md:aspect-auto">
                <Image src={pizza.image || "/placeholder.svg"} alt={pizza.name} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">{pizza.name}</h2>
                <p className="text-muted-foreground mb-6">{pizza.description}</p>

                {/* Toppings */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Extra Toppings
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({selectedToppings.length}/{MAX_TOPPINGS})
                    </span>
                  </h3>

                  {Object.entries(toppingsByCategory).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {items.map((topping) => (
                          <AnimatedCheckbox
                            key={topping.id}
                            checked={selectedToppings.some((t) => t.id === topping.id)}
                            onChange={(checked) => handleToppingToggle(topping, checked)}
                            disabled={
                              !selectedToppings.some((t) => t.id === topping.id) &&
                              selectedToppings.length >= MAX_TOPPINGS
                            }
                            label={topping.name}
                            sublabel={`+$${topping.price.toFixed(2)}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium text-foreground">Quantity</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                    onClick={handleAddToCart}
                  >
                    Add to Cart - ${totalPrice.toFixed(2)}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
