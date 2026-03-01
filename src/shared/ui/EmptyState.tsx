import type { ReactNode } from 'react'
import { Package, FileText, ShoppingCart, TrendingDown } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-light-separator dark:bg-dark-separator">
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

// Preset Empty States
export function EmptyProducts({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="w-8 h-8" />}
      title="No products found"
      description="Add your first product to get started with inventory tracking"
      actionLabel="Add Product"
      onAction={onAction}
    />
  )
}

export function EmptyPurchases({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<ShoppingCart className="w-8 h-8" />}
      title="No purchases yet"
      description="Record your first purchase to start tracking inventory"
      actionLabel="Add Purchase"
      onAction={onAction}
    />
  )
}

export function EmptyExpenses({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<TrendingDown className="w-8 h-8" />}
      title="No expenses recorded"
      description="Track your sales and expenses to monitor your business"
      actionLabel="Add Expense"
      onAction={onAction}
    />
  )
}

export function EmptyTransactions() {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8" />}
      title="No transactions"
      description="Your transaction history will appear here once you start recording purchases and expenses"
    />
  )
}
