import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onClear?: () => void
  variant?: 'default' | 'search'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onClear,
      variant = 'default',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {(leftIcon || variant === 'search') && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary">
              {variant === 'search' ? <Search className="w-5 h-5" /> : leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 rounded-ios-lg
              bg-light-card dark:bg-dark-card
              border border-light-border dark:border-dark-border
              text-light-text dark:text-dark-text
              placeholder-light-text-secondary dark:placeholder-dark-text-secondary
              focus:outline-none focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue
              transition-all duration-200
              ${leftIcon || variant === 'search' ? 'pl-10' : ''}
              ${rightIcon || onClear ? 'pr-10' : ''}
              ${error ? 'border-ios-red focus:ring-ios-red/50 focus:border-ios-red' : ''}
              ${className}
            `}
            {...props}
          />
          {(rightIcon || (onClear && props.value)) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {onClear && props.value ? (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-ios-red">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 rounded-ios-lg
            bg-light-card dark:bg-dark-card
            border border-light-border dark:border-dark-border
            text-light-text dark:text-dark-text
            placeholder-light-text-secondary dark:placeholder-dark-text-secondary
            focus:outline-none focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue
            transition-all duration-200
            resize-none
            ${error ? 'border-ios-red focus:ring-ios-red/50 focus:border-ios-red' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-ios-red">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
