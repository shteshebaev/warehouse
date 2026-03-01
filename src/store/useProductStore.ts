import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, ProductFormData, Category } from '@/shared/types'
import { generateId, STORAGE_KEYS } from '@/shared/utils/helpers'
import { DEFAULT_CATEGORIES } from '@/shared/constants'

interface ProductState {
  products: Product[]
  categories: Category[]
  isLoading: boolean
  addProduct: (data: ProductFormData) => Product
  updateProduct: (id: string, data: Partial<ProductFormData>) => void
  deleteProduct: (id: string) => void
  getProductById: (id: string) => Product | undefined
  updateStock: (id: string, quantityChange: number, newAvgCost?: number) => void
  addCategory: (name: string, color: string) => Category
  deleteCategory: (id: string) => void
  getLowStockProducts: () => Product[]
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: DEFAULT_CATEGORIES,
      isLoading: false,

      addProduct: (data: ProductFormData): Product => {
        const newProduct: Product = {
          id: generateId(),
          ...data,
          currentStock: 0,
          averageCost: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set(state => ({
          products: [...state.products, newProduct],
        }))

        return newProduct
      },

      updateProduct: (id: string, data: Partial<ProductFormData>) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id
              ? { ...product, ...data, updatedAt: new Date().toISOString() }
              : product
          ),
        }))
      },

      deleteProduct: (id: string) => {
        set(state => ({
          products: state.products.filter(product => product.id !== id),
        }))
      },

      getProductById: (id: string): Product | undefined => {
        return get().products.find(product => product.id === id)
      },

      updateStock: (id: string, quantityChange: number, newAvgCost?: number) => {
        set(state => ({
          products: state.products.map(product => {
            if (product.id !== id) return product

            const newStock = Math.max(0, product.currentStock + quantityChange)
            return {
              ...product,
              currentStock: newStock,
              averageCost: newAvgCost ?? product.averageCost,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      addCategory: (name: string, color: string): Category => {
        const newCategory: Category = {
          id: generateId(),
          name,
          color,
        }

        set(state => ({
          categories: [...state.categories, newCategory],
        }))

        return newCategory
      },

      deleteCategory: (id: string) => {
        set(state => ({
          categories: state.categories.filter(category => category.id !== id),
        }))
      },

      getLowStockProducts: (): Product[] => {
        return get().products.filter(
          product => product.currentStock <= product.minStock
        )
      },
    }),
    {
      name: STORAGE_KEYS.PRODUCTS,
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
      }),
    }
  )
)
