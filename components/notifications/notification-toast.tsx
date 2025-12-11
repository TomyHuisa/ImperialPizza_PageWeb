"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/lib/store/app-store"
import { cn } from "@/lib/utils"

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const colors = {
  success: "bg-green-500/10 border-green-500/30 text-green-700",
  error: "bg-destructive/10 border-destructive/30 text-destructive",
  info: "bg-blue-500/10 border-blue-500/30 text-blue-700",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700",
}

export function NotificationToast() {
  const { state, dispatch } = useAppStore()

  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: state.notifications[0].id })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.notifications, dispatch])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {state.notifications.map((notification) => {
          const Icon = icons[notification.type]
          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ x: 50, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm",
                colors[notification.type],
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-sm opacity-80">{notification.message}</p>
              </div>
              <button
                onClick={() => dispatch({ type: "REMOVE_NOTIFICATION", payload: notification.id })}
                className="flex-shrink-0 hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
