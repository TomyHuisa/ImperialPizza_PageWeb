"use client"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Coins, Plus, Minus, Trash2 } from "lucide-react"

import { useAppStore } from "@/lib/store/app-store"
import { Button } from "@/components/ui/button"

const POINTS_STEP = 25
const POINT_VALUE = 2 / 25
const MAX_POINTS_PER_ITEM = 150

export function CartView() {

  const { state, dispatch } = useAppStore()

  const subtotal = useMemo(() => {

    return state.cart.reduce((sum, item) => {

      const itemTotal = item.totalPrice * item.quantity

      return sum + itemTotal

    }, 0)

  }, [state.cart])

  const totalPointsUsed = useMemo(() => {

    return state.cart.reduce((sum, item) => {

      return sum + (item.pointsUsed || 0)

    }, 0)

  }, [state.cart])

  const userPoints = state.user?.points || 0
  const remainingPoints = userPoints - totalPointsUsed

  function removeItem(id: string) {

    dispatch({
      type: "REMOVE_FROM_CART",
      payload: id
    })

  }

  function updateQuantity(item: any, newQuantity: number) {

    if (newQuantity <= 0) {
      removeItem(item.id)
      return
    }

    if (item.pizza.stock && newQuantity > item.pizza.stock) {
      return
    }

    dispatch({
      type: "UPDATE_CART_ITEM",
      payload: { id: item.id, quantity: newQuantity }
    })

  }

  function updateItemPoints(id: string, newPoints: number) {

    dispatch({
      type: "UPDATE_CART_ITEM_POINTS",
      payload: {
        id,
        pointsUsed: Math.max(0, newPoints)
      }
    })

  }

  function incrementPoints(item: any) {

    const current = item.pointsUsed || 0

    if (current >= MAX_POINTS_PER_ITEM) return

    if (remainingPoints < POINTS_STEP) return

    updateItemPoints(item.id, current + POINTS_STEP)

  }

  function decrementPoints(item: any) {

    const current = item.pointsUsed || 0

    if (current <= 0) return

    updateItemPoints(item.id, current - POINTS_STEP)

  }

  function discountFromPoints(points: number) {

    return points * POINT_VALUE

  }

  if (state.cart.length === 0) {

    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Your cart is empty</h2>

        <Link href="/menu">
          <Button className="mt-4">Go to menu</Button>
        </Link>
      </div>
    )
  }

  return (

    <div className="container mx-auto py-10">

      <h1 className="text-3xl font-bold mb-6">
        Your Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ITEMS */}

        <div className="lg:col-span-2 space-y-4">

          {state.cart.map((item) => {

            const pointsUsed = item.pointsUsed || 0
            const itemTotal = item.totalPrice * item.quantity
            const discount = discountFromPoints(pointsUsed)
            const finalPrice = Math.max(0, itemTotal - discount)

            return (

              <div
                key={item.id}
                className="border rounded-xl p-4 flex gap-4"
              >

                <div className="relative w-24 h-24">

                  <Image
                    src={item.pizza.image}
                    alt={item.pizza.name}
                    fill
                    className="object-cover rounded-lg"
                  />

                </div>

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {item.pizza.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Stock: {item.pizza.stock ?? "∞"}
                  </p>

                  <p className="text-lg font-bold">
                    ${finalPrice.toFixed(2)}
                  </p>

                  {pointsUsed > 0 && (
                    <p className="text-green-600 text-sm">
                      Saved ${discount.toFixed(2)}
                    </p>
                  )}

                </div>

                {/* QUANTITY */}

                <div className="flex flex-col items-center gap-2">

                  <div className="flex items-center gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item, item.quantity - 1)
                      }
                    >
                      <Minus size={14} />
                    </Button>

                    <span>{item.quantity}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        updateQuantity(item, item.quantity + 1)
                      }
                    >
                      <Plus size={14} />
                    </Button>

                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>

                {/* POINTS */}

                <div className="flex flex-col items-center gap-2">

                  <Coins size={18} />

                  <div className="flex items-center gap-2">

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => decrementPoints(item)}
                    >
                      <Minus size={12} />
                    </Button>

                    <span>{pointsUsed}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => incrementPoints(item)}
                    >
                      <Plus size={12} />
                    </Button>

                  </div>

                  <span className="text-xs text-gray-500">
                    max {MAX_POINTS_PER_ITEM}
                  </span>

                </div>

              </div>

            )
          })}

        </div>

        {/* SUMMARY */}

        <div className="border rounded-xl p-6 h-fit">

          <h2 className="text-xl font-bold mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2 text-green-600">
            <span>Points discount</span>
            <span>
              -$
              {discountFromPoints(totalPointsUsed).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>
              $
              {(subtotal - discountFromPoints(totalPointsUsed)).toFixed(2)}
            </span>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Points available: {userPoints}
          </div>

          <Link href="/checkout">

            <Button className="w-full mt-4">
              Checkout
            </Button>

          </Link>

        </div>

      </div>

    </div>

  )

}