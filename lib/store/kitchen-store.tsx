"use client"

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react"
import type { Order } from "@/lib/types"

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
    case "ADD_ORDER":
      // Add to queue sorted by timestamp
      const newQueue = [...state.orderQueue, action.payload].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      return { ...state, orderQueue: newQueue }

    case "MARK_READY": {
      const order = state.orderQueue.find((o) => o.id === action.payload)
      if (!order) return state
      return {
        orderQueue: state.orderQueue.filter((o) => o.id !== action.payload),
        completedOrders: [{ ...order, status: "ready" }, ...state.completedOrders],
      }
    }

    case "SET_ORDERS":
      return {
        ...state,
        orderQueue: action.payload.filter((o) => o.status === "preparing" || o.status === "confirmed"),
      }

    default:
      return state
  }
}

const KitchenStateContext = createContext<KitchenState | null>(null)
const KitchenDispatchContext = createContext<Dispatch<KitchenAction> | null>(null)

export function KitchenStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kitchenReducer, initialState)

  return (
    <KitchenStateContext.Provider value={state}>
      <KitchenDispatchContext.Provider value={dispatch}>{children}</KitchenDispatchContext.Provider>
    </KitchenStateContext.Provider>
  )
}

export function useKitchenState() {
  const context = useContext(KitchenStateContext)
  if (!context) {
    throw new Error("useKitchenState must be used within KitchenStoreProvider")
  }
  return context
}

export function useKitchenDispatch() {
  const context = useContext(KitchenDispatchContext)
  if (!context) {
    throw new Error("useKitchenDispatch must be used within KitchenStoreProvider")
  }
  return context
}

export function useKitchenStore() {
  return { state: useKitchenState(), dispatch: useKitchenDispatch() }
}
