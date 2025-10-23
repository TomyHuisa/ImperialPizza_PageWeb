"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  pizzaId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  comment: string;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (pizzaId: string, comment: string) => void;
  updateQuantity: (pizzaId: string, comment: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("pizzeria_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("pizzeria_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (i) => i.pizzaId === item.pizzaId && i.comment === item.comment
      );

      if (existingItem) {
        return prev.map((i) =>
          i.pizzaId === item.pizzaId && i.comment === item.comment
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        const newItem = { ...item, quantity: 1 };
        return [...prev, newItem];
      }
    });

    toast({
      title: "✅ Agregado al carrito",
      description: `${item.name} ha sido agregado correctamente.`,
      duration: 2000,
    });
  };

  const removeFromCart = (pizzaId: string, comment: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.pizzaId === pizzaId && item.comment === comment)
      )
    );

    toast({
      title: "🗑️ Eliminado",
      description: "Producto removido del carrito.",
      duration: 2000,
    });
  };

  const updateQuantity = (
    pizzaId: string,
    comment: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId, comment);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.pizzaId === pizzaId && item.comment === comment
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
