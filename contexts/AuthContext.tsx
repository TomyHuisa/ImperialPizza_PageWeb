"use client";

import { createContext, useContext, useEffect, useState } from "react";
import PocketBaseService from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// =================================================================
// Interfaces
// =================================================================

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
  comment: string;
  maxStock?: number;
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
  register: (username: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { username?: string; phone?: string; location?: string }) => Promise<void>;
  
  // Funciones del Carrito
  cart: CartItem[];
  addToCart: (pizza: PizzaToAdd, comment: string) => void;
  removeFromCart: (pizzaId: string, comment: string) => void;
  updateCartItem: (pizzaId: string, comment: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  validateCartStock: () => Promise<void>;
  
  // Funciones de Órdenes
  createOrder: (orderData: any) => Promise<string>;
  userOrders: any[];
  
  // Estado
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =================================================================
// Proveedor del Contexto
// =================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const pb = PocketBaseService.getInstance();

  // Inicialización perezosa del carrito desde localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("pizzaImperial_cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error("Error parsing saved cart:", e);
          return [];
        }
      }
    }
    return [];
  });

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

  // --- AUTENTICACIÓN ---

  const refreshUser = async () => {
    try {
        if (!pb.authStore.isValid) {
            setUser(null);
            return;
        }
        const authData = await pb.collection("users").authRefresh();
        if (authData && authData.record) {
            setUser(getUserInfo(authData.record));
        } else {
            logout(false);
        }
    } catch (error) {
        console.log("Sesión no activa o expirada.");
        setUser(null);
    }
  };

  const initializeAuth = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pizzaImperial_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const authData = await pb.collection("users").authWithPassword(username, password);
      setUser(getUserInfo(authData.record));
      
      try {
         const orders = await pb.collection("orders").getList(1, 50, {
             filter: `user = "${authData.record.id}"`,
             sort: '-created'
         });
         setUserOrders(orders.items);
      } catch (err) {
         console.error("Error cargando órdenes:", err);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, phone: string, password: string) => {
    try {
      setLoading(true);
      await pb.collection("users").create({
          username,
          phone,
          password,
          passwordConfirm: password,
          email: `${username}@placeholder.com`,
          points: 0
      });
      await login(username, password);
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const logout = (shouldRedirect: boolean = true) => {
    pb.authStore.clear();
    setUser(null);
    setUserOrders([]);
    if (shouldRedirect) {
        router.push("/");
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) throw new Error("Usuario no autenticado");
    try {
      const updatedRecord = await pb.collection("users").update(user.id, data);
      setUser((prev) => (prev ? { ...prev, ...getUserInfo(updatedRecord) } : null));
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  // --- LÓGICA DEL CARRITO ---

  const addToCart = (pizza: PizzaToAdd, comment: string) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex(
        (item) => item.pizzaId === pizza.id && item.comment === comment
      );

      if (itemIndex !== -1) {
        const newCart = [...prevCart];
        newCart[itemIndex].quantity += 1;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            pizzaId: pizza.id,
            name: pizza.name,
            price: pizza.price,
            quantity: 1,
            image: pizza.image,
            comment: comment,
          },
        ];
      }
    });
  };

  const removeFromCart = (pizzaId: string, comment: string) => {
    setCart((prevCart) => 
      prevCart.filter(item => !(item.pizzaId === pizzaId && item.comment === comment))
    );
  };

  const updateCartItem = (pizzaId: string, comment: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId, comment);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.pizzaId === pizzaId && item.comment === comment)
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const validateCartStock = async () => {
    if (cart.length === 0) return;

    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        try {
          const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
          return {
            ...item,
            maxStock: pizza.stock,
          };
        } catch (error) {
            console.error(`Error validando stock para ${item.name}:`, error);
            return { ...item, maxStock: 0 }; 
        }
      })
    );
    
    if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
        setCart(updatedCart);
    }
  };

  // --- LÓGICA DE ÓRDENES (CORREGIDA) ---

  const createOrder = async (orderData: any): Promise<string> => {
    if (cart.length === 0) throw new Error("Carrito vacío");

    try {
      // 1. Pre-validación de stock
      for (const item of cart) {
        const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
        if (pizza.stock < item.quantity) {
            throw new Error(`Stock insuficiente para ${item.name}. Disponibles: ${pizza.stock}`);
        }
      }

      // 🔥 CORRECCIÓN ERROR 1: Mapeo de nombres para coincidir con PocketBase
      // 'address' del form -> 'delivery_address' de la BD
      // 'notes' del form -> 'customer_notes' de la BD
      // 'name' del form -> 'customer_name' (si tienes ese campo, sino usa el usuario)
      
      const finalOrderData = {
        user: user?.id || "",
        items: cart, // PocketBase lo guardará como JSON
        total: getCartTotal(),
        status: "pending",
        
        // Mapeo explicito de los campos del formulario a la BD
        delivery_address: orderData.address, 
        customer_notes: orderData.notes,
        phone: orderData.phone,
        
        // 🔥 CORRECCIÓN ERROR 3 (Parte A): Guardar los puntos ganados en el historial de la orden
        points: orderData.pointsEarned || 0, 
        payment_method: orderData.payment_method
      };

      // 2. Crear la orden
      const order = await pb.collection("orders").create(finalOrderData);

      // 3. Actualizar el stock en PocketBase
      const updateStockPromises = cart.map(async (item) => {
        try {
          const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
          const newStock = Math.max(0, pizza.stock - item.quantity);
          await pb.collection("pizzas").update(item.pizzaId, { stock: newStock });
        } catch (err) {
            console.error(`Error actualizando stock para ${item.name}:`, err);
        }
      });
      await Promise.all(updateStockPromises);

      // 🔥 CORRECCIÓN ERROR 3 (Parte B): Sincronizar puntos en el perfil del usuario
      if (user && orderData.newUserPoints !== undefined) {
         console.log(`Actualizando puntos de usuario: ${user.points} -> ${orderData.newUserPoints}`);
         await pb.collection("users").update(user.id, { points: orderData.newUserPoints });
         
         // Importante: Refrescar el usuario localmente para que la UI se actualice
         await refreshUser();
      }

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
    validateCartStock,
    createOrder,
    userOrders,
    loading,
    isAuthenticated,
    refreshUser,
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