"use client"

import type React from "react"

import { memo, useState } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, ChefHat, User, MapPin } from "lucide-react"
import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface KitchenOrderCardProps {
  order: Order
  onMarkReady: (orderId: string) => void
  style?: React.CSSProperties
}

export const KitchenOrderCard = memo(function KitchenOrderCard({ order, onMarkReady, style }: KitchenOrderCardProps) {
  const [isMarking, setIsMarking] = useState(false)

  const handleMarkReady = async () => {
    setIsMarking(true)
    // Optimistic UI update
    onMarkReady(order.id)
  }

  const timeElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)

  const isUrgent = timeElapsed > 15

  return (
    <motion.div
      layout
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      style={style}
      className={cn(
        "bg-card border rounded-xl p-4 shadow-sm",
        isUrgent ? "border-destructive/50 bg-destructive/5" : "border-border",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-primary">#{order.id.slice(-6)}</span>
          {isUrgent && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive">
              Urgent
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{timeElapsed}m ago</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>{order.customerName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground truncate">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{order.deliveryAddress}</span>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
            <span className="font-bold text-primary min-w-[1.5rem]">{item.quantity}x</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{item.pizza.name}</p>
              {item.selectedToppings.length > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  + {item.selectedToppings.map((t) => t.name).join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleMarkReady}
          disabled={isMarking}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isMarking ? (
            <>
              <ChefHat className="h-4 w-4 mr-2 animate-pulse" />
              Marking...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Ready
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
})
