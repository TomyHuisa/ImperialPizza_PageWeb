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
    payment_method: string;
  }) => Promise<string | null>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  // Cargar carrito desde localStorage SOLO en el cliente
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("pizzeria_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Carrito cargado desde localStorage:", parsedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie (SOLO en cliente)
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("pizzeria_cart", JSON.stringify(cartItems));
        console.log("Carrito guardado en localStorage:", cartItems);
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (i) => i.pizzaId === item.pizzaId && i.comment === item.comment
      );

      let newCart;
      if (existingItem) {
        newCart = prev.map((i) =>
          i.pizzaId === item.pizzaId && i.comment === item.comment
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }

      console.log("Nuevo carrito después de agregar:", newCart);
      return newCart;
    });

    toast({
      title: "✅ Agregado al carrito",
      description: `${item.name} ha sido agregado correctamente.`,
      duration: 2000,
    });
  };

  const removeFromCart = (pizzaId: string, comment: string) => {
    setCartItems((prev) => {
      const newCart = prev.filter(
        (item) => !(item.pizzaId === pizzaId && item.comment === comment)
      );
      console.log("Carrito después de eliminar:", newCart);
      return newCart;
    });

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

    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.pizzaId === pizzaId && item.comment === comment
          ? { ...item, quantity }
          : item
      );
      console.log("Carrito después de actualizar cantidad:", newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    console.log("Carrito limpiado");
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

  // 🔥 ACTUALIZADO: Función para crear pedido - AHORA CALCULA PUNTOS
  const createOrder = async (customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes: string;
    payment_method: string;
  }): Promise<string | null> => {
    try {
      // Validar que haya items en el carrito
      if (cartItems.length === 0) {
        throw new Error("El carrito está vacío");
      }

      // 🔥 CALCULAR PUNTOS GANADOS (50 puntos por pizza)
      const pointsEarned = cartItems.reduce((total, item) => {
        return total + item.quantity * 50;
      }, 0);

      const orderData = {
        items: cartItems,
        total: getTotalPrice(),
        status: "pending",
        customer_notes: customerInfo.notes,
        delivery_address: customerInfo.address,
        phone: customerInfo.phone,
        customer_name: customerInfo.name,
        payment_method: customerInfo.payment_method,
        user: null,
        points_earned: pointsEarned, // 🔥 INCLUIR PUNTOS EN EL PEDIDO
      };

      console.log("Enviando pedido a PocketBase:", orderData);

      // 1. Crear la orden en PocketBase
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

      // 2. ACTUALIZAR STOCK DE LAS PIZZAS
      await updatePizzaStock(cartItems);

      // 3. Limpiar carrito después de crear el pedido exitosamente
      clearCart();

      // 🔥 MOSTRAR PUNTOS GANADOS AL USUARIO
      toast({
        title: "✅ Pedido creado exitosamente",
        description: `¡Has ganado ${pointsEarned} puntos! Revisa tu historial para ver tus puntos acumulados.`,
        duration: 5000,
      });

      return result.id;
    } catch (error) {
      console.error("Error creando pedido:", error);

      toast({
        variant: "destructive",
        title: "❌ Error creando pedido",
        description: "No se pudo procesar el pedido. Intenta nuevamente.",
        duration: 5000,
      });

      return null;
    }
  };

  // Función para actualizar stock de pizzas después del pedido
  const updatePizzaStock = async (items: CartItem[]) => {
    try {
      console.log("🔄 Actualizando stock de pizzas...");

      for (const item of items) {
        try {
          // Obtener la pizza actual para conocer el stock actual
          const pizzaResponse = await fetch(
            `http://127.0.0.1:8090/api/collections/pizzas/records/${item.pizzaId}`
          );

          if (!pizzaResponse.ok) {
            console.error(
              `Error obteniendo pizza ${item.pizzaId}: ${pizzaResponse.status}`
            );
            continue;
          }

          const pizzaData = await pizzaResponse.json();
          const currentStock = pizzaData.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);

          console.log(
            `Actualizando stock de ${item.name}: ${currentStock} -> ${newStock}`
          );

          // Actualizar el stock de la pizza
          const updateResponse = await fetch(
            `http://127.0.0.1:8090/api/collections/pizzas/records/${item.pizzaId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                stock: newStock,
              }),
            }
          );

          if (!updateResponse.ok) {
            console.error(
              `Error actualizando stock de ${item.name}: ${updateResponse.status}`
            );
          } else {
            console.log(`✅ Stock de ${item.name} actualizado exitosamente`);
          }
        } catch (error) {
          console.error(`Error procesando pizza ${item.pizzaId}:`, error);
        }
      }

      toast({
        title: "✅ Stock actualizado",
        description:
          "El stock de las pizzas ha sido actualizado correctamente.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error general actualizando stock:", error);
      toast({
        variant: "destructive",
        title: "⚠️ Error actualizando stock",
        description:
          "El pedido se creó pero hubo un error actualizando el stock. Contacta al administrador.",
      });
    }
  };

  // Evitar renderizado hasta que esté montado
  if (!isMounted) {
    return null;
  }

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
        createOrder,
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
