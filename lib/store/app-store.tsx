"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import type { CartItem, Order, Notification, User } from "@/lib/types"

// State Interface
interface AppState {
  user: User | null
  cart: CartItem[]
  orders: Order[]
  activeOrder: Order | null
  notifications: Notification[]
  isLoading: boolean
}

// Action Types
type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_ITEM"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "SET_ACTIVE_ORDER"; payload: Order | null }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_POINTS"; payload: number }
  | { type: "USE_POINTS"; payload: number }
  | { type: "LOAD_FROM_STORAGE"; payload: Partial<AppState> }

// Initial State
const initialState: AppState = {
  user: {
    id: "customer-1",
    name: "Guest",
    email: "guest@imperial.pizza",
    phone: "",
    role: "customer",
    points: 250,
  },
  cart: [],
  orders: [],
  activeOrder: null,
  notifications: [],
  isLoading: false,
}

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }

    case "ADD_TO_CART": {
      const existingIndex = state.cart.findIndex(
        (item) =>
          item.pizza.id === action.payload.pizza.id &&
          JSON.stringify(item.selectedToppings) === JSON.stringify(action.payload.selectedToppings),
      )
      if (existingIndex > -1) {
        const newCart = [...state.cart]
        newCart[existingIndex].quantity += action.payload.quantity
        newCart[existingIndex].totalPrice =
          (newCart[existingIndex].pizza.price +
            newCart[existingIndex].selectedToppings.reduce((sum, t) => sum + t.price, 0)) *
          newCart[existingIndex].quantity
        return { ...state, cart: newCart }
      }
      return { ...state, cart: [...state.cart, action.payload] }
    }

    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) }

    case "UPDATE_CART_ITEM": {
      const newCart = state.cart.map((item) => {
        if (item.id === action.payload.id) {
          const newQuantity = action.payload.quantity
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: (item.pizza.price + item.selectedToppings.reduce((sum, t) => sum + t.price, 0)) * newQuantity,
          }
        }
        return item
      })
      return { ...state, cart: newCart }
    }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "SET_ORDERS":
      return { ...state, orders: action.payload }

    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] }

    case "UPDATE_ORDER": {
      const updatedOrders = state.orders.map((order) => (order.id === action.payload.id ? action.payload : order))
      const updatedActiveOrder = state.activeOrder?.id === action.payload.id ? action.payload : state.activeOrder
      return { ...state, orders: updatedOrders, activeOrder: updatedActiveOrder }
    }

    case "SET_ACTIVE_ORDER":
      return { ...state, activeOrder: action.payload }

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [...state.notifications, action.payload] }

    case "REMOVE_NOTIFICATION":
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.payload) }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "ADD_POINTS":
      if (!state.user) return state
      return { ...state, user: { ...state.user, points: state.user.points + action.payload } }

    case "USE_POINTS":
      if (!state.user) return state
      return { ...state, user: { ...state.user, points: Math.max(0, state.user.points - action.payload) } }

    case "LOAD_FROM_STORAGE":
      return { ...state, ...action.payload }

    default:
      return state
  }
}

// Context
const AppStateContext = createContext<AppState | null>(null)
const AppDispatchContext = createContext<Dispatch<AppAction> | null>(null)

// Provider
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("imperial-pizzeria-state")
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        dispatch({
          type: "LOAD_FROM_STORAGE",
          payload: {
            user: parsed.user || initialState.user,
            cart: parsed.cart || [],
            activeOrder: parsed.activeOrder || null,
          },
        })
      } catch (e) {
        console.error("Failed to load state from localStorage:", e)
      }
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      cart: state.cart,
      activeOrder: state.activeOrder,
    }
    localStorage.setItem("imperial-pizzeria-state", JSON.stringify(stateToSave))
  }, [state.user, state.cart, state.activeOrder])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

// Hooks
export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within AppStoreProvider")
  }
  return context
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext)
  if (!context) {
    throw new Error("useAppDispatch must be used within AppStoreProvider")
  }
  return context
}

// Helper hook to get both
export function useAppStore() {
  return { state: useAppState(), dispatch: useAppDispatch() }
}
