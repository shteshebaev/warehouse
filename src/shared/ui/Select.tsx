import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
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
          <select
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 rounded-ios-lg appearance-none
              bg-light-card dark:bg-dark-card
              border border-light-border dark:border-dark-border
              text-light-text dark:text-dark-text
              focus:outline-none focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue
              transition-all duration-200
              pr-10
              ${error ? 'border-ios-red focus:ring-ios-red/50 focus:border-ios-red' : ''}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-light-text-secondary dark:text-dark-text-secondary">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-ios-red">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
