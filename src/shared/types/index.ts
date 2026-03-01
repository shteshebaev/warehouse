// Product types
export interface Product {
  id: string
  code: string
  name: string
  unit: 'pcs' | 'kg' | 'l' | 'm' | 'box'
  barcode?: string
  category: string
  minStock: number
  currentStock: number
  averageCost: number
  photo?: string
  createdAt: string
  updatedAt: string
}

// Purchase (income) types
export interface Purchase {
  id: string
  productId: string
  productName: string
  quantity: number
  unitCost: number
  totalCost: number
  supplier?: string
  date: string
  comment?: string
  createdAt: string
}

// Expense (outgoing) types
export type ExpenseType = 'sale' | 'damage' | 'personal' | 'return'

export interface Expense {
  id: string
  productId: string
  productName: string
  quantity: number
  unitCost: number
  salePrice?: number
  expenseType: ExpenseType
  client?: string
  date: string
  comment?: string
  profit?: number
  createdAt: string
}

// Transaction types (for history)
export type TransactionType = 'purchase' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  productId: string
  productName: string
  quantity: number
  unitCost: number
  totalAmount: number
  date: string
  details: Purchase | Expense
  createdAt: string
}

// User and Auth types
export type UserRole = 'admin' | 'manager'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Dashboard KPI types
export interface DashboardKPI {
  totalStock: number
  stockValue: number
  totalRevenue: number
  totalExpenses: number
  profit: number
  lowStockProducts: Product[]
}

// Category type
export interface Category {
  id: string
  name: string
  color: string
}

// Filter types
export interface DateFilter {
  startDate: string | null
  endDate: string | null
}

export interface TransactionFilter extends DateFilter {
  productId?: string
  type?: TransactionType
  searchQuery?: string
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Language types
export type Language = 'en' | 'ru' | 'uz'

// Stock status type
export type StockStatus = 'low' | 'medium' | 'good'

// Form types
export interface ProductFormData {
  code: string
  name: string
  unit: Product['unit']
  barcode?: string
  category: string
  minStock: number
  photo?: string
}

export interface PurchaseFormData {
  productId: string
  quantity: number
  unitCost: number
  supplier?: string
  date: string
  comment?: string
}

export interface ExpenseFormData {
  productId: string
  quantity: number
  salePrice?: number
  expenseType: ExpenseType
  client?: string
  date: string
  comment?: string
}
