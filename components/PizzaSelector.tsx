"use client";

import { useState } from "react";

interface PizzaSelectorProps {
  onCategoryChange: (category: string) => void;
}

const PizzaSelector: React.FC<PizzaSelectorProps> = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState("clasicas");

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
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="mb-8">
      <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={`flex-1 py-4 px-2 text-sm font-medium text-center transition-colors ${
              activeCategory === category.id
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${
              index < categories.length - 1 ? "border-r border-gray-300" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="font-semibold">{category.name}</div>
            <div className="text-xs mt-1 opacity-75">
              {category.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PizzaSelector;
