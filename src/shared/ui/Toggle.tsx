import { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  label?: string
  className?: string
}

const sizeStyles = {
  sm: {
    track: 'w-9 h-5',
    thumb: 'w-4 h-4',
    translate: 'translateX(16px)',
  },
  md: {
    track: 'w-12 h-7',
    thumb: 'w-6 h-6',
    translate: 'translateX(20px)',
  },
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      disabled = false,
      size = 'md',
      label,
      className = '',
    },
    ref
  ) => {
    const styles = sizeStyles[size]

    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex shrink-0 cursor-pointer rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus-visible:ring-2 focus-visible:ring-ios-blue/50 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            ${styles.track}
            ${checked ? 'bg-ios-green' : 'bg-light-separator dark:bg-dark-separator'}
          `}
        >
          <motion.span
            className={`
              pointer-events-none inline-block rounded-full bg-white shadow-lg ring-0
              ${styles.thumb}
            `}
            initial={false}
            animate={{
              x: checked ? (size === 'sm' ? 16 : 20) : 2,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ marginTop: size === 'sm' ? 2 : 2 }}
          />
        </button>
        {label && (
          <span className="text-sm font-medium text-light-text dark:text-dark-text">
            {label}
          </span>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
