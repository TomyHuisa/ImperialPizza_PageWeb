"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/store/auth-store" // Importamos el store real
import type { User } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: User["role"][]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
  if (!isLoading) {
    if (!isAuthenticated || !user) {
      setIsAuthorized(false)
      setTimeout(() => router.push("/login"), 3000)
      return
    }

    // MODIFICACIÓN: Si es admin, siempre tiene permiso (true)
    // De lo contrario, comprobamos si su rol está en la lista permitida
    const hasPermission = user.role === "admin" || allowedRoles.includes(user.role)
    
    setIsAuthorized(hasPermission)
  }
}, [isLoading, isAuthenticated, user, allowedRoles, router])

  // Estado de carga (Verificando sesión en PocketBase)
  if (isLoading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying secure access...</p>
        </motion.div>
      </div>
    )
  }

  // Pantalla de Acceso Denegado (Si intenta entrar a un rol que no es suyo)
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
            Usted no tiene permisos para acceder a esta sección. 
            Esta área es exclusiva para personal de: <span className="font-bold capitalize">{allowedRoles.join(", ")}</span>.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="text-primary hover:underline font-medium"
          >
            Volver al Inicio
          </button>
        </motion.div>
      </div>
    )
  }

  // Si todo está bien, mostramos el contenido
  return <>{children}</>
}