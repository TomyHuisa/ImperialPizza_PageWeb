// Core Types for Imperial Pizzeria

export interface Pizza {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "classic" | "premium" | "vegetarian" | "specialty"
  available: boolean
  toppings: string[]
  stock: number
  popular?: boolean
}

export interface Topping {
  id: string
  name: string
  price: number
  category: "meat" | "vegetable" | "cheese" | "sauce"
}

export interface Drink {
  id: string
  name: string
  description: string
  price: number
  image: string
  size: "small" | "medium" | "large"
  stock: number
}

export interface Dessert {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
}

export interface CartItem {
  id: string
  pizza: Pizza
  quantity: number
  selectedToppings: Topping[]
  totalPrice: number
}

export interface DrinkCartItem {
  id: string
  drink: Drink
  quantity: number
  totalPrice: number
}

export interface DessertCartItem {
  id: string
  dessert: Dessert
  quantity: number
  totalPrice: number
}

export interface Order {
  id: string
  items: CartItem[]
  drinkItems?: DrinkCartItem[]
  dessertItems?: DessertCartItem[]
  status: OrderStatus
  totalPrice: number
  discountApplied: number
  pointsUsed: number
  pointsEarned: number
  customerName: string
  customerPhone: string
  deliveryAddress: string
  coordinates: { lat: number; lng: number }
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
  driverId?: string
  driverLocation?: { lat: number; lng: number }
  orderMode: "delivery" | "takeaway"
  paymentMethod: "cash" | "card"
  cardInfo?: {
    lastFour: string
  }
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "customer" | "kitchen" | "driver" | "admin"
  points: number
  password?: string
}

export interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  timestamp: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "customer" | "kitchen" | "driver" | "admin"
  points: number
}
