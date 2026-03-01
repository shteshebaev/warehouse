import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Package } from 'lucide-react'
import { useAuthStore, useThemeStore } from '@/store'
import { Button, Input } from '@/shared/ui'

export function LoginPage() {
  const { t } = useTranslation()
  const { login, isLoading } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(email, password)
    if (!success) {
      setError(t('auth.loginError'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-ios-blue/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-ios-purple/10 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative"
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="absolute -top-12 right-0 p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-ios hover:bg-light-separator dark:hover:bg-dark-separator"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Card */}
        <div className="bg-light-card dark:bg-dark-card rounded-ios-2xl shadow-ios-xl border border-light-border dark:border-dark-border p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-ios-2xl bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center shadow-ios-lg"
            >
              <Package className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {t('auth.signInToContinue')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@warehouse.com"
              required
            />

            <div className="relative">
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-ios-red text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              {t('auth.loginButton')}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 pt-6 border-t border-light-border dark:border-dark-border">
            <p className="text-xs text-center text-light-text-secondary dark:text-dark-text-secondary mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@warehouse.com')
                  setPassword('admin123')
                }}
                className="w-full flex justify-between p-3 bg-light-separator/50 dark:bg-[#252528] rounded-ios-lg hover:bg-light-separator dark:hover:bg-[#2a2a2d] transition-colors text-left"
              >
                <span className="text-light-text-secondary dark:text-dark-text-secondary">Admin:</span>
                <span className="font-mono text-light-text dark:text-dark-text">admin@warehouse.com</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@warehouse.com')
                  setPassword('manager123')
                }}
                className="w-full flex justify-between p-3 bg-light-separator/50 dark:bg-[#252528] rounded-ios-lg hover:bg-light-separator dark:hover:bg-[#2a2a2d] transition-colors text-left"
              >
                <span className="text-light-text-secondary dark:text-dark-text-secondary">Manager:</span>
                <span className="font-mono text-light-text dark:text-dark-text">manager@warehouse.com</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
