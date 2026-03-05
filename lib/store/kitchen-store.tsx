"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import type { Order } from "@/lib/types"
import { pb } from "@/lib/data/pocketbase"

interface KitchenState {
  orderQueue: Order[]
  completedOrders: Order[]
}

type KitchenAction =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "MARK_READY"; payload: string }
  | { type: "SET_ORDERS"; payload: Order[] }

const initialState: KitchenState = {
  orderQueue: [],
  completedOrders: [],
}

function kitchenReducer(state: KitchenState, action: KitchenAction): KitchenState {
  switch (action.type) {
    case "ADD_ORDER": {
      // Evitar duplicados
      if (state.orderQueue.some(o => o.id === action.payload.id)) return state
      return {
        ...state,
        orderQueue: [...state.orderQueue, action.payload].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      }
    }
    case "MARK_READY": {
      const order = state.orderQueue.find((o) => o.id === action.payload)
      if (!order) return state
      // Actualizar en BD
      pb.collection("orders").update(order.id, { status: "ready" })
      return {
        orderQueue: state.orderQueue.filter((o) => o.id !== action.payload),
        completedOrders: [{ ...order, status: "ready" }, ...state.completedOrders],
      }
    }
    case "SET_ORDERS":
      return {
        ...state,
        orderQueue: action.payload.filter((o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing"),
        completedOrders: action.payload.filter((o) => o.status === "ready" || o.status === "delivered"),
      }
    default:
      return state
  }
}

const KitchenStateContext = createContext<KitchenState | null>(null)
const KitchenDispatchContext = createContext<Dispatch<KitchenAction> | null>(null)

export function KitchenStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kitchenReducer, initialState)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await pb.collection("orders").getFullList({
          filter: 'status != "delivered"',
          sort: "-created",
        })
        dispatch({ type: "SET_ORDERS", payload: orders as Order[] })
      } catch (error) {
        console.error("Error loading orders:", error)
      }
    }
    loadOrders()

    let unsubscribe: (() => void) | undefined
    let intervalId: NodeJS.Timeout | undefined

    const setupRealtime = async () => {
      try {
        if (!pb.authStore.isValid) {
          throw new Error("No autenticado")
        }
        unsubscribe = await pb.collection("orders").subscribe("*", (e) => {
          if (e.action === "create") {
            if (e.record.status !== "delivered") {
              dispatch({ type: "ADD_ORDER", payload: e.record as Order })
            }
          } else if (e.action === "update") {
            const record = e.record as Order
            if (record.status === "ready") {
              dispatch({ type: "MARK_READY", payload: record.id })
            } else if (record.status === "delivered") {
              // Recargar para mantener consistencia
              loadOrders()
            }
          }
        })
      } catch (error) {
        console.warn("Error en suscripción de cocina, usando polling:", error)
        intervalId = setInterval(loadOrders, 5000)
      }
    }

    setupRealtime()

    return () => {
      if (unsubscribe) unsubscribe()
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return (
    <KitchenStateContext.Provider value={state}>
      <KitchenDispatchContext.Provider value={dispatch}>{children}</KitchenDispatchContext.Provider>
    </KitchenStateContext.Provider>
  )
}

export function useKitchenState() {
  const context = useContext(KitchenStateContext)
  if (!context) throw new Error("useKitchenState must be used within KitchenStoreProvider")
  return context
}

export function useKitchenDispatch() {
  const context = useContext(KitchenDispatchContext)
  if (!context) throw new Error("useKitchenDispatch must be used within KitchenStoreProvider")
  return context
}

export function useKitchenStore() {
  return { state: useKitchenState(), dispatch: useKitchenDispatch() }
}