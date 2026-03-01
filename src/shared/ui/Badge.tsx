import type { ReactNode } from 'react'
import type { StockStatus } from '@/shared/types'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-light-separator dark:bg-dark-separator text-light-text-secondary dark:text-dark-text-secondary',
  success: 'bg-ios-green/10 text-ios-green',
  warning: 'bg-ios-orange/10 text-ios-orange',
  danger: 'bg-ios-red/10 text-ios-red',
  info: 'bg-ios-blue/10 text-ios-blue',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

// Stock Status Badge
interface StockBadgeProps {
  status: StockStatus
  size?: BadgeSize
  className?: string
}

const stockStatusVariant: Record<StockStatus, BadgeVariant> = {
  low: 'danger',
  medium: 'warning',
  good: 'success',
}

const stockStatusLabels: Record<StockStatus, string> = {
  low: 'products.stockStatus.low',
  medium: 'products.stockStatus.medium',
  good: 'products.stockStatus.good',
}

export function StockBadge({ status, size = 'md', className = '' }: StockBadgeProps) {
  return (
    <Badge variant={stockStatusVariant[status]} size={size} className={className}>
      <span className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === 'low'
              ? 'bg-ios-red'
              : status === 'medium'
              ? 'bg-ios-orange'
              : 'bg-ios-green'
          }`}
        />
        {stockStatusLabels[status]}
      </span>
    </Badge>
  )
}
