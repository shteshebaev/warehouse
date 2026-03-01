import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, ShoppingCart, TrendingDown, LayoutDashboard, History, BarChart3, ArrowRight } from 'lucide-react'
import { useProductStore } from '@/store'

interface SpotlightSearchProps {
  isOpen: boolean
  onClose: () => void
}

type SearchResultType = 'page' | 'product' | 'action'

interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  icon: React.ReactNode
  path?: string
  action?: () => void
}

export function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { products } = useProductStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Pages for navigation
  const pages: SearchResult[] = [
    { id: 'dashboard', type: 'page', title: t('nav.dashboard'), icon: <LayoutDashboard className="w-5 h-5" />, path: '/' },
    { id: 'products', type: 'page', title: t('nav.products'), icon: <Package className="w-5 h-5" />, path: '/products' },
    { id: 'purchases', type: 'page', title: t('nav.purchases'), icon: <ShoppingCart className="w-5 h-5" />, path: '/purchases' },
    { id: 'expenses', type: 'page', title: t('nav.expenses'), icon: <TrendingDown className="w-5 h-5" />, path: '/expenses' },
    { id: 'history', type: 'page', title: t('nav.history'), icon: <History className="w-5 h-5" />, path: '/history' },
    { id: 'analytics', type: 'page', title: t('nav.analytics'), icon: <BarChart3 className="w-5 h-5" />, path: '/analytics' },
  ]

  // Search results
  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) return pages

    const lowerQuery = query.toLowerCase()

    // Filter pages
    const matchedPages = pages.filter(page =>
      page.title.toLowerCase().includes(lowerQuery)
    )

    // Filter products
    const matchedProducts: SearchResult[] = products
      .filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.code.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        type: 'product' as const,
        title: product.name,
        subtitle: `${product.code} • ${product.currentStock} ${t(`products.units.${product.unit}`)}`,
        icon: <Package className="w-5 h-5" />,
        path: '/products',
      }))

    return [...matchedPages, ...matchedProducts]
  }, [query, products, pages, t])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Open with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault()
          // This would need to be handled by parent
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % results.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex])
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleSelect = (result: SearchResult) => {
    if (result.path) {
      navigate(result.path)
    }
    if (result.action) {
      result.action()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl bg-light-card dark:bg-dark-card rounded-ios-2xl shadow-ios-xl border border-light-border dark:border-dark-border overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-light-border dark:border-dark-border">
              <Search className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
              <input
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                placeholder={t('common.search')}
                className="flex-1 bg-transparent text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary outline-none text-lg"
                autoFocus
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary bg-light-separator dark:bg-dark-separator rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="px-4 py-8 text-center text-light-text-secondary dark:text-dark-text-secondary">
                  {t('common.noData')}
                </div>
              ) : (
                <ul>
                  {results.map((result, index) => (
                    <li key={result.id}>
                      <button
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 transition-colors
                          ${index === selectedIndex
                            ? 'bg-ios-blue/10'
                            : 'hover:bg-light-separator dark:hover:bg-dark-separator'
                          }
                        `}
                      >
                        <div className={`${index === selectedIndex ? 'text-ios-blue' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
                          {result.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${index === selectedIndex ? 'text-ios-blue' : 'text-light-text dark:text-dark-text'}`}>
                            {result.title}
                          </div>
                          {result.subtitle && (
                            <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                              {result.subtitle}
                            </div>
                          )}
                        </div>
                        {index === selectedIndex && (
                          <ArrowRight className="w-4 h-4 text-ios-blue" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-light-border dark:border-dark-border flex items-center justify-between text-xs text-light-text-secondary dark:text-dark-text-secondary">
              <span>
                <kbd className="px-1.5 py-0.5 bg-light-separator dark:bg-dark-separator rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-light-separator dark:bg-dark-separator rounded ml-1">↓</kbd>
                <span className="ml-2">{t('common.search')}</span>
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-light-separator dark:bg-dark-separator rounded">↵</kbd>
                <span className="ml-2">{t('common.confirm')}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
