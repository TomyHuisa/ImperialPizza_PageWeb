"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChefHat, Clock, CheckCircle2, Bell, Store, Bike } from "lucide-react"
import { useKitchenStore, KitchenStoreProvider } from "@/lib/store/kitchen-store"
import type { Order } from "@/lib/types"
import { KitchenOrderCard } from "./kitchen-order-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

function KitchenDashboardContent() {
  const { state, dispatch } = useKitchenStore()
  const { toast } = useToast()
  const [stats, setStats] = useState({ pending: 0, completed: 0, avgTime: 0 })

  useEffect(() => {
    setStats({
      pending: state.orderQueue.length,
      completed: state.completedOrders.length,
      avgTime: state.completedOrders.length > 0 ? 12 : 0,
    })
  }, [state.orderQueue, state.completedOrders])

  const handleMarkReady = useCallback(
    (orderId: string) => {
      dispatch({ type: "MARK_READY", payload: orderId })
      toast({
        title: "Pedido listo",
        description: `El pedido #${orderId.slice(-6)} está listo.`,
      })
    },
    [dispatch, toast],
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">Cocina</h1>
                <p className="text-sm text-muted-foreground">Imperial Pizzeria</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Estadísticas */}
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
                <p className="text-sm text-muted-foreground">Pendientes</p>
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
                <p className="text-sm text-muted-foreground">Completados hoy</p>
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
                <p className="text-sm text-muted-foreground">Tiempo promedio</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cola de pedidos */}
        <div>
          <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pedidos pendientes
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
              <h3 className="font-medium text-foreground mb-1">No hay pedidos pendientes</h3>
              <p className="text-sm text-muted-foreground">Los nuevos pedidos aparecerán aquí</p>
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

        {/* Pedidos completados */}
        {state.completedOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Recientemente completados
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
                    {order.orderMode === "takeaway" ? (
                      <Store className="h-4 w-4 text-blue-500 ml-2" />
                    ) : (
                      <Bike className="h-4 w-4 text-purple-500 ml-2" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {order.orderMode === "takeaway" ? "Listo para recoger" : "Listo para repartir"}
                  </span>
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