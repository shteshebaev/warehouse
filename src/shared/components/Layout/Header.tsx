import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  Menu,
  Search,
} from 'lucide-react'
import { useThemeStore, useAuthStore } from '@/store'
import { LANGUAGES } from '@/shared/constants'

interface HeaderProps {
  onMenuClick?: () => void
  onSearchClick?: () => void
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const currentLang = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setShowLangMenu(false)
  }

  return (
    <header className="sticky top-0 z-40 h-16 px-4 flex items-center justify-between bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-ios border-b border-light-border dark:border-dark-border">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-ios hover:bg-light-separator dark:hover:bg-dark-separator"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-ios bg-ios-blue flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="hidden sm:block font-semibold text-light-text dark:text-dark-text">
            {t('common.appName')}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search button (mobile) */}
        <button
          onClick={onSearchClick}
          className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-ios hover:bg-light-separator dark:hover:bg-dark-separator"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-ios hover:bg-light-separator dark:hover:bg-dark-separator"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-ios hover:bg-light-separator dark:hover:bg-dark-separator flex items-center gap-1"
          >
            <Globe className="w-5 h-5" />
            <span className="hidden sm:block text-sm">{currentLang.flag}</span>
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-40 py-1 bg-light-card dark:bg-dark-card rounded-ios-lg shadow-ios-lg border border-light-border dark:border-dark-border z-50"
                >
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-ios-blue/10 text-ios-blue'
                          : 'text-light-text dark:text-dark-text hover:bg-light-separator dark:hover:bg-dark-separator'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-ios-lg hover:bg-light-separator dark:hover:bg-dark-separator transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-ios-blue/10 flex items-center justify-center">
              <User className="w-4 h-4 text-ios-blue" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-light-text dark:text-dark-text max-w-[100px] truncate">
              {user?.name}
            </span>
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 py-1 bg-light-card dark:bg-dark-card rounded-ios-lg shadow-ios-lg border border-light-border dark:border-dark-border z-50"
                >
                  <div className="px-4 py-2 border-b border-light-border dark:border-dark-border">
                    <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                      {user?.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-ios-blue/10 text-ios-blue rounded-full capitalize">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-ios-red flex items-center gap-2 hover:bg-light-separator dark:hover:bg-dark-separator transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('auth.logout')}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
