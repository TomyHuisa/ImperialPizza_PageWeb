"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/lib/store/auth-store"
import { Crown, Mail, User, ShieldCheck, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user } = useAuth()

  // Si no hay usuario, no mostramos nada (el middleware debería proteger esta ruta)
  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-border pb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <User className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="font-serif text-4xl font-bold text-foreground">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="capitalize">{user.role}</Badge>
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                <Crown className="h-3 w-3 mr-1" /> Cliente Imperial
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-secondary/30 border-none relative overflow-hidden group">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Mis Puntos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-primary mb-2">{user.points}</div>
              <p className="text-xs text-muted-foreground">Úsalos para obtener pizzas gratis</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Detalles de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Dirección Principal</p>
                  <p className="text-sm font-medium">No especificada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}