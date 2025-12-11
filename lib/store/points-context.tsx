"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

interface PointsContextType {
  points: number
  addPoints: (amount: number) => void
  usePoints: (amount: number) => boolean
  pointsHistory: { amount: number; type: "earned" | "spent"; timestamp: string }[]
}

const PointsContext = createContext<PointsContextType | null>(null)

export function PointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(250)
  const [pointsHistory, setPointsHistory] = useState<{ amount: number; type: "earned" | "spent"; timestamp: string }[]>(
    [],
  )

  useEffect(() => {
    const savedPoints = localStorage.getItem("imperial-points")
    const savedHistory = localStorage.getItem("imperial-points-history")
    if (savedPoints) {
      setPoints(Number.parseInt(savedPoints, 10))
    }
    if (savedHistory) {
      setPointsHistory(JSON.parse(savedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("imperial-points", points.toString())
    localStorage.setItem("imperial-points-history", JSON.stringify(pointsHistory))
  }, [points, pointsHistory])

  const addPoints = useCallback((amount: number) => {
    setPoints((prev) => prev + amount)
    setPointsHistory((prev) => [
      ...prev,
      {
        amount,
        type: "earned",
        timestamp: new Date().toISOString(),
      },
    ])
  }, [])

  const usePointsFunc = useCallback(
    (amount: number): boolean => {
      if (points >= amount) {
        setPoints((prev) => prev - amount)
        setPointsHistory((prev) => [
          ...prev,
          {
            amount,
            type: "spent",
            timestamp: new Date().toISOString(),
          },
        ])
        return true
      }
      return false
    },
    [points],
  )

  return (
    <PointsContext.Provider value={{ points, addPoints, usePoints: usePointsFunc, pointsHistory }}>
      {children}
    </PointsContext.Provider>
  )
}

export function usePoints() {
  const context = useContext(PointsContext)
  if (!context) {
    throw new Error("usePoints must be used within PointsProvider")
  }
  return context
}
