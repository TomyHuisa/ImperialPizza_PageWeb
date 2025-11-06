import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts";
import { CartProvider } from "@/contexts/CartContext"; // Agregar esta importación
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Pizzeria Imperial",
  description: "Auténtica pizzas",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            {" "}
            {/* Agregar CartProvider aquí */}
            <Suspense fallback={null}>
              {children}
              <Toaster />
            </Suspense>
            <Analytics />
          </CartProvider>{" "}
          {/* Cerrar CartProvider */}
        </AuthProvider>
      </body>
    </html>
  );
}
