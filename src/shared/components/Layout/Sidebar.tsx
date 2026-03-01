import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingDown,
  History,
  BarChart3,
  Settings,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/store'
import { NAV_ITEMS, ADMIN_NAV_ITEMS } from '@/shared/constants'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingDown,
  History,
  BarChart3,
  Settings,
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  const navItems = isAdmin ? [...NAV_ITEMS, ...ADMIN_NAV_ITEMS] : NAV_ITEMS

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] h-screen
          bg-light-bg dark:bg-[#1E1E20]
          border-r border-light-border dark:border-[rgba(255,255,255,0.08)]
          flex flex-col
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-ios bg-ios-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-light-text dark:text-dark-text">
              {t('common.appName')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-ios hover:bg-light-separator dark:hover:bg-dark-separator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map(item => {
              const Icon = iconMap[item.icon]
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-ios-lg
                      transition-all duration-200
                      ${isActive
                        ? 'bg-ios-blue text-white'
                        : 'text-light-text dark:text-dark-text hover:bg-light-separator dark:hover:bg-dark-separator'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-light-border dark:border-dark-border">
          <div className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary">
            Warehouse v1.0.0
          </div>
        </div>
      </motion.aside>
    </>
  )
}
