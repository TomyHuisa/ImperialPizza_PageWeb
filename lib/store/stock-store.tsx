"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import { pizzas as initialPizzas, drinks as initialDrinks, desserts as initialDesserts } from "@/lib/data/pizzas"

interface StockState {
  pizzaStock: Record<string, number>
  drinkStock: Record<string, number>
  dessertStock: Record<string, number>
}

type StockAction =
  | { type: "DECREASE_PIZZA_STOCK"; payload: { id: string; quantity: number } }
  | { type: "INCREASE_PIZZA_STOCK"; payload: { id: string; quantity: number } }
  | { type: "DECREASE_DRINK_STOCK"; payload: { id: string; quantity: number } }
  | { type: "INCREASE_DRINK_STOCK"; payload: { id: string; quantity: number } }
  | { type: "DECREASE_DESSERT_STOCK"; payload: { id: string; quantity: number } }
  | { type: "INCREASE_DESSERT_STOCK"; payload: { id: string; quantity: number } }
  | { type: "LOAD_FROM_STORAGE"; payload: StockState }

const getInitialState = (): StockState => ({
  pizzaStock: Object.fromEntries(initialPizzas.map((p) => [p.id, p.stock])),
  drinkStock: Object.fromEntries(initialDrinks.map((d) => [d.id, d.stock])),
  dessertStock: Object.fromEntries(initialDesserts.map((d) => [d.id, d.stock])),
})

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
    case "LOAD_FROM_STORAGE":
      return action.payload
    default:
      return state
  }
}

const StockStateContext = createContext<StockState | null>(null)
const StockDispatchContext = createContext<Dispatch<StockAction> | null>(null)

export function StockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stockReducer, getInitialState())

  useEffect(() => {
    const saved = localStorage.getItem("imperial-stock")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: "LOAD_FROM_STORAGE", payload: parsed })
      } catch {
        // Use initial state
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("imperial-stock", JSON.stringify(state))
  }, [state])

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
