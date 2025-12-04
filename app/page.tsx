"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { PizzaCard } from "@/components/pizza-card";
import PizzaSelector from "@/components/PizzaSelector";
import Header from "@/components/Header";
import PocketBaseService from "@/lib/pocketbase";
import { CartModal } from "@/components/cart-modal";
import { useAuth } from "@/contexts/AuthContext";

// Importación dinámica
const OrderTrackingMap = dynamic(
  () => import("@/components/OrderTrackingMap"),
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

// Interfaz Pizza completa con todos los campos
interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
  popular: boolean;
  price_points: number;
}

// Función de normalización de cadenas
const normalizeString = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export default function Home() {
  const { toast } = useToast();
  const { user, refreshUser, addToCart } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("clasicas");
  const [allPizzas, setAllPizzas] = useState<Pizza[]>([]);
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [cartComment, setCartComment] = useState("");
  const [isRedemptionMode, setIsRedemptionMode] = useState(false);

  // Referencia para evitar doble llamada en Strict Mode
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;

    const loadAllPizzas = async () => {
      setLoadingPizzas(true);
      try {
        const pb = PocketBaseService.getInstance();

        const records = await pb.collection("pizzas").getFullList<Pizza>({
          sort: "-popular,name",
        });

        // Mapear correctamente todos los campos incluyendo price_points y popular
        const pizzasData: Pizza[] = records.map((record: any) => ({
          id: record.id,
          name: record.name,
          description: record.description,
          category: record.category,
          price: record.price,
          stock: record.stock,
          image: record.image
            ? pb.files.getUrl(record, record.image)
            : "/placeholder.svg",
          popular: record.popular || false,
          price_points: record.price_points || 0,
        }));

        // Debug: Verificar que los datos lleguen correctamente
        console.log("Pizzas cargadas desde PocketBase:", pizzasData);
        pizzasData.forEach(pizza => {
          console.log(`${pizza.name}: $${pizza.price}, ${pizza.price_points} pts, popular: ${pizza.popular}`);
        });

        setAllPizzas(pizzasData);
      } catch (error: any) {
        console.error("Error al cargar pizzas:", error);

        let description =
          error.message ||
          "No se pudieron cargar las pizzas. Intenta de nuevo.";
        if (error.status === 404) {
          description =
            "Colección 'pizzas' no encontrada. Verifica el nombre en PocketBase.";
        } else if (error.status === 403) {
          description =
            "Acceso denegado. Asegúrate de que los permisos de la colección 'pizzas' estén configurados para 'Anyone'.";
        }

        if (error.message !== "The request was autocancelled.") {
          toast({
            variant: "destructive",
            title: "❌ Error de conexión al API",
            description: description,
          });
        }
      } finally {
        setLoadingPizzas(false);
      }
    };

    loadAllPizzas();
  }, [toast]);

  const filteredPizzas = allPizzas.filter(
    (pizza) =>
      normalizeString(pizza.category) === normalizeString(selectedCategory)
  );

  const handleAddToCartClick = (
    pizza: Pizza,
    isRedemption: boolean = false
  ) => {
    if (pizza.stock <= 0) {
      toast({
        variant: "destructive",
        title: "⚠️ Agotado",
        description: "Sin stock disponible.",
      });
      return;
    }

    if (isRedemption && user) {
      // Usar price_points directo de la BD
      const pointsCost = pizza.price_points || 0;
      if (user.points < pointsCost) {
        toast({
          variant: "destructive",
          title: "❌ Puntos insuficientes",
          description: `Necesitas ${pointsCost} pts para canjear esta pizza.`,
        });
        return;
      }
    }

    setSelectedPizza(pizza);
    setCartComment(isRedemption ? "Canje de Puntos" : "");
    setIsRedemptionMode(isRedemption);
    setIsCartModalOpen(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedPizza) return;

    if (isRedemptionMode) {
      if (!user || !user.id || !refreshUser) {
        setIsCartModalOpen(false);
        return;
      }
      
      // Usar price_points directo de la BD
      const pointsCost = selectedPizza.price_points || 0;

      try {
        const pb = PocketBaseService.getInstance();
        const newPoints = user.points - pointsCost;

        await pb.collection("users").update(user.id, { points: newPoints });

        addToCart(
          {
            id: selectedPizza.id,
            name: selectedPizza.name,
            price: 0.0,
            image: selectedPizza.image,
            price_points: pointsCost,
          },
          `[CANJE PUNTOS: -${pointsCost}pts] ${cartComment}`,
          true
        );

        await refreshUser();

        toast({
          title: "🎉 Canje Exitoso",
          description: `Se agregó ${selectedPizza.name} al carrito. Se restaron ${pointsCost} puntos.`,
          className: "bg-yellow-50 border-yellow-200",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "❌ Error en el canje",
          description:
            "No se pudo procesar el canje de puntos. Intenta de nuevo.",
        });
      }
    } else {
      addToCart(
        {
          id: selectedPizza.id,
          name: selectedPizza.name,
          price: selectedPizza.price,
          image: selectedPizza.image,
          price_points: selectedPizza.price_points,
        },
        cartComment,
        false
      );

      toast({
        title: "✅ Agregado al carrito",
        description: `Se agregó ${selectedPizza.name} al carrito.`,
      });
    }

    setIsCartModalOpen(false);
    setSelectedPizza(null);
    setCartComment("");
    setIsRedemptionMode(false);
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackingOrderId("simulated_id");
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-serif">
            La Mejor Pizza de la Ciudad
          </h1>
          <p className="text-xl mb-8">
            Hecha con ingredientes frescos y pasión italiana.
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
          Nuestro Menú
        </h2>

        {/* Selector de Categorías (Controlado) */}
        <PizzaSelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loadingPizzas ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Cargando pizzas...</p>
          </div>
        ) : allPizzas.length === 0 ? (
          <div className="text-center py-12 p-8 bg-card rounded-lg shadow-lg max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Menú no disponible
            </h3>
            <p className="text-muted-foreground mb-6">
              Lo sentimos, no hay pizzas disponibles en este momento. Vuelve pronto.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
                  onAddToCart={handleAddToCartClick}
                />
              ))}
            </div>

            {filteredPizzas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No hay pizzas disponibles en la categoría "{selectedCategory}"
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <section className="container mx-auto px-4 py-12 bg-card rounded-lg shadow-lg mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
          Rastrea tu Pedido
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full md:w-1/2">
            <p className="text-lg mb-4 text-muted-foreground">
              Ingresa el ID de tu pedido para ver su estado y ubicación en tiempo real.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ingresa ID del pedido (ej: 1a2b3c)"
                className="flex-1 p-3 border border-border rounded-lg focus:ring-red-500 focus:border-red-500"
                onChange={() => {
                  /* manejar el estado de input si es necesario */
                }}
              />
              <button
                onClick={() => handleTrackOrder("simulated_id")}
                className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Rastrear
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Estados de Pedido:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
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
      </section>

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

      {/* Modal del carrito */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        pizza={selectedPizza}
        comment={cartComment}
        onCommentChange={setCartComment}
        onConfirm={handleConfirmAddToCart}
        isRedemption={isRedemptionMode}
      />
    </main>
  );
}