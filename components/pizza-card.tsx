"use client";

import { useState, useEffect } from "react";
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
}

// Interface
interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza, isRedemption?: boolean) => void;
}

export function PizzaCard({ pizza, onAddToCart }: PizzaCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pointsMode, setPointsMode] = useState(false);

  // Detectar si el anuncio ya se vio para activar botones
  useEffect(() => {
    const checkMode = () => {
      const active = localStorage.getItem("hasSeenPointsPromo") === "true";
      setPointsMode(active);
    };

    // Chequear al montar
    checkMode();

    // Escuchar evento custom del modal
    window.addEventListener("pointsModeActivated", checkMode);
    return () => window.removeEventListener("pointsModeActivated", checkMode);
  }, []);

  // --- MODIFICACIÓN CLAVE ---
  // Esta función ahora acepta 'isRedemption' y lo pasa al padre.
  const handleAddToCart = (isRedemption: boolean) => {
    if (pizza.stock <= 0) {
      toast({
        variant: "destructive",
        title: "⚠️ Agotado",
        description: "Sin stock disponible.",
      });
      return;
    }
    // Llama a la función del padre pasando la pizza y el modo (true o false)
    onAddToCart(pizza, isRedemption);
  };
  // --------------------------

  const isAvailable = pizza.stock > 0;
  // Calcular costo en puntos (ej: $10 = 1000 puntos / 2 = 500)
  // Nota: Esto debería coincidir con tu lógica de costos en `cart.tsx`.
  const pointsCost = Math.floor((pizza.price * 100) / 2);
  const canRedeem = user && user.points >= pointsCost;

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all border-2 hover:border-red-100 relative">
      {/* Badge de Puntos si el modo está activo */}
      {pointsMode && isAvailable && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          💎 {pointsCost} pts
        </div>
      )}

      <div className="relative h-64 w-full bg-muted">
        <Image
          src={pizza.image || "/placeholder.svg"}
          alt={pizza.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded">
              AGOTADO
            </span>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-serif">{pizza.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {pizza.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex justify-between items-end">
          {/* Muestra el precio normal o el costo en puntos si el modo está activo */}
          {pointsMode && isAvailable ? (
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-gray-800">
                ${pizza.price.toFixed(2)}
              </p>
              <p className="text-sm font-semibold text-yellow-600">
                O {pointsCost} pts
              </p>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-800">
              ${pizza.price.toFixed(2)}
            </p>
          )}

          {isAvailable && (
            <p className="text-xs text-gray-500">Stock: {pizza.stock}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {/* Botón Normal: Llama a handleAddToCart(false) */}
        <Button
          onClick={() => handleAddToCart(false)}
          disabled={!isAvailable}
          className="w-full py-6 text-lg"
          variant={isAvailable ? "default" : "secondary"}
        >
          {isAvailable ? "Agregar al Carrito" : "Agotado"}
        </Button>

        {/* Botón de Canje (Solo si vio el anuncio) */}
        {pointsMode && isAvailable && (
          <Button
            onClick={() => {
              if (canRedeem) {
                // Llama a handleAddToCart(true) para activar el modo canje en el modal
                handleAddToCart(true);
                toast({
                  title: "💎 Agregado para canje",
                  description: "Confirma tu pedido en el modal para canjear.",
                  className: "bg-yellow-50 border-yellow-200",
                });
              } else {
                toast({
                  variant: "destructive",
                  title: "Puntos insuficientes",
                  description: `Necesitas ${pointsCost} pts.`,
                });
              }
            }}
            disabled={!canRedeem}
            className={`w-full py-2 text-sm font-bold border-2 ${
              canRedeem
                ? "bg-white text-yellow-600 border-yellow-400 hover:bg-yellow-50"
                : "bg-gray-100 text-gray-400 border-transparent"
            }`}
            variant="outline"
          >
            {canRedeem
              ? `Canjear por ${pointsCost} pts`
              : `Faltan ${
                  user?.points ? pointsCost - user.points : pointsCost
                } pts`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
