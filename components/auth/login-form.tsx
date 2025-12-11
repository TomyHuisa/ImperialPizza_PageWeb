"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Crown, Eye, EyeOff, LogIn, Users } from "lucide-react"
import { useAuth } from "@/lib/store/auth-store"
import { demoUsers } from "@/lib/data/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoAccounts, setShowDemoAccounts] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = login(email, password)

    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
      // Redirect based on role
      const user = demoUsers.find((u) => u.email === email)
      if (user) {
        switch (user.role) {
          case "admin":
            router.push("/")
            break
          case "kitchen":
            router.push("/kitchen")
            break
          case "driver":
            router.push("/driver")
            break
          default:
            router.push("/")
        }
      }
    } else {
      toast({
        title: "Login failed",
        description: result.error,
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-block mb-4"
          >
            <Crown className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Imperial Pizzeria</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="rounded-xl bg-card border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo Accounts Toggle */}
          <div className="mt-6 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              {showDemoAccounts ? "Hide Demo Accounts" : "Show Demo Accounts"}
            </button>

            {/* Demo Accounts List */}
            <motion.div
              initial={false}
              animate={{ height: showDemoAccounts ? "auto" : 0, opacity: showDemoAccounts ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleDemoLogin(user.email, user.password!)}
                    className={cn(
                      "w-full p-3 rounded-lg border text-left transition-all hover:border-primary",
                      email === user.email ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full capitalize",
                          user.role === "admin" && "bg-amber-500/20 text-amber-600",
                          user.role === "customer" && "bg-blue-500/20 text-blue-600",
                          user.role === "kitchen" && "bg-orange-500/20 text-orange-600",
                          user.role === "driver" && "bg-green-500/20 text-green-600",
                        )}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Password: {user.password}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Continue as Guest */}
        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground">
            Continue as Guest
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
