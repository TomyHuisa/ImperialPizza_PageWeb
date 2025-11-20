"use client";

import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react"; // Asegúrate de tener lucide-react o usa svgs

export default function PointsPromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar si ya vio el anuncio
    const hasSeenPromo = localStorage.getItem("hasSeenPointsPromo");

    // Mostrar despues de 2 segundos si no lo ha visto
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Guardar que ya vio y ACTIVÓ el modo puntos
    localStorage.setItem("hasSeenPointsPromo", "true");
    // Disparar evento para que otros componentes sepan que se activó
    window.dispatchEvent(new Event("pointsModeActivated"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative transform transition-all scale-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Gift className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            ¡NUEVO PROGRAMA!
          </h2>
          <p className="text-red-100 font-medium">Tus pizzas ahora valen más</p>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            ¡Empieza a comprar y canjear puntos por pizzas!
          </h3>
          <p className="text-gray-600 mb-6">
            Por cada compra acumulas puntos. Activa ahora el modo canje para ver
            qué puedes llevarte gratis hoy mismo.
          </p>

          <button
            onClick={handleClose}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:bg-red-700 transition-transform active:scale-95 shadow-lg shadow-red-200"
          >
            ¡Entendido, quiero canjear!
          </button>
        </div>
      </div>
    </div>
  );
}
