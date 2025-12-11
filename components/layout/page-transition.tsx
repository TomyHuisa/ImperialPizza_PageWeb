"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 25,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
