"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Crown, Menu, X, LogIn, LogOut, User, ChefHat, Bike, Shield } from "lucide-react"
import { useState } from "react"
import { useAppState } from "@/lib/store/app-store"
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
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  // Usamos un fallback de 0 y nos aseguramos de que sea número
  const points = Number(user?.points || 0)

  // Componente interno para evitar repetir los links en desktop y mobile
  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
    const isAdmin = user?.role === "admin"
    const linkClass = cn(
      "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
      isMobile ? "text-lg py-3 border-b border-border/50" : ""
    )

    return (
      <>
        <Link href="/menu" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
          Menú
        </Link>
        
        {(user?.role === "kitchen" || isAdmin) && (
          <Link href="/kitchen" className={cn(linkClass, "text-orange-500")} onClick={() => setMobileMenuOpen(false)}>
            <ChefHat className="h-4 w-4" /> Cocina
          </Link>
        )}
        
        {(user?.role === "driver" || isAdmin) && (
          <Link href="/driver" className={cn(linkClass, "text-blue-500")} onClick={() => setMobileMenuOpen(false)}>
            <Bike className="h-4 w-4" /> Repartos
          </Link>
        )}
      </>
    )
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Crown className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground hidden sm:block">
            Imperial <span className="text-primary">Pizzeria</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/20 rounded-full border border-secondary/30">
              <Crown className="h-4 w-4 text-secondary" />
              <AnimatedCounter value={points} className="text-sm font-bold text-foreground" suffix=" pts" />
            </div>
          )}

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full border border-border p-0">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2 flex flex-col">
                  <span className="font-medium text-sm">{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile">Mi Perfil</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/orders">Mis Pedidos</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* CORRECCIÓN AQUÍ: DropdownMenuItem cerrando correctamente */}
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">Iniciar Sesión</Button>
            </Link>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              <NavLinks isMobile />
              <div className="flex items-center justify-between pt-4 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-secondary" />
                      <span className="font-bold">{points} pts</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => logout()}>Cerrar Sesión</Button>
                  </>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full">Iniciar Sesión</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}