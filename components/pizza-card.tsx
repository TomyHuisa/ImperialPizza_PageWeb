"use client";

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

interface Pizza {
  id: number;
  name: string;
  description: string;
  image: string;
  available: boolean;
  price: number;
}

interface PizzaCardProps {
  pizza: Pizza;
}

export function PizzaCard({ pizza }: PizzaCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!pizza.available) {
      toast({
        variant: "destructive",
        title: "⚠️ Producto no disponible actualmente",
        description:
          "Lo sentimos, esta pizza no está disponible en este momento.",
      });
      return;
    }

    toast({
      title: "✅ Agregado al carrito",
      description: `${pizza.name} ha sido agregada a tu pedido.`,
      duration: 550,
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <Image
          src={pizza.image || "/placeholder.svg"}
          alt={pizza.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {!pizza.available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center"></div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-2xl font-serif text-balance">
          {pizza.name}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed text-pretty">
          {pizza.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-3xl font-bold text-accent">
          ${pizza.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleAddToCart}
          disabled={!pizza.available}
          className="w-full text-lg py-6"
          variant={pizza.available ? "default" : "secondary"}
        >
          {pizza.available ? "Agregar al Carrito" : "No Disponible"}
        </Button>
      </CardFooter>
    </Card>
  );
}
