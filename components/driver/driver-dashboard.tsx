"use client"

import { useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bike, MapPin, Phone, User, Clock, CheckCircle2, Package, Navigation, Plus } from "lucide-react"
import { useDriverStore, DriverStoreProvider } from "@/lib/store/driver-store"
import { useWebSocket } from "@/hooks/use-websocket"
import type { Order, CartItem, OrderStatus } from "@/lib/types"
import { pizzas } from "@/lib/data/pizzas"
import { DriverMap } from "./driver-map"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function DriverDashboardContent() {
  const { state, dispatch } = useDriverStore()
  const { isConnected, subscribe, emit } = useWebSocket()
  const { toast } = useToast()
  const [earnings, setEarnings] = useState({ today: 45.5, deliveries: 8 })

  // Subscribe to ready orders
  useEffect(() => {
    const unsubscribe = subscribe("order-ready", (msg) => {
      if (msg.type === "order-ready") {
        // Mock: Create a delivery-ready order
        const mockOrder: Order = {
          id: msg.payload.orderId,
          items: [],
          status: "ready" as OrderStatus,
          totalPrice: 24.99,
          discountApplied: 0,
          pointsUsed: 0,
          pointsEarned: 24,
          customerName: "Customer",
          customerPhone: "+1 555-0123",
          deliveryAddress: "456 Oak Avenue, Suite 12",
          coordinates: { lat: 40.715, lng: -74.01 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        }
        dispatch({ type: "ADD_AVAILABLE_ORDER", payload: mockOrder })
        toast({
          title: "New Delivery Available!",
          description: `Order #${msg.payload.orderId.slice(-6)} is ready for pickup`,
        })
      }
    })

    return unsubscribe
  }, [subscribe, dispatch, toast])

  const handleAcceptDelivery = useCallback(
    (orderId: string) => {
      dispatch({ type: "ACCEPT_DELIVERY", payload: orderId })
      toast({
        title: "Delivery Accepted",
        description: "Navigate to the restaurant for pickup",
      })
    },
    [dispatch, toast],
  )

  const handleCompleteDelivery = useCallback(() => {
    if (!state.activeDelivery) return

    dispatch({ type: "COMPLETE_DELIVERY", payload: state.activeDelivery.id })
    setEarnings((prev) => ({
      today: prev.today + 5.5,
      deliveries: prev.deliveries + 1,
    }))

    emit("order-update", {
      type: "order-update",
      payload: { ...state.activeDelivery, status: "delivered" } as Order,
    })

    toast({
      title: "Delivery Complete!",
      description: "Great job! +$5.50 earned",
    })
  }, [state.activeDelivery, dispatch, emit, toast])

  const handleAddressUpdate = useCallback(
    (address: string, coordinates: { lat: number; lng: number }) => {
      if (!state.activeDelivery) return
      dispatch({
        type: "UPDATE_DELIVERY_ADDRESS",
        payload: { orderId: state.activeDelivery.id, address, coordinates },
      })
      toast({
        title: "Address Updated",
        description: "Delivery location has been updated",
      })
    },
    [state.activeDelivery, dispatch, toast],
  )

  // Demo: Add mock available order
  const addMockOrder = () => {
    const randomPizza = pizzas[Math.floor(Math.random() * pizzas.length)]
    const mockOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: [
        {
          id: `item-${Date.now()}`,
          pizza: randomPizza,
          quantity: Math.floor(Math.random() * 2) + 1,
          selectedToppings: [],
          totalPrice: randomPizza.price,
        } as CartItem,
      ],
      status: "ready" as OrderStatus,
      totalPrice: randomPizza.price,
      discountApplied: 0,
      pointsUsed: 0,
      pointsEarned: Math.floor(randomPizza.price),
      customerName: ["Alice Brown", "Bob Green", "Carol White", "David Black"][Math.floor(Math.random() * 4)],
      customerPhone: "+1 555-" + Math.floor(Math.random() * 9000 + 1000),
      deliveryAddress: [
        "789 Pine Street, Apt 3A",
        "321 Elm Road, Unit 7",
        "555 Maple Drive, Floor 2",
        "100 Cedar Lane, Suite 5B",
      ][Math.floor(Math.random() * 4)],
      coordinates: {
        lat: 40.71 + Math.random() * 0.01,
        lng: -74.01 + Math.random() * 0.01,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    }
    dispatch({ type: "ADD_AVAILABLE_ORDER", payload: mockOrder })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Bike className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Driver Dashboard</h1>
                <p className="text-sm text-muted-foreground">Imperial Pizzeria</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-muted-foreground">{isConnected ? "Online" : "Connecting..."}</span>
              </div>

              <Button onClick={addMockOrder} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Demo Order
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">Today's Earnings</p>
            <p className="text-2xl font-bold text-green-600">${earnings.today.toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">Deliveries</p>
            <p className="text-2xl font-bold text-foreground">{earnings.deliveries}</p>
          </motion.div>
        </div>

        {/* Active Delivery */}
        {state.activeDelivery ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-secondary" />
              Active Delivery
            </h2>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Map */}
              <div className="driver-map-container h-[400px] rounded-xl overflow-hidden border border-border">
                <DriverMap
                  driverLocation={state.currentLocation}
                  deliveryLocation={state.activeDelivery.coordinates}
                  deliveryAddress={state.activeDelivery.deliveryAddress}
                  onAddressUpdate={handleAddressUpdate}
                  isEditable={true}
                />
              </div>

              {/* Order Details */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-primary">#{state.activeDelivery.id.slice(-6)}</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary-foreground">
                    In Progress
                  </span>
                </div>

                {/* Customer Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{state.activeDelivery.customerName}</p>
                      <p className="text-sm text-muted-foreground">Customer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{state.activeDelivery.customerPhone}</p>
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{state.activeDelivery.deliveryAddress}</p>
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Order Items</p>
                  {state.activeDelivery.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span>
                        {item.quantity}x {item.pizza.name}
                      </span>
                      <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleCompleteDelivery} className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Delivered
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Available Orders */
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Available Deliveries
              {state.availableOrders.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  {state.availableOrders.length}
                </span>
              )}
            </h2>

            {state.availableOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-card border border-border rounded-xl"
              >
                <Bike className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-1">No deliveries available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  New deliveries will appear here when orders are ready
                </p>
                <Button onClick={addMockOrder} variant="outline" className="bg-transparent">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Demo Delivery
                </Button>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {state.availableOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm font-bold text-primary">#{order.id.slice(-6)}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>~15 min</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{order.deliveryAddress}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </span>
                        <span className="font-bold text-foreground">${order.totalPrice.toFixed(2)}</span>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => handleAcceptDelivery(order.id)}
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Accept Delivery
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Completed Deliveries */}
        {state.completedDeliveries.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completed Today
            </h2>
            <div className="space-y-2">
              {state.completedDeliveries.slice(0, 5).map((order) => (
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
                  <span className="text-sm font-medium text-green-600">+$5.50</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function DriverDashboard() {
  return (
    <DriverStoreProvider>
      <DriverDashboardContent />
    </DriverStoreProvider>
  )
}
