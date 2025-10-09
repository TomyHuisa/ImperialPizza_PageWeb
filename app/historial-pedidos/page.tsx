"use client";

import Link from "next/link";

// Datos de ejemplo para el historial de pedidos
const orderHistory = [
  {
    id: 1,
    date: "2024-01-15-18:30",
    pizzaName: "Margherita Clásica",
    quantity: 2,
    points: 100,
    total: 25.98,
  },
  {
    id: 2,
    date: "2024-01-10-20:15",
    pizzaName: "Pepperoni Suprema",
    quantity: 1,
    points: 50,
    total: 14.99,
  },
  {
    id: 3,
    date: "2024-01-05-19:45",
    pizzaName: "Quattro Formaggi",
    quantity: 1,
    points: 50,
    total: 16.99,
  },
  {
    id: 4,
    date: "2023-12-28-21:00",
    pizzaName: "Prosciutto e Rucola",
    quantity: 3,
    points: 150,
    total: 53.97,
  },
  {
    id: 5,
    date: "2023-12-20-17:30",
    pizzaName: "Diavola Picante",
    quantity: 1,
    points: 50,
    total: 15.99,
  },
  {
    id: 6,
    date: "2023-12-15-19:15",
    pizzaName: "Vegetariana Mediterránea",
    quantity: 2,
    points: 100,
    total: 31.98,
  },
];

export default function OrderHistoryPage() {
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
            Revisa todos tus pedidos anteriores en Pizzeria Imperial
          </p>
        </div>

        {/* Resumen de puntos */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Tus Puntos Acumulados
              </h2>
              <p className="text-muted-foreground">
                Gana 50 puntos por cada pizza que ordendes
              </p>
            </div>
            <div className="bg-red-600 text-white py-3 px-6 rounded-lg text-center mt-4 sm:mt-0">
              <div className="text-2xl font-bold">500</div>
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
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Información principal del pedido */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {order.date}
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {order.pizzaName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        x{order.quantity}
                      </span>

                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Puntos */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        Puntos: {order.points}+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ganados
                      </div>
                    </div>

                    {/* Botón para reordenar */}
                    <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                      Volver a Pedir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay pedidos (no se muestra con datos de ejemplo) */}
          {orderHistory.length === 0 && (
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
                No hay pedidos anteriores
              </h3>
              <p className="text-muted-foreground mb-4">
                Cuando hagas tu primer pedido, aparecerá aquí.
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
