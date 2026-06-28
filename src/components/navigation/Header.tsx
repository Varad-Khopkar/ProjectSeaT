import React, { useState } from 'react'
import { Menu, Bell, Settings, Compass, ChevronDown, LogOut, User as UserIcon } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/formatters'
import { Link } from 'react-router-dom'

export const Header: React.FC = () => {
  const {
    activeUser,
    notifications,
    markNotificationRead,
    setSidebarMobileOpen,
  } = useApp()

  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-navy text-brand-pearl border-b border-brand-blue/30 shadow-medium">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section: Hamburger Menu and Branding */}
        <div className="flex items-center gap-3">
          {/* Hamburger button shown under screen width 'lg' */}
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="lg:hidden p-2 rounded-[12px] hover:bg-brand-blue/20 text-slate-300 hover:text-white transition-colors cursor-pointer focus-ring"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
            <div className="bg-brand-blue/30 p-2 rounded-[12px] border border-brand-blue/40 text-brand-gold">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-sans font-bold tracking-wide text-white block text-sm sm:text-base leading-none uppercase">
                ProjectSeaT
              </span>
              <span className="text-[9px] tracking-widest text-brand-gold uppercase block font-mono leading-none mt-0.5">
                Maritime Training
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section: Sub-nav showcase links (Optional/Mock) */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs tracking-wide">
          <Link to="/" className="text-brand-pearl border-b-2 border-brand-gold pb-1 font-semibold">
            PSC DEMO SHOWCASE
          </Link>
          <Link to="/modules" className="text-slate-300 hover:text-brand-pearl transition-colors">
            MODULES
          </Link>
          <Link to="/leaderboard" className="text-slate-300 hover:text-brand-pearl transition-colors">
            LEADERBOARD
          </Link>
        </nav>

        {/* Right Section: Alerts dropdown, Settings and User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Notifications dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationPopup(!showNotificationPopup)
                setShowProfileMenu(false)
              }}
              className={cn(
                'p-2 rounded-[12px] transition-colors relative focus-ring cursor-pointer',
                showNotificationPopup ? 'bg-brand-blue/30 text-white' : 'text-slate-300 hover:bg-brand-blue/20 hover:text-brand-pearl'
              )}
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 text-[9px] font-bold text-white rounded-full bg-brand-coral flex items-center justify-center ring-2 ring-brand-navy">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotificationPopup && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200/80 rounded-[16px] shadow-large p-4 text-brand-navy z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-sans font-bold text-sm">Maritime Alerts</h4>
                  {unreadCount > 0 && (
                    <span className="text-[9px] font-mono font-bold bg-brand-coral/10 text-brand-coral px-2 py-0.5 rounded-full uppercase">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No active alerts.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n.id)}
                        className={cn(
                          'w-full text-left p-2 rounded-[10px] transition-colors hover:bg-slate-50 flex gap-2.5 items-start cursor-pointer select-none',
                          !n.read && 'bg-slate-50/50 border-l-2 border-brand-blue pl-1.5'
                        )}
                      >
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-1.5 shrink-0',
                            n.type === 'error'
                              ? 'bg-brand-coral'
                              : n.type === 'warning'
                                ? 'bg-brand-gold'
                                : 'bg-brand-blue'
                          )}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-brand-navy leading-snug">{n.message}</p>
                          {n.description && <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{n.description}</p>}
                          <span className="text-[9px] font-mono text-slate-400 block mt-1">{n.time}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings link */}
          <Link
            to="/settings"
            className="p-2 rounded-[12px] hover:bg-brand-blue/20 text-slate-300 hover:text-brand-pearl transition-colors focus-ring"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu)
                setShowNotificationPopup(false)
              }}
              className={cn(
                'flex items-center gap-2 px-2.5 py-1.5 rounded-[12px] transition-all focus-ring cursor-pointer',
                showProfileMenu ? 'bg-brand-blue/30 text-white' : 'hover:bg-brand-blue/20'
              )}
            >
              <div className="h-7 w-7 rounded-[8px] bg-brand-gold text-brand-navy flex items-center justify-center font-bold text-xs uppercase shadow-small">
                {activeUser.avatar}
              </div>
              <span className="hidden sm:inline text-xs font-sans font-medium text-slate-200">
                {activeUser.name}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:inline" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-200/80 rounded-[16px] shadow-large py-1.5 text-brand-navy z-50 animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                    {activeUser.rank}
                  </p>
                  <p className="text-xs font-bold truncate text-brand-navy">
                    {activeUser.name}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Account Settings
                </Link>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-brand-coral hover:bg-slate-50 border-t border-slate-100 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
