"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
  popular: boolean;
  price_points: number;
}

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza, isRedemption?: boolean) => void;
}

export function PizzaCard({ pizza, onAddToCart }: PizzaCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  // Obtenemos el precio en puntos directo de la BD
  const pointsCost = Number(pizza.price_points) || 0;
  const isAvailable = pizza.stock > 0;
  const pointsToEarn = Math.floor(pizza.price); // Puntos que ganará al comprar

  // Manejador del intento de canje
  const handleRedeemAttempt = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes estar registrado para canjear puntos.",
      });
      return;
    }

    // Validación más robusta
    const userPoints = Number(user.points) || 0;
    const requiredPoints = Number(pointsCost) || 0;

    if (userPoints >= requiredPoints) {
      // ✅ Tiene puntos -> Abre el modal en modo canje
      onAddToCart(pizza, true);
    } else {
      // ❌ No tiene puntos -> Notificación tipo Push
      const pointsNeeded = requiredPoints - userPoints;
      toast({
        variant: "destructive",
        title: "💎 Puntos Insuficientes",
        description: `Te faltan ${pointsNeeded} puntos. ¡Sigue comprando para sumar más!`,
        duration: 4000,
      });
    }
  };

  // Manejador de compra normal
  const handleAddToCart = () => {
    if (!isAvailable) return;
    onAddToCart(pizza, false);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-red-100 relative group">
      {/* Etiqueta de puntos - SIEMPRE visible si tiene stock */}
      {isAvailable && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-yellow-600 flex items-center gap-1">
          <span className="text-yellow-700">💎</span>
          <span>{pointsCost} pts</span>
        </div>
      )}

      {pizza.popular && (
        <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          ★ POPULAR
        </div>
      )}

      <div className="relative h-64 w-full bg-muted overflow-hidden">
        <Image
          src={pizza.image || "/placeholder.svg"}
          alt={pizza.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold bg-red-600 px-4 py-2 rounded shadow-lg -rotate-12">
              AGOTADO
            </span>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-serif text-balance">
          {pizza.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-pretty">
          {pizza.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-bold text-gray-800">
              ${pizza.price.toFixed(2)}
            </p>
            {/* Información de equivalencia en puntos - SIEMPRE visible */}
            <p className="text-sm text-yellow-700 font-medium mt-1">
              Equivale a {pointsCost} puntos
            </p>
          </div>
          <div className="text-right">
            {isAvailable && (
              <p className="text-xs text-gray-500 mb-1">Stock: {pizza.stock}</p>
            )}
            {/* 🔥 INDICAR QUE GANARÁS PUNTOS INMEDIATAMENTE - SIEMPRE visible */}
            <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              Gana +{pointsToEarn} pts al agregar
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-2">
        {/* Botón Compra Normal */}
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full py-6 text-lg shadow-sm hover:shadow-md transition-shadow"
          variant={isAvailable ? "default" : "secondary"}
        >
          {isAvailable ? "Agregar al Carrito" : "Agotado"}
        </Button>

        {/* Botón Canje - SIEMPRE VISIBLE si hay usuario y stock (incluso si cuesta 0 puntos) */}
        {user && isAvailable && (
          <Button
            onClick={handleRedeemAttempt}
            className="w-full py-2 text-sm font-bold border-2 bg-white text-yellow-600 border-yellow-400 hover:bg-yellow-50"
            variant="outline"
          >
            {/* 🔥 CLARAMENTE INDICA CUÁNTOS PUNTOS GASTARÁS */}
            Canjear por {pointsCost} pts
          </Button>
        )}

        {/* Mensaje informativo si no hay usuario */}
        {!user && isAvailable && (
          <div className="text-center text-xs text-gray-500 p-2 bg-gray-50 rounded border">
            ⚡ Inicia sesión para canjear esta pizza con puntos
          </div>
        )}
      </CardFooter>
    </Card>
  );
}