"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import type { Order, OrderStatus } from "@/lib/types"

type WSMessage =
  | { type: "order-update"; payload: Order }
  | { type: "new-order"; payload: Order }
  | { type: "driver-location"; payload: { orderId: string; lat: number; lng: number } }
  | { type: "order-ready"; payload: { orderId: string } }
  | { type: "takeaway-ready"; payload: { orderId: string; phone: string } }

type WSCallback = (message: WSMessage) => void

// Mock WebSocket simulation
class MockWebSocket {
  private listeners: Map<string, Set<WSCallback>> = new Map()
  private intervalIds: NodeJS.Timeout[] = []

  subscribe(event: string, callback: WSCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  emit(event: string, message: WSMessage) {
    this.listeners.get(event)?.forEach((cb) => cb(message))
    this.listeners.get("*")?.forEach((cb) => cb(message))
  }

  startDriverSimulation(orderId: string, startLat: number, startLng: number, endLat: number, endLng: number) {
    let progress = 0
    const steps = 20
    const intervalId = setInterval(() => {
      progress++
      const lat = startLat + (endLat - startLat) * (progress / steps)
      const lng = startLng + (endLng - startLng) * (progress / steps)

      this.emit("driver-location", {
        type: "driver-location",
        payload: { orderId, lat, lng },
      })

      if (progress >= steps) {
        clearInterval(intervalId)
        this.emit("order-update", {
          type: "order-update",
          payload: {
            id: orderId,
            status: "delivered",
          } as Order,
        })
      }
    }, 2000)
    this.intervalIds.push(intervalId)
  }

  cleanup() {
    this.intervalIds.forEach((id) => clearInterval(id))
    this.intervalIds = []
  }
}

const mockWS = new MockWebSocket()

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const callbacksRef = useRef<Map<string, WSCallback>>(new Map())

  useEffect(() => {
    const timeout = setTimeout(() => setIsConnected(true), 500)
    return () => {
      clearTimeout(timeout)
      mockWS.cleanup()
    }
  }, [])

  const subscribe = useCallback((event: string, callback: WSCallback) => {
    callbacksRef.current.set(event, callback)
    return mockWS.subscribe(event, callback)
  }, [])

  const emit = useCallback((event: string, data: WSMessage) => {
    mockWS.emit(event, data)
  }, [])

  const simulateOrderProgress = useCallback((order: Order, isTakeaway = false) => {
    const deliveryStatuses: OrderStatus[] = ["confirmed", "preparing", "ready", "out-for-delivery", "delivered"]
    const takeawayStatuses: OrderStatus[] = ["confirmed", "preparing", "ready"]

    const statuses = isTakeaway ? takeawayStatuses : deliveryStatuses
    let currentIndex = 0

    const progressOrder = () => {
      if (currentIndex >= statuses.length) return

      const updatedOrder: Order = {
        ...order,
        status: statuses[currentIndex],
        updatedAt: new Date().toISOString(),
      }

      mockWS.emit("order-update", {
        type: "order-update",
        payload: updatedOrder,
      })

      // For takeaway orders, emit notification when ready
      if (isTakeaway && statuses[currentIndex] === "ready") {
        mockWS.emit("takeaway-ready", {
          type: "takeaway-ready",
          payload: { orderId: order.id, phone: order.customerPhone },
        })
        return // Stop progression for takeaway - customer picks up
      }

      if (!isTakeaway && statuses[currentIndex] === "out-for-delivery") {
        mockWS.startDriverSimulation(
          order.id,
          40.7128 + Math.random() * 0.01,
          -74.006 + Math.random() * 0.01,
          order.coordinates.lat,
          order.coordinates.lng,
        )
      }

      currentIndex++
      if (currentIndex < statuses.length) {
        setTimeout(progressOrder, 5000 + Math.random() * 3000)
      }
    }

    setTimeout(progressOrder, 2000)
  }, [])

  return { isConnected, subscribe, emit, simulateOrderProgress }
}

export { mockWS }
