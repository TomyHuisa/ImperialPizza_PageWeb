"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Gift } from "lucide-react";

interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
  price_points: number; // Aseguramos que venga este campo
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: Pizza | null;
  comment: string;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  isRedemption: boolean; // Sincronizado con PizzaCard
}

export function CartModal({
  isOpen,
  onClose,
  pizza,
  comment,
  onCommentChange,
  onConfirm,
  isRedemption,
}: CartModalProps) {
  if (!isOpen || !pizza) return null;

  // Usamos el precio en puntos directo de la BD
  const pointsCost = pizza.price_points;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-border">
        {/* Header con cambio de color si es canje */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isRedemption ? "bg-yellow-50" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {isRedemption ? (
              <>
                <Gift className="text-yellow-600" />
                Confirmar Canje
              </>
            ) : (
              "Personalizar Pedido"
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-xl">{pizza.name}</h3>
            <p className="text-muted-foreground text-sm">{pizza.description}</p>

            <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
              <h3 className="font-semibold text-lg text-foreground mb-1">
                {isRedemption ? "Costo en Puntos:" : "Precio:"}
              </h3>

              {isRedemption ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-yellow-600">
                    💎 {pointsCost} pts
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${pizza.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-red-600">
                  ${pizza.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Comentario */}
          <div className="space-y-3">
            <label htmlFor="comment" className="font-semibold text-foreground">
              Notas para la cocina:
            </label>
            <Textarea
              id="comment"
              placeholder={
                isRedemption
                  ? "Ej: Es un regalo, enviar servilletas extra..."
                  : "Ej: Sin aceitunas, extra queso..."
              }
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={3}
              className="resize-none focus:ring-red-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 text-white font-bold transition-transform active:scale-95 ${
              isRedemption
                ? "bg-yellow-500 hover:bg-yellow-600 shadow-md shadow-yellow-200"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isRedemption ? "Confirmar Canje" : "Agregar al Carrito"}
          </Button>
        </div>
      </div>
    </div>
  );
}
