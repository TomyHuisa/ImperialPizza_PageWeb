"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
// Agregado Loader2 aquí para corregir el ReferenceError
import { Crown, Eye, EyeOff, LogIn, Users, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
// Ahora sí usaremos cn para los colores de los roles
import { cn } from "@/lib/utils"

const demoAccounts = [
  { name: "Admin", email: "admin@imperial.pizza", role: "admin" },
  { name: "Chef", email: "kitchen@imperial.pizza", role: "kitchen" },
  { name: "Driver", email: "driver@imperial.pizza", role: "driver" },
  { name: "Customer", email: "customer@imperial.pizza", role: "customer" },
]

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await login(email, password)

    if (result.success) {
      toast({
        title: "¡Bienvenido!",
        description: "Sesión iniciada correctamente.",
      })

      // Pequeña pausa para asegurar que el token se guarde en localStorage
      setTimeout(() => {
        const pbAuth = JSON.parse(localStorage.getItem("pocketbase_auth") || "{}")
        const role = pbAuth?.model?.role || "customer"

        switch (role) {
          case "admin": router.push("/admin"); break
          case "kitchen": router.push("/kitchen"); break
          case "driver": router.push("/driver"); break
          default: router.push("/")
        }
      }, 400)
    } else {
      toast({
        title: "Error",
        description: result.error || "Credenciales inválidas",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("12345678") // Contraseña genérica para tus pruebas
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div whileHover={{ rotate: 10 }} className="inline-block mb-4">
            <Crown className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Imperial Pizzeria</h1>
          <p className="text-muted-foreground mt-2">Acceso al Sistema</p>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@imperial.pizza"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Entrando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              {showDemoAccounts ? "Ocultar cuentas" : "Ver cuentas de prueba"}
            </button>

            <motion.div
              initial={false}
              animate={{ height: showDemoAccounts ? "auto" : 0, opacity: showDemoAccounts ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleDemoLogin(account.email)}
                    className="w-full p-2 text-xs rounded border border-border hover:border-primary flex justify-between items-center transition-colors"
                  >
                    <span>{account.email}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      account.role === "admin" && "bg-amber-500/10 text-amber-600",
                      account.role === "kitchen" && "bg-orange-500/10 text-orange-600",
                      account.role === "driver" && "bg-blue-500/10 text-blue-600",
                      account.role === "customer" && "bg-green-500/10 text-green-600",
                    )}>
                      {account.role}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground">
            Continuar como Invitado (Guest)
          </Button>
        </div>
      </motion.div>
    </div>
  )
}