"use client";

import { PizzaCard } from "@/components/pizza-card";

export default function Home() {
  const pizzas = [
    {
      id: 1,
      name: "Margherita Clásica",
      description:
        "Salsa de tomate San Marzano, mozzarella fresca, albahaca y aceite de oliva extra virgen",
      image: "/delicious-margherita-pizza-with-fresh-basil-and-mo.jpg",
      available: true,
      price: 12.99,
    },
    {
      id: 2,
      name: "Pepperoni Suprema",
      description:
        "Generosas rodajas de pepperoni premium, mozzarella y nuestra salsa especial de tomate",
      image: "/pepperoni-pizza-with-melted-cheese-and-crispy-pepp.jpg",
      available: true,
      price: 14.99,
    },
    {
      id: 3,
      name: "Quattro Formaggi",
      description:
        "Mezcla de mozzarella, gorgonzola, parmesano y queso de cabra sobre base blanca",
      image: "/four-cheese-pizza-with-creamy-white-sauce.jpg",
      available: false,
      price: 16.99,
    },
    {
      id: 4,
      name: "Prosciutto e Rucola",
      description:
        "Jamón prosciutto italiano, rúcula fresca, parmesano en lascas y reducción balsámica",
      image: "/prosciutto-pizza-with-arugula-and-parmesan-shaving.jpg",
      available: true,
      price: 17.99,
    },
    {
      id: 5,
      name: "Diavola Picante",
      description:
        "Salami picante, jalapeños, cebolla roja, mozzarella y aceite de chile calabrés",
      image: "/spicy-diavola-pizza-with-hot-peppers-and-salami.jpg",
      available: false,
      price: 15.99,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-foreground text-center font-serif">
            Pizzeria Imperial
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Auténtica pizzas
          </p>
        </div>
      </header>

      {/* Pizza Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Nuestras Pizzas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Pizzeria Bella Napoli. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
