import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100%-2rem)] md:max-w-4xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`
                w-full ${sizeStyles[size]}
                bg-light-bg dark:bg-dark-bg
                rounded-t-ios-2xl md:rounded-ios-2xl
                shadow-ios-xl
                max-h-[90vh] overflow-hidden
                flex flex-col
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-light-border dark:border-dark-border">
                  {title && (
                    <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 -m-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors rounded-full hover:bg-light-separator dark:hover:bg-dark-separator"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>

              {/* iOS-style handle for mobile */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 md:hidden">
                <div className="w-10 h-1 bg-light-separator dark:bg-dark-separator rounded-full" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Confirm Modal
interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmModalProps) {
  const variantColors = {
    danger: 'bg-ios-red hover:bg-ios-red/90',
    warning: 'bg-ios-orange hover:bg-ios-orange/90',
    info: 'bg-ios-blue hover:bg-ios-blue/90',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
          {title}
        </h3>
        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-ios-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium transition-colors hover:bg-light-separator dark:hover:bg-dark-separator"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-3 rounded-ios-lg text-white font-medium transition-colors ${variantColors[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
