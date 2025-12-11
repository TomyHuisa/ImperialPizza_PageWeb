"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, Award, Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-imperial-wood to-imperial-wood-light py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="currentColor" className="text-imperial-mustard" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold text-imperial-beige mb-6 text-balance"
          >
            Artisan Pizzas Crafted for
            <span className="text-imperial-mustard"> Royalty</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-imperial-beige/80 mb-8 max-w-2xl mx-auto text-pretty"
          >
            Experience the finest Italian tradition with our handcrafted pizzas, made with premium ingredients and baked
            to perfection in our stone ovens.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/menu">
              <Button
                size="lg"
                className="bg-imperial-brick hover:bg-imperial-brick/90 text-imperial-beige font-semibold px-8"
              >
                Order Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/track">
              <Button
                size="lg"
                variant="outline"
                className="border-imperial-beige/30 text-imperial-beige hover:bg-imperial-beige/10 bg-transparent"
              >
                Track Order
              </Button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-imperial-mustard/20 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-5 w-5 text-imperial-mustard" />
              </div>
              <p className="text-sm font-medium text-imperial-beige">30 Min Delivery</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-imperial-mustard/20 flex items-center justify-center mx-auto mb-3">
                <Award className="h-5 w-5 text-imperial-mustard" />
              </div>
              <p className="text-sm font-medium text-imperial-beige">Premium Quality</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-imperial-mustard/20 flex items-center justify-center mx-auto mb-3">
                <Truck className="h-5 w-5 text-imperial-mustard" />
              </div>
              <p className="text-sm font-medium text-imperial-beige">Live Tracking</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-imperial-brick/20 blur-3xl" />
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-imperial-mustard/10 blur-3xl" />
    </section>
  )
}
