import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  className?: string
  disabled?: boolean
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-ios-blue text-white hover:bg-ios-blue/90 active:bg-ios-blue/80',
  secondary: 'bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text hover:bg-light-separator dark:hover:bg-dark-separator border border-light-border dark:border-dark-border',
  danger: 'bg-ios-red text-white hover:bg-ios-red/90 active:bg-ios-red/80',
  ghost: 'bg-transparent text-ios-blue hover:bg-ios-blue/10 active:bg-ios-blue/20',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-ios',
  md: 'px-4 py-2.5 text-base rounded-ios-lg',
  lg: 'px-6 py-3 text-lg rounded-ios-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      onClick,
      type = 'button',
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
        className={`
          inline-flex items-center justify-center gap-2 font-medium
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
