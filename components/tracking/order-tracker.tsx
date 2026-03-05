"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, ChefHat, Bike, CheckCircle2, Clock, MapPin, XCircle, Store, Phone } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { useStock } from "@/lib/store/stock-store"
import { pb } from "@/lib/data/pocketbase"
import type { OrderStatus } from "@/lib/types"
import { DeliveryMap } from "./delivery-map"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const deliveryStatusSteps: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: "confirmed", label: "Order Confirmed", icon: Package },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready", icon: CheckCircle2 },
  { status: "out-for-delivery", label: "On the Way", icon: Bike },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
]

const takeawayStatusSteps: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: "confirmed", label: "Order Confirmed", icon: Package },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready", label: "Ready for Pickup", icon: Store },
  { status: "delivered", label: "Picked Up", icon: CheckCircle2 },
]

export function OrderTracker() {
  const { state, dispatch } = useAppStore()
  const { dispatch: stockDispatch } = useStock()
  const { toast } = useToast()
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showPickupNotification, setShowPickupNotification] = useState(false)

  const order = state.activeOrder

  useEffect(() => {
    if (!order) return

    const unsubscribe = pb.collection("orders").subscribe(order.id, (e) => {
      if (e.action === "update") {
        const updatedOrder = e.record as Order
        dispatch({ type: "UPDATE_ORDER", payload: updatedOrder })

        if (updatedOrder.status === "ready" && order.orderMode === "takeaway") {
          setShowPickupNotification(true)
          toast({
            title: "Your order is ready!",
            description: "Please come to the store to pick up your order.",
          })
        }
      }
    })

    return () => {
      pb.collection("orders").unsubscribe(order.id)
    }
  }, [order, dispatch, toast])

  const handleCancelOrder = () => {
    if (!order) return

    order.items.forEach((item) => {
      stockDispatch({
        type: "INCREASE_PIZZA_STOCK",
        payload: { id: item.pizza.id, quantity: item.quantity },
      })
    })

    pb.collection("orders").update(order.id, { status: "cancelled" })

    const cancelledOrder = { ...order, status: "cancelled" as OrderStatus }
    dispatch({ type: "UPDATE_ORDER", payload: cancelledOrder })
    dispatch({ type: "SET_ACTIVE_ORDER", payload: null })

    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled and items have been restocked.",
    })
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Package className="h-24 w-24 text-muted-foreground/30 mb-6" />
        </motion.div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">No active order</h2>
        <p className="text-muted-foreground mb-6">Place an order to track it here</p>
        <Link href="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    )
  }

  const statusSteps = order.orderMode === "takeaway" ? takeawayStatusSteps : deliveryStatusSteps
  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status)
  const canCancel = ["pending", "confirmed"].includes(order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Track Your Order</h1>
            <p className="text-muted-foreground">Order #{order.id}</p>
          </div>
          {canCancel && (
            <Button variant="destructive" onClick={handleCancelOrder} className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Cancel Order
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showPickupNotification && order.orderMode === "takeaway" && order.status === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-xl bg-green-500/10 border-2 border-green-500 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-600">Your order is ready!</h3>
                <p className="text-sm text-muted-foreground">Please come to the store to pick up your order.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">We&apos;ll also send you an SMS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {order.status === "cancelled" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 rounded-xl bg-destructive/10 border-2 border-destructive flex items-center gap-3"
        >
          <XCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold text-destructive">Order Cancelled</h3>
            <p className="text-sm text-muted-foreground">This order has been cancelled.</p>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card border border-border p-6"
        >
          <h2 className="font-semibold text-lg text-foreground mb-6">Order Status</h2>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <motion.div
              className="absolute left-6 top-0 w-0.5 bg-primary"
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            <div className="space-y-8">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                const Icon = step.icon

                return (
                  <motion.div
                    key={step.status}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-center gap-4"
                  >
                    <div
                      className={cn(
                        "relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {isCurrent && order.status !== "delivered" && order.status !== "cancelled" && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-primary"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      )}
                    </div>
                    <div>
                      <p className={cn("font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {step.label}
                      </p>
                      {isCurrent && order.status !== "delivered" && order.status !== "cancelled" && (
                        <p className="text-sm text-muted-foreground">In progress...</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">
                {order.orderMode === "takeaway" ? "Estimated Pickup" : "Estimated Delivery"}
              </p>
              <p className="font-medium text-foreground">
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Calculating..."}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-sm text-secondary-foreground flex items-center gap-2">
              {order.orderMode === "takeaway" ? <Store className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
              {order.orderMode === "takeaway" ? "Pickup at Store" : "Home Delivery"}
            </p>
          </div>
        </motion.div>

        {order.orderMode === "delivery" ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-card border border-border overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Live Tracking</h2>
            </div>
            <DeliveryMap
              deliveryLocation={order.coordinates}
              driverLocation={driverLocation}
              isDelivering={order.status === "out-for-delivery"}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl bg-card border border-border p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Pickup Location</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold text-foreground">Imperial Pizzeria</h3>
                <p className="text-sm text-muted-foreground mt-1">123 Main Street, Downtown</p>
                <p className="text-sm text-muted-foreground">New York, NY 10001</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-primary font-medium">
                  Show your order number #{order.id.slice(-6)} when picking up
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 rounded-xl bg-card border border-border p-6"
      >
        <h2 className="font-semibold text-lg text-foreground mb-4">Order Details</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {order.orderMode === "takeaway" ? "Pickup Location" : "Delivery Address"}
            </p>
            <p className="font-medium text-foreground">{order.deliveryAddress}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Contact</p>
            <p className="font-medium text-foreground">{order.customerName}</p>
            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">Items</p>
          {order.items.map((item) => (
            <div key={item.id} className="py-2 border-b border-border last:border-0">
              <div className="flex justify-between">
                <span>
                  {item.quantity}x {item.pizza.name}
                </span>
                <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
              </div>
              {item.selectedToppings.length > 0 && (
                <p className="text-sm text-primary mt-1 ml-4">
                  + Extra Toppings: {item.selectedToppings.map((t) => t.name).join(", ")}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-between pt-2 mt-2 border-t border-border font-bold">
            <span>Total</span>
            <span className="text-primary">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">Payment Method</p>
          <p className="font-medium text-foreground capitalize">
            {order.paymentMethod}
            {order.cardInfo && ` (**** ${order.cardInfo.lastFour})`}
          </p>
        </div>
      </motion.div>
    </div>
  )
}