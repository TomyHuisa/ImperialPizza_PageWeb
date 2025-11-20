"use client";

import { useState } from "react";

interface PizzaSelectorProps {
  // 🔥 CORRECCIÓN: Ahora es un componente "Controlado"
  selectedCategory: string; // La categoría activa viene del padre (page.tsx)
  onSelectCategory: (category: string) => void; // El callback para actualizar al padre (Antes era onCategoryChange)
}

// Destructuramos las props controladas
const PizzaSelector: React.FC<PizzaSelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  // 💡 NOTA: El estado interno 'activeCategory' se elimina ya que la categoría
  // activa es ahora la prop 'selectedCategory'.

  const categories = [
    {
      id: "clasicas",
      name: "Pizzas Clásicas",
      description: "Las favoritas de siempre",
    },
    {
      id: "especiales",
      name: "Pizzas Especiales",
      description: "Nuestras creaciones únicas",
    },
    {
      id: "vegetarianas",
      name: "Pizzas Vegetarianas",
      description: "Sabores frescos y naturales",
    },
    {
      id: "personaliza",
      name: "Personaliza",
      description: "Crea tu propia pizza",
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    // 🔥 CORRECCIÓN DE ERROR: Usamos la prop de callback onSelectCategory
    onSelectCategory(categoryId);
  };

  return (
    <div className="mb-8">
      <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`flex-1 py-4 px-2 text-sm font-medium text-center transition-colors ${
              // 🔥 Usamos la prop 'selectedCategory' para la clase activa
              selectedCategory === category.id
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${
              index < categories.length - 1 ? "border-r border-gray-300" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="font-semibold">{category.name}</div>
            <div className="text-xs text-muted-foreground/80">
              {category.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PizzaSelector;
