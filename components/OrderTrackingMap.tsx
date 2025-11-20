"use client";

import { useEffect, useRef, useState } from "react";

interface SimpleTrackingMapProps {
  orderId: string;
  onClose: () => void;
}

type DataMode = "simulated" | "real";

export default function SimpleTrackingMap({
  orderId,
  onClose,
}: SimpleTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Control de estado
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataMode, setDataMode] = useState<DataMode>("simulated");

  // Refs para controlar la asincronía estricta de React
  const isMountedRef = useRef(false);
  const isInitializingRef = useRef(false);

  // Datos simulados
  const simulatedLocations = [
    { lat: -34.6037, lng: -58.3816, name: "Centro" },
    { lat: -34.605, lng: -58.383, name: "Avenida" },
    { lat: -34.6025, lng: -58.38, name: "Plaza" },
    { lat: -34.604, lng: -58.3785, name: "Cerca de ti" },
  ];

  // Función de limpieza ROBUSTA (Soluciona el error al cerrar)
  const cleanupMap = () => {
    // 1. Limpiar intervalo de simulación
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 2. Limpiar instancia del mapa de forma segura
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.off(); // Quitar eventos
        mapInstanceRef.current.remove(); // Intentar destruir
      } catch (e) {
        // Si falla el remove (porque el contenedor ya no existe o el ID cambió),
        // solo lo logueamos como advertencia y seguimos. No rompemos la app.
        console.warn("Limpieza del mapa: El mapa ya había sido desmontado", e);
      }
      mapInstanceRef.current = null;
    }

    // 3. Limpiar referencias
    markerRef.current = null;
    isInitializingRef.current = false;
  };

  useEffect(() => {
    isMountedRef.current = true;

    const initMap = async () => {
      // 1. Bloqueo de seguridad: Si ya estamos inicializando o ya existe el mapa, parar.
      if (isInitializingRef.current || mapInstanceRef.current) return;

      isInitializingRef.current = true;

      try {
        // 2. Cargar CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
          // Pequeña pausa para asegurar estilos
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        if (!isMountedRef.current) return;

        // 3. Importar Leaflet
        const L = await import("leaflet");

        // Verificación doble post-await
        if (!isMountedRef.current) return;

        // 4. Configurar iconos (Fix para Next.js)
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // 5. SOLUCIÓN DEFINITIVA AL ERROR DE INICIALIZACIÓN
        // Si el contenedor existe pero Leaflet cree que ya tiene mapa (zombie), lo reseteamos a la fuerza.
        const container = mapRef.current;
        if (container) {
          // @ts-ignore
          if (container._leaflet_id) {
            // @ts-ignore
            container._leaflet_id = null; // Corrección crítica
          }
        } else {
          return;
        }

        // Si mapInstanceRef se llenó durante el await, salimos
        if (mapInstanceRef.current) return;

        // 6. Crear mapa
        const map = L.map(container, {
          zoomControl: true,
          scrollWheelZoom: false,
          attributionControl: false,
        }).setView([-34.6037, -58.3816], 15);

        mapInstanceRef.current = map;

        // Agregar atribución manualmente más pequeña
        L.control
          .attribution({ prefix: false })
          .addAttribution("OpenStreetMap")
          .addTo(map);

        // 7. Agregar tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        // 8. Agregar marcador inicial
        const marker = L.marker([-34.6037, -58.3816])
          .addTo(map)
          .bindPopup(
            `<div style="text-align: center;">
              <strong>🚗 Tu pedido</strong><br/>
              En preparación para salir<br/>
              <small>Orden #${orderId}</small>
            </div>`
          )
          .openPopup();

        markerRef.current = marker;

        // Círculo decorativo
        L.circle([-34.6037, -58.3816], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.1,
          radius: 150,
        }).addTo(map);

        // Forzar repintado del mapa
        setTimeout(() => {
          if (isMountedRef.current && map) {
            map.invalidateSize();
          }
        }, 300);

        setIsLoading(false);
        isInitializingRef.current = false;

        // Iniciar modo simulación por defecto
        startSimulation(map, marker);
      } catch (error) {
        console.error("Error crítico cargando mapa:", error);
        if (isMountedRef.current) {
          setError("No se pudo inicializar el mapa de rastreo.");
          setIsLoading(false);
        }
        isInitializingRef.current = false;
      }
    };

    initMap();

    // Cleanup al desmontar
    return () => {
      isMountedRef.current = false;
      cleanupMap();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Lógica de simulación separada
  const startSimulation = (map: any, marker: any) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let currentLocationIndex = 0;

    intervalRef.current = setInterval(() => {
      if (!map || !marker || !isMountedRef.current) return;

      try {
        currentLocationIndex =
          (currentLocationIndex + 1) % simulatedLocations.length;
        const nextLocation = simulatedLocations[currentLocationIndex];

        marker.setLatLng([nextLocation.lat, nextLocation.lng]);

        // Animación suave de la vista (pan)
        map.panTo([nextLocation.lat, nextLocation.lng]);

        marker.getPopup().setContent(
          `<div style="text-align: center;">
            <strong>🚗 En camino</strong><br/>
            ${nextLocation.name}<br/>
            <small>Actualizado hace un momento</small>
          </div>`
        );
      } catch (e) {
        console.warn("Error en animación:", e);
      }
    }, 4000);
  };

  // Efecto para cambiar entre modos (Simulado / Real)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || isLoading) return;

    if (dataMode === "simulated") {
      startSimulation(mapInstanceRef.current, markerRef.current);
    } else {
      // Modo Real: Detener simulación y resetear
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const basePos = [-34.6037, -58.3816];
      markerRef.current.setLatLng(basePos);
      mapInstanceRef.current.setView(basePos, 15);
      markerRef.current
        .bindPopup("📡 Esperando señal GPS del repartidor...")
        .openPopup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMode, isLoading]);

  const handleClose = () => {
    cleanupMap(); // Limpieza segura
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center max-w-md shadow-xl">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error de Mapa
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b shrink-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full"></span>
                  Cargando...
                </span>
              ) : (
                "🗺️ Rastreando tu pedido"
              )}
            </h2>
            <p className="text-gray-600 text-sm">Orden #{orderId}</p>
          </div>
          <button
            onClick={handleClose}
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

        {/* Selector de modo */}
        <div className="p-4 border-b bg-gray-50 shrink-0 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Modo de visualización:
          </span>
          <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setDataMode("simulated")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dataMode === "simulated"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🎮 Simulación
            </button>
            <button
              onClick={() => setDataMode("real")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dataMode === "real"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              📡 GPS Real
            </button>
          </div>
        </div>

        {/* Mapa */}
        <div className="relative flex-1 w-full bg-gray-100 min-h-[350px]">
          <div ref={mapRef} className="absolute inset-0 z-0" />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mb-4"></div>
              <p className="text-lg font-semibold text-gray-800">
                Conectando con el repartidor...
              </p>
            </div>
          )}
        </div>

        {/* Info Repartidor Footer */}
        <div className="p-6 bg-white border-t shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl shadow-inner">
              🛵
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Carlos Rodríguez</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`h-2 w-2 rounded-full ${
                    dataMode === "simulated"
                      ? "bg-green-500 animate-pulse"
                      : "bg-blue-500"
                  }`}
                ></span>
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                  {dataMode === "simulated"
                    ? "En camino (Simulado)"
                    : "Señal GPS: Esperando"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                title="Llamar"
              >
                📞
              </button>
              <button
                className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                title="Mensaje"
              >
                💬
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
