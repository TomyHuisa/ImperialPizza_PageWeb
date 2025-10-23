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
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
}

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza) => void; // Nueva prop
}

export function PizzaCard({ pizza, onAddToCart }: PizzaCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (pizza.stock <= 0) {
      toast({
        variant: "destructive",
        title: "⚠️ Producto agotado",
        description:
          "Lo sentimos, esta pizza no está disponible en este momento.",
      });
      return;
    }

    // Llamar a la función del padre para abrir el modal
    onAddToCart(pizza);
  };

  const isAvailable = pizza.stock > 0;

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <Image
          src={pizza.image || "/placeholder.svg"}
          alt={pizza.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded">
              AGOTADO
            </span>
          </div>
        )}
        {isAvailable && pizza.stock < 5 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-sm font-bold">
            ¡Últimas {pizza.stock}!
          </div>
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
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold text-accent">
            ${pizza.price.toFixed(2)}
          </p>
          {isAvailable && (
            <p className="text-sm text-muted-foreground">
              Stock: {pizza.stock}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full text-lg py-6"
          variant={isAvailable ? "default" : "secondary"}
        >
          {isAvailable ? "Agregar al Carrito" : "Agotado"}
        </Button>
      </CardFooter>
    </Card>
  );
}
