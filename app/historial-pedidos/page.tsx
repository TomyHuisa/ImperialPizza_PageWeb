"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

// Importación dinámica del componente de rastreo
const OrderTrackingMap = dynamic(
  () => import("@/components/OrderTrackingMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

interface OrderItem {
  pizzaId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  comment: string;
  image: string;
}

interface Order {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  customer_notes: string;
  items: OrderItem[];
  total: number;
  status: string;
}

export default function OrderHistoryPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Cargar pedidos desde PocketBase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://127.0.0.1:8090/api/collections/orders/records?sort=-created"
        );

        if (!response.ok) {
          throw new Error("Error al cargar los pedidos");
        }

        const data = await response.json();
        setOrders(data.items || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          variant: "destructive",
          title: "❌ Error",
          description: "No se pudieron cargar los pedidos.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  // Filtrar pedidos por teléfono
  const filteredOrders = phoneFilter
    ? orders.filter(
        (order) =>
          order.customer_phone.includes(phoneFilter) ||
          order.customer_name.toLowerCase().includes(phoneFilter.toLowerCase())
      )
    : orders;

  // Calcular puntos totales
  const totalPoints = filteredOrders.reduce((total, order) => {
    const orderPoints = order.items.reduce(
      (itemTotal, item) => itemTotal + item.quantity * 50,
      0
    );
    return total + orderPoints;
  }, 0);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para cancelar pedido
  const cancelOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de que quieres cancelar este pedido?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8090/api/collections/orders/records/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al cancelar el pedido");
      }

      // Actualizar la lista local
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      toast({
        title: "✅ Pedido cancelado",
        description: "El pedido ha sido cancelado exitosamente.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "No se pudo cancelar el pedido.",
      });
    }
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "onway":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "withdrawal":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Función para traducir el estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "confirmed":
        return "Confirmado";
      case "preparing":
        return "En preparación";
      case "onway":
        return "En camino";
      case "withdrawal":
        return "Para retirar";
      case "delivered":
        return "Entregado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Función para verificar si se puede cancelar el pedido
  const canCancelOrder = (status: string) => {
    return (
      status === "pending" || status === "confirmed" || status === "preparing"
    );
  };

  // Función para verificar si se puede volver a pedir
  const canReorder = (status: string) => {
    return (
      status === "withdrawal" ||
      status === "delivered" ||
      status === "cancelled"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="p-2 rounded-md hover:bg-muted transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-foreground font-serif text-center flex-1">
              Pizzeria Imperial
            </h1>
            <div className="w-10"></div> {/* Espacio para centrar */}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Historial de Pedidos
          </h1>
          <p className="text-muted-foreground">
            Revisa y gestiona todos tus pedidos en Pizzeria Imperial
          </p>
        </div>

        {/* Filtro por teléfono/nombre */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Buscar por teléfono o nombre
              </label>
              <input
                type="text"
                placeholder="Ingresa tu teléfono o nombre..."
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
                className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredOrders.length} pedidos encontrados
            </div>
          </div>
        </div>

        {/* Resumen de puntos */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Tus Puntos Acumulados
              </h2>
              <p className="text-muted-foreground">
                Gana 50 puntos por cada pizza que ordenes
              </p>
            </div>
            <div className="bg-red-600 text-white py-3 px-6 rounded-lg text-center mt-4 sm:mt-0">
              <div className="text-2xl font-bold">{totalPoints}</div>
              <div className="text-sm">puntos totales</div>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              Pedidos Recientes
            </h2>
          </div>

          <div className="divide-y divide-border">
            {filteredOrders.map((order) => {
              const orderPoints = order.items.reduce(
                (total, item) => total + item.quantity * 50,
                0
              );
              const totalItems = order.items.reduce(
                (total, item) => total + item.quantity,
                0
              );

              return (
                <div
                  key={order.id}
                  className="p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Información principal del pedido */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {formatDate(order.created)}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      {/* Información del cliente */}
                      <div className="mb-3">
                        <p className="text-sm text-muted-foreground">
                          <strong>Cliente:</strong> {order.customer_name} |{" "}
                          {order.customer_phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Dirección:</strong> {order.delivery_address}
                        </p>
                        {order.customer_notes && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Notas:</strong> {order.customer_notes}
                          </p>
                        )}
                      </div>

                      {/* Items del pedido */}
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-foreground">
                                {item.name}
                              </span>
                              {item.comment && (
                                <span className="text-muted-foreground ml-2">
                                  ({item.comment})
                                </span>
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              x{item.quantity} - $
                              {(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Información lateral */}
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      {/* Total y puntos */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          Total: ${order.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {totalItems} items • {orderPoints} puntos
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex flex-col gap-2">
                        {/* Botón Cancelar Pedido - Solo para pending, confirmed, preparing */}
                        {canCancelOrder(order.status) && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            Cancelar Pedido
                          </button>
                        )}

                        {/* Botón Rastrear Pedido - Solo para onway */}
                        {order.status === "onway" && (
                          <button
                            onClick={() => setTrackingOrderId(order.id)}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Rastrear Pedido
                          </button>
                        )}

                        {/* Botón Volver a Pedir - Solo para withdrawal, delivered, cancelled */}
                        {canReorder(order.status) ? (
                          <Link
                            href="/"
                            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium text-center"
                          >
                            Volver a Pedir
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-400 text-gray-200 py-2 px-4 rounded-lg cursor-not-allowed text-sm font-medium text-center"
                          >
                            Volver a Pedir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mensaje si no hay pedidos */}
          {filteredOrders.length === 0 && (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {phoneFilter
                  ? "No hay pedidos con ese filtro"
                  : "No hay pedidos anteriores"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {phoneFilter
                  ? "Intenta con otro teléfono o nombre."
                  : "Cuando hagas tu primer pedido, aparecerá aquí."}
              </p>
              <Link
                href="/"
                className="inline-block bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                Hacer mi primer pedido
              </Link>
            </div>
          )}
        </div>

        {/* Información adicional sobre puntos */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            ¿Cómo funcionan los puntos?
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Ganas 50 puntos por cada pizza que ordenes</li>
            <li>• 100 puntos = $1 de descuento en tu próxima compra</li>
            <li>• Los puntos no expiran</li>
            <li>• Puedes canjear tus puntos en cualquier momento</li>
          </ul>
        </div>

        {/* Información sobre estados de pedido */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Estados del pedido
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-green-700">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Pendiente
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Confirmado
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              En preparación
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              En camino
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
              Para retirar
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Entregado
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Cancelado
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Pizzeria Imperial. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modal de Rastreo */}
      {trackingOrderId && (
        <OrderTrackingMap
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}
