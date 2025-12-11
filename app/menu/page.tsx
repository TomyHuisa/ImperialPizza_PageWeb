import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { MenuCatalog } from "@/components/menu/menu-catalog"

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-imperial-wood to-imperial-wood-light py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-imperial-beige mb-4">Our Menu</h1>
            <p className="text-lg text-imperial-beige/80 max-w-2xl mx-auto">
              Discover our full selection of artisan pizzas, refreshing drinks, and delicious desserts
            </p>
          </div>
        </div>
        <MenuCatalog />
      </main>
      <Footer />
    </div>
  )
}
