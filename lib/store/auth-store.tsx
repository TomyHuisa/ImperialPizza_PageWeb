"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import type { AuthUser } from "@/lib/types"
import { pb } from "@/lib/data/pocketbase" // Asegúrate que esta ruta sea correcta (@/lib/pocketbase)

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthAction =
  | { type: "LOGIN"; payload: AuthUser }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOAD_FROM_STORAGE"; payload: AuthUser | null }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false }
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "LOAD_FROM_STORAGE":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}

const AuthStateContext = createContext<AuthState | null>(null)
const AuthDispatchContext = createContext<Dispatch<AuthAction> | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Sincronizar estado inicial con PocketBase al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.model) {
          const user: AuthUser = {
            id: pb.authStore.model.id,
            name: pb.authStore.model.name,
            email: pb.authStore.model.email,
            role: pb.authStore.model.role,
            points: pb.authStore.model.points || 0,
          }
          dispatch({ type: "LOAD_FROM_STORAGE", payload: user })
        } else {
          dispatch({ type: "LOAD_FROM_STORAGE", payload: null })
        }
      } catch (error) {
        dispatch({ type: "LOAD_FROM_STORAGE", payload: null })
      }
    };
    initAuth();
  }, [])

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export function useAuthState() {
  const context = useContext(AuthStateContext)
  if (!context) throw new Error("useAuthState must be used within AuthProvider")
  return context
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)
  if (!context) throw new Error("useAuthDispatch must be used within AuthProvider")
  return context
}

export function useAuth() {
  const state = useAuthState()
  const dispatch = useAuthDispatch()

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // LLAMADA REAL A POCKETBASE
      const authData = await pb.collection("users").authWithPassword(email, password)
      
      const authUser: AuthUser = {
        id: authData.record.id,
        name: authData.record.name,
        email: authData.record.email,
        role: authData.record.role,
        points: authData.record.points || 0,
      }

      dispatch({ type: "LOGIN", payload: authUser })
      return { success: true }
    } catch (error: any) {
      console.error("Login Error:", error)
      return { 
        success: false, 
        error: error.message || "Email o contraseña incorrectos" 
      }
    }
  }

  const logout = () => {
    pb.authStore.clear()
    dispatch({ type: "LOGOUT" })
  }

  return { ...state, login, logout }
}