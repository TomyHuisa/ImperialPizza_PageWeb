"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  MapPin,
  XCircle,
  Bike,
  Store,
  CheckCircle,
} from "lucide-react";
import PocketBaseService from "@/lib/pocketbase";

const OrderTrackingMap = dynamic(
  () => import("@/components/OrderTrackingMap"),
  { ssr: false }
);

interface OrderItem {
  pizzaId: string;
  name: string;
  price: number;
  quantity: number;
  comment: string;
  image: string;
  isRedemption?: boolean;
  pointsCost?: number;
}

interface Order {
  id: string;
  created: string;
  delivery_address: string;
  customer_notes: string;
  payment_method: string;
  items: OrderItem[];
  total: number;
  status: string;
  points_earned?: number;
  points_spent?: number;
  service?: "delivery" | "takeaway";
}

export default function OrderHistoryPage() {
  const { user, userOrders, loading, fetchUserOrders, refreshUser } = useAuth();
  const { toast } = useToast();
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      refreshUser?.();
      fetchUserOrders?.(user.id);
    }
  }, [user?.id]);

  // CANCELAR PEDIDO
  const handleCancelOrder = async (order: Order) => {
    if (!confirm("¿Cancelar pedido?")) return;
    try {
      const pb = PocketBaseService.getInstance();
      await pb.collection("orders").update(order.id, { status: "cancelled" });

      // Devolver Stock
      for (const item of order.items) {
        try {
          const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
          await pb
            .collection("pizzas")
            .update(item.pizzaId, {
              stock: (pizza.stock || 0) + item.quantity,
            });
        } catch (err) {
          console.error(err);
        }
      }

      toast({ title: "Pedido Cancelado", description: "Stock restaurado." });
      if (user) await fetchUserOrders(user.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cancelar.",
      });
    }
  };

  // 🔥 DETECTAR Y SUMAR PUNTOS AUTOMÁTICAMENTE PARA ÓRDENES ENTREGADAS
  useEffect(() => {
    const processDeliveredOrders = async () => {
      if (!user || !userOrders.length) return;

      const pb = PocketBaseService.getInstance();
      let pointsAdded = false;

      for (const order of userOrders) {
        // Solo procesar órdenes entregadas que no hayan tenido puntos sumados
        if (order.status === "delivered" && order.points_earned && order.points_earned > 0) {
          
          // Verificar si la orden tiene items de canje (no debería sumar puntos por estos)
          const hasRedemptionItems = order.items.some(item => 
            item.isRedemption || (item.pointsCost && item.pointsCost > 0)
          );

          // 🔥 SOLO SUMAR PUNTOS SI:
          // 1. No tiene items de canje (compras con dinero normal)
          // 2. Los puntos no han sido sumados previamente
          if (!hasRedemptionItems) {
            try {
              const currentUser = await pb.collection("users").getOne(user.id);
              const currentPoints = Number(currentUser.points) || 0;
              const newPoints = currentPoints + order.points_earned;

              await pb.collection("users").update(user.id, { points: newPoints });
              pointsAdded = true;

              console.log(`✅ Puntos sumados automáticamente: +${order.points_earned} pts para orden ${order.id}`);
            } catch (error) {
              console.error("Error sumando puntos automáticamente:", error);
            }
          }
        }
      }

      if (pointsAdded) {
        await refreshUser();
        toast({
          title: "¡Puntos Actualizados! 🎉",
          description: "Se han sumado los puntos de tus pedidos entregados.",
          className: "bg-green-50 border-green-200",
        });
      }
    };

    processDeliveredOrders();
  }, [userOrders, user?.id]);

  const renderStatusBadge = (status: string) => {
    const labels: any = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      onway: "En Camino",
      withdrawal: "Listo para Retirar",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    const styles: any = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      onway: "bg-purple-100 text-purple-800",
      withdrawal: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };

  // 🔥 CALCULAR PUNTOS GANADOS (excluyendo canjes)
  const calculateEarnedPoints = (order: Order) => {
    const hasRedemption = order.items.some(item => 
      item.isRedemption || (item.pointsCost && item.pointsCost > 0)
    );
    
    if (hasRedemption) return 0; // No gana puntos por canjes
    return order.points_earned || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm mb-8">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-red-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver
          </Link>
          <h1 className="text-xl font-bold ml-auto">Mis Pedidos</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta Puntos */}
        <div className="md:col-span-1 h-fit bg-white border border-yellow-200 rounded-xl p-6 shadow-lg sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 flex gap-2">
            💎 Mis Puntos
          </h2>
          <div className="mt-4">
            <span className="text-5xl font-extrabold text-yellow-600">
              {user?.points || 0}
            </span>{" "}
            <span className="text-sm text-gray-500">Pts</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Los puntos se suman automáticamente cuando tus pedidos son entregados.
          </p>
        </div>

        <section className="md:col-span-2 space-y-6">
          {userOrders.map((order: Order) => {
            const earnedPoints = calculateEarnedPoints(order);
            const hasRedemption = order.items.some(item => 
              item.isRedemption || (item.pointsCost && item.pointsCost > 0)
            );

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">
                          #{order.id.slice(0, 8)}
                        </span>
                        {renderStatusBadge(order.status)}
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
                          {order.service === "takeaway" ? (
                            <>
                              <Store size={12} /> Retiro
                            </>
                          ) : (
                            <>
                              <Bike size={12} /> Delivery
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ${order.total.toFixed(2)}
                      </p>
                      
                      {/* 🔥 MOSTRAR PUNTOS SEGÚN TIPO DE COMPRA */}
                      {hasRedemption ? (
                        <span className="text-xs text-yellow-600 font-bold">
                          Canje con puntos
                        </span>
                      ) : order.status === "delivered" && earnedPoints > 0 ? (
                        <span className="text-xs text-green-600 font-bold">
                          +{earnedPoints} pts sumados
                        </span>
                      ) : earnedPoints > 0 ? (
                        <span className="text-xs text-gray-400">
                          +{earnedPoints} pts (al entregar)
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Detalles */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <MapPin className="w-4 h-4 mt-0.5 text-red-500" />
                      <div>
                        <p className="font-bold">
                          {order.service === "takeaway"
                            ? "Retiro en Sucursal"
                            : "Dirección"}
                          :
                        </p>
                        <p>
                          {order.service === "takeaway"
                            ? "Av. Corrientes 1234"
                            : order.delivery_address}
                        </p>
                      </div>
                    </div>
                    
                    {/* 🔥 INDICAR SI HAY CANJES EN LOS ITEMS */}
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between text-sm border-b border-gray-50 pb-2"
                        >
                          <div>
                            <span className="font-bold">{item.quantity}x</span>{" "}
                            {item.name}
                            {(item.isRedemption || item.pointsCost) && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                                💎 Canje
                              </span>
                            )}
                          </div>
                          <span>
                            {(item.isRedemption || item.pointsCost) ? (
                              <span className="text-yellow-600 font-bold">
                                {item.pointsCost ? `💎 ${item.pointsCost * item.quantity} pts` : "0 pts"}
                              </span>
                            ) : (
                              `$${(item.price * item.quantity).toFixed(2)}`
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Acciones */}
                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-t">
                  <div>
                    {(order.status === "pending" || order.status === "confirmed") && (
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 font-medium"
                      >
                        <XCircle className="w-4 h-4" /> Cancelar
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* RASTREO: Disponible para órdenes en camino */}
                    {(order.status === "onway" || order.status === "preparing") && (
                      <button
                        onClick={() => setTrackingOrderId(order.id)}
                        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                      >
                        📍 Rastrear
                      </button>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {trackingOrderId && (
        <OrderTrackingMap
          orderId={trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
        />
      )}
    </div>
  );
}