"use client";

import { useState, useEffect } from "react";
import { PizzaCard } from "@/components/pizza-card";
import PizzaSelector from "@/components/PizzaSelector";
import Header from "@/components/Header";
import PocketBaseService from "@/lib/pocketbase";
import { CartModal } from "@/components/cart-modal";
import { useCart } from "@/contexts/CartContext"; // Importar el hook del carrito

interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("clasicas");
  const [allPizzas, setAllPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el modal del carrito
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [cartComment, setCartComment] = useState("");

  // Usar el contexto del carrito
  const { addToCart } = useCart();

  // Cargar TODAS las pizzas al inicio
  useEffect(() => {
    const loadAllPizzas = async () => {
      setLoading(true);
      try {
        const pb = PocketBaseService.getInstance();

        const records = await pb.collection("pizzas").getFullList({
          sort: "-popular,name",
        });

        const pizzasData = records.map((record: any) => ({
          id: record.id,
          name: record.name,
          description: record.description,
          category: record.category,
          price: record.price,
          image: record.image
            ? pb.files.getUrl(record, record.image)
            : "/placeholder.svg",
          stock: record.stock,
        }));

        setAllPizzas(pizzasData);
      } catch (error) {
        console.error("Error loading pizzas:", error);
        setAllPizzas([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllPizzas();
  }, []);

  // Filtrar pizzas localmente por categoría
  const filteredPizzas = allPizzas.filter((pizza) =>
    selectedCategory === "personaliza"
      ? false
      : pizza.category === selectedCategory
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Función para abrir el modal cuando se hace clic en "Agregar al Carrito"
  const handleAddToCartClick = (pizza: Pizza) => {
    if (pizza.stock <= 0) return;

    setSelectedPizza(pizza);
    setCartComment("");
    setIsCartModalOpen(true);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedPizza) return;

    const success = await addToCart({
      pizzaId: selectedPizza.id,
      name: selectedPizza.name,
      description: selectedPizza.description,
      price: selectedPizza.price,
      comment: cartComment,
      image: selectedPizza.image,
    });

    if (success) {
      toast({
        title: "✅ Agregado al carrito",
        description: `${selectedPizza.name} ha sido agregada a tu pedido.`,
        duration: 2000,
      });

      // Cerrar modal después de agregar
      setIsCartModalOpen(false);
      setSelectedPizza(null);
      setCartComment("");
    }
    // Si no fue success, el toast ya se mostró en el contexto
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          Cargando pizzas...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-12">
        <PizzaSelector onCategoryChange={handleCategoryChange} />

        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Nuestras Pizzas
        </h2>

        {selectedCategory === "personaliza" ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Personaliza tu pizza
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Crea tu pizza perfecta eligiendo entre nuestra selección de
              ingredientes frescos y de alta calidad. Desde la masa hasta los
              toppings, tú decides.
            </p>
            <div className="bg-muted p-6 rounded-lg max-w-2xl mx-auto">
              <p className="text-muted-foreground mb-4">
                Próximamente: Nuestro creador de pizzas personalizadas estará
                disponible
              </p>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Notificarme cuando esté disponible
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPizzas.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
                  onAddToCart={handleAddToCartClick} // Pasamos la función
                />
              ))}
            </div>

            {filteredPizzas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No hay pizzas disponibles en la categoría "{selectedCategory}
                  ".
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Pizzeria Imperial. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modal del carrito */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        pizza={selectedPizza}
        comment={cartComment}
        onCommentChange={setCartComment}
        onConfirm={handleConfirmAddToCart}
      />
    </main>
  );
}
