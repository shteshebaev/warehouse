interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseStyles = 'bg-light-separator dark:bg-dark-separator'

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-ios-lg',
  }

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${animationStyles[animation]}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-ios-xl border border-light-border dark:border-dark-border">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
    </div>
  )
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton width={index === 0 ? '80%' : '60%'} height={16} />
        </td>
      ))}
    </tr>
  )
}

// Dashboard Card Skeleton
export function DashboardCardSkeleton() {
  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-ios-xl border border-light-border dark:border-dark-border">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton width={100} height={14} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
        <Skeleton width="70%" height={32} />
        <Skeleton width="50%" height={12} />
      </div>
    </div>
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="p-4 bg-light-card dark:bg-dark-card rounded-ios-xl border border-light-border dark:border-dark-border">
      <div className="flex items-start gap-4">
        <Skeleton variant="rectangular" width={80} height={80} className="rounded-ios-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton width="80%" height={20} />
          <Skeleton width="50%" height={14} />
          <div className="flex items-center gap-2 mt-3">
            <Skeleton width={60} height={24} className="rounded-full" />
            <Skeleton width={80} height={14} />
          </div>
        </div>
      </div>
    </div>
  )
}

// List Skeleton
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
