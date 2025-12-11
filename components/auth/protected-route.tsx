"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"
import type { User } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: User["role"][]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [currentRole, setCurrentRole] = useState<User["role"] | null>(null)

  useEffect(() => {
    // Check role from localStorage or URL params for demo purposes
    const urlParams = new URLSearchParams(window.location.search)
    const roleFromUrl = urlParams.get("role") as User["role"] | null
    const savedRole = localStorage.getItem("imperial-user-role") as User["role"] | null

    const role = roleFromUrl || savedRole || "customer"

    if (roleFromUrl) {
      localStorage.setItem("imperial-user-role", roleFromUrl)
    }

    setCurrentRole(role)
    setIsAuthorized(allowedRoles.includes(role))
  }, [allowedRoles])

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Access Restricted</h1>
          <p className="text-muted-foreground mb-6">
            This area is restricted to authorized staff only.
            {currentRole && (
              <span className="block mt-2 text-sm">
                Your current role: <span className="font-medium capitalize">{currentRole}</span>
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            Access with: <code className="bg-muted px-1 py-0.5 rounded">?role=kitchen</code> or{" "}
            <code className="bg-muted px-1 py-0.5 rounded">?role=driver</code>
          </p>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
