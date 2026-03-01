import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, defaultTab, onChange, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className={className}>
      {/* Tab List - iOS Segmented Control Style */}
      <div className="relative p-1 bg-light-separator dark:bg-dark-separator rounded-ios-lg">
        <div className="relative flex">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative flex-1 px-4 py-2 text-sm font-medium rounded-ios
                  transition-colors duration-200
                  ${isActive
                    ? 'text-light-text dark:text-dark-text'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-light-card dark:bg-dark-card rounded-ios shadow-sm"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Tab Button Group
interface TabButtonGroupProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function TabButtonGroup({
  tabs,
  activeTab,
  onChange,
  className = '',
}: TabButtonGroupProps) {
  return (
    <div className={`relative p-1 bg-light-separator dark:bg-dark-separator rounded-ios-lg inline-flex ${className}`}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-4 py-2 text-sm font-medium rounded-ios
              transition-colors duration-200
              ${isActive
                ? 'text-light-text dark:text-dark-text'
                : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabButton"
                className="absolute inset-0 bg-light-card dark:bg-dark-card rounded-ios shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
