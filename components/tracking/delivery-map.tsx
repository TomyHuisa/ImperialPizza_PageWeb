"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation } from "lucide-react"

interface DeliveryMapProps {
  deliveryLocation: { lat: number; lng: number }
  driverLocation: { lat: number; lng: number } | null
  isDelivering: boolean
}

export function DeliveryMap({ deliveryLocation, driverLocation, isDelivering }: DeliveryMapProps) {
  // Mock map visualization
  const mapRef = useRef<HTMLDivElement>(null)

  const driverPosition = driverLocation
    ? {
        x: ((driverLocation.lng - -74.02) / 0.02) * 100,
        y: ((driverLocation.lat - 40.7) / 0.02) * 100,
      }
    : null

  const deliveryPosition = {
    x: ((deliveryLocation.lng - -74.02) / 0.02) * 100,
    y: ((deliveryLocation.lat - 40.7) / 0.02) * 100,
  }

  return (
    <div ref={mapRef} className="relative h-[400px] bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden">
      {/* Grid lines for visual interest */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Route line (mock) */}
      {isDelivering && driverPosition && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.line
            x1={`${driverPosition.x}%`}
            y1={`${100 - driverPosition.y}%`}
            x2={`${deliveryPosition.x}%`}
            y2={`${100 - deliveryPosition.y}%`}
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      )}

      {/* Delivery Location Marker */}
      <motion.div
        className="absolute"
        style={{
          left: `${deliveryPosition.x}%`,
          top: `${100 - deliveryPosition.y}%`,
          transform: "translate(-50%, -100%)",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="relative">
          <MapPin className="h-10 w-10 text-primary drop-shadow-lg" fill="currentColor" />
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-0.5 rounded shadow">
            Your Location
          </span>
        </div>
      </motion.div>

      {/* Driver Marker */}
      {isDelivering && driverPosition && (
        <motion.div
          className="absolute"
          style={{
            left: `${driverPosition.x}%`,
            top: `${100 - driverPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="relative">
            {/* Pulse effect */}
            <div className="absolute inset-0 animate-pulse-marker">
              <div className="w-12 h-12 rounded-full bg-secondary/30" />
            </div>
            {/* Driver icon */}
            <div className="relative w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <Navigation className="h-6 w-6 text-secondary-foreground" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-0.5 rounded shadow">
              Driver
            </span>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <p className="text-xs font-medium text-muted-foreground mb-2">Map Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Delivery Address</span>
          </div>
          {isDelivering && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                <Navigation className="h-2.5 w-2.5 text-secondary-foreground" />
              </div>
              <span>Driver</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
