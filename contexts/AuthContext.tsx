"use client";

import { createContext, useContext, useEffect, useState } from "react";
import PocketBaseService from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
  pointsCost?: number;
  isRedemption?: boolean;
  pointsEarned?: number; // Puntos que este item generará
}

interface PizzaToAdd {
  id: string;
  name: string;
  price: number;
  image: string;
  price_points: number;
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
  addToCart: (
    pizza: PizzaToAdd,
    comment: string,
    isRedemption?: boolean
  ) => Promise<void>;
  removeFromCart: (pizzaId: string, comment: string) => Promise<void>;
  updateCartItem: (pizzaId: string, comment: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  validateCartStock: () => Promise<void>;
  getPointsSpent: () => number;
  getPointsEarned: () => number;

  createOrder: (orderData: any) => Promise<string>;
  userOrders: any[];
  fetchUserOrders: (userId: string) => Promise<void>;

  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const pb = PocketBaseService.getInstance();

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("pizzaImperial_cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
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
    points: Number(userData.points) || 0,
    location: userData.location || "",
    created: userData.created,
    updated: userData.updated,
  });

  const refreshUser = async () => {
    try {
      if (!pb.authStore.isValid) {
        setUser(null);
        return;
      }
      const authData = await pb.collection("users").authRefresh();
      if (authData?.record) setUser(getUserInfo(authData.record));
      else logout(false);
    } catch (error) {
      setUser(null);
    }
  };

  const fetchUserOrders = async (userId: string) => {
    try {
      const orders = await pb.collection("orders").getList(1, 50, {
        filter: `user = "${userId}"`,
        sort: "-created",
      });
      setUserOrders(orders.items);
    } catch (err) {
      console.error("Error cargando órdenes:", err);
    }
  };

  const initializeAuth = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error(error);
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

