// AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import PocketBaseService from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// =================================================================
// Constantes
// =================================================================
// 2 puntos = $1 de descuento => 1 punto = $0.5 de descuento
const POINTS_TO_DOLLAR_DISCOUNT_RATE = 0.5;
// 1 dólar = 1 punto ganado
const POINTS_PER_DOLLAR_EARNED = 1; 

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
  pointsCost?: number; // Costo en puntos para canje total
  isRedemption?: boolean; // Si fue agregado como canje total
  pointsEarned?: number; // Puntos que este item generará (si no es canje)
}

interface PizzaToAdd {
  id: string;
  name: string;
  price: number;
  image: string;
  price_points: number; // Costo en puntos para canje total
}

// Nueva Interfaz para la Creación de Órdenes
interface OrderCreationData {
  customer_name: string;
  phone: string;
  delivery_address: string;
  customer_notes: string;
  payment_method: "efectivo" | "tarjeta" | "puntos"; // 'puntos' es canje total o mixto
  service: "delivery" | "takeaway";
  pointsDiscount?: number; // Monto de descuento en $
  pointsSpent?: number; // Puntos gastados
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

  // Cart related functions
  cart: CartItem[];
  addToCart: (
    pizza: PizzaToAdd,
    comment: string,
    isRedemption?: boolean
  ) => Promise<void>;
  removeFromCart: (pizzaId: string, comment: string) => void;
  updateCartItem: (pizzaId: string, comment: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  validateCartStock: () => Promise<boolean>;

  // Points helpers
  getPointsSpent: () => number; // Puntos para canje total
  getPointsEarned: () => number; // Puntos a ganar
  
  // Order & Status
  createOrder: (data: OrderCreationData) => Promise<string>;
  userOrders: any[];
  fetchUserOrders: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  
  // Constante exportada
  POINTS_TO_DOLLAR_DISCOUNT_RATE: number; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const pb = PocketBaseService.getInstance();

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  const getPointsSpent = (): number => {
    return cart.reduce((totalPoints, item) => {
      return item.isRedemption && item.pointsCost
        ? totalPoints + item.pointsCost * item.quantity
        : totalPoints;
    }, 0);
  };

  const getPointsEarned = (): number => {
    const purchaseTotal = cart.reduce((total, item) => {
      return item.isRedemption ? total : total + item.price * item.quantity;
    }, 0);
    return Math.floor(purchaseTotal * POINTS_PER_DOLLAR_EARNED); 
  };

  const refreshUser = async () => {
    try {
      const authModel = pb.authStore.model;
      if (authModel) {
        const record = await pb.collection("users").getOne(authModel.id);
        setUser(record as unknown as User);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      pb.authStore.clear();
      setUser(null);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      await pb.collection("users").authWithPassword(username, password);
      await refreshUser();
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${username}.`,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas.",
      });
      throw new Error(error.message || "Error al iniciar sesión");
    }
  };

  const register = async (
    username: string,
    phone: string,
    password: string
  ): Promise<void> => {
    try {
      await pb.collection("users").create({
        username,
        phone,
        email: `${username}@pizzeriaimperial.com`, 
        password,
        passwordConfirm: password,
        points: 0, 
      });

      await pb.collection("users").authWithPassword(username, password);
      await refreshUser();
      toast({
        title: "¡Registro Exitoso!",
        description: "Tu cuenta ha sido creada.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Error al registrar",
        description: error.message || "Error desconocido al registrar.",
      });
      throw new Error(error.message || "Error al registrar");
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setCart([]);
    setUserOrders([]);
    router.push("/");
    toast({
        title: "Sesión Cerrada",
        description: "Has salido de tu cuenta.",
    });
  };
  
  const updateProfile = async (data: {
    username?: string;
    phone?: string;
    location?: string;
  }): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado");

    try {
      const updatedUser = await pb.collection("users").update(user.id, data);
      setUser(updatedUser as unknown as User);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      throw new Error(error.message || "Error al actualizar el perfil");
    }
  };

  const fetchUserOrders = async () => {
    if (!user) return;
    try {
      const records = await pb.collection("orders").getFullList({
        filter: `user='${user.id}'`,
        sort: "-created",
      });
      setUserOrders(records);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setUserOrders([]);
    }
  };

  const addToCart = async (
    pizza: PizzaToAdd,
    comment: string,
    isRedemption: boolean = false
  ) => {
    try {
        const currentStock = await pb.collection("pizzas").getOne(pizza.id, {
            fields: 'stock'
        });
        const maxStock = (currentStock as any).stock;
        
        const existingItemIndex = cart.findIndex(
          (item) => item.pizzaId === pizza.id && item.comment === comment
        );

        if (existingItemIndex > -1) {
          const newCart = [...cart];
          const newQuantity = newCart[existingItemIndex].quantity + 1;
          
          if (newQuantity > maxStock) {
            toast({
                variant: "destructive",
                title: "⚠️ Stock limitado",
                description: `Solo quedan ${maxStock} unidades de ${pizza.name}.`,
            });
            return;
          }
          
          newCart[existingItemIndex].quantity = newQuantity;
          setCart(newCart);
        } else {
          if (1 > maxStock) {
            toast({
                variant: "destructive",
                title: "⚠️ Stock agotado",
                description: `${pizza.name} está agotada.`,
            });
            return;
          }
          
          const newItem: CartItem = {
            pizzaId: pizza.id,
            name: pizza.name,
            price: pizza.price,
            quantity: 1,
            image: pizza.image,
            comment: comment,
            maxStock: maxStock,
            pointsCost: isRedemption ? pizza.price_points : undefined,
            isRedemption: isRedemption,
          };
          setCart((prev) => [...prev, newItem]);
        }

        const updatedCart = existingItemIndex > -1 ? [...cart].map((item, index) => index === existingItemIndex ? {...item, quantity: item.quantity + 1} : item) : [...cart, {
            pizzaId: pizza.id,
            name: pizza.name,
            price: pizza.price,
            quantity: 1,
            image: pizza.image,
            comment: comment,
            maxStock: maxStock,
            pointsCost: isRedemption ? pizza.price_points : undefined,
            isRedemption: isRedemption,
        }];

        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart) 
        ); 
    } catch (error) {
        console.error("Error adding to cart or checking stock:", error);
        toast({
            variant: "destructive",
            title: "Error de stock",
            description: `No se pudo verificar el stock de ${pizza.name}.`,
        });
    }
  };
  
  const removeFromCart = (pizzaId: string, comment: string) => {
    const newCart = cart.filter(
      (item) => !(item.pizzaId === pizzaId && item.comment === comment)
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateCartItem = (pizzaId: string, comment: string, quantity: number) => {
    if (quantity <= 0) {
        removeFromCart(pizzaId, comment);
        return;
    }
    
    let isStockExceeded = false;
    const newCart = cart.map((item) => {
      if (item.pizzaId === pizzaId && item.comment === comment) {
          if (item.maxStock !== undefined && quantity > item.maxStock) {
              isStockExceeded = true;
              toast({
                  variant: "destructive",
                  title: "⚠️ Stock limitado",
                  description: `Solo quedan ${item.maxStock} unidades de ${item.name}.`,
              });
              return item; 
          }
          return { ...item, quantity };
      }
      return item;
    });

    if (!isStockExceeded) {
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    }
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const validateCartStock = async (): Promise<boolean> => {
    let allValid = true;
    for (const item of cart) {
        try {
            const currentStock = await pb.collection("pizzas").getOne(item.pizzaId, { fields: 'stock' });
            const maxStock = (currentStock as any).stock;
            
            if (item.quantity > maxStock) {
                allValid = false;
                if (maxStock > 0) {
                    updateCartItem(item.pizzaId, item.comment, maxStock);
                    toast({
                        variant: "destructive",
                        title: "Stock Ajustado",
                        description: `La cantidad de ${item.name} ha sido ajustada a ${maxStock} debido a la limitación de stock.`,
                    });
                } else {
                    removeFromCart(item.pizzaId, item.comment);
                    toast({
                        variant: "destructive",
                        title: "Producto Eliminado",
                        description: `${item.name} fue eliminado del carrito porque está agotado.`,
                    });
                }
            } else if (item.maxStock !== maxStock) {
                 updateCartItem(item.pizzaId, item.comment, item.quantity); 
            }
            
        } catch (error) {
            console.error("Error validating stock for item:", item.name, error);
            allValid = false;
        }
    }
    return allValid;
  };
  
  // =================================================================
  // FUNCIÓN CLAVE: createOrder - Actualizada para descuento parcial
  // =================================================================
  const createOrder = async (data: OrderCreationData): Promise<string> => {
    if (!user) throw new Error("Usuario no autenticado");
    if (cart.length === 0) throw new Error("Carrito vacío");

    try {
      const pb = PocketBaseService.getInstance();
      const totalCart = getCartTotal();
      
      // Valores de descuento
      const pointsDiscount = data.pointsDiscount || 0;
      const totalPointsSpent = data.pointsSpent || 0;

      // 1. Determinar el total final a pagar:
      let finalTotal: number;
      if (data.payment_method === "puntos") {
        // Canje total o descuento parcial que resultó en $0.00
        finalTotal = 0;
      } else {
        // Compra normal (efectivo/tarjeta) o con descuento parcial que resulta en un pago restante
        finalTotal = Math.max(0, totalCart - pointsDiscount); 
      }
      
      // 2. Gestionar Puntos:
      // a) Puntos a deducir (canje total O descuento parcial)
      let totalPointsToDeduct: number = 0;
      let pointsEarned: number = 0;

      if (data.payment_method === "puntos") {
        // Canje total
        totalPointsToDeduct = data.pointsSpent || getPointsSpent(); 
      } else {
        // Compra normal o con descuento parcial
        totalPointsToDeduct = totalPointsSpent;
        pointsEarned = getPointsEarned(); 
      }
      
      // Descontar los puntos del usuario si hay gasto
      if (user && totalPointsToDeduct > 0) {
        const newPoints = user.points - totalPointsToDeduct;
        if (newPoints < 0) {
             throw new Error("Puntos insuficientes para la transacción.");
        }
        await pb.collection("users").update(user.id, { points: newPoints });
        setUser((prev) => (prev ? { ...prev, points: newPoints } : null));
      }
      
      // Sumar puntos ganados
      if (user && data.payment_method !== "puntos" && pointsEarned > 0) {
        // Se recalculan los puntos del usuario desde la base de datos o el estado actual
        // para asegurar que no se pierda la resta anterior si ocurren muy rápido.
        // Como estamos en un contexto async, es mejor obtener el usuario fresco.
        // Pero para simplificar, asumimos que el estado user ya se actualizó arriba si hubo resta.
        // En una app real, podrías hacer un nuevo .getOne o calcular sobre la marcha.
        
        // Simplemente sumamos al estado local (que ya podría tener la resta aplicada)
        // Nota: Esto es una simplificación. Lo ideal es una transacción atómica o lecturas secuenciales.
        const currentUserPoints = user.points; // Este valor podría no estar actualizado si setUser es asíncrono
        // Mejor enfoque: Hacer un nuevo update sobre la base de datos fresca
        const freshUser = await pb.collection("users").getOne(user.id);
        const newPoints = freshUser.points + pointsEarned;
        
        await pb.collection("users").update(user.id, { points: newPoints });
        setUser((prev) => (prev ? { ...prev, points: newPoints } : null));
      }


      // 3. Preparar datos base de la orden
      const orderDataToSave = {
        user: user.id,
        items: cart.map((item) => ({
          pizzaId: item.pizzaId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          comment: item.comment,
          isRedemption: item.isRedemption,
        })),
        total: finalTotal, // Usar el total ajustado
        status: "pending",
        customer_name: data.customer_name,
        phone: data.phone,
        delivery_address: data.delivery_address,
        customer_notes: data.customer_notes,
        payment_method: data.payment_method,
        service: data.service,
        points: pointsEarned, // Puntos ganados
        points_spent: totalPointsToDeduct, 
        points_discount_amount: pointsDiscount, // Guardar el descuento en $
      };

      const order = await pb.collection("orders").create(orderDataToSave);

      // 4. Descontar Stock de Pizzas
      await Promise.all(
        cart.map(async (item) => {
          const pizza = await pb.collection("pizzas").getOne(item.pizzaId, { fields: 'stock' });
          await pb
            .collection("pizzas")
            .update(item.pizzaId, {
              stock: Math.max(0, (pizza as any).stock - item.quantity),
            });
        })
      );

      // 5. Limpiar carrito y refrescar usuario 
      clearCart();
      await refreshUser(); 
      return order.id;

    } catch (error: any) {
      console.error("Order error:", error);
      if (error.message.includes("Puntos insuficientes")) {
          throw new Error("No tienes suficientes puntos para realizar este canje/descuento.");
      }
      throw new Error(error.message || "Error al crear la orden");
    }
  };


  useEffect(() => {
    const authenticate = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection("users").authRefresh();
          const record = await pb.collection("users").getOne(pb.authStore.model!.id);
          setUser(record as unknown as User);
          await fetchUserOrders();
        }
      } catch (error) {
        pb.authStore.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    authenticate();

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        localStorage.removeItem("cart");
      }
    }
  }, []); 

  const isAuthenticated = user !== null;

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    // Cart
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
    // Orders & Status
    createOrder,
    userOrders,
    fetchUserOrders,
    loading,
    isAuthenticated,
    refreshUser,
    // Constante
    POINTS_TO_DOLLAR_DISCOUNT_RATE, 
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