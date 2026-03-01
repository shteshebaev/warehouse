import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/shared/types'
import { DEFAULT_USERS } from '@/shared/constants'
import { STORAGE_KEYS } from '@/shared/utils/helpers'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true })

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Find user in default users
        const foundUser = DEFAULT_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )

        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        }

        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      hasRole: (roles: UserRole[]): boolean => {
        const user = get().user
        if (!user) return false
        return roles.includes(user.role)
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
