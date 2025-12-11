"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  sublabel?: string
  className?: string
}

export function AnimatedCheckbox({
  checked,
  onChange,
  disabled = false,
  label,
  sublabel,
  className,
}: AnimatedCheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-muted/50",
        checked && "bg-primary/10",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-5 h-5 rounded border-2 transition-colors duration-200 flex items-center justify-center",
          checked ? "bg-primary border-primary" : "border-muted-foreground",
          disabled && "bg-muted",
        )}
        onClick={(e) => {
          e.preventDefault()
          if (!disabled) onChange(!checked)
        }}
      >
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M2 6L5 9L10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </svg>
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {sublabel && <span className="text-xs text-muted-foreground ml-2">{sublabel}</span>}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  )
}
