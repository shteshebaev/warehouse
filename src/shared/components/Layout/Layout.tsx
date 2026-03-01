import { useState, type ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { SpotlightSearch } from './SpotlightSearch'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:min-h-screen">
          {/* Header */}
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onSearchClick={() => setSearchOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />

      {/* Spotlight Search */}
      <SpotlightSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
