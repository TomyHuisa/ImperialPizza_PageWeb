"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from "react"
import type { AuthUser } from "@/lib/types"
import { demoUsers } from "@/lib/data/users"

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

  useEffect(() => {
    const savedUser = localStorage.getItem("imperial-auth-user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: "LOAD_FROM_STORAGE", payload: user })
      } catch {
        dispatch({ type: "LOAD_FROM_STORAGE", payload: null })
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("imperial-auth-user", JSON.stringify(state.user))
    } else if (!state.isLoading) {
      localStorage.removeItem("imperial-auth-user")
    }
  }, [state.user, state.isLoading])

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>{children}</AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export function useAuthState() {
  const context = useContext(AuthStateContext)
  if (!context) {
    throw new Error("useAuthState must be used within AuthProvider")
  }
  return context
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext)
  if (!context) {
    throw new Error("useAuthDispatch must be used within AuthProvider")
  }
  return context
}

export function useAuth() {
  const state = useAuthState()
  const dispatch = useAuthDispatch()

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const user = demoUsers.find((u) => u.email === email && u.password === password)
    if (user) {
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      }
      dispatch({ type: "LOGIN", payload: authUser })
      return { success: true }
    }
    return { success: false, error: "Invalid email or password" }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  return { ...state, login, logout }
}
