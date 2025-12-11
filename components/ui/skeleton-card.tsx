import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden bg-card border border-border", className)}>
      <div className="aspect-square animate-shimmer bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded animate-shimmer bg-muted" />
        <div className="h-4 w-full rounded animate-shimmer bg-muted" />
        <div className="h-4 w-1/2 rounded animate-shimmer bg-muted" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 rounded animate-shimmer bg-muted" />
          <div className="h-10 w-24 rounded animate-shimmer bg-muted" />
        </div>
      </div>
    </div>
  )
}
