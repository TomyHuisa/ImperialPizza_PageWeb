// components/SimpleTrackingMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SimpleTrackingMapProps {
  orderId: string;
  onClose: () => void;
}

export default function SimpleTrackingMap({
  orderId,
  onClose,
}: SimpleTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      try {
        // Cargar Leaflet dinámicamente
        const L = await import("leaflet");

        // Configurar iconos
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Crear mapa
        const map = L.map(mapRef.current!).setView([-34.6037, -58.3816], 16);

        // Agregar capa de tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Agregar marcador
        const marker = L.marker([-34.6037, -58.3816])
          .addTo(map)
          .bindPopup("Tu repartidor<br>En camino a tu ubicación")
          .openPopup();

        // Simular movimiento
        const interval = setInterval(() => {
          const newLat = marker.getLatLng().lat + (Math.random() - 0.5) * 0.001;
          const newLng = marker.getLatLng().lng + (Math.random() - 0.5) * 0.001;

          marker.setLatLng([newLat, newLng]);
          map.setView([newLat, newLng]);
        }, 3000);

        setIsLoading(false);

        return () => {
          clearInterval(interval);
          map.remove();
        };
      } catch (error) {
        console.error("Error loading map:", error);
        setIsLoading(false);
      }
    };

    loadMap();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Rastreando tu pedido
            </h2>
            <p className="text-gray-600">Orden #{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div ref={mapRef} className="h-96 w-full" />

        <div className="p-6 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Juan Delgado</h3>
              <p className="text-gray-600 text-sm">Repartidor asignado</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Llamar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
