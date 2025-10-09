"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems] = useState<any[]>([]); // Carrito vacío por defecto

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleCheckout = () => {
    // En una implementación real, aquí iría la lógica de checkout
    alert("Funcionalidad de checkout en desarrollo");
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
            // Carrito con items (estructura para cuando haya productos)
            <div className="text-left">
              {/* Aquí iría la lista de productos cuando el carrito no esté vacío */}
              <div className="space-y-4">
                {/* Ejemplo de item (no visible cuando cartItems está vacío) */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src="/margherita.jpg"
                      alt="Pizza"
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Pizza Margherita
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Cantidad: 1
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">$12.99</p>
                    <button className="text-red-600 hover:text-red-700 text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-foreground">Subtotal:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-foreground">Envío:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-lg font-bold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-red-600">$0.00</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Proceder al Pago
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
