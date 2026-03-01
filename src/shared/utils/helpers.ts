import { format, parseISO } from 'date-fns'
import type { Product, StockStatus } from '../types'

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Format currency
export const formatCurrency = (amount: number, currency = 'UZS'): string => {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`
}

// Format number with spaces
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(num)
}

// Format date
export const formatDate = (dateString: string, formatStr = 'dd.MM.yyyy'): string => {
  try {
    return format(parseISO(dateString), formatStr)
  } catch {
    return dateString
  }
}

// Format datetime
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, 'dd.MM.yyyy HH:mm')
}

// Get today's date in ISO format
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0]
}

// Get stock status
export const getStockStatus = (product: Product): StockStatus => {
  if (product.currentStock <= 0) return 'low'
  if (product.currentStock <= product.minStock) return 'low'
  if (product.currentStock <= product.minStock * 2) return 'medium'
  return 'good'
}

// Calculate average cost after new purchase
export const calculateNewAverageCost = (
  currentStock: number,
  currentAvgCost: number,
  newQuantity: number,
  newUnitCost: number
): number => {
  const totalValue = currentStock * currentAvgCost + newQuantity * newUnitCost
  const totalQuantity = currentStock + newQuantity
  return totalQuantity > 0 ? totalValue / totalQuantity : 0
}

// Calculate profit from sale
export const calculateProfit = (
  quantity: number,
  averageCost: number,
  salePrice: number
): number => {
  return (salePrice - averageCost) * quantity
}

// Debounce function
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'warehouse-theme',
  LANGUAGE: 'i18nextLng',
  AUTH: 'warehouse-auth',
  PRODUCTS: 'warehouse-products',
  PURCHASES: 'warehouse-purchases',
  EXPENSES: 'warehouse-expenses',
  CATEGORIES: 'warehouse-categories',
  USERS: 'warehouse-users',
} as const
