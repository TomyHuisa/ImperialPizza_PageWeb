"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  className?: string
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedCounter({
  value,
  className = "",
  prefix = "",
  suffix = "",
  duration = 0.5,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousValue = useRef(value)

  useEffect(() => {
    if (previousValue.current !== value) {
      setIsAnimating(true)
      const startValue = previousValue.current
      const endValue = value
      const startTime = performance.now()
      const durationMs = duration * 1000

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / durationMs, 1)

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress)

        setDisplayValue(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          previousValue.current = value
        }
      }

      requestAnimationFrame(animate)
    }
  }, [value, duration])

  return (
    <span className={`inline-flex items-center ${className}`}>
      {prefix}
      <AnimatePresence mode="wait">
        <motion.span
          key={displayValue}
          initial={isAnimating ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="tabular-nums"
        >
          {displayValue}
        </motion.span>
      </AnimatePresence>
      {suffix}
    </span>
  )
}
