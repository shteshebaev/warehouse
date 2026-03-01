import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Purchase, PurchaseFormData } from '@/shared/types'
import { generateId, calculateNewAverageCost, STORAGE_KEYS } from '@/shared/utils/helpers'
import { useProductStore } from './useProductStore'

interface PurchaseState {
  purchases: Purchase[]
  isLoading: boolean
  addPurchase: (data: PurchaseFormData) => Purchase
  deletePurchase: (id: string) => void
  getPurchasesByProductId: (productId: string) => Purchase[]
  getTotalPurchases: () => number
  getPurchasesByDateRange: (startDate: string, endDate: string) => Purchase[]
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      purchases: [],
      isLoading: false,

      addPurchase: (data: PurchaseFormData): Purchase => {
        const productStore = useProductStore.getState()
        const product = productStore.getProductById(data.productId)

        if (!product) {
          throw new Error('Product not found')
        }

        const totalCost = data.quantity * data.unitCost
        const newAvgCost = calculateNewAverageCost(
          product.currentStock,
          product.averageCost,
          data.quantity,
          data.unitCost
        )

        const newPurchase: Purchase = {
          id: generateId(),
          productId: data.productId,
          productName: product.name,
          quantity: data.quantity,
          unitCost: data.unitCost,
          totalCost,
          supplier: data.supplier,
          date: data.date,
          comment: data.comment,
          createdAt: new Date().toISOString(),
        }

        // Update product stock and average cost
        productStore.updateStock(data.productId, data.quantity, newAvgCost)

        set(state => ({
          purchases: [...state.purchases, newPurchase],
        }))

        return newPurchase
      },

      deletePurchase: (id: string) => {
        set(state => ({
          purchases: state.purchases.filter(purchase => purchase.id !== id),
        }))
      },

      getPurchasesByProductId: (productId: string): Purchase[] => {
        return get().purchases.filter(purchase => purchase.productId === productId)
      },

      getTotalPurchases: (): number => {
        return get().purchases.reduce((total, purchase) => total + purchase.totalCost, 0)
      },

      getPurchasesByDateRange: (startDate: string, endDate: string): Purchase[] => {
        return get().purchases.filter(purchase => {
          const purchaseDate = new Date(purchase.date)
          return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate)
        })
      },
    }),
    {
      name: STORAGE_KEYS.PURCHASES,
      partialize: (state) => ({
        purchases: state.purchases,
      }),
    }
  )
)
