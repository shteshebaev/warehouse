import { useEffect, useState, createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const toastIcons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-ios-green" />,
  error: <XCircle className="w-5 h-5 text-ios-red" />,
  warning: <AlertCircle className="w-5 h-5 text-ios-orange" />,
  info: <Info className="w-5 h-5 text-ios-blue" />,
}

const toastStyles: Record<ToastType, string> = {
  success: 'border-ios-green/20',
  error: 'border-ios-red/20',
  warning: 'border-ios-orange/20',
  info: 'border-ios-blue/20',
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id)
      }, toast.duration || 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center gap-3 px-4 py-3
        bg-light-card/95 dark:bg-dark-card/95
        backdrop-blur-ios
        border ${toastStyles[toast.type]}
        rounded-ios-lg shadow-ios-lg
        max-w-sm w-full
      `}
    >
      {toastIcons[toast.type]}
      <p className="flex-1 text-sm font-medium text-light-text dark:text-dark-text">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 -m-1 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-full"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {typeof window !== 'undefined' &&
        createPortal(
          <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="sync">
              {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                  <ToastItem toast={toast} onRemove={removeToast} />
                </div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}
