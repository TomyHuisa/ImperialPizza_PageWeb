"use client"

import type { ReactNode } from "react"
import { AppStoreProvider } from "@/lib/store/app-store"
import { PointsProvider } from "@/lib/store/points-context"
import { AuthProvider } from "@/lib/store/auth-store"
import { StockProvider } from "@/lib/store/stock-store"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StockProvider>
        <AppStoreProvider>
          <PointsProvider>{children}</PointsProvider>
        </AppStoreProvider>
      </StockProvider>
    </AuthProvider>
  )
}
