"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

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
}

export function CartModal({
  isOpen,
  onClose,
  pizza,
  comment,
  onCommentChange,
  onConfirm,
}: CartModalProps) {
  if (!isOpen || !pizza) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-foreground">
            Personalizar Pedido
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
            <div>
              <h3 className="font-semibold text-lg text-foreground">Pizza:</h3>
              <p className="text-foreground">{pizza.name}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-foreground">
                Descripción:
              </h3>
              <p className="text-muted-foreground">{pizza.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-foreground">Precio:</h3>
              <p className="text-2xl font-bold text-red-600">
                ${pizza.price.toFixed(2)}
              </p>
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
              placeholder="Ej: Sin aceitunas, extra queso, bien cocida, menos picante, etc."
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Añade cualquier especificación especial para tu pizza
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Agregar al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
