"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import { pb } from "@/lib/data/pocketbase"

interface StockState {
  pizzaStock: Record<string, number>
  drinkStock: Record<string, number>
  dessertStock: Record<string, number>
  isLoading: boolean
}

type StockAction =
  | { type: "DECREASE_PIZZA_STOCK"; payload: { id: string; quantity: number } }
  | { type: "INCREASE_PIZZA_STOCK"; payload: { id: string; quantity: number } }
  | { type: "DECREASE_DRINK_STOCK"; payload: { id: string; quantity: number } }
  | { type: "INCREASE_DRINK_STOCK"; payload: { id: string; quantity: number } }
  | { type: "DECREASE_DESSERT_STOCK"; payload: { id: string; quantity: number } }
  | { type: "INCREASE_DESSERT_STOCK"; payload: { id: string; quantity: number } }
  | { type: "LOAD_FROM_DATABASE"; payload: Omit<StockState, "isLoading"> }
  | { type: "SET_LOADING"; payload: boolean }

// Inicializamos vacío, se llenará desde PocketBase
const initialState: StockState = {
  pizzaStock: {},
  drinkStock: {},
  dessertStock: {},
  isLoading: true,
}

function stockReducer(state: StockState, action: StockAction): StockState {
  switch (action.type) {
    case "DECREASE_PIZZA_STOCK":
      return {
        ...state,
        pizzaStock: {
          ...state.pizzaStock,
          [action.payload.id]: Math.max(0, (state.pizzaStock[action.payload.id] || 0) - action.payload.quantity),
        },
      }
    case "INCREASE_PIZZA_STOCK":
      return {
        ...state,
        pizzaStock: {
          ...state.pizzaStock,
          [action.payload.id]: (state.pizzaStock[action.payload.id] || 0) + action.payload.quantity,
        },
      }
    case "DECREASE_DRINK_STOCK":
      return {
        ...state,
        drinkStock: {
          ...state.drinkStock,
          [action.payload.id]: Math.max(0, (state.drinkStock[action.payload.id] || 0) - action.payload.quantity),
        },
      }
    case "INCREASE_DRINK_STOCK":
      return {
        ...state,
        drinkStock: {
          ...state.drinkStock,
          [action.payload.id]: (state.drinkStock[action.payload.id] || 0) + action.payload.quantity,
        },
      }
    case "DECREASE_DESSERT_STOCK":
      return {
        ...state,
        dessertStock: {
          ...state.dessertStock,
          [action.payload.id]: Math.max(0, (state.dessertStock[action.payload.id] || 0) - action.payload.quantity),
        },
      }
    case "INCREASE_DESSERT_STOCK":
      return {
        ...state,
        dessertStock: {
          ...state.dessertStock,
          [action.payload.id]: (state.dessertStock[action.payload.id] || 0) + action.payload.quantity,
        },
      }
    case "LOAD_FROM_DATABASE":
      return {
        ...state,
        pizzaStock: action.payload.pizzaStock,
        drinkStock: action.payload.drinkStock,
        dessertStock: action.payload.dessertStock,
        isLoading: false,
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

const StockStateContext = createContext<StockState | null>(null)
const StockDispatchContext = createContext<Dispatch<StockAction> | null>(null)

export function StockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stockReducer, initialState)

  useEffect(() => {
    const fetchStock = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Ejecutamos las tres llamadas en paralelo para mayor velocidad
        const [pizzas, drinks, desserts] = await Promise.all([
          pb.collection("pizzas").getFullList(),
          pb.collection("drinks").getFullList(),
          pb.collection("desserts").getFullList()
        ])

        const pizzaStockObj = Object.fromEntries(pizzas.map((p) => [p.id, p.stock]))
        const drinkStockObj = Object.fromEntries(drinks.map((d) => [d.id, d.stock]))
        const dessertStockObj = Object.fromEntries(desserts.map((d) => [d.id, d.stock]))

        dispatch({
          type: "LOAD_FROM_DATABASE",
          payload: {
            pizzaStock: pizzaStockObj,
            drinkStock: drinkStockObj,
            dessertStock: dessertStockObj,
          },
        })
      } catch (error) {
        console.error("Failed to load stock from PocketBase:", error)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    fetchStock()
  }, [])

  // Ya no usamos localStorage aquí porque PocketBase es la única fuente de verdad
  // Si necesitas sincronizar los cambios de stock devuelta a la BD, deberás hacer llamadas 
  // a pb.collection('pizzas').update(...) cuando ocurra una compra.

  return (
    <StockStateContext.Provider value={state}>
      <StockDispatchContext.Provider value={dispatch}>{children}</StockDispatchContext.Provider>
    </StockStateContext.Provider>
  )
}

export function useStockState() {
  const context = useContext(StockStateContext)
  if (!context) {
    throw new Error("useStockState must be used within StockProvider")
  }
  return context
}

export function useStockDispatch() {
  const context = useContext(StockDispatchContext)
  if (!context) {
    throw new Error("useStockDispatch must be used within StockProvider")
  }
  return context
}

export function useStock() {
  return { state: useStockState(), dispatch: useStockDispatch() }
}