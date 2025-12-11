"use client"

import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from "react"
import type { Order } from "@/lib/types"

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
  | {
      type: "UPDATE_DELIVERY_ADDRESS"
      payload: { orderId: string; address: string; coordinates: { lat: number; lng: number } }
    }

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

    case "ADD_AVAILABLE_ORDER":
      return { ...state, availableOrders: [...state.availableOrders, action.payload] }

    case "ACCEPT_DELIVERY": {
      const order = state.availableOrders.find((o) => o.id === action.payload)
      if (!order) return state
      return {
        ...state,
        availableOrders: state.availableOrders.filter((o) => o.id !== action.payload),
        activeDelivery: { ...order, status: "out-for-delivery" },
      }
    }

    case "COMPLETE_DELIVERY": {
      if (!state.activeDelivery || state.activeDelivery.id !== action.payload) return state
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
      return {
        ...state,
        activeDelivery: {
          ...state.activeDelivery,
          deliveryAddress: action.payload.address,
          coordinates: action.payload.coordinates,
        },
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

  return (
    <DriverStateContext.Provider value={state}>
      <DriverDispatchContext.Provider value={dispatch}>{children}</DriverDispatchContext.Provider>
    </DriverStateContext.Provider>
  )
}

export function useDriverState() {
  const context = useContext(DriverStateContext)
  if (!context) {
    throw new Error("useDriverState must be used within DriverStoreProvider")
  }
  return context
}

export function useDriverDispatch() {
  const context = useContext(DriverDispatchContext)
  if (!context) {
    throw new Error("useDriverDispatch must be used within DriverStoreProvider")
  }
  return context
}

export function useDriverStore() {
  return { state: useDriverState(), dispatch: useDriverDispatch() }
}
