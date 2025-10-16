"use client";

import { createContext, useContext, useEffect, useState } from "react";
import PocketBaseService from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  points: number;
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
  addToCart: (pizza: any) => void;
  removeFromCart: (pizzaId: string) => void;
  updateCartItem: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  createOrder: () => Promise<string>;
  userOrders: any[];
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // Guardar carrito en localStorage siempre, incluso si está vacío
    if (typeof window !== "undefined") {
      localStorage.setItem("pizzaImperial_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const initializeAuth = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        PocketBaseService.isAuthenticated()
      ) {
        const userData = PocketBaseService.getCurrentUser();
        if (userData) {
          const userInfo: User = {
            id: userData.id,
            username: userData.username || "",
            phone: userData.phone || "",
            email: userData.email,
            points: userData.points || 0,
            location: userData.location || "",
            created: userData.created,
            updated: userData.updated,
          };
          setUser(userInfo);

          try {
            const orders = await PocketBaseService.getUserOrders(userData.id);
            setUserOrders(orders);
          } catch (orderError) {
            console.error("Error loading user orders:", orderError);
            setUserOrders([]);
          }
        }
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const authData = await PocketBaseService.login(username, password);

      const userInfo: User = {
        id: authData.record.id,
        username: authData.record.username || "",
        phone: authData.record.phone || "",
        email: authData.record.email,
        points: authData.record.points || 0,
        location: authData.record.location || "",
        created: authData.record.created,
        updated: authData.record.updated,
      };

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
      await PocketBaseService.updateProfile(user.id, data);
      setUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw new Error(error.message || "Error al actualizar el perfil");
    }
  };

  const logout = () => {
    try {
      PocketBaseService.logout();
      setUser(null);
      setCart([]);
      setUserOrders([]);
      if (typeof window !== "undefined") {
        localStorage.removeItem("pizzaImperial_cart");
      }
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const addToCart = (pizza: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.pizzaId === pizza.id.toString()
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.pizzaId === pizza.id.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            pizzaId: pizza.id.toString(),
            name: pizza.name,
            price: pizza.price,
            quantity: 1,
            image: pizza.image,
          },
        ];
      }
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.pizzaId !== pizzaId));
  };

  const updateCartItem = (pizzaId: string, quantity: number) => {
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
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = async (): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado");
    if (cart.length === 0) throw new Error("Carrito vacío");

    try {
      const orderData = {
        user: user.id,
        items: cart,
        total: getCartTotal(),
        status: "pending",
        points_earned: Math.floor(getCartTotal()),
      };

      const order = await PocketBaseService.createOrder(orderData);

      // Actualizar puntos del usuario
      const newPoints = user.points + orderData.points_earned;
      await PocketBaseService.updateProfile(user.id, { points: newPoints });
      setUser((prev) => (prev ? { ...prev, points: newPoints } : null));

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
