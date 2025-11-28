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
  isRedemption?: boolean; // Nueva propiedad para identificar canjes
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
  ) => void;
  removeFromCart: (pizzaId: string, comment: string) => void;
  updateCartItem: (pizzaId: string, comment: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  validateCartStock: () => Promise<void>;
  getPointsSpent: () => number; // Nueva función para calcular puntos gastados

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
    points: Number(userData.points) || 0, // Aseguramos que sea número
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

  // --- CARRITO MEJORADO ---
  const addToCart = (
    pizza: PizzaToAdd,
    comment: string,
    isRedemption: boolean = false
  ) => {
    setCart((prev) => {
      // Clave única incluye si es canje o no para no mezclarlos
      const itemIndex = prev.findIndex(
        (item) =>
          item.pizzaId === pizza.id &&
          item.comment === comment &&
          item.isRedemption === isRedemption
      );

      // Costo en puntos: Si es canje, usa el valor de la BD. Si no, 0.
      const pointsCostValue = isRedemption ? Number(pizza.price_points) || 0 : 0;

      if (itemIndex !== -1) {
        const newCart = [...prev];
        newCart[itemIndex].quantity += 1;
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
            isRedemption: isRedemption, // Marcamos explícitamente si es canje
          },
        ];
      }
    });
  };

  const removeFromCart = (pizzaId: string, comment: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.pizzaId === pizzaId && item.comment === comment)
      )
    );
  };

  const updateCartItem = (
    pizzaId: string,
    comment: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(pizzaId, comment);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.pizzaId === pizzaId && item.comment === comment
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce(
      (total, item) =>
        total +
        (item.isRedemption ? 0 : item.price * item.quantity), // Solo suma precio si NO es canje
      0
    );

  const getPointsSpent = () =>
    cart.reduce(
      (total, item) =>
        total + (item.isRedemption ? (item.pointsCost || 0) * item.quantity : 0),
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

  // --- CREAR ORDEN (MEJORADO) ---
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

      // 2. Si hubo canje de puntos, descontarlos AHORA del usuario
      if (totalPointsSpent > 0 && user) {
        const newPoints = Math.max(0, user.points - totalPointsSpent);
        await pb.collection("users").update(user.id, { points: newPoints });
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
        points: orderData.points_earned || 0,
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

      // 5. Refrescar usuario para ver el descuento de puntos si hubo canje
      await refreshUser();
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