"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Crown, Menu, X, LogIn, LogOut, User, ChefHat, Bike, Shield } from "lucide-react"
import { useState } from "react"
import { useAppState } from "@/lib/store/app-store"
import { usePoints } from "@/lib/store/points-context"
import { useAuth } from "@/lib/store/auth-store"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { cart } = useAppState()
  const { points } = usePoints()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "kitchen":
        return <ChefHat className="h-4 w-4" />
      case "driver":
        return <Bike className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
            <Crown className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="font-serif text-xl font-bold text-foreground">Imperial Pizzeria</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/menu"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Menu
          </Link>
          <Link
            href="/track"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Track Order
          </Link>

          {/* Admin/Staff Links */}
          {isAuthenticated && (user?.role === "admin" || user?.role === "kitchen") && (
            <Link
              href="/kitchen"
              className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              <ChefHat className="h-4 w-4" />
              Kitchen
            </Link>
          )}
          {isAuthenticated && (user?.role === "admin" || user?.role === "driver") && (
            <Link
              href="/driver"
              className="text-sm font-medium text-green-500 hover:text-green-600 transition-colors flex items-center gap-1"
            >
              <Bike className="h-4 w-4" />
              Driver
            </Link>
          )}

          {/* Points Display */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 border border-secondary/30"
            whileHover={{ scale: 1.02 }}
          >
            <Crown className="h-4 w-4 text-secondary" />
            <AnimatedCounter value={points} className="text-sm font-semibold text-secondary-foreground" suffix=" pts" />
          </motion.div>

          {/* Cart */}
          <Link href="/cart">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent flex items-center gap-2">
                  {getRoleIcon(user?.role || "customer")}
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <DropdownMenuSeparator />
                {user?.role === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/kitchen" className="flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Kitchen Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/driver" className="flex items-center gap-2">
                        <Bike className="h-4 w-4" />
                        Driver Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="bg-transparent">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? "auto" : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        className={cn(
          "md:hidden overflow-hidden bg-card border-t border-border",
          !mobileMenuOpen && "pointer-events-none",
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link href="/" className="block text-sm font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link
            href="/menu"
            className="block text-sm font-medium text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            href="/track"
            className="block text-sm font-medium text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Track Order
          </Link>
          {isAuthenticated && (user?.role === "admin" || user?.role === "kitchen") && (
            <Link
              href="/kitchen"
              className="block text-sm font-medium text-orange-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kitchen Dashboard
            </Link>
          )}
          {isAuthenticated && (user?.role === "admin" || user?.role === "driver") && (
            <Link
              href="/driver"
              className="block text-sm font-medium text-green-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Driver Dashboard
            </Link>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-secondary" />
              <AnimatedCounter value={points} className="text-sm font-semibold" suffix=" points" />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartItemsCount > 0 && <span className="ml-1 text-primary">({cartItemsCount})</span>}
                </Button>
              </Link>
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout} className="bg-transparent">
                  <LogOut className="h-4 w-4" />
                </Button>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <LogIn className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}
