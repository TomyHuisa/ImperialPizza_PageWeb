// page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Bike,
  Store,
  Gem,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
} from "lucide-react";

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
    getCartTotal,
    getCartItemsCount,
    getPointsSpent,
    // 🔥 IMPORTAR LA CONSTANTE
    POINTS_TO_DOLLAR_DISCOUNT_RATE, 
  } = useAuth();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    address: user?.location || "",
    notes: "",
  });

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
  const [showCardForm, setShowCardForm] = useState(false);
  
  // 🔥 NUEVOS ESTADOS PARA EL DESCUENTO PARCIAL
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [showDiscountWarning, setShowDiscountWarning] = useState(false);
  const MIN_POINTS_THRESHOLD = 1; 

  // Validar stock al cargar la página y sincronizar usuario
  useEffect(() => {
    if (cartItems.length > 0) {
      validateCartStock();
    }
    if (user) {
        setCustomerInfo((prev) => ({
            ...prev,
            name: prev.name || user.username || "",
            phone: prev.phone || user.phone || "",
            address: prev.address || user.location || "",
        }));
    }
  }, [cartItems.length, validateCartStock, user]);

  // Lógica de Puntos para Canje Total y Descuento Parcial
  const cartTotal = getCartTotal();
  const userPoints = user?.points || 0;
  const isPureRedemption = paymentMethod === "puntos"; 
  
  // 🔥 LÓGICA DE CÁLCULO DEL DESCUENTO PARCIAL
  const { maxPossibleDiscount, actualDiscountAmount, pointsToSpend, finalTotal, isPointsDiscountButtonActive } = useMemo(() => {
    // 1. Descuento máximo posible en $ (ej: 45 pts * 0.5 = $22.50)
    const maxDiscount = userPoints * POINTS_TO_DOLLAR_DISCOUNT_RATE;
    
    // 2. Descuento real aplicado (no puede ser mayor al total del carrito)
    const actualAmount = Math.min(maxDiscount, cartTotal);
    
    // 3. Puntos que se gastarían realmente para este descuento (redondeado hacia arriba)
    const pointsToSpendCalc = Math.ceil(actualAmount / POINTS_TO_DOLLAR_DISCOUNT_RATE);
    
    // 4. Total a pagar después del descuento
    const final = isDiscountApplied ? cartTotal - actualAmount : cartTotal;
    
    // 5. Lógica para habilitar el botón
    const isActive = userPoints >= MIN_POINTS_THRESHOLD && cartTotal > 0;
    
    return {
        maxPossibleDiscount: maxDiscount,
        actualDiscountAmount: actualAmount,
        pointsToSpend: pointsToSpendCalc,
        finalTotal: final,
        isPointsDiscountButtonActive: isActive,
    };
  }, [cartTotal, userPoints, isDiscountApplied, POINTS_TO_DOLLAR_DISCOUNT_RATE]);

  // Funciones para manejar el descuento
  const handleApplyDiscountClick = () => {
    if (isDiscountApplied) {
      setIsDiscountApplied(false);
      toast({ title: "❌ Descuento de Puntos Removido" });
    } else if (isPointsDiscountButtonActive) {
      setShowDiscountWarning(true);
    }
  };
  
  const confirmApplyDiscount = () => {
    setIsDiscountApplied(true);
    setShowDiscountWarning(false);
    toast({ 
        title: "✅ Descuento Aplicado", 
        description: `Se descontarán ${pointsToSpend} puntos ($${actualDiscountAmount.toFixed(2)}) de tu total.`,
        className: "bg-yellow-50 border-yellow-200" 
    });
    
    // Si el descuento cubre todo el costo, limpiar método de pago externo
    if (finalTotal === 0 && paymentMethod !== "puntos") {
        setPaymentMethod("puntos"); // Se convierte en un pago completo con puntos
    } else if (finalTotal > 0 && paymentMethod === "puntos") {
        setPaymentMethod(""); // Si ya no cubre todo, limpiar para obligar a elegir
    }
  };

  // Efecto: Si es canje total (por items gratis), desactivar descuento parcial
  useEffect(() => {
    if (isPureRedemption && !isDiscountApplied && cartTotal === 0) {
        // Es un canje puro por items de 0 costo, no aplica descuento de dinero
    }
  }, [isPureRedemption, isDiscountApplied, cartTotal]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodSelect = (method: "efectivo" | "tarjeta" | "puntos" | "") => {
    setPaymentMethod(method);
    setShowCardForm(method === "tarjeta");
    
    // Si selecciona explícitamente "puntos" (solo posible si todo es canje), 
    // desactivar el descuento parcial de dinero para evitar doble conteo lógico
    if (method === "puntos" && cartTotal === 0) {
        setIsDiscountApplied(false);
    }
  };

  const isCardInfoComplete = () => {
    return cardInfo.number && cardInfo.name && cardInfo.expiry && cardInfo.cvv;
  };
  
  const isFormComplete =
    customerInfo.name &&
    customerInfo.phone &&
    (serviceType === "takeaway" || customerInfo.address);

  // Validación final para proceder
  const canProceed = isFormComplete && (
    (paymentMethod === "puntos" && finalTotal === 0) // Cubierto totalmente por puntos
    || (paymentMethod !== "" && finalTotal > 0) // Pago parcial con dinero
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!user) {
      toast({ variant: "destructive", title: "⚠️ Acceso denegado", description: "Debes iniciar sesión." });
      return;
    }
    
    if (finalTotal > 0 && !paymentMethod) {
        toast({ variant: "destructive", title: "⚠️ Selecciona un método de pago", description: "Por favor, elige cómo pagar el total restante." });
        return;
    }

    if (paymentMethod === "tarjeta" && !isCardInfoComplete()) {
        toast({ variant: "destructive", title: "⚠️ Datos de tarjeta incompletos" });
        return;
    }
    
    const stockOk = await validateCartStock();
    if (!stockOk) {
        toast({ variant: "destructive", title: "⚠️ Stock no disponible", description: "Revisa tu carrito." });
        return;
    }

    setIsSubmitting(true);
    
    try {
      // Determinar método final
      let finalPaymentMethod = paymentMethod;
      if (finalTotal === 0 && isDiscountApplied) {
          finalPaymentMethod = "puntos";
      }

      const orderId = await createOrder({
        customer_name: customerInfo.name,
        phone: customerInfo.phone,
        delivery_address: serviceType === "delivery" ? customerInfo.address : "Retiro en Local",
        customer_notes: customerInfo.notes,
        payment_method: finalPaymentMethod as any,
        service: serviceType,
        // 🔥 PASAR EL DESCUENTO Y PUNTOS GASTADOS
        pointsDiscount: isDiscountApplied ? actualDiscountAmount : undefined,
        pointsSpent: isDiscountApplied ? pointsToSpend : undefined,
      });

      if (orderId) {
        toast({ title: "🎉 Pedido Confirmado", description: `Tu orden #${orderId.slice(0, 8)} está en camino.`, className: "bg-green-50 border-green-200" });
        setTimeout(() => router.push("/historial-pedidos"), 2000);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "❌ Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/" className="flex items-center text-gray-600 hover:text-red-600">
            <ArrowLeft className="w-5 h-5 mr-2" /> Menú
          </Link>
          <h1 className="text-xl font-bold ml-auto">Carrito ({getCartItemsCount()})</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Items del Carrito */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow"><p>Carrito vacío</p></div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.pizzaId}-${idx}`} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-md object-cover" />
                <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.comment}</p>
                  {(item.pointsCost || 0) > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">💎 Canje: {item.pointsCost} pts</span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded-md bg-gray-50">
                    <button onClick={() => updateCartItem(item.pizzaId, item.comment, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-200">-</button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button onClick={() => updateCartItem(item.pizzaId, item.comment, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-200" disabled={item.maxStock ? item.quantity >= item.maxStock : false}>+</button>
                  </div>
                  <p className="font-bold text-lg">
                    {(item.pointsCost || 0) > 0 ? `${item.pointsCost! * item.quantity} pts` : `$${(item.price * item.quantity).toFixed(2)}`}
                  </p>
                  <button onClick={() => removeFromCart(item.pizzaId, item.comment)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-lg font-bold">📝 Entrega y Datos</h2>
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button onClick={() => setServiceType("delivery")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${serviceType === "delivery" ? "bg-white shadow text-red-600" : "text-gray-500"}`}><Bike size={20} /> Delivery</button>
                <button onClick={() => setServiceType("takeaway")} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-medium transition-all ${serviceType === "takeaway" ? "bg-white shadow text-red-600" : "text-gray-500"}`}><Store size={20} /> Takeaway</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Nombre" value={customerInfo.name} onChange={handleChange} className="w-full p-2 border rounded" />
                <input type="tel" name="phone" placeholder="Teléfono" value={customerInfo.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                {serviceType === "delivery" && <input type="text" name="address" placeholder="Dirección" value={customerInfo.address} onChange={handleChange} className="w-full p-2 border rounded md:col-span-2" />}
                <textarea rows={2} name="notes" placeholder="Notas..." value={customerInfo.notes} onChange={handleChange} className="w-full p-2 border rounded md:col-span-2" />
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="lg:col-span-1">
          {cartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen</h2>
              
              {/* 🔥 BOTÓN DE DESCUENTO */}
              {user && cartTotal > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-yellow-800 flex items-center gap-1"><Gem size={16} /> Mis Puntos</span>
                        <span className="font-bold text-yellow-900">{userPoints}</span>
                    </div>
                    <button
                        onClick={handleApplyDiscountClick}
                        disabled={!isPointsDiscountButtonActive} 
                        className={`w-full p-2 rounded text-sm font-bold transition-all border ${
                        isDiscountApplied
                            ? "bg-white text-yellow-600 border-yellow-400 hover:bg-yellow-50"
                            : isPointsDiscountButtonActive
                            ? "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600"
                            : "bg-gray-100 text-gray-400 border-gray-300"
                        }`}
                    >
                        {isDiscountApplied ? "Quitar Descuento" : "Gastar Puntos"}
                    </button>
                    {isDiscountApplied && <p className="text-xs text-center mt-2 text-yellow-700">Descuento aplicado: ${actualDiscountAmount.toFixed(2)}</p>}
                </div>
              )}

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                
                {isDiscountApplied && (
                    <div className="flex justify-between text-yellow-600 font-bold border-b border-dashed pb-2">
                        <span>Descuento Puntos (-{pointsToSpend})</span>
                        <span>- ${actualDiscountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-xl font-bold pt-4 border-t border-border">
                    <span>Total a Pagar</span>
                    <span className={finalTotal === 0 ? "text-green-600" : "text-red-600"}>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Opciones de Pago */}
              {finalTotal > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-sm text-gray-700">Pago Restante</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handlePaymentMethodSelect("efectivo")} className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${paymentMethod === "efectivo" ? "bg-red-50 border-red-500 text-red-700" : ""}`}><Banknote /> <span className="text-sm">Efectivo</span></button>
                    <button onClick={() => handlePaymentMethodSelect("tarjeta")} className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 ${paymentMethod === "tarjeta" ? "bg-blue-50 border-blue-500 text-blue-700" : ""}`}><CreditCard /> <span className="text-sm">Tarjeta</span></button>
                  </div>
                  
                  {paymentMethod === "tarjeta" && showCardForm && (
                    <div className="bg-gray-50 p-3 rounded border space-y-3">
                        <input type="text" placeholder="Nro Tarjeta" value={cardInfo.number} onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})} className="w-full p-2 border rounded text-sm" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="MM/AA" value={cardInfo.expiry} onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})} className="w-full p-2 border rounded text-sm" />
                            <input type="text" placeholder="CVV" value={cardInfo.cvv} onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})} className="w-full p-2 border rounded text-sm" />
                        </div>
                        <input type="text" placeholder="Nombre Titular" value={cardInfo.name} onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})} className="w-full p-2 border rounded text-sm" />
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isSubmitting || !canProceed}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-300 shadow-md"
              >
                {isSubmitting ? "Procesando..." : "CONFIRMAR PEDIDO"}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Advertencia */}
      {showDiscountWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2"><AlertTriangle className="text-yellow-500" /> Confirmar Descuento</h3>
            <p className="text-gray-600 mb-4">
              ¿Deseas gastar tus puntos por este pedido?<br/>
              Se usarán <strong>{pointsToSpend} puntos</strong> para descontar <strong>${actualDiscountAmount.toFixed(2)}</strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscountWarning(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancelar</button>
              <button onClick={confirmApplyDiscount} className="flex-1 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-bold">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}