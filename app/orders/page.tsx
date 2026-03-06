"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Package, Pizza } from "lucide-react"
import { useAuth } from "@/lib/store/auth-store"
import { pb } from "@/lib/data/pocketbase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {

  const { user } = useAuth()

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchMyOrders() {

      if (!user?.id) return

      try {

        const records = await pb.collection("orders").getFullList({
          filter: `users = "${user.id}"`,
          sort: "-created",
        })

        setOrders(records)

      } catch (error) {

        console.error("Error cargando pedidos:", error)

      } finally {

        setLoading(false)

      }

    }

    fetchMyOrders()

  }, [user])

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">

      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif text-4xl font-bold text-foreground">
          Mis Pedidos
        </h1>
        <p className="text-muted-foreground mt-2">
          Historial personal de {user?.name}
        </p>
      </div>

      {loading ? (

        <div className="space-y-4">
          {[1,2,3].map(i =>
            <Skeleton key={i} className="h-24 w-full rounded-xl"/>
          )}
        </div>

      ) : orders.length > 0 ? (

        <div className="space-y-4">

          {orders.map((order) => (

            <Card key={order.id} className="border-border/50">

              <CardContent className="p-6 flex justify-between items-center">

                <div className="flex items-center gap-4">

                  <Package className="text-primary h-6 w-6"/>

                  <div>
                    <p className="font-bold">
                      Pedido #{order.id.slice(-6).toUpperCase()}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <div className="text-right">

                  <p className="font-bold text-primary">
                    ${order.totalPrice}
                  </p>

                  <p className="text-xs uppercase tracking-widest font-semibold">
                    {order.status}
                  </p>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      ) : (

        <motion.div
          initial={{opacity:0}}
          animate={{opacity:1}}
          className="text-center py-20 border-2 border-dashed border-border rounded-3xl"
        >

          <Pizza className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4"/>

          <h2 className="text-xl font-medium text-muted-foreground">
            No tienes pedidos registrados
          </h2>

          <Button className="mt-6" asChild>
            <a href="/menu">Ir al Menú</a>
          </Button>

        </motion.div>

      )}

    </div>
  )
}