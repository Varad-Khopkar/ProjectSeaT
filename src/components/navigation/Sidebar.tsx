import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Trophy,
  User,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
} from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { NAVIGATION_ITEMS } from '@/constants'
import { cn } from '@/utils/formatters'

// Icon mapping dictionary
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  BookOpen,
  Trophy,
  User,
  Settings,
  HelpCircle,
  Compass,
}

interface SidebarProps {
  isMobileDrawer?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileDrawer = false }) => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarMobileOpen,
    setSidebarMobileOpen,
  } = useApp()

  const handleLinkClick = () => {
    if (sidebarMobileOpen) {
      setSidebarMobileOpen(false)
    }
  }

  return (
    <aside
      className={cn(
        'bg-brand-navy text-white flex flex-col transition-all duration-300 shadow-medium shrink-0',
        isMobileDrawer
          ? 'w-72 h-full'
          : cn(
              'hidden lg:flex rounded-[20px] my-4 ml-4 h-[calc(100vh-2rem)] border border-brand-blue/30',
              sidebarCollapsed ? 'w-20' : 'w-64'
            )
      )}
    >
      {/* Mobile Drawer Header */}
      {isMobileDrawer ? (
        <div className="flex items-center justify-between p-5 border-b border-brand-blue/20">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue/30 p-2 rounded-[12px] text-brand-gold">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-sans font-bold text-white uppercase text-sm leading-none block">ProjectSeaT</span>
              <span className="text-[10px] text-brand-gold uppercase tracking-wider block font-mono mt-0.5 leading-none">Maritime Training</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarMobileOpen(false)}
            className="p-1.5 hover:bg-brand-blue/20 rounded-[8px] transition-colors cursor-pointer text-slate-300 hover:text-white focus-ring"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        /* Desktop Header Section */
        <div className="flex items-center justify-between px-4 py-5 border-b border-brand-blue/20 min-h-[70px]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-brand-blue/30 p-1.5 rounded-[8px] text-brand-gold">
                <Compass className="h-4 w-4" />
              </div>
              <span className="font-mono text-xs text-brand-gold font-bold tracking-widest uppercase">NAV PANEL</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              'p-1.5 hover:bg-brand-blue/20 rounded-[8px] transition-colors cursor-pointer text-slate-300 hover:text-white focus-ring',
              sidebarCollapsed ? 'mx-auto' : 'ml-auto'
            )}
            aria-label="Toggle navigation collapse"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Navigation Items list */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || Compass
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all text-sm font-sans focus-ring cursor-pointer select-none',
                  isActive
                    ? 'bg-brand-blue text-white font-semibold shadow-inner'
                    : 'text-slate-300 hover:bg-brand-blue/20 hover:text-white',
                  sidebarCollapsed && !isMobileDrawer && 'justify-center px-0'
                )
              }
              title={sidebarCollapsed && !isMobileDrawer ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  'transition-opacity duration-200',
                  sidebarCollapsed && !isMobileDrawer ? 'sr-only lg:hidden' : 'inline-block truncate'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      {/* Sidebar Footer context (User rank summary) */}
      {!sidebarCollapsed || isMobileDrawer ? (
        <div className="p-4 border-t border-brand-blue/20 bg-brand-navy/60 text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between shrink-0">
          <span>Vessel: Guardian</span>
          <span className="text-brand-gold font-bold">SOLAS v2</span>
        </div>
      ) : (
        <div className="p-2 border-t border-brand-blue/20 flex justify-center shrink-0">
          <Compass className="h-4 w-4 text-brand-blue" />
        </div>
      )}
    </aside>
  )
}
