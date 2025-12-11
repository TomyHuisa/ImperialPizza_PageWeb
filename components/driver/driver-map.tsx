"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, Edit3, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DriverMapProps {
  driverLocation: { lat: number; lng: number }
  deliveryLocation: { lat: number; lng: number } | null
  deliveryAddress: string
  onAddressUpdate?: (address: string, coordinates: { lat: number; lng: number }) => void
  isEditable?: boolean
}

export function DriverMap({
  driverLocation,
  deliveryLocation,
  deliveryAddress,
  onAddressUpdate,
  isEditable = false,
}: DriverMapProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedAddress, setEditedAddress] = useState(deliveryAddress)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)

  const driverPos = {
    x: ((driverLocation.lng - -74.02) / 0.02) * 100,
    y: ((driverLocation.lat - 40.7) / 0.02) * 100,
  }

  const deliveryPos = deliveryLocation
    ? {
        x: ((deliveryLocation.lng - -74.02) / 0.02) * 100,
        y: ((deliveryLocation.lat - 40.7) / 0.02) * 100,
      }
    : null

  const handleMarkerDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditMode) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setDragPosition({ x, y })
    },
    [isEditMode],
  )

  const handleSaveEdit = () => {
    if (dragPosition && onAddressUpdate) {
      // Mock reverse geocoding
      const newLng = -74.02 + (dragPosition.x / 100) * 0.02
      const newLat = 40.7 + ((100 - dragPosition.y) / 100) * 0.02
      onAddressUpdate(editedAddress, { lat: newLat, lng: newLng })
    }
    setIsEditMode(false)
    setDragPosition(null)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setDragPosition(null)
    setEditedAddress(deliveryAddress)
  }

  const currentDeliveryPos = dragPosition || deliveryPos

  return (
    <div className="relative h-full min-h-[400px] bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="driver-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#driver-grid)" />
        </svg>
      </div>

      {/* Map Click Handler for Edit Mode */}
      <div
        className={`absolute inset-0 ${isEditMode ? "cursor-crosshair" : ""}`}
        onClick={isEditMode ? handleMarkerDrag : undefined}
      />

      {/* Route Line */}
      {currentDeliveryPos && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.line
            x1={`${driverPos.x}%`}
            y1={`${100 - driverPos.y}%`}
            x2={`${currentDeliveryPos.x}%`}
            y2={`${100 - currentDeliveryPos.y}%`}
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      )}

      {/* Driver Marker */}
      <motion.div
        className="absolute z-10"
        style={{
          left: `${driverPos.x}%`,
          top: `${100 - driverPos.y}%`,
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-marker">
            <div className="w-14 h-14 rounded-full bg-secondary/30" />
          </div>
          <div className="relative w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg border-4 border-card">
            <Navigation className="h-6 w-6 text-secondary-foreground" />
          </div>
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-1 rounded shadow">
            You
          </span>
        </div>
      </motion.div>

      {/* Delivery Marker */}
      {currentDeliveryPos && (
        <motion.div
          className={`absolute z-20 ${isEditMode ? "cursor-move" : ""}`}
          style={{
            left: `${currentDeliveryPos.x}%`,
            top: `${100 - currentDeliveryPos.y}%`,
            transform: "translate(-50%, -100%)",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          drag={isEditMode}
          dragMomentum={false}
          onDrag={(_, info) => {
            if (isEditMode) {
              const parent = document.querySelector(".driver-map-container")
              if (parent) {
                const rect = parent.getBoundingClientRect()
                const x = ((info.point.x - rect.left) / rect.width) * 100
                const y = ((info.point.y - rect.top) / rect.height) * 100
                setDragPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
              }
            }
          }}
        >
          <div className="relative">
            <MapPin
              className={`h-12 w-12 drop-shadow-lg ${isEditMode ? "text-secondary" : "text-primary"}`}
              fill="currentColor"
            />
            {isEditMode && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                <Edit3 className="h-2.5 w-2.5 text-secondary-foreground" />
              </motion.div>
            )}
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap bg-card px-2 py-1 rounded shadow">
              Delivery
            </span>
          </div>
        </motion.div>
      )}

      {/* Edit Controls */}
      {isEditable && deliveryLocation && (
        <div className="absolute top-4 right-4 z-30">
          {isEditMode ? (
            <div className="flex flex-col gap-2 bg-card p-3 rounded-lg shadow-lg border border-border">
              <Input
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
                placeholder="Enter new address"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Click on map to move pin</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="bg-transparent">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)} className="bg-card">
              <Edit3 className="h-4 w-4 mr-1" />
              Edit Location
            </Button>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
              <Navigation className="h-3 w-3 text-secondary-foreground" />
            </div>
            <span>Your Location</span>
          </div>
          {currentDeliveryPos && (
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Delivery Point</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
