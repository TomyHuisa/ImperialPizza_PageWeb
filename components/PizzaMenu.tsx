"use client";

import { useState, useEffect } from "react";
import { PizzaCard } from "@/components/pizza-card";
import PizzaSelector from "@/components/PizzaSelector";
import PocketBaseService from "@/lib/pocketbase";

// Interfaz para los registros de PocketBase
interface PocketBasePizzaRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  popular: boolean;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  expand?: any;
}

// Tu interfaz Pizza existente
interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  stock: number;
  price: number;
  category: string;
  popular: boolean;
}

export function PizzaMenu() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("clasicas");
  const [loading, setLoading] = useState(true);

  // 🔥 El useEffect ahora solo depende de selectedCategory
  useEffect(() => {
    // 🔥 Antes: Se usaba AbortController aquí
    loadPizzas(selectedCategory);
  }, [selectedCategory]);

  // 🔥 El 'signal' fue removido de los argumentos
  const loadPizzas = async (category: string) => {
    setLoading(true);
    try {
      const pb = PocketBaseService.getInstance();

      let filter = "";
      if (category && category !== "personaliza") {
        filter = `category = '${category}'`;
      }

      // Especificar el tipo para getFullList
      const records = await pb
        .collection("pizzas")
        .getFullList<PocketBasePizzaRecord>({
          filter,
          sort: "-popular,name",
          // 🔥 Antes: fetch: { signal }, // Esta era la línea problemática
        });

      // Mapear los datos de PocketBase a tu interfaz
      const pizzasData: Pizza[] = records.map(
        (record: PocketBasePizzaRecord) => ({
          id: record.id,
          name: record.name,
          description: record.description,
          category: record.category,
          price: record.price,
          image: record.image
            ? pb.files.getUrl(record, record.image)
            : "/placeholder.svg",
          stock: record.stock,
          popular: record.popular,
        })
      );

      setPizzas(pizzasData);
      console.log("Pizzas cargadas:", pizzasData);
    } catch (error: any) {
      // Ahora solo manejamos errores de conexión/PocketBase
      console.error("Error loading pizzas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando pizzas...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Nuestras Pizzas</h1>

      {/* COMPONENTE CONTROLADO: CORRECCIÓN DE PROPS */}
      <PizzaSelector
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <PizzaCard key={pizza.id} pizza={pizza} />
        ))}
      </div>

      {pizzas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg">
            No hay pizzas disponibles en la categoría **{selectedCategory}**.
          </p>
        </div>
      )}
    </div>
  );
}
