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
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Cargar CSS de Leaflet dinámicamente
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    return () => {
      // Limpiar el CSS cuando el componente se desmonte
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return;

    const loadMap = async () => {
      try {
        // Cargar Leaflet dinámicamente
        const L = await import("leaflet");

        // Configurar iconos - IMPORTANTE
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // Crear mapa
        const map = L.map(mapRef.current!).setView([-34.6037, -58.3816], 16);

        // Agregar capa de tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Agregar marcador
        const marker = L.marker([-34.6037, -58.3816])
          .addTo(map)
          .bindPopup(
            `
            <div style="text-align: center;">
              <strong>🚗 Tu repartidor</strong><br/>
              En camino a tu ubicación<br/>
              <small>Orden #${orderId}</small>
            </div>
          `
          )
          .openPopup();

        // Agregar círculo para mostrar área de ubicación aproximada
        L.circle([-34.6037, -58.3816], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.1,
          radius: 200,
        }).addTo(map);

        // Simular movimiento
        const interval = setInterval(() => {
          const newLat = marker.getLatLng().lat + (Math.random() - 0.5) * 0.001;
          const newLng = marker.getLatLng().lng + (Math.random() - 0.5) * 0.001;

          marker.setLatLng([newLat, newLng]);
          map.setView([newLat, newLng], 16);
        }, 3000);

        setIsLoading(false);
        setMapLoaded(true);

        // Cleanup
        return () => {
          clearInterval(interval);
          if (map) {
            map.remove();
          }
        };
      } catch (error) {
        console.error("Error loading map:", error);
        setIsLoading(false);
      }
    };

    loadMap();
  }, [orderId, mapLoaded]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Cargando mapa...</p>
          <p className="text-sm text-gray-600 mt-2">
            Preparando el rastreo en tiempo real
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header del modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              🗺️ Rastreando tu pedido
            </h2>
            <p className="text-gray-600">Orden #{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
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

        {/* Información del pedido */}
        <div className="bg-blue-50 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-blue-800">
                  Tiempo estimado de entrega
                </p>
                <p className="text-blue-600">15-20 minutos</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">📍 En movimiento</p>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="h-96 w-full bg-gray-200 relative">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: "384px" }}
          />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Renderizando mapa...</p>
              </div>
            </div>
          )}
        </div>

        {/* Información del repartidor */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
              🚗
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Carlos Rodríguez</h3>
              <p className="text-gray-600 text-sm">
                Repartidor asignado - En camino
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Vehículo: Moto - Placa ABC123
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                📞 Llamar
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                💬 Mensaje
              </button>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="p-4 bg-yellow-50 border-t">
          <p className="text-sm text-yellow-800 text-center">
            💡 <strong>Tip:</strong> El marcador rojo muestra la ubicación
            actual de tu repartidor
          </p>
        </div>
      </div>
    </div>
  );
}
