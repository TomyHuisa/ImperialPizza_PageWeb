"use client";

import { useState } from "react";
import { PizzaCard } from "@/components/pizza-card";
import PizzaSelector from "@/components/PizzaSelector";
import Header from "@/components/Header";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("clasicas");

  const pizzas = [
    {
      id: 1,
      name: "Margherita Clásica",
      description:
        "Salsa de tomate San Marzano, mozzarella fresca, albahaca y aceite de oliva extra virgen",
      image: "/delicious-margherita-pizza-with-fresh-basil-and-mo.jpg",
      available: true,
      price: 12.99,
      category: "clasicas",
    },
    {
      id: 2,
      name: "Pepperoni Suprema",
      description:
        "Generosas rodajas de pepperoni premium, mozzarella y nuestra salsa especial de tomate",
      image: "/pepperoni-pizza-with-melted-cheese-and-crispy-pepp.jpg",
      available: true,
      price: 14.99,
      category: "clasicas",
    },
    {
      id: 3,
      name: "Quattro Formaggi",
      description:
        "Mezcla de mozzarella, gorgonzola, parmesano y queso de cabra sobre base blanca",
      image: "/four-cheese-pizza-with-creamy-white-sauce.jpg",
      available: false,
      price: 16.99,
      category: "especiales",
    },
    {
      id: 4,
      name: "Prosciutto e Rucola",
      description:
        "Jamón prosciutto italiano, rúcula fresca, parmesano en lascas y reducción balsámica",
      image: "/prosciutto-pizza-with-arugula-and-parmesan-shaving.jpg",
      available: true,
      price: 17.99,
      category: "especiales",
    },
    {
      id: 5,
      name: "Diavola Picante",
      description:
        "Salami picante, jalapeños, cebolla roja, mozzarella y aceite de chile calabrés",
      image: "/spicy-diavola-pizza-with-hot-peppers-and-salami.jpg",
      available: false,
      price: 15.99,
      category: "especiales",
    },
    // Agregando algunas pizzas vegetarianas de ejemplo
    {
      id: 6,
      name: "Vegetariana Mediterránea",
      description:
        "Berenjena asada, pimientos, cebolla caramelizada, aceitunas kalamata y queso feta",
      image: "/mediterranean-vegetable-pizza.jpg",
      available: true,
      price: 15.99,
      category: "vegetarianas",
    },
    {
      id: 7,
      name: "Hortalizas Frescas",
      description:
        "Calabacín, champiñones, espinacas, tomate fresco y mozzarella de búfala",
      image: "/fresh-vegetable-pizza.jpg",
      available: true,
      price: 14.99,
      category: "vegetarianas",
    },
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Filtrar pizzas según la categoría seleccionada
  const filteredPizzas = pizzas.filter((pizza) =>
    selectedCategory === "personaliza"
      ? false
      : pizza.category === selectedCategory
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header actualizado */}
      <Header />

      {/* Contenido principal */}
      <section className="container mx-auto px-4 py-12">
        {/* Selector de categorías de pizza */}
        <PizzaSelector onCategoryChange={handleCategoryChange} />

        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Nuestras Pizzas
        </h2>

        {/* Mostrar contenido según la categoría seleccionada */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPizzas.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Pizzeria Imperial. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
