"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Gift } from "lucide-react"; // Agregamos el icono Gift

interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: Pizza | null;
  comment: string;
  onCommentChange: (comment: string) => void;
  onConfirm: () => void;
  isRedemption?: boolean; // <--- Ya lo tenías, crucial para el flujo
}

export function CartModal({
  isOpen,
  onClose,
  pizza,
  comment,
  onCommentChange,
  onConfirm,
  isRedemption = false, // Por defecto es false (compra normal)
}: CartModalProps) {
  if (!isOpen || !pizza) return null;

  // Calcular costo en puntos (1 dólar = 100 puntos, ajusta si es diferente)
  const POINTS_PER_DOLLAR = 100;
  // Usamos un factor de descuento para el canje, o el precio base
  // Si en `pizza-card.tsx` usaste `(pizza.price * 100) / 2`, usa ese factor aquí
  // Si la pizza cuesta $10 y el canje es 500pts (mitad), usa 50pts por dólar.
  const pointsCost = Math.floor(pizza.price * 50); // Ejemplo: 50pts por dólar (mitad de costo)

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-border">
        {/* Header con cambio de color si es canje */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isRedemption ? "bg-yellow-50" : ""
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
          {/* Información de la pizza */}
          <div className="space-y-4">
            {/* ... (Nombre y Descripción) ... */}

            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {isRedemption ? "Costo del Canje:" : "Precio:"}
              </h3>

              {/* Lógica visual: Dinero vs Puntos */}
              {isRedemption ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-600">
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
            <label
              htmlFor="comment"
              className="font-semibold text-lg text-foreground"
            >
              Comentario:
            </label>
            <Textarea
              id="comment"
              placeholder={
                isRedemption
                  ? "Ej: Sin aceitunas (Canje de recompensa)"
                  : "Ej: Sin aceitunas, extra queso, bien cocida..."
              }
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={4}
              className="resize-none focus:ring-red-500"
            />
            <p className="text-sm text-muted-foreground">
              Añade cualquier especificación especial para tu pizza
            </p>
          </div>
        </div>

        {/* Footer: El botón de confirmación usa onConfirm */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm} // <--- Llama a la función del padre
            className={`flex-1 text-white font-bold transition-colors ${
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
