import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartView } from "@/components/cart/cart-view"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <CartView />
      </main>
      <Footer />
    </div>
  )
}