  // 🔥 ACTUALIZAR PUNTOS DEL USUARIO
  const updateUserPoints = async (newPoints: number) => {
    if (!user) return;
    
    try {
      await pb.collection("users").update(user.id, { points: newPoints });
      setUser(prev => prev ? { ...prev, points: newPoints } : null);
    } catch (error) {
      console.error("Error actualizando puntos:", error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(username, password);
      setUser(getUserInfo(authData.record));
      await fetchUserOrders(authData.record.id);
    } catch (error: any) {
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
    setLoading(true);
    try {
      await pb.collection("users").create({
        username,
        phone,
        password,
        passwordConfirm: password,
        email: `${username}@placeholder.com`,
        points: 0,
      });
      await login(username, password);
    } catch (error: any) {
      throw new Error(error.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  const logout = (shouldRedirect: boolean = true) => {
    pb.authStore.clear();
    setUser(null);
    setUserOrders([]);
    if (shouldRedirect) router.push("/");
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    const updated = await pb.collection("users").update(user.id, data);
    setUser((prev) => (prev ? { ...prev, ...getUserInfo(updated) } : null));
  };

  // --- CARRITO MEJORADO CON PUNTOS INMEDIATOS ---
  const addToCart = async (
    pizza: PizzaToAdd,
    comment: string,
    isRedemption: boolean = false
  ) => {
    // Calcular puntos que genera este item (solo si no es canje)
    const pointsEarned = isRedemption ? 0 : Math.floor(pizza.price);
    const pointsCostValue = isRedemption ? Number(pizza.price_points) || 0 : 0;

    // 🔥 SUMAR PUNTOS INMEDIATAMENTE (solo para compras normales)
    if (!isRedemption && user) {
      const newPoints = (user.points || 0) + pointsEarned;
      await updateUserPoints(newPoints);
    }

    setCart((prev) => {
      const itemIndex = prev.findIndex(
        (item) =>
          item.pizzaId === pizza.id &&
          item.comment === comment &&
          item.isRedemption === isRedemption
      );

      if (itemIndex !== -1) {
        const newCart = [...prev];
        newCart[itemIndex].quantity += 1;
        
        // 🔥 ACTUALIZAR PUNTOS ACUMULADOS
        if (!isRedemption) {
          newCart[itemIndex].pointsEarned = (newCart[itemIndex].pointsEarned || 0) + pointsEarned;
        }
        
        return newCart;
      } else {
        return [
          ...prev,
          {
            pizzaId: pizza.id,
            name: pizza.name,
            price: pizza.price,
            quantity: 1,
            image: pizza.image,
            comment,
            pointsCost: pointsCostValue,
            isRedemption: isRedemption,
            pointsEarned: pointsEarned,
          },
        ];
      }
    });
  };

  const removeFromCart = async (pizzaId: string, comment: string) => {
    const itemToRemove = cart.find(
      item => item.pizzaId === pizzaId && item.comment === comment
    );

    setCart((prev) =>
      prev.filter(
        (item) => !(item.pizzaId === pizzaId && item.comment === comment)
      )
    );

    // 🔥 RESTAR PUNTOS SI SE ELIMINA UN ITEM (solo compras normales)
    if (itemToRemove && !itemToRemove.isRedemption && itemToRemove.pointsEarned && user) {
      const newPoints = Math.max(0, (user.points || 0) - itemToRemove.pointsEarned);
      await updateUserPoints(newPoints);
    }
  };

  const updateCartItem = async (
    pizzaId: string,
    comment: string,
    quantity: number
  ) => {
    const oldItem = cart.find(
      item => item.pizzaId === pizzaId && item.comment === comment
    );

    if (!oldItem) return;

    if (quantity <= 0) {
      await removeFromCart(pizzaId, comment);
      return;
    }

    const quantityDifference = quantity - oldItem.quantity;
    
    // 🔥 AJUSTAR PUNTOS POR CAMBIO DE CANTIDAD (solo compras normales)
    if (!oldItem.isRedemption && quantityDifference !== 0 && user) {
      const pointsPerUnit = Math.floor(oldItem.price);
      const pointsDifference = pointsPerUnit * quantityDifference;
      const newPoints = Math.max(0, (user.points || 0) + pointsDifference);
      await updateUserPoints(newPoints);
    }

    setCart((prev) =>
      prev.map((item) =>
        item.pizzaId === pizzaId && item.comment === comment
          ? { 
              ...item, 
              quantity,
              pointsEarned: item.isRedemption ? 0 : Math.floor(item.price) * quantity
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce(
      (total, item) =>
        total +
        (item.isRedemption ? 0 : item.price * item.quantity),
      0
    );

  const getPointsSpent = () =>
    cart.reduce(
      (total, item) =>
        total + (item.isRedemption ? (item.pointsCost || 0) * item.quantity : 0),
      0
    );

  const getPointsEarned = () =>
    cart.reduce(
      (total, item) =>
        total + (item.isRedemption ? 0 : (item.pointsEarned || 0)),
      0
    );

  const getCartItemsCount = () =>
    cart.reduce((c, item) => c + item.quantity, 0);

  const validateCartStock = async () => {
    if (cart.length === 0) return;
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        try {
          const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
          return { ...item, maxStock: pizza.stock };
        } catch {
          return { ...item, maxStock: 0 };
        }
      })
    );
    if (JSON.stringify(updatedCart) !== JSON.stringify(cart))
      setCart(updatedCart);
  };

  // --- CREAR ORDEN (SIMPLIFICADO) ---
  const createOrder = async (orderData: any): Promise<string> => {
    if (cart.length === 0) throw new Error("Carrito vacío");

    try {
      // 1. Validar Stock final
      for (const item of cart) {
        const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
        if (pizza.stock < item.quantity)
          throw new Error(`Stock insuficiente para ${item.name}`);
      }

      const totalPointsSpent = getPointsSpent();

      // 2. Si hubo canje de puntos, descontarlos del usuario
      if (totalPointsSpent > 0 && user) {
        const newPoints = Math.max(0, user.points - totalPointsSpent);
        await updateUserPoints(newPoints);
      }

      // 3. Preparar datos para PocketBase
      const finalOrderData = {
        user: user?.id || "",
        items: cart,
        total: getCartTotal(),
        status: "pending",
        delivery_address: orderData.delivery_address,
        customer_notes: orderData.customer_notes,
        phone: orderData.phone,
        payment_method: orderData.payment_method,
        service: orderData.service,
        points: getPointsEarned(), // Puntos ya sumados inmediatamente
        points_spent: totalPointsSpent,
      };

      const order = await pb.collection("orders").create(finalOrderData);

      // 4. Descontar Stock de Pizzas
      await Promise.all(
        cart.map(async (item) => {
          const pizza = await pb.collection("pizzas").getOne(item.pizzaId);
          await pb
            .collection("pizzas")
            .update(item.pizzaId, {
              stock: Math.max(0, pizza.stock - item.quantity),
            });
        })
      );

      // 5. Los puntos ya están sumados, solo limpiamos carrito
      clearCart();
      return order.id;
    } catch (error: any) {
      console.error("Order error:", error);
      throw new Error(error.message || "Error al crear la orden");
    }
  };

  const value = {
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
    getPointsSpent,
    getPointsEarned,
    createOrder,
    userOrders,
    fetchUserOrders,
    loading,
    isAuthenticated,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}