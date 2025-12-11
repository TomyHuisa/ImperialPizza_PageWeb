"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Clock, CheckCircle2, Bell, Plus } from "lucide-react"
import { useKitchenStore, KitchenStoreProvider } from "@/lib/store/kitchen-store"
import { useWebSocket, mockWS } from "@/hooks/use-websocket"
import type { Order, CartItem, OrderStatus } from "@/lib/types"
import { pizzas } from "@/lib/data/pizzas"
import { KitchenOrderCard } from "./kitchen-order-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function KitchenDashboardContent() {
  const { state, dispatch } = useKitchenStore()
  const { isConnected, subscribe, emit } = useWebSocket()
  const { toast } = useToast()
  const [stats, setStats] = useState({ pending: 0, completed: 0, avgTime: 0 })

  // Subscribe to new orders
  useEffect(() => {
    const unsubscribe = subscribe("new-order", (msg) => {
      if (msg.type === "new-order") {
        dispatch({ type: "ADD_ORDER", payload: msg.payload })
        toast({
          title: "New Order!",
          description: `Order #${msg.payload.id.slice(-6)} received`,
        })
      }
    })

    return unsubscribe
  }, [subscribe, dispatch, toast])

  // Update stats
  useEffect(() => {
    setStats({
      pending: state.orderQueue.length,
      completed: state.completedOrders.length,
      avgTime: state.completedOrders.length > 0 ? 12 : 0,
    })
  }, [state.orderQueue, state.completedOrders])

  const handleMarkReady = useCallback(
    (orderId: string) => {
      // Optimistic update
      dispatch({ type: "MARK_READY", payload: orderId })

      // Emit WebSocket event
      emit("order-ready", {
        type: "order-ready",
        payload: { orderId },
      })

      toast({
        title: "Order Ready!",
        description: `Order #${orderId.slice(-6)} is ready for delivery`,
      })
    },
    [dispatch, emit, toast],
  )

  // Demo: Add mock order
  const addMockOrder = () => {
    const randomPizza = pizzas[Math.floor(Math.random() * pizzas.length)]
    const mockOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [
        {
          id: `item-${Date.now()}`,
          pizza: randomPizza,
          quantity: Math.floor(Math.random() * 3) + 1,
          selectedToppings: [],
          totalPrice: randomPizza.price,
        } as CartItem,
      ],
      status: "confirmed" as OrderStatus,
      totalPrice: randomPizza.price,
      discountApplied: 0,
      pointsUsed: 0,
      pointsEarned: Math.floor(randomPizza.price),
      customerName: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"][Math.floor(Math.random() * 4)],
      customerPhone: "+1 555-0123",
      deliveryAddress: "123 Main St, Apt 4B",
      coordinates: { lat: 40.7128, lng: -74.006 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    }

    mockWS.emit("new-order", { type: "new-order", payload: mockOrder })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Kitchen Dashboard</h1>
                <p className="text-sm text-muted-foreground">Imperial Pizzeria</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Connection Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-muted-foreground">{isConnected ? "Connected" : "Connecting..."}</span>
              </div>

              {/* Demo: Add Order Button */}
              <Button onClick={addMockOrder} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Demo Order
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgTime}m</p>
                <p className="text-sm text-muted-foreground">Avg. Prep Time</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Queue */}
        <div>
          <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Order Queue
            {state.orderQueue.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                {state.orderQueue.length}
              </span>
            )}
          </h2>

          {state.orderQueue.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-card border border-border rounded-xl"
            >
              <ChefHat className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-1">No pending orders</h3>
              <p className="text-sm text-muted-foreground">New orders will appear here automatically</p>
              <Button onClick={addMockOrder} variant="outline" className="mt-4 bg-transparent">
                <Plus className="h-4 w-4 mr-1" />
                Add Demo Order
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {state.orderQueue.map((order) => (
                  <KitchenOrderCard key={order.id} order={order} onMarkReady={handleMarkReady} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Completed Orders */}
        {state.completedOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Recently Completed
            </h2>
            <div className="space-y-2">
              {state.completedOrders.slice(0, 5).map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-mono text-sm font-medium">#{order.id.slice(-6)}</span>
                    <span className="text-sm text-muted-foreground">{order.customerName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Ready for pickup</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function KitchenDashboard() {
  return (
    <KitchenStoreProvider>
      <KitchenDashboardContent />
    </KitchenStoreProvider>
  )
}
