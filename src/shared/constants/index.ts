import type { Category, User } from '../types'

// Default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', color: '#007AFF' },
  { id: '2', name: 'Food', color: '#34C759' },
  { id: '3', name: 'Clothing', color: '#AF52DE' },
  { id: '4', name: 'Household', color: '#FF9500' },
  { id: '5', name: 'Tools', color: '#5AC8FA' },
  { id: '6', name: 'Other', color: '#8E8E93' },
]

// Units
export const UNITS = [
  { value: 'pcs', labelKey: 'products.units.pcs' },
  { value: 'kg', labelKey: 'products.units.kg' },
  { value: 'l', labelKey: 'products.units.l' },
  { value: 'm', labelKey: 'products.units.m' },
  { value: 'box', labelKey: 'products.units.box' },
] as const

// Expense types
export const EXPENSE_TYPES = [
  { value: 'sale', labelKey: 'expenses.types.sale' },
  { value: 'damage', labelKey: 'expenses.types.damage' },
  { value: 'personal', labelKey: 'expenses.types.personal' },
  { value: 'return', labelKey: 'expenses.types.return' },
] as const

// Stock status colors
export const STOCK_STATUS_COLORS = {
  low: '#FF3B30',
  medium: '#FF9500',
  good: '#34C759',
} as const

// Default users for demo
export const DEFAULT_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@warehouse.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@warehouse.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    createdAt: new Date().toISOString(),
  },
]

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
] as const

// Navigation items
export const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.dashboard', icon: 'LayoutDashboard' },
  { path: '/products', labelKey: 'nav.products', icon: 'Package' },
  { path: '/purchases', labelKey: 'nav.purchases', icon: 'ShoppingCart' },
  { path: '/expenses', labelKey: 'nav.expenses', icon: 'TrendingDown' },
  { path: '/history', labelKey: 'nav.history', icon: 'History' },
  { path: '/analytics', labelKey: 'nav.analytics', icon: 'BarChart3' },
] as const

// Admin only nav items
export const ADMIN_NAV_ITEMS = [
  { path: '/settings', labelKey: 'nav.settings', icon: 'Settings' },
] as const

// Animation variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  modalOverlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modalContent: {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  },
} as const
