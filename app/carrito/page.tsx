"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    validateCartStock,
    createOrder, // AÑADIR createOrder aquí
  } = useCart();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isValidating, setIsValidating] = useState(false);

  // Validar stock al cargar la página
  useEffect(() => {
    const validateCart = async () => {
      if (cartItems.length > 0) {
        setIsValidating(true);
        await validateCartStock();
        setIsValidating(false);
      }
    };

    validateCart();
  }, []);

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Validar stock una última vez antes del checkout
    setIsValidating(true);
    const isValid = await validateCartStock();
    setIsValidating(false);

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "❌ Carrito actualizado",
        description: "Revisa los cambios en tu carrito antes de continuar.",
      });
      return;
    }

    // Validar información mínima
    if (!customerInfo.phone || !customerInfo.address) {
      toast({
        variant: "destructive",
        title: "❌ Información incompleta",
        description: "Por favor ingresa tu teléfono y dirección de entrega.",
      });
      return;
    }

    // REEMPLAZAR EL CONSOLE.LOG CON LA LLAMADA A POCKETBASE
    try {
      const orderId = await createOrder(customerInfo);

      if (orderId) {
        toast({
          title: "✅ Pedido realizado",
          description: `Tu pedido #${orderId} ha sido creado exitosamente. Te contactaremos pronto.`,
          duration: 3000,
        });

        // Limpiar carrito después del pedido
        clearCart();

        // Redirigir a home después de un momento
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error("No se pudo crear el pedido");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description:
          "No se pudo crear el pedido. Por favor, intenta nuevamente.",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateQuantity = async (
    pizzaId: string,
    comment: string,
    newQuantity: number
  ) => {
    await updateQuantity(pizzaId, comment, newQuantity);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validando stock...</p>
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
            <div className="text-lg font-semibold">{getTotalItems()} items</div>
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
            // Carrito vacío
            <div className="py-12">
              <svg
                className="w-24 h-24 text-muted-foreground mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Tu carrito está vacío
              </h2>

              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Aún no has agregado ninguna pizza a tu carrito. Explora nuestro
                menú y descubre nuestras deliciosas opciones.
              </p>

              <button
                onClick={handleContinueShopping}
                className="bg-red-600 text-white py-3 px-8 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Explorar Pizzas
              </button>
            </div>
          ) : (
            // Carrito con items
            <div className="text-left">
              {/* Lista de productos */}
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
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                        {item.comment && (
                          <p className="text-sm text-blue-600 mt-1">
                            <strong>Especificación:</strong> {item.comment}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.pizzaId,
                                item.comment,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.pizzaId,
                                item.comment,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >= (item.maxStock || item.quantity)
                            }
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                        {item.maxStock && item.maxStock > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Máximo: {item.maxStock} disponibles
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} c/u
                      </p>
                      <button
                        onClick={() =>
                          removeFromCart(item.pizzaId, item.comment)
                        }
                        className="text-red-600 hover:text-red-700 text-sm mt-2 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Información del cliente */}
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Información de Contacto
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={customerInfo.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      placeholder="Tu teléfono"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dirección de entrega *
                  </label>
                  <input
                    type="text"
                    placeholder="Dirección completa para la entrega"
                    value={customerInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notas adicionales
                  </label>
                  <textarea
                    placeholder="Instrucciones especiales para la entrega, etc."
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 h-20 resize-none"
                  />
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="mt-6 p-6 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-foreground">Subtotal:</span>
                  <span className="font-semibold">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-foreground">Envío:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-lg font-bold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-red-600">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    !customerInfo.phone ||
                    !customerInfo.address ||
                    cartItems.length === 0
                  }
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Realizar Pedido
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="font-semibold text-foreground mb-2">Envío Rápido</h3>
            <p className="text-muted-foreground text-sm">
              Entregamos tu pizza caliente en 30 minutos o menos
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="font-semibold text-foreground mb-2">Pago Seguro</h3>
            <p className="text-muted-foreground text-sm">
              Tus datos están protegidos con encriptación de última generación
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <h3 className="font-semibold text-foreground mb-2">Soporte 24/7</h3>
            <p className="text-muted-foreground text-sm">
              ¿Necesitas ayuda? Nuestro equipo está disponible para asistirte
            </p>
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
    </div>
  );
}
