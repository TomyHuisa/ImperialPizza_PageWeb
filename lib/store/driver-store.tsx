"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import type { Order } from "@/lib/types"
import { pb } from "@/lib/data/pocketbase"

interface DriverState {
  availableOrders: Order[]
  activeDelivery: Order | null
  completedDeliveries: Order[]
  currentLocation: { lat: number; lng: number }
}

type DriverAction =
  | { type: "SET_AVAILABLE_ORDERS"; payload: Order[] }
  | { type: "ADD_AVAILABLE_ORDER"; payload: Order }
  | { type: "ACCEPT_DELIVERY"; payload: string }
  | { type: "COMPLETE_DELIVERY"; payload: string }
  | { type: "UPDATE_LOCATION"; payload: { lat: number; lng: number } }
  | { type: "UPDATE_DELIVERY_ADDRESS"; payload: { orderId: string; address: string; coordinates: { lat: number; lng: number } } }

const initialState: DriverState = {
  availableOrders: [],
  activeDelivery: null,
  completedDeliveries: [],
  currentLocation: { lat: 40.7128, lng: -74.006 },
}

function driverReducer(state: DriverState, action: DriverAction): DriverState {
  switch (action.type) {
    case "SET_AVAILABLE_ORDERS":
      return { ...state, availableOrders: action.payload }
    case "ADD_AVAILABLE_ORDER": {
      if (state.availableOrders.some(o => o.id === action.payload.id)) return state
      return { ...state, availableOrders: [...state.availableOrders, action.payload] }
    }
    case "ACCEPT_DELIVERY": {
      const order = state.availableOrders.find((o) => o.id === action.payload)
      if (!order) return state
      pb.collection("orders").update(order.id, { status: "out-for-delivery", driverId: pb.authStore.model?.id })
      return {
        ...state,
        availableOrders: state.availableOrders.filter((o) => o.id !== action.payload),
        activeDelivery: { ...order, status: "out-for-delivery" },
      }
    }
    case "COMPLETE_DELIVERY": {
      if (!state.activeDelivery || state.activeDelivery.id !== action.payload) return state
      pb.collection("orders").update(state.activeDelivery.id, { status: "delivered" })
      return {
        ...state,
        activeDelivery: null,
        completedDeliveries: [{ ...state.activeDelivery, status: "delivered" }, ...state.completedDeliveries],
      }
    }
    case "UPDATE_LOCATION":
      return { ...state, currentLocation: action.payload }
    case "UPDATE_DELIVERY_ADDRESS": {
      if (!state.activeDelivery || state.activeDelivery.id !== action.payload.orderId) return state
      pb.collection("orders").update(action.payload.orderId, {
        deliveryAddress: action.payload.address,
        coordinates: JSON.stringify(action.payload.coordinates),
      })
      return {
        ...state,
        activeDelivery: { ...state.activeDelivery, deliveryAddress: action.payload.address, coordinates: action.payload.coordinates },
      }
    }
    default:
      return state
  }
}

const DriverStateContext = createContext<DriverState | null>(null)
const DriverDispatchContext = createContext<Dispatch<DriverAction> | null>(null)

export function DriverStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(driverReducer, initialState)

  useEffect(() => {
    const loadAvailable = async () => {
      try {
        const orders = await pb.collection("orders").getFullList({
          filter: 'status = "ready" && orderMode = "delivery"',
        })
        dispatch({ type: "SET_AVAILABLE_ORDERS", payload: orders as Order[] })
      } catch (error) {
        console.error("Error loading available orders:", error)
      }
    }
    loadAvailable()

    let unsubscribe: (() => void) | undefined
    let intervalId: NodeJS.Timeout | undefined

    const setupRealtime = async () => {
      try {
        if (!pb.authStore.isValid) {
          throw new Error("No autenticado")
        }
        unsubscribe = await pb.collection("orders").subscribe("*", (e) => {
          if (e.action === "update") {
            const record = e.record as Order
            if (record.status === "ready" && record.orderMode === "delivery") {
              dispatch({ type: "ADD_AVAILABLE_ORDER", payload: record })
            } else if (record.status === "out-for-delivery" || record.status === "delivered") {
              // Recargar lista de disponibles
              loadAvailable()
            }
          }
        })
      } catch (error) {
        console.warn("Error en suscripción de driver, usando polling:", error)
        intervalId = setInterval(loadAvailable, 5000)
      }
    }

    setupRealtime()

    return () => {
      if (unsubscribe) unsubscribe()
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <DriverStateContext.Provider value={state}>
      <DriverDispatchContext.Provider value={dispatch}>{children}</DriverDispatchContext.Provider>
    </DriverStateContext.Provider>
  )
}

export function useDriverState() {
  const context = useContext(DriverStateContext)
  if (!context) throw new Error("useDriverState must be used within DriverStoreProvider")
  return context
}

export function useDriverDispatch() {
  const context = useContext(DriverDispatchContext)
  if (!context) throw new Error("useDriverDispatch must be used within DriverStoreProvider")
  return context
}

export function useDriverStore() {
  return { state: useDriverState(), dispatch: useDriverDispatch() }
}