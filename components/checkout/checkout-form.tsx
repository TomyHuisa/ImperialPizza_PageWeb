"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Phone, User, CreditCard, ArrowLeft, Crown, Banknote, Truck, Store, X } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { usePoints } from "@/lib/store/points-context"
import { useStock } from "@/lib/store/stock-store"
import { useWebSocket } from "@/hooks/use-websocket"
import type { Order, OrderStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function CheckoutForm() {
  const router = useRouter()
  const { state, dispatch } = useAppStore()
  const { points, usePoints: spendPoints, addPoints } = usePoints()
  const { dispatch: stockDispatch } = useStock()
  const { simulateOrderProgress } = useWebSocket()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderMode, setOrderMode] = useState<"delivery" | "takeaway">("delivery")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [showCardForm, setShowCardForm] = useState(false)
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const subtotal = useMemo(() => {
    return state.cart.reduce((sum, item) => sum + item.totalPrice, 0)
  }, [state.cart])

  const maxRedeemablePoints = Math.min(points, Math.floor(subtotal) * 100)
  const discount = pointsToRedeem / 100
  const total = Math.max(0, subtotal - discount)
  const pointsEarned = Math.floor(subtotal)

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+\-\s()]/g, "")
    setFormData({ ...formData, phone: value })
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16)
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ")
    setCardData({ ...cardData, number: formatted })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    if (value.length >= 2) {
      setCardData({ ...cardData, expiry: `${value.slice(0, 2)}/${value.slice(2)}` })
    } else {
      setCardData({ ...cardData, expiry: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in name and phone number.",
        variant: "destructive",
      })
      return
    }

    if (orderMode === "delivery" && !formData.address) {
      toast({
        title: "Missing address",
        description: "Please provide a delivery address.",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "card" && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      toast({
        title: "Missing card information",
        description: "Please complete your card details.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    state.cart.forEach((item) => {
      stockDispatch({
        type: "DECREASE_PIZZA_STOCK",
        payload: { id: item.pizza.id, quantity: item.quantity },
      })
    })

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: state.cart,
      status: "pending" as OrderStatus,
      totalPrice: total,
      discountApplied: discount,
      pointsUsed: pointsToRedeem,
      pointsEarned,
      customerName: formData.name,
      customerPhone: formData.phone,
      deliveryAddress: orderMode === "delivery" ? formData.address : "Pickup at store",
      coordinates: { lat: 40.7128 + Math.random() * 0.01, lng: -74.006 + Math.random() * 0.01 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + (orderMode === "delivery" ? 45 : 20) * 60 * 1000).toISOString(),
      orderMode,
      paymentMethod,
      cardInfo: paymentMethod === "card" ? { lastFour: cardData.number.slice(-4) } : undefined,
    }

    if (pointsToRedeem > 0) {
      spendPoints(pointsToRedeem)
    }
    addPoints(pointsEarned)

    dispatch({ type: "ADD_ORDER", payload: order })
    dispatch({ type: "SET_ACTIVE_ORDER", payload: order })
    dispatch({ type: "CLEAR_CART" })

    if (orderMode === "delivery") {
      simulateOrderProgress(order)
    } else {
      // For takeaway, simulate faster preparation
      simulateOrderProgress(order, true)
    }

    toast({
      title: "Order placed successfully!",
      description:
        orderMode === "takeaway"
          ? `Your order #${order.id} will be ready for pickup soon.`
          : `Your order #${order.id} is being prepared for delivery.`,
    })

    setIsSubmitting(false)
    router.push("/track")
  }

  if (state.cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some pizzas before checking out</p>
        <Link href="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Link>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-serif text-3xl font-bold text-foreground mb-8"
      >
        Checkout
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="rounded-xl bg-card border border-border p-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">Order Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderMode("delivery")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    orderMode === "delivery" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                  )}
                >
                  <Truck
                    className={cn("h-8 w-8", orderMode === "delivery" ? "text-primary" : "text-muted-foreground")}
                  />
                  <span className={cn("font-medium", orderMode === "delivery" ? "text-primary" : "text-foreground")}>
                    Delivery
                  </span>
                  <span className="text-xs text-muted-foreground">~45 min</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderMode("takeaway")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    orderMode === "takeaway" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                  )}
                >
                  <Store
                    className={cn("h-8 w-8", orderMode === "takeaway" ? "text-primary" : "text-muted-foreground")}
                  />
                  <span className={cn("font-medium", orderMode === "takeaway" ? "text-primary" : "text-foreground")}>
                    TakeAway
                  </span>
                  <span className="text-xs text-muted-foreground">~20 min</span>
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="rounded-xl bg-card border border-border p-6">
              <h2 className="font-semibold text-lg text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+1 555 123 4567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address - Only show for delivery mode */}
            {orderMode === "delivery" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-card border border-border p-6"
              >
                <h2 className="font-semibold text-lg text-foreground mb-4">Delivery Address</h2>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main St, Apt 4B, New York, NY 10001"
                    required={orderMode === "delivery"}
                  />
                </div>
              </motion.div>
            )}

            {/* Points Redemption */}
            {points > 0 && (
              <div className="rounded-xl bg-secondary/10 border border-secondary/30 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-secondary" />
                  <h2 className="font-semibold text-lg text-foreground">Redeem Points</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You have <span className="font-semibold text-secondary-foreground">{points} points</span> available.
                  100 points = $1.00 discount.
                </p>
                <Slider
                  value={[pointsToRedeem]}
                  onValueChange={(v) => setPointsToRedeem(Math.floor(v[0] / 100) * 100)}
                  max={maxRedeemablePoints}
                  step={100}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm">
                  <span>Points to use:</span>
                  <AnimatedCounter value={pointsToRedeem} className="font-semibold" />
                </div>
                {pointsToRedeem > 0 && (
                  <p className="text-sm text-green-600 mt-2">You save ${(pointsToRedeem / 100).toFixed(2)}!</p>
                )}
              </div>
            )}

            <div className="rounded-xl bg-card border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5" />
                <h2 className="font-semibold text-lg text-foreground">Payment Method</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cash")
                    setShowCardForm(false)
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    paymentMethod === "cash"
                      ? "border-green-500 bg-green-500/10"
                      : "border-border hover:border-green-500/50",
                  )}
                >
                  <Banknote
                    className={cn("h-8 w-8", paymentMethod === "cash" ? "text-green-500" : "text-muted-foreground")}
                  />
                  <span className={cn("font-medium", paymentMethod === "cash" ? "text-green-500" : "text-foreground")}>
                    Cash
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Pay on {orderMode === "delivery" ? "delivery" : "pickup"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card")
                    setShowCardForm(true)
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500/50",
                  )}
                >
                  <CreditCard
                    className={cn("h-8 w-8", paymentMethod === "card" ? "text-blue-500" : "text-muted-foreground")}
                  />
                  <span className={cn("font-medium", paymentMethod === "card" ? "text-blue-500" : "text-foreground")}>
                    Card
                  </span>
                  <span className="text-xs text-muted-foreground">Pay now</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showCardForm && paymentMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="rounded-xl bg-card border-2 border-blue-500/30 p-6 relative"
                >
                  <button
                    type="button"
                    onClick={() => setShowCardForm(false)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    Card Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardData.number}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                          }
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
              </Button>
            </motion.div>
          </motion.form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 rounded-xl bg-card border border-border p-6"
          >
            <h2 className="font-serif text-xl font-bold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {state.cart.map((item) => (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.pizza.name}
                    </span>
                    <span>${item.totalPrice.toFixed(2)}</span>
                  </div>
                  {item.selectedToppings.length > 0 && (
                    <p className="text-xs text-primary ml-4">+ {item.selectedToppings.map((t) => t.name).join(", ")}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Points Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
              <p className="text-sm text-secondary-foreground flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Earn {pointsEarned} points with this order!
              </p>
            </div>

            {/* Order mode summary */}
            <div className="mt-4 p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {orderMode === "delivery" ? <Truck className="h-4 w-4" /> : <Store className="h-4 w-4" />}
                {orderMode === "delivery" ? "Delivery" : "Pickup"} -{" "}
                {paymentMethod === "cash" ? "Pay with Cash" : "Pay with Card"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
