import type { User } from "@/lib/types"

export const demoUsers: User[] = [
  {
    id: "user-1",
    name: "John Customer",
    email: "customer@imperial.pizza",
    phone: "+1 555-0100",
    role: "customer",
    points: 250,
    password: "customer123",
  },
  {
    id: "admin-1",
    name: "Maria Admin",
    email: "admin@imperial.pizza",
    phone: "+1 555-0101",
    role: "admin",
    points: 250,
    password: "admin123",
  },
  {
    id: "kitchen-1",
    name: "Chef Antonio",
    email: "kitchen@imperial.pizza",
    phone: "+1 555-0102",
    role: "kitchen",
    points: 250,
    password: "kitchen123",
  },
  {
    id: "driver-1",
    name: "Marco Driver",
    email: "driver@imperial.pizza",
    phone: "+1 555-0103",
    role: "driver",
    points: 250,
    password: "driver123",
  },
]
