"use client";

import { createContext, useContext, useEffect, useState } from "react";
import PocketBaseService from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Añadido para manejo de errores

// =================================================================
// Interfaces
// =================================================================

interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  points: number; // Crucial: Asegurar que este campo existe en PocketBase
  location?: string;
  created?: string;
  updated?: string;
}

interface CartItem {
  pizzaId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  comment: string; // Añadido para la gestión del modal de carrito
}

interface PizzaToAdd {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    username?: string;
    phone?: string;
    location?: string;
  }) => Promise<void>;
  cart: CartItem[];
  addToCart: (pizza: PizzaToAdd, comment: string) => void; // Firma actualizada
  removeFromCart: (pizzaId: string) => void;
  updateCartItem: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  createOrder: () => Promise<string>;
  userOrders: any[];
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>; // 🔥 Añadido: Importante para actualizar puntos
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const { toast } = useToast(); // Si quieres usar toasts aquí

  const isAuthenticated = !!user;
  const pb = PocketBaseService.getInstance();

  // Función para obtener la información del usuario desde el objeto de PocketBase
  const getUserInfo = (userData: any): User => ({
    id: userData.id,
    username: userData.username || "",
    phone: userData.phone || "",
    email: userData.email,
    points: userData.points || 0,
    location: userData.location || "",
    created: userData.created,
    updated: userData.updated,
  });

  // 🔥 Implementación de refreshUser: Actualiza los datos del usuario logueado
  const refreshUser = async () => {
    try {
      const authData = await pb.collection("users").authRefresh();

      if (pb.authStore.isValid && authData && authData.record) {
        setUser(getUserInfo(authData.record));
        // Opcional: Refrescar órdenes aquí si es necesario
      } else {
        // Si el token es inválido, forzar logout
        logout(false);
      }
    } catch (error) {
      // Ignorar el error de "token inválido" que ocurre a menudo si no hay sesión
      console.log(
        "No se pudo refrescar la sesión (posiblemente no hay sesión activa)."
      );
      // logout(false); // No forzar logout silencioso aquí, se encarga initializeAuth
    }
  };

  const initializeAuth = async () => {
    try {
      if (typeof window !== "undefined") {
        // Intentar refrescar para validar el token y obtener datos frescos
        await refreshUser();
      }

      // Cargar carrito desde localStorage
      if (typeof window !== "undefined") {
        const savedCart = localStorage.getItem("pizzaImperial_cart");
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch (e) {
            console.error("Error parsing saved cart:", e);
            setCart([]);
          }
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      // Forzar logout si initializeAuth falla catastróficamente
      // logout(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage siempre
    if (typeof window !== "undefined") {
      localStorage.setItem("pizzaImperial_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const authData = await PocketBaseService.login(username, password);

      const userInfo = getUserInfo(authData.record);
      setUser(userInfo);

      try {
        const orders = await PocketBaseService.getUserOrders(
          authData.record.id
        );
        setUserOrders(orders);
      } catch (orderError) {
        console.error("Error loading user orders after login:", orderError);
        setUserOrders([]);
      }

      // La redirección DEBE manejarse en el componente de login/registro.
      // Por ejemplo, router.push("/").
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    phone: string,
    password: string
  ) => {
    try {
      setLoading(true);
      await PocketBaseService.register(username, phone, password);

      // Login automático después del registro
      await login(username, password);
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: {
    username?: string;
    phone?: string;
    location?: string;
  }) => {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      const updatedRecord = await PocketBaseService.updateProfile(
        user.id,
        data
      );

      // Actualizar solo los campos modificados en el estado local
      setUser((prev) => (prev ? { ...prev, ...updatedRecord } : null));
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw new Error(error.message || "Error al actualizar el perfil");
    }
  };

  const logout = (shouldRedirect: boolean = true) => {
    try {
      PocketBaseService.logout();
      setUser(null);
      setCart([]);
      setUserOrders([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("pizzaImperial_cart");
      }
      if (shouldRedirect) {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Firma actualizada para incluir el comentario
  const addToCart = (pizza: PizzaToAdd, comment: string) => {
    setCart((prevCart) => {
      // Usar pizzaId + comment como clave única para permitir la misma pizza
      // con diferentes comentarios (e.g., "Sin aceitunas" vs "Extra queso")
      const uniqueKey = `${pizza.id.toString()}-${comment}`;

      const existingItemIndex = prevCart.findIndex(
        (item) => `${item.pizzaId}-${item.comment}` === uniqueKey
      );

      if (existingItemIndex !== -1) {
        // Item existente: incrementar cantidad
        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nuevo item
        return [
          ...prevCart,
          {
            pizzaId: pizza.id.toString(),
            name: pizza.name,
            price: pizza.price,
            quantity: 1,
            image: pizza.image,
            comment: comment || "",
          },
        ];
      }
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.pizzaId !== pizzaId));
  };

  const updateCartItem = (pizzaId: string, quantity: number) => {
    // Si la cantidad es 0 o menos, eliminar
    if (quantity <= 0) {
      removeFromCart(pizzaId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.pizzaId === pizzaId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    // Suma todos los precios (incluye precios de 0.00 para canjes)
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = async (): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado");
    if (cart.length === 0) throw new Error("Carrito vacío");

    try {
      const total = getCartTotal();
      const pointsEarned = Math.floor(total); // Asumiendo 1 punto por $1 gastado

      const orderData = {
        user: user.id,
        items: cart,
        total: total,
        status: "pending",
        points_earned: pointsEarned,
      };

      const order = await PocketBaseService.createOrder(orderData);

      // Si hay puntos a ganar, actualizar el perfil
      if (pointsEarned > 0) {
        const newPoints = user.points + pointsEarned;
        await PocketBaseService.updateProfile(user.id, { points: newPoints });
        // Actualizar el estado local (o usar refreshUser, pero la actualización directa es más rápida)
        setUser((prev) => (prev ? { ...prev, points: newPoints } : null));
      }

      // Limpiar carrito después de la orden exitosa
      clearCart();

      return order.id;
    } catch (error: any) {
      console.error("Order creation error:", error);
      throw new Error(error.message || "Error al crear la orden");
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    createOrder,
    userOrders,
    loading,
    isAuthenticated,
    refreshUser, // 🔥 Exportado
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
