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
  maxStock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (pizzaId: string, comment: string) => void;
  updateQuantity: (pizzaId: string, comment: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  validateCartStock: () => Promise<boolean>;
  createOrder: (customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes: string;
  }) => Promise<string | null>;
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

  const validateCartStock = async (): Promise<boolean> => {
    try {
      console.log("🔍 Validando stock del carrito...");

      if (cartItems.length === 0) {
        return true;
      }

      let hasChanges = false;
      const updatedItems = [...cartItems];

      // Validar cada item del carrito
      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];

        try {
          // Consultar stock actual desde PocketBase
          const response = await fetch(
            `http://127.0.0.1:8090/api/collections/pizzas/records/${item.pizzaId}`
          );

          if (response.ok) {
            const pizzaData = await response.json();
            const currentStock = pizzaData.stock || 0;

            // Si la cantidad en carrito excede el stock disponible
            if (item.quantity > currentStock) {
              hasChanges = true;

              if (currentStock === 0) {
                // Eliminar producto si no hay stock
                updatedItems.splice(i, 1);
                i--; // Ajustar índice después de eliminar

                toast({
                  variant: "destructive",
                  title: "❌ Producto agotado",
                  description: `${item.name} ha sido removido por falta de stock.`,
                });
              } else {
                // Ajustar cantidad al stock disponible
                updatedItems[i] = {
                  ...item,
                  quantity: currentStock,
                  maxStock: currentStock,
                };

                toast({
                  variant: "destructive",
                  title: "⚠️ Stock actualizado",
                  description: `${item.name} ajustado a ${currentStock} unidades (stock disponible).`,
                });
              }
            } else {
              // Actualizar maxStock con el valor real
              updatedItems[i] = {
                ...item,
                maxStock: currentStock,
              };
            }
          }
        } catch (error) {
          console.error(`Error consultando stock para ${item.name}:`, error);
        }
      }

      // Aplicar cambios si hubo ajustes de stock
      if (hasChanges) {
        setCartItems(updatedItems);
        return false; // Hubo cambios, no es válido
      }

      return true; // Todo está bien, sin cambios
    } catch (error) {
      console.error("Error general validando stock:", error);
      return true; // En caso de error, permitir continuar
    }
  };

  // NUEVA FUNCIÓN: Crear pedido en PocketBase
  const createOrder = async (customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes: string;
  }): Promise<string | null> => {
    try {
      // Validar que haya items en el carrito
      if (cartItems.length === 0) {
        throw new Error("El carrito está vacío");
      }

      const orderData = {
        items: cartItems,
        total: getTotalPrice(),
        status: "pending",
        customer_notes: customerInfo.notes,
        delivery_address: customerInfo.address,
        phone: customerInfo.phone,
        customer_name: customerInfo.name,
        user: null, // Si no hay autenticación, lo dejamos null
      };

      console.log("Enviando pedido a PocketBase:", orderData);

      const response = await fetch(
        "http://127.0.0.1:8090/api/collections/orders/records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`Error creando pedido: ${response.status}`);
      }

      const result = await response.json();
      console.log("Pedido creado exitosamente:", result);
      return result.id;
    } catch (error) {
      console.error("Error creando pedido:", error);
      return null;
    }
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
        validateCartStock,
        createOrder, // NO OLVIDAR INCLUIRLA AQUÍ
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
