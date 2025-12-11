"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Coins } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { usePoints } from "@/lib/store/points-context"
import { Button } from "@/components/ui/button"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { cn } from "@/lib/utils"

// Nueva equivalencia: 25 puntos = $2.00
const POINTS_TO_DOLLAR_RATE = 2.00 / 25 // $0.08 por punto
const POINTS_STEP = 25 // Incremento mínimo de 25 puntos

export function CartView() {
  const { state, dispatch } = useAppStore()
  const { points, usePoints: spendPoints } = usePoints()

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

  const handleUpdateItemPoints = (itemId: string, pointsToUse: number) => {
    dispatch({ 
      type: "UPDATE_CART_ITEM_POINTS", 
      payload: { id: itemId, pointsUsed: Math.max(0, pointsToUse) } 
    })
  }

  const handleIncrementPoints = (itemId: string, currentPoints: number) => {
    const maxPoints = getMaxPointsForItem(itemId)
    const newPoints = Math.min(currentPoints + POINTS_STEP, maxPoints)
    handleUpdateItemPoints(itemId, newPoints)
  }

  const handleDecrementPoints = (itemId: string, currentPoints: number) => {
    const newPoints = Math.max(currentPoints - POINTS_STEP, 0)
    handleUpdateItemPoints(itemId, newPoints)
  }

  const getMaxPointsForItem = (itemId: string) => {
    const item = state.cart.find(item => item.id === itemId)
    if (!item) return 0
    
    const currentItemPoints = item.pointsUsed || 0
    const otherItemsPoints = state.cart.reduce((sum, cartItem) => {
      if (cartItem.id !== itemId) return sum + (cartItem.pointsUsed || 0)
      return sum
    }, 0)
    
    const availablePoints = points - otherItemsPoints
    
    // Máximo de puntos basado en el precio del item
    // Convertimos el precio máximo a puntos usando la nueva tasa
    const maxPointsByPrice = Math.floor(item.totalPrice / POINTS_TO_DOLLAR_RATE)
    
    return Math.min(maxPointsByPrice, Math.max(0, availablePoints + currentItemPoints))
  }

  // Calcula el descuento en dólares basado en los puntos usados
  const calculateDiscountFromPoints = (pointsUsed: number) => {
    return pointsUsed * POINTS_TO_DOLLAR_RATE
  }

  // Función para obtener los puntos disponibles para un ítem específico
  const getAvailablePointsForItem = (itemId: string) => {
    const currentItemPoints = state.cart.find(item => item.id === itemId)?.pointsUsed || 0
    const otherItemsPoints = state.cart.reduce((sum, cartItem) => {
      if (cartItem.id !== itemId) return sum + (cartItem.pointsUsed || 0)
      return sum
    }, 0)
    
    return Math.max(0, points - otherItemsPoints + currentItemPoints)
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
            {state.cart.map((item, index) => {
              const maxPoints = getMaxPointsForItem(item.id)
              const availablePointsForItem = getAvailablePointsForItem(item.id)
              const currentPoints = item.pointsUsed || 0
              const itemDiscount = calculateDiscountFromPoints(currentPoints)
              const itemFinalPrice = Math.max(0, item.totalPrice - itemDiscount)
              const canUsePoints = maxPoints >= POINTS_STEP && availablePointsForItem >= POINTS_STEP
              const canIncrement = currentPoints + POINTS_STEP <= maxPoints
              const canDecrement = currentPoints - POINTS_STEP >= 0

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col gap-4 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.pizza.image || "/placeholder.svg"}
                        alt={item.pizza.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">{item.pizza.name}</h3>
                          {item.selectedToppings.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              <span className="text-primary font-medium">+ Extra: </span>
                              {item.selectedToppings.map((t) => t.name).join(", ")}
                            </p>
                          )}
                          {item.type === 'dessert' && item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          {item.type === 'drink' && item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-2 mt-2">
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
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-lg font-bold text-primary">
                          ${itemFinalPrice.toFixed(2)}
                          {currentPoints > 0 && (
                            <span className="text-sm text-green-600 ml-2">
                              (Saved: ${itemDiscount.toFixed(2)})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Points Discount Section for each item */}
                  <div className={cn(
                    "rounded-lg p-4 border transition-all",
                    canUsePoints 
                      ? "bg-secondary/10 border-secondary/30" 
                      : "bg-muted/30 border-muted"
                  )}>
                    <div className="flex items-center gap-2 mb-4">
                      <Coins className={cn(
                        "h-5 w-5",
                        canUsePoints ? "text-secondary" : "text-muted-foreground"
                      )} />
                      <div>
                        <h4 className={cn(
                          "font-medium",
                          canUsePoints ? "text-foreground" : "text-muted-foreground"
                        )}>
                          Use points for this item
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          25 points = $2.00 discount
                        </p>
                      </div>
                    </div>
                    
                    {canUsePoints ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              Available for this item: {availablePointsForItem} points
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Max discount: ${calculateDiscountFromPoints(maxPoints).toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Points Control - Similar al control de cantidad */}
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground mr-2">Points:</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 bg-transparent",
                                  !canDecrement && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => handleDecrementPoints(item.id, currentPoints)}
                                disabled={!canDecrement}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="flex flex-col items-center min-w-[80px]">
                                <span className="w-full text-center font-medium text-lg">
                                  {currentPoints}
                                </span>
                                <span className="text-xs text-green-600">
                                  (${calculateDiscountFromPoints(currentPoints).toFixed(2)})
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                  "h-8 w-8 bg-transparent",
                                  !canIncrement && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => handleIncrementPoints(item.id, currentPoints)}
                                disabled={!canIncrement}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Visual slider design (solo visual, no funcional) */}
                            <div className="w-full max-w-[200px] relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div></div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-green-600">
                                    ${calculateDiscountFromPoints(currentPoints).toFixed(2)} discount
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                                <div 
                                  style={{ 
                                    width: `${maxPoints > 0 ? (currentPoints / maxPoints) * 100 : 0}%` 
                                  }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-300"
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>0 pts</span>
                                <span>${calculateDiscountFromPoints(maxPoints).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Not enough points available for discount on this item
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You need at least 25 points to get a $2.00 discount
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
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

            {/* Items List */}
            <div className="space-y-3 mb-4">
              {state.cart.map((item) => {
                const itemDiscount = calculateDiscountFromPoints(item.pointsUsed || 0)
                const itemFinalPrice = Math.max(0, item.totalPrice - itemDiscount)
                
                return (
                  <div key={item.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.pizza.name}
                      </span>
                      <div className="text-right">
                        <span>${itemFinalPrice.toFixed(2)}</span>
                        {(item.pointsUsed || 0) > 0 && (
                          <div className="text-xs text-green-600">
                            -${itemDiscount.toFixed(2)} with {item.pointsUsed} points
                          </div>
                        )}
                      </div>
                    </div>
                    {item.selectedToppings.length > 0 && (
                      <p className="text-xs text-primary ml-4">+ {item.selectedToppings.map((t) => t.name).join(", ")}</p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Points Summary */}
            <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-secondary" />
                <h3 className="text-sm font-medium text-secondary-foreground">Points Summary</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total points available:</span>
                  <span className="font-medium">{points} points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Points being used:</span>
                  <span className="font-medium text-green-600">
                    {state.cart.reduce((sum, item) => sum + (item.pointsUsed || 0), 0)} points
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total discount:</span>
                  <span className="font-medium text-green-600">
                    ${state.cart.reduce((sum, item) => 
                      sum + calculateDiscountFromPoints(item.pointsUsed || 0), 0).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground pt-1 border-t border-border/30">
                  25 points = $2.00 discount
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm text-green-600">
                <span>Points Discount</span>
                <span>
                  -$
                  {state.cart.reduce((sum, item) => 
                    sum + calculateDiscountFromPoints(item.pointsUsed || 0), 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <AnimatedCounter 
                  value={
                    state.cart.reduce((sum, item) => {
                      const itemDiscount = calculateDiscountFromPoints(item.pointsUsed || 0)
                      return sum + Math.max(0, item.totalPrice - itemDiscount)
                    }, 0)
                  } 
                  prefix="$" 
                  className="text-primary" 
                />
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

            <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="h-4 w-4 text-secondary" />
                <span className="text-sm text-secondary-foreground">
                  You have {points} points available
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                25 points = $2.00 discount • 1 point = $0.08
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}