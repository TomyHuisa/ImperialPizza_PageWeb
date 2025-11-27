"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; 
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const {
    user,
    cart: cartItems,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    createOrder,
  } = useAuth();

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    address: user?.location || "", 
    notes: "",
  });

  useEffect(() => {
    if (user) {
        setCustomerInfo(prev => ({
            ...prev,
            name: prev.name || user.username || "",
            phone: prev.phone || user.phone || "",
            address: prev.address || user.location || ""
        }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "tarjeta" | "">("");
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showCardForm, setShowCardForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!paymentMethod) {
      toast({
        variant: "destructive",
        title: "❌ Método de pago requerido",
        description: "Por favor selecciona un método de pago.",
      });
      return;
    }

    if (paymentMethod === "tarjeta" && !isCardInfoComplete()) {
      toast({
        variant: "destructive",
        title: "❌ Información de tarjeta incompleta",
        description: "Por favor ingresa todos los datos de tu tarjeta.",
      });
      return;
    }

    // Validación estricta para asegurar que la dirección no vaya vacía
    if (!customerInfo.phone || !customerInfo.address || !customerInfo.name) {
      toast({
        variant: "destructive",
        title: "❌ Información incompleta",
        description: "Por favor completa Nombre, Teléfono y Dirección.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const total = getCartTotal();
      
      // 🔥 Lógica de Puntos: 
      // Si pagas, ganas puntos (ej. 1 punto por cada $1).
      // Si el total es 0 (todo canje), no ganas puntos.
      const pointsEarned = total > 0 ? Math.floor(total) : 0;
      const currentPoints = user?.points || 0;
      const newUserPoints = currentPoints + pointsEarned;

      const orderData = {
        ...customerInfo, // Esto contiene 'address', 'notes', etc.
        payment_method: paymentMethod,
        userId: user?.id,
        // Datos para la actualización de puntos en AuthContext
        pointsEarned: pointsEarned,
        newUserPoints: newUserPoints
      };

      console.log("Enviando orden:", orderData); // Para depuración

      const orderId = await createOrder(orderData);

      if (orderId) {
        toast({
          title: "✅ Pedido realizado",
          description: `Pedido #${orderId} creado. Ganaste ${pointsEarned} puntos.`,
          duration: 4000,
        });

        setTimeout(() => {
          router.push("/"); 
        }, 3000);
      } else {
        throw new Error("No se pudo crear el pedido");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "No se pudo crear el pedido. Revisa tu conexión.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateQuantity = async (
    pizzaId: string,
    comment: string,
    newQuantity: number
  ) => {
    updateCartItem(pizzaId, comment, newQuantity);
  };

  const handleRemoveItem = (pizzaId: string, comment: string) => {
      removeFromCart(pizzaId, comment);
  };

  const handlePaymentMethodSelect = (method: "efectivo" | "tarjeta") => {
    setPaymentMethod(method);
    setShowCardForm(method === "tarjeta");
  };

  const handleAddCard = () => {
    setShowCardForm(true);
    setPaymentMethod("tarjeta");
  };

  const isCardInfoComplete = () => {
    return cardInfo.number && cardInfo.name && cardInfo.expiry && cardInfo.cvv;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-foreground font-serif text-center flex-1">
              Pizzeria Imperial
            </h1>
            <div className="text-lg font-semibold">{getCartItemsCount()} items</div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Carrito de Compras
          </h1>
          <p className="text-muted-foreground">
            Revisa y gestiona tus pizzas antes de realizar el pedido
          </p>
        </div>

        {/* Estado del carrito */}
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          {cartItems.length === 0 ? (
            <div className="py-12">
              <svg className="w-24 h-24 text-muted-foreground mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-foreground mb-4">Tu carrito está vacío</h2>
              <button onClick={handleContinueShopping} className="bg-red-600 text-white py-3 px-8 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Explorar Pizzas
              </button>
            </div>
          ) : (
            <div className="text-left">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.pizzaId}-${item.comment}-${index}`}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        {item.comment && (
                          <p className="text-sm text-blue-600 mt-1">
                            <strong>Nota:</strong> {item.comment}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <button onClick={() => handleUpdateQuantity(item.pizzaId, item.comment, item.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">-</button>
                          <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.pizzaId, item.comment, item.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">+</button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => handleRemoveItem(item.pizzaId, item.comment)} className="text-red-600 hover:text-red-700 text-sm mt-2">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Información del cliente */}
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-foreground">Información de Contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre completo *</label>
                    <input type="text" placeholder="Tu nombre" value={customerInfo.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full p-3 border border-border rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Teléfono *</label>
                    <input type="tel" placeholder="Tu teléfono" value={customerInfo.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full p-3 border border-border rounded-md" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Dirección de entrega *</label>
                  <input type="text" placeholder="Dirección completa para la entrega" value={customerInfo.address} onChange={(e) => handleInputChange("address", e.target.value)} className="w-full p-3 border border-border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notas adicionales</label>
                  <textarea placeholder="Instrucciones especiales..." value={customerInfo.notes} onChange={(e) => handleInputChange("notes", e.target.value)} className="w-full p-3 border border-border rounded-md h-20 resize-none" />
                </div>
              </div>

              {/* Método de Pago */}
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-foreground">Método de Pago</h3>
                {!showCardForm && (
                  <div onClick={handleAddCard} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-red-500 mb-6">
                    <p className="text-lg font-semibold text-gray-600">Agregar Tarjeta</p>
                  </div>
                )}
                {showCardForm && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Número" value={cardInfo.number} onChange={(e) => handleCardInputChange("number", formatCardNumber(e.target.value))} className="w-full p-3 border rounded-md" />
                        <input type="text" placeholder="Nombre" value={cardInfo.name} onChange={(e) => handleCardInputChange("name", e.target.value.toUpperCase())} className="w-full p-3 border rounded-md" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/AA" value={cardInfo.expiry} onChange={(e) => handleCardInputChange("expiry", formatExpiry(e.target.value))} className="w-full p-3 border rounded-md" />
                        <input type="text" placeholder="CVV" value={cardInfo.cvv} onChange={(e) => handleCardInputChange("cvv", e.target.value.replace(/[^0-9]/g, ""))} className="w-full p-3 border rounded-md" />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => handlePaymentMethodSelect("efectivo")} className={`p-4 border-2 rounded-lg ${paymentMethod === "efectivo" ? "border-red-600 bg-red-50" : "border-gray-300"}`}>Pagar Efectivo</button>
                  <button onClick={() => { if (!showCardForm) { toast({ title: "Tarjeta requerida" }); return; } handlePaymentMethodSelect("tarjeta"); }} disabled={!showCardForm || !isCardInfoComplete()} className={`p-4 border-2 rounded-lg ${paymentMethod === "tarjeta" ? "border-green-600 bg-green-50" : "border-gray-300"}`}>Pagar con Tarjeta</button>
                </div>
              </div>

              {/* Resumen */}
              <div className="mt-6 p-6 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-4"><span className="text-foreground">Subtotal:</span><span className="font-semibold">${getCartTotal().toFixed(2)}</span></div>
                <div className="flex justify-between items-center mb-6 text-lg font-bold"><span className="text-foreground">Total:</span><span className="text-red-600">${getCartTotal().toFixed(2)}</span></div>
                <button onClick={handleCheckout} disabled={isSubmitting || cartItems.length === 0} className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-400">
                  {isSubmitting ? "Procesando..." : "Realizar Pedido"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}