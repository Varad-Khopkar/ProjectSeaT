import React, { useState } from 'react'
import { Menu, ChevronRight, Home } from 'lucide-react'

// 1. Navbar
interface NavbarProps {
  items: { label: string; href: string; active?: boolean }[]
}

export const Navbar: React.FC<NavbarProps> = ({ items }) => {
  return (
    <nav className="w-full bg-white border border-slate-200/80 rounded-[12px] px-4 py-3 shadow-small flex items-center justify-between font-mono text-xs">
      <div className="flex items-center gap-6">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className={`transition-colors py-1 ${item.active ? 'text-brand-blue border-b-2 border-brand-blue font-bold' : 'text-slate-500 hover:text-brand-navy'}`}
          >
            {item.label.toUpperCase()}
          </a>
        ))}
      </div>
    </nav>
  )
}

// 2. Sidebar
interface SidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[]
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, tabs }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`bg-brand-navy text-white rounded-[16px] transition-all duration-300 flex shadow-medium w-full p-2.5 overflow-x-auto lg:overflow-x-visible flex-row gap-2 lg:flex-col lg:p-4 shrink-0 ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}>
      <div className="hidden lg:flex items-center justify-between border-b border-brand-blue/30 pb-3 mb-4 shrink-0">
        {!collapsed && <span className="font-mono text-xs text-brand-gold font-bold tracking-widest uppercase">Navigation</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-brand-blue/20 rounded-[8px] transition-colors cursor-pointer ml-auto"
          aria-label="Toggle menu collapse"
        >
          <Menu className="h-4 w-4 text-slate-300 hover:text-white" />
        </button>
      </div>

      <nav className="flex flex-row flex-nowrap lg:flex-col gap-1.5 shrink-0 w-full lg:w-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 lg:gap-3 px-3.5 py-2 lg:py-2.5 rounded-[12px] transition-all text-left text-xs lg:text-sm font-sans cursor-pointer focus-ring whitespace-nowrap shrink-0 ${isActive ? 'bg-brand-blue text-white font-semibold' : 'text-slate-300 hover:bg-brand-blue/20 hover:text-white'}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={`${collapsed ? 'lg:hidden' : 'inline-block'} truncate`}>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

// 3. Breadcrumb
interface BreadcrumbProps {
  steps: { label: string; href?: string }[]
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ steps }) => {
  return (
    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] uppercase tracking-wide">
      <Home className="h-3.5 w-3.5 text-slate-400" />
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          {step.href ? (
            <a href={step.href} className="hover:text-brand-blue transition-colors">
              {step.label}
            </a>
          ) : (
            <span className="text-brand-navy font-semibold">{step.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// 4. Tabs
interface TabsProps {
  activeTab: string
  onChange: (tabId: string) => void
  items: { id: string; label: string; badge?: string | number }[]
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, items }) => {
  return (
    <div className="border-b border-slate-200/80 flex items-center gap-6 w-full font-sans text-sm">
      {items.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-3 relative flex items-center gap-2 font-medium cursor-pointer transition-colors focus-ring border-b-2 ${isActive ? 'text-brand-blue border-brand-blue font-semibold' : 'text-slate-500 border-transparent hover:text-brand-navy'}`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${isActive ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
