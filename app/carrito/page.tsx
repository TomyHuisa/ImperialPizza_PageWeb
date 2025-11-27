"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Banknote, Bike, Store } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    user,
    cart: cartItems,
    removeFromCart,
    updateCartItem,
    createOrder,
    validateCartStock,
  } = useAuth();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    address: user?.location || "",
    notes: "",
  });

  // Selector de servicio
  const [serviceType, setServiceType] = useState<"delivery" | "takeaway">(
    "delivery"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "efectivo" | "tarjeta" | "puntos" | ""
  >("");
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: prev.name || user.username || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.location || "",
      }));
    }
  }, [user]);

  // Cálculos
  const totalMoney = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.pointsCost && item.pointsCost > 0 ? 0 : item.price * item.quantity),
    0
  );
  const totalPointsCost = cartItems.reduce(
    (acc, item) => acc + (item.pointsCost || 0) * item.quantity,
    0
  );
  const totalPointsEarn = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.pointsCost && item.pointsCost > 0
        ? 0
        : Math.floor(item.price) * item.quantity),
    0
  );

  const isPureRedemption = totalMoney === 0 && cartItems.length > 0;
  const canProceed = user ? user.points >= totalPointsCost : true;
  const isCardComplete =
    cardInfo.number && cardInfo.name && cardInfo.expiry && cardInfo.cvv;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (
      !customerInfo.name ||
      !customerInfo.phone ||
      (serviceType === "delivery" && !customerInfo.address)
    ) {
      toast({
        variant: "destructive",
        title: "Faltan datos",
        description: "Verifica nombre, teléfono y dirección.",
      });
      return;
    }
    if (!isPureRedemption && !paymentMethod) {
      toast({
        variant: "destructive",
        title: "Método de pago",
        description: "Selecciona cómo quieres pagar.",
      });
      return;
    }
    if (paymentMethod === "tarjeta" && !isCardComplete) {
      toast({
        variant: "destructive",
        title: "Datos de tarjeta",
        description: "Completa la información de pago.",
      });
      return;
    }
    if (!canProceed) {
      toast({
        variant: "destructive",
        title: "Puntos insuficientes",
        description: "No te alcanzan los puntos.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await validateCartStock();

      const orderId = await createOrder({
        customer_name: customerInfo.name,
        phone: customerInfo.phone,
        delivery_address:
          serviceType === "delivery" ? customerInfo.address : "Retiro en Local",
        customer_notes: customerInfo.notes,
        payment_method: isPureRedemption ? "puntos" : paymentMethod,

        // 🔥 CORRECCIÓN: Enviamos la variable correcta al contexto
        service: serviceType,

        points_spent: totalPointsCost,
        points_earned: totalPointsEarn,
      });

      if (orderId) {
        toast({
          title: "✅ Pedido Confirmado",
          description: `Tu orden #${orderId.slice(0, 8)} está en camino.`,
        });
        setTimeout(() => router.push("/orders"), 2000);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-red-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Menú
          </Link>
          <h1 className="text-xl font-bold ml-auto">Carrito</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p>Carrito vacío</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.pizzaId}-${item.comment}`}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.comment}</p>
                  {(item.pointsCost || 0) > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">
                      💎 Canje: {item.pointsCost} pts
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded-md bg-gray-50">
                    <button
                      onClick={() =>
                        updateCartItem(
                          item.pizzaId,
                          item.comment,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartItem(
                          item.pizzaId,
                          item.comment,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-1 hover:bg-gray-200"
                      disabled={
                        item.maxStock ? item.quantity >= item.maxStock : false
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-lg">
                    {(item.pointsCost || 0) > 0
                      ? `${item.pointsCost! * item.quantity} pts`
                      : `$${(item.price * item.quantity).toFixed(2)}`}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.pizzaId, item.comment)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold">📝 Entrega y Datos</h2>

              {/* Selector de Servicio */}
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setServiceType("delivery")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${
                    serviceType === "delivery"
                      ? "bg-white shadow text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  <Bike size={20} /> Delivery
                </button>
                <button
                  onClick={() => setServiceType("takeaway")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${
                    serviceType === "takeaway"
                      ? "bg-white shadow text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  <Store size={20} /> Takeaway
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                {serviceType === "delivery" && (
                  <input
                    type="text"
                    placeholder="Dirección de Entrega"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded md:col-span-2"
                  />
                )}
                <textarea
                  rows={2}
                  placeholder="Notas adicionales..."
                  value={customerInfo.notes}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, notes: e.target.value })
                  }
                  className="w-full p-2 border rounded md:col-span-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen</h2>
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Total Efectivo</span>
                  <span>${totalMoney.toFixed(2)}</span>
                </div>
                {totalPointsCost > 0 && (
                  <div className="flex justify-between text-yellow-600 font-bold">
                    <span>Total Canje</span>
                    <span>{totalPointsCost} pts</span>
                  </div>
                )}
              </div>

              {isPureRedemption ? (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-center">
                  <p className="font-bold text-yellow-800">
                    ✨ Canjeado con Puntos
                  </p>
                  <p className="text-sm text-yellow-600">No requiere pago.</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-sm text-gray-700">Pago</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod("efectivo")}
                      className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                        paymentMethod === "efectivo"
                          ? "bg-red-50 border-red-500 text-red-700"
                          : ""
                      }`}
                    >
                      <Banknote /> <span className="text-sm">Efectivo</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("tarjeta")}
                      className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${
                        paymentMethod === "tarjeta"
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : ""
                      }`}
                    >
                      <CreditCard /> <span className="text-sm">Tarjeta</span>
                    </button>
                  </div>
                  {paymentMethod === "tarjeta" && (
                    <div className="bg-gray-50 p-4 rounded border space-y-3">
                      <input
                        type="text"
                        placeholder="Nro Tarjeta"
                        value={cardInfo.number}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, number: e.target.value })
                        }
                        className="w-full p-2 border rounded text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={cardInfo.expiry}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, expiry: e.target.value })
                          }
                          className="w-full p-2 border rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardInfo.cvv}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, cvv: e.target.value })
                          }
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={cardInfo.name}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, name: e.target.value })
                        }
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={
                  isSubmitting ||
                  (!isPureRedemption && !paymentMethod) ||
                  !canProceed
                }
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-300 shadow-md"
              >
                {isSubmitting ? "Procesando..." : "CONFIRMAR PEDIDO"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
