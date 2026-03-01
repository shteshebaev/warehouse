import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingDown,
  History,
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/products', icon: Package, labelKey: 'nav.products' },
  { path: '/purchases', icon: ShoppingCart, labelKey: 'nav.purchases' },
  { path: '/expenses', icon: TrendingDown, labelKey: 'nav.expenses' },
  { path: '/history', icon: History, labelKey: 'nav.history' },
]

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-light-card/95 dark:bg-[#1E1E20]/95 backdrop-blur-ios border-t border-light-border dark:border-[rgba(255,255,255,0.08)] safe-area-bottom">
      <ul className="flex items-center justify-around h-16 px-2">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <li key={item.path} className="flex-1">
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center gap-0.5 py-1.5
                  transition-colors duration-200
                  ${isActive
                    ? 'text-ios-blue'
                    : 'text-light-text-secondary dark:text-dark-text-secondary'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      initial={false}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
