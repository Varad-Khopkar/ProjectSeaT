import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'
import { MainContainer } from './MainContainer'
import { useApp } from '@/contexts/AppContext'
import { Loader2 } from 'lucide-react'

interface AppLayoutProps {
  children?: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarMobileOpen, setSidebarMobileOpen, globalLoading } = useApp()

  return (
    <div className="flex flex-col min-h-screen bg-brand-pearl relative">
      {/* Top Header Navigation */}
      <Header />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative items-start">
        {/* Desktop Sidebar (hidden under 'lg') */}
        <Sidebar />

        {/* Mobile Navigation Drawer Backdrop & Panel */}
        {sidebarMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop transition */}
            <div
              onClick={() => setSidebarMobileOpen(false)}
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-200"
            />
            {/* Drawer Panel */}
            <div className="relative flex flex-col bg-brand-navy shadow-large animate-in slide-in-from-left duration-300">
              <Sidebar isMobileDrawer={true} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-4rem)]">
          <MainContainer>
            {children || <Outlet />}
          </MainContainer>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-500 py-6 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            &copy; {new Date().getFullYear()} ProjectSeaT Maritime Platform (Demo). All rights reserved.
          </p>
          <div className="flex gap-4 text-[11px] font-mono text-slate-500">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">PSC Regulations</span>
          </div>
        </div>
      </footer>

      {/* Global Loading screen spinner overlay */}
      {globalLoading && (
        <div className="fixed inset-0 z-55 bg-brand-pearl/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200/80 p-6 rounded-[20px] shadow-large flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
            <span className="text-xs font-mono font-bold text-brand-navy uppercase tracking-wider">
              Syncing Logbook...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
