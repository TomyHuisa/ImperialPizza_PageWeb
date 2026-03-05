"use client"

import { useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bike, MapPin, Phone, User, Clock, CheckCircle2, Package, Navigation } from "lucide-react"
import { useDriverStore, DriverStoreProvider } from "@/lib/store/driver-store"
import type { Order } from "@/lib/types"
import { DriverMap } from "./driver-map"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function DriverDashboardContent() {
  const { state, dispatch } = useDriverStore()
  const { toast } = useToast()
  const [earnings, setEarnings] = useState({ today: 0, deliveries: 0 })

  // Actualizar ganancias cuando se completa una entrega
  useEffect(() => {
    // Podrías cargar desde localStorage o backend
  }, [])

  const handleAcceptDelivery = useCallback(
    (orderId: string) => {
      dispatch({ type: "ACCEPT_DELIVERY", payload: orderId })
      toast({
        title: "Entrega aceptada",
        description: "Dirígete al restaurante para recoger el pedido.",
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

    toast({
      title: "Entrega completada",
      description: "¡Buen trabajo! +$5.50 ganados",
    })
  }, [state.activeDelivery, dispatch, toast])

  const handleAddressUpdate = useCallback(
    (address: string, coordinates: { lat: number; lng: number }) => {
      if (!state.activeDelivery) return
      dispatch({
        type: "UPDATE_DELIVERY_ADDRESS",
        payload: { orderId: state.activeDelivery.id, address, coordinates },
      })
      toast({
        title: "Dirección actualizada",
        description: "La ubicación de entrega ha sido actualizada.",
      })
    },
    [state.activeDelivery, dispatch, toast],
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Bike className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Panel de Repartidor</h1>
                <p className="text-sm text-muted-foreground">Imperial Pizzeria</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">En línea</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">Ganancias hoy</p>
            <p className="text-2xl font-bold text-green-600">${earnings.today.toFixed(2)}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground mb-1">Entregas</p>
            <p className="text-2xl font-bold text-foreground">{earnings.deliveries}</p>
          </motion.div>
        </div>

        {/* Entrega activa */}
        {state.activeDelivery ? (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-secondary" />
              Entrega activa
            </h2>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="driver-map-container h-[400px] rounded-xl overflow-hidden border border-border">
                <DriverMap
                  driverLocation={state.currentLocation}
                  deliveryLocation={state.activeDelivery.coordinates}
                  deliveryAddress={state.activeDelivery.deliveryAddress}
                  onAddressUpdate={handleAddressUpdate}
                  isEditable={true}
                />
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-bold text-primary">#{state.activeDelivery.id.slice(-6)}</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary-foreground">
                    En progreso
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{state.activeDelivery.customerName}</p>
                      <p className="text-sm text-muted-foreground">Cliente</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{state.activeDelivery.customerPhone}</p>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{state.activeDelivery.deliveryAddress}</p>
                      <p className="text-sm text-muted-foreground">Dirección de entrega</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Productos</p>
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
                    Marcar como entregado
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Pedidos disponibles */
          <div>
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Entregas disponibles
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
                <h3 className="font-medium text-foreground mb-1">No hay entregas disponibles</h3>
                <p className="text-sm text-muted-foreground">Las nuevas entregas aparecerán aquí</p>
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
                          {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                        </span>
                        <span className="font-bold text-foreground">${order.totalPrice.toFixed(2)}</span>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => handleAcceptDelivery(order.id)}
                          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Aceptar entrega
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Entregas completadas */}
        {state.completedDeliveries.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Completadas hoy
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