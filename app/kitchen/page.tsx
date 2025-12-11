import { ProtectedRoute } from "@/components/auth/protected-route"
import { KitchenDashboard } from "@/components/kitchen/kitchen-dashboard"

export default function KitchenPage() {
  return (
    <ProtectedRoute allowedRoles={["kitchen"]}>
      <KitchenDashboard />
    </ProtectedRoute>
  )
}
