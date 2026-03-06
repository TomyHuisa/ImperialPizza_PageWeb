"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react"

import type { CartItem, Order, Notification, User } from "@/lib/types"
import { pb } from "@/lib/data/pocketbase"

interface AppState {
  user: User | null
  cart: CartItem[]
  orders: Order[]
  activeOrder: Order | null
  notifications: Notification[]
  isLoading: boolean
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_CART_ITEM"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_CART_ITEM_POINTS"; payload: { id: string; pointsUsed: number } }
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

const initialState: AppState = {
  user: null,
  cart: [],
  orders: [],
  activeOrder: null,
  notifications: [],
  isLoading: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case "SET_USER":
      return { ...state, user: action.payload }

    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, action.payload] }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }

    case "UPDATE_CART_ITEM_POINTS":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, pointsUsed: action.payload.pointsUsed }
            : item
        ),
      }

    case "CLEAR_CART":
      return { ...state, cart: [] }

    case "SET_ORDERS":
      return { ...state, orders: action.payload }

    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] }

    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
        activeOrder:
          state.activeOrder?.id === action.payload.id
            ? action.payload
            : state.activeOrder,
      }

    case "SET_ACTIVE_ORDER":
      return { ...state, activeOrder: action.payload }

    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.payload, ...state.notifications] }

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "ADD_POINTS":
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          points: state.user.points + action.payload,
        },
      }

    case "USE_POINTS":
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          points: Math.max(0, state.user.points - action.payload),
        },
      }

    case "LOAD_FROM_STORAGE":
      return { ...state, ...action.payload }

    default:
      return state
  }
}

interface AppStoreContextType {
  state: AppState
  dispatch: Dispatch<AppAction>
  createOrder: (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ) => Promise<any>
}

const AppStoreContext = createContext<AppStoreContextType | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {

  const [state, dispatch] = useReducer(appReducer, initialState)

  // cargar carrito local
  useEffect(() => {

    const savedCart = localStorage.getItem("imperial-pizzeria-cart")

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)

        dispatch({
          type: "LOAD_FROM_STORAGE",
          payload: { cart: parsedCart },
        })
      } catch (e) {
        console.error("Error cargando carrito:", e)
      }
    }

  }, [])

  // guardar carrito
  useEffect(() => {

    localStorage.setItem(
      "imperial-pizzeria-cart",
      JSON.stringify(state.cart)
    )

  }, [state.cart])

  // cargar usuario
  useEffect(() => {

    if (pb.authStore.model) {

      const user: User = {
        id: pb.authStore.model.id,
        name: pb.authStore.model.name,
        email: pb.authStore.model.email,
        phone: pb.authStore.model.phone,
        role: pb.authStore.model.role,
        points: pb.authStore.model.points,
      }

      dispatch({ type: "SET_USER", payload: user })
    }

  }, [])

  // crear pedido
  const createOrder = async (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ) => {

    dispatch({ type: "SET_LOADING", payload: true })

    try {

      if (orderData.pointsUsed > 0 && state.user) {

        await pb.collection("users").update(state.user.id, {
          points: (state.user.points || 0) - orderData.pointsUsed,
        })

        dispatch({
          type: "USE_POINTS",
          payload: orderData.pointsUsed,
        })
      }

      const record = await pb.collection("orders").create({
        status: "pending",
        orderMode: orderData.orderMode,
        users: state.user?.id,
        items: JSON.stringify(orderData.items),
        totalPrice: orderData.totalPrice,
        deliveryAddress: orderData.deliveryAddress,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        coordinates: JSON.stringify(orderData.coordinates),
        paymentMethod: orderData.paymentMethod,
        estimatedDelivery: orderData.estimatedDelivery,
      })

      if (orderData.pointsEarned > 0 && state.user) {

        await pb.collection("users").update(state.user.id, {
          points: (state.user.points || 0) + orderData.pointsEarned,
        })

        dispatch({
          type: "ADD_POINTS",
          payload: orderData.pointsEarned,
        })
      }

      const newOrder = {
        ...orderData,
        id: record.id,
        createdAt: record.created,
        updatedAt: record.updated,
      } as Order

      dispatch({ type: "ADD_ORDER", payload: newOrder })
      dispatch({ type: "SET_ACTIVE_ORDER", payload: newOrder })
      dispatch({ type: "CLEAR_CART" })

      return { success: true, order: newOrder }

    } catch (error) {

      console.error("Error creando pedido:", error)

      return { success: false, error }

    } finally {

      dispatch({ type: "SET_LOADING", payload: false })

    }
  }

  return (
    <AppStoreContext.Provider value={{ state, dispatch, createOrder }}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {

  const context = useContext(AppStoreContext)

  if (!context)
    throw new Error("useAppStore must be used within AppStoreProvider")

  return context
}

export function useAppState() {

  const context = useContext(AppStoreContext)

  if (!context)
    throw new Error("useAppState must be used within AppStoreProvider")

  return context.state
}

export function useAppDispatch() {

  const context = useContext(AppStoreContext)

  if (!context)
    throw new Error("useAppDispatch must be used within AppStoreProvider")

  return context.dispatch
}