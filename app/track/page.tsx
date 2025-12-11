import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { OrderTracker } from "@/components/tracking/order-tracker"

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <OrderTracker />
      </main>
      <Footer />
    </div>
  )
}
