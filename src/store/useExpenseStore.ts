import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Expense, ExpenseFormData } from '@/shared/types'
import { generateId, calculateProfit, STORAGE_KEYS } from '@/shared/utils/helpers'
import { useProductStore } from './useProductStore'

interface ExpenseState {
  expenses: Expense[]
  isLoading: boolean
  addExpense: (data: ExpenseFormData) => Expense
  deleteExpense: (id: string) => void
  getExpensesByProductId: (productId: string) => Expense[]
  getTotalExpenses: () => number
  getTotalRevenue: () => number
  getTotalProfit: () => number
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[]
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      isLoading: false,

      addExpense: (data: ExpenseFormData): Expense => {
        const productStore = useProductStore.getState()
        const product = productStore.getProductById(data.productId)

        if (!product) {
          throw new Error('Product not found')
        }

        if (product.currentStock < data.quantity) {
          throw new Error('Insufficient stock')
        }

        // Calculate profit for sales
        let profit: number | undefined
        if (data.expenseType === 'sale' && data.salePrice) {
          profit = calculateProfit(data.quantity, product.averageCost, data.salePrice)
        }

        const newExpense: Expense = {
          id: generateId(),
          productId: data.productId,
          productName: product.name,
          quantity: data.quantity,
          unitCost: product.averageCost,
          salePrice: data.salePrice,
          expenseType: data.expenseType,
          client: data.client,
          date: data.date,
          comment: data.comment,
          profit,
          createdAt: new Date().toISOString(),
        }

        // Update product stock (decrease)
        productStore.updateStock(data.productId, -data.quantity)

        set(state => ({
          expenses: [...state.expenses, newExpense],
        }))

        return newExpense
      },

      deleteExpense: (id: string) => {
        set(state => ({
          expenses: state.expenses.filter(expense => expense.id !== id),
        }))
      },

      getExpensesByProductId: (productId: string): Expense[] => {
        return get().expenses.filter(expense => expense.productId === productId)
      },

      getTotalExpenses: (): number => {
        return get().expenses.reduce(
          (total, expense) => total + expense.quantity * expense.unitCost,
          0
        )
      },

      getTotalRevenue: (): number => {
        return get().expenses
          .filter(expense => expense.expenseType === 'sale' && expense.salePrice)
          .reduce(
            (total, expense) => total + expense.quantity * (expense.salePrice || 0),
            0
          )
      },

      getTotalProfit: (): number => {
        return get().expenses
          .filter(expense => expense.profit !== undefined)
          .reduce((total, expense) => total + (expense.profit || 0), 0)
      },

      getExpensesByDateRange: (startDate: string, endDate: string): Expense[] => {
        return get().expenses.filter(expense => {
          const expenseDate = new Date(expense.date)
          return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
        })
      },
    }),
    {
      name: STORAGE_KEYS.EXPENSES,
      partialize: (state) => ({
        expenses: state.expenses,
      }),
    }
  )
)
