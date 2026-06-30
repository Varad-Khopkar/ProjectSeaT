import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { 
  Menu, 
  Bell, 
  Settings, 
  Compass, 
  ChevronDown, 
  LogOut, 
  User as UserIcon,
  Search,
  Ship,
  Anchor,
  Clock,
  Target,
  ShieldCheck,
  BookOpen,
  FileText,
  Briefcase,
  Flame,
  Cpu,
  ChevronRight,
  Play,
  Pause,
  MoreHorizontal,
  Clipboard as ClipboardIcon,
  SunDim,
  Award,
  ChevronLeft,
  X,
  AlertTriangle,
  Check,
  AlertCircle
} from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useSimulation } from '@/simulation'
import { cn } from '@/utils/formatters'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  searchDatabase, 
  headerNotifications, 
  getCategoryIcon,
  getNotificationIcon 
} from '@/mock/headerDb'
import type { SearchItem } from '@/mock/headerDb'

export const Header: React.FC = () => {
  const {
    activeUser,
    setSidebarMobileOpen,
  } = useApp()

  const { state: simState, activeMission } = useSimulation()
  const location = useLocation()
  const navigate = useNavigate()

  // Dropdowns toggling states
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotificationPopup, setShowNotificationPopup] = useState(false)
  const [activeNotificationTab, setActiveNotificationTab] = useState<string>('All')
  
  // Search Autocomplete state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [activePanel, setActivePanel] = useState<'checklist' | 'certificates' | 'regulations' | 'notes' | 'documents' | 'emergency' | null>(null)

  // Simulation Clock simulated time state
  const [simTime, setSimTime] = useState('08:30:00')
  const [simSpeed, setSimSpeed] = useState<'1x' | '2x' | 'pause'>('1x')

  // UI Refs for closing on outside click
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Auto-close overlay dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotificationPopup(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Auto-close overlays and panels on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePanel) setActivePanel(null)
        if (showSearchDropdown) setShowSearchDropdown(false)
        if (showNotificationPopup) setShowNotificationPopup(false)
        if (showProfileMenu) setShowProfileMenu(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePanel, showSearchDropdown, showNotificationPopup, showProfileMenu])

  // Calculate live mission progress details
  const isMissionActive = simState.status === 'running' || simState.status === 'paused'
  const totalObjectives = activeMission ? Object.values(activeMission.scenes).reduce(
    (acc, scene) => acc + scene.objectives.length, 0
  ) : 0
  const completedObjectivesCount = simState.playerState.completedObjectiveIds.length
  const progressPercent = totalObjectives > 0 ? Math.round((completedObjectivesCount / totalObjectives) * 100) : 0

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollArrowLeft, setShowScrollArrowLeft] = useState(false)
  const [showScrollArrowRight, setShowScrollArrowRight] = useState(false)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const canScrollLeft = el.scrollLeft > 10
    const canScrollRight = el.scrollWidth > el.clientWidth && el.scrollLeft < (el.scrollWidth - el.clientWidth - 15)
    setShowScrollArrowLeft(canScrollLeft)
    setShowScrollArrowRight(canScrollRight)
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    
    checkScroll()
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [simState.status, isMissionActive, location.pathname])

  // Simulated ticking clock
  useEffect(() => {
    if (simSpeed === 'pause') return

    const interval = setInterval(() => {
      setSimTime((prev) => {
        const parts = prev.split(':').map(Number)
        let secs = parts[2] + (simSpeed === '2x' ? 2 : 1)
        let mins = parts[1]
        let hours = parts[0]

        if (secs >= 60) {
          secs -= 60
          mins += 1
        }
        if (mins >= 60) {
          mins = 0
          hours += 1
        }
        if (hours >= 24) {
          hours = 0
        }

        const pad = (num: number) => String(num).padStart(2, '0')
        return `${pad(hours)}:${pad(mins)}:${pad(secs)}`
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [simSpeed])

  // Breadcrumbs parsing
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const getBreadcrumbLabel = (segment: string) => {
    if (segment === 'simulation') return 'Simulation Hub'
    if (segment === 'psc-mission-01') return 'PSC Audit'
    if (segment === 'debrief') return 'Debrief Summary'
    if (segment === 'results') return 'Detailed Audit'
    if (segment === 'modules') return 'Modules'
    if (segment === 'leaderboard') return 'Leaderboard'
    if (segment === 'profile') return 'Profile'
    if (segment === 'settings') return 'Settings'
    if (segment === 'help') return 'Help'
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // Handle autocomplete input changes
  const handleSearchInput = (val: string) => {
    setSearchQuery(val)
    if (!val.trim()) {
      setSearchResults([])
      setShowSearchDropdown(false)
      return
    }
    const query = val.toLowerCase()
    const matches = searchDatabase.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
    setSearchResults(matches)
    setShowSearchDropdown(true)
  }

  // Categories count for Notification center
  const notificationCategories = ['All', 'Mission Updates', 'PSC Alerts', 'Certificate Warnings', 'Messages', 'System Notifications']
  const filteredNotifications = headerNotifications.filter((n) => {
    if (activeNotificationTab === 'All') return true
    return n.category === activeNotificationTab
  })



  return (
    <>
    <header className="sticky top-0 z-40 w-full bg-brand-navy text-brand-pearl border-b border-brand-blue/30 shadow-medium flex flex-col shrink-0 select-none">
      
      {/* ================= TOP ROW ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-brand-blue/15 relative z-50">
        
        {/* Brand/Logo & Hamburger */}
        <div className="flex items-center gap-3">
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

        {/* Dynamic Breadcrumbs */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-4 mr-auto">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join('/')}`
            const isLast = index === pathSegments.length - 1
            return (
              <React.Fragment key={path}>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                {isLast ? (
                  <span className="text-brand-gold font-bold">{getBreadcrumbLabel(segment)}</span>
                ) : (
                  <Link to={path} className="hover:text-white transition-colors">{getBreadcrumbLabel(segment)}</Link>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Global Autocomplete Search Bar */}
        <div className="relative flex-1 max-w-sm mx-4" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents, regulations, crew..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              className="w-full bg-slate-950/60 border border-brand-blue/30 rounded-[12px] pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue/60 focus:ring-1 focus:ring-brand-blue/30 transition-all font-sans"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute left-0 mt-2 w-full max-h-80 bg-white border border-slate-200 rounded-[16px] shadow-large overflow-y-auto text-brand-navy z-50 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
              {searchResults.map((item) => {
                const CategoryIcon = getCategoryIcon(item.category)
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSearchDropdown(false)
                      setSearchQuery('')
                      navigate(item.path)
                    }}
                    className="w-full text-left p-2 rounded-[10px] hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <div className="p-1.5 bg-brand-blue/10 text-brand-blue rounded-md mt-0.5">
                      <CategoryIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-navy truncate">{item.title}</span>
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full shrink-0 ml-2">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Action icons & user profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Notification center */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotificationPopup(!showNotificationPopup)
                setShowProfileMenu(false)
              }}
              className={cn(
                'p-2 rounded-[12px] transition-colors relative focus-ring cursor-pointer',
                showNotificationPopup ? 'bg-brand-blue/30 text-white' : 'text-slate-300 hover:bg-brand-blue/20 hover:text-brand-pearl'
              )}
            >
              <Bell className="h-5 w-5" />
              {headerNotifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 text-[9px] font-bold text-white rounded-full bg-brand-coral flex items-center justify-center ring-2 ring-brand-navy">
                  {headerNotifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notification Center Popover */}
            {showNotificationPopup && (
              <div className="absolute right-0 mt-2.5 w-96 bg-white border border-slate-200 rounded-[20px] shadow-large p-4 text-brand-navy z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3 shrink-0">
                  <h4 className="font-sans font-bold text-sm">Mission Control Alerts</h4>
                  <span className="text-[9px] font-mono font-bold bg-brand-coral/10 text-brand-coral px-2.5 py-0.5 rounded-full uppercase">
                    {headerNotifications.filter(n => !n.read).length} UNREAD
                  </span>
                </div>

                {/* Categories Tabs inside notifications */}
                <div className="flex gap-1 overflow-x-auto pb-2 mb-2 border-b border-slate-100 shrink-0 scrollbar-none">
                  {notificationCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveNotificationTab(cat)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-bold whitespace-nowrap cursor-pointer transition-all",
                        activeNotificationTab === cat 
                          ? "bg-brand-blue text-white" 
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      )}
                    >
                      {cat === 'System Notifications' ? 'System' : cat === 'Certificate Warnings' ? 'Certs' : cat}
                    </button>
                  ))}
                </div>

                {/* Alerts List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {filteredNotifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No alerts in this category.</p>
                  ) : (
                    filteredNotifications.map((n) => {
                      const AlertIcon = getNotificationIcon(n.category)
                      return (
                        <div
                          key={n.id}
                          className={cn(
                            'p-2.5 rounded-[12px] border transition-all flex gap-3 items-start select-none relative',
                            n.read 
                              ? 'bg-white border-slate-100' 
                              : 'bg-slate-50 border-brand-blue/20'
                          )}
                        >
                          <div className={cn(
                            'p-2 rounded-lg shrink-0 mt-0.5',
                            n.type === 'error' ? 'bg-red-50 text-red-500' :
                            n.type === 'warning' ? 'bg-amber-50 text-amber-500' :
                            n.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                            'bg-blue-50 text-blue-500'
                          )}>
                            <AlertIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-brand-navy leading-tight">{n.title}</h5>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{n.description}</p>
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/50">
                              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wide">{n.category}</span>
                              <span className="text-[9px] font-mono text-slate-400">{n.time}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Settings Icon */}
          <Link
            to="/settings"
            className="p-2 rounded-[12px] hover:bg-brand-blue/20 text-slate-300 hover:text-brand-pearl transition-colors focus-ring"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          {/* User profile dropdown */}
          <div className="relative" ref={profileRef}>
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
              <div className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-200/80 rounded-[16px] shadow-large py-1.5 text-brand-navy z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                  onClick={() => {
                    setShowProfileMenu(false)
                    navigate('/offboard')
                  }}
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

      {/* ================= BOTTOM ROW (MISSION CONTROL BAR) ================= */}
      <div className="w-full bg-slate-950/45 border-t border-brand-blue/10 px-4 lg:px-8 py-3 relative z-10 flex items-center min-h-[60px]">
        {/* Horizontal scroll container with refined gaps */}
        <div ref={scrollContainerRef} className="w-full flex items-center gap-6 lg:gap-8 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          
          {/* 1. Active Vessel Widget (Increased Visual Weight) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shadow-inner">
              <Ship className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none tracking-wider">Active Vessel</span>
              <span className="text-sm font-bold text-white block mt-1 leading-none tracking-wide">M/V Sea Guardian</span>
              <span className="text-[11px] text-slate-300 block mt-1 leading-none">Dry Cargo Carrier</span>
            </div>
          </div>

          {/* 2. Location Card Widget (Scalable) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shadow-inner">
              <Anchor className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none tracking-wider">Current Port</span>
              <span className="text-sm font-bold text-white block mt-1 leading-none tracking-wide">Port of Rotterdam</span>
              <span className="text-[11px] text-slate-300 block mt-1 leading-none">Terminal 4 • Berth B</span>
            </div>
          </div>

          {/* 3. Active Mission Widget (Contextual Phase & Badging) */}
          {(() => {
            let primaryMissionVal = 'Awaiting Next Assignment'
            let secondaryMissionVal = 'Vessel Standby'
            let badgeText = 'Pending'
            let badgeStyle = 'bg-slate-500/10 text-slate-400 border border-slate-500/25'

            if (isMissionActive && activeMission) {
              badgeText = simState.playerState.trustScore < 50 ? 'Warning' : 'Active'
              badgeStyle = simState.playerState.trustScore < 50
                ? 'bg-brand-coral/10 text-brand-coral border border-brand-coral/25'
                : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/25 animate-pulse'
              
              const phaseMap: Record<string, string> = {
                ship_office: 'Document Review',
                bridge: 'Bridge Inspection',
                engine_room: 'Engine Room Inspection'
              }
              const currentPhase = (simState.currentSceneId ? phaseMap[simState.currentSceneId] : null) || 'Boarding'
              primaryMissionVal = `PSC Inspection • ${currentPhase}`
              secondaryMissionVal = activeMission.title
            } else if (simState.status === 'success') {
              primaryMissionVal = 'Mission Completed'
              secondaryMissionVal = 'Audit Finalized'
              badgeText = 'Completed'
              badgeStyle = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
            }

            return (
              <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10">
                <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shadow-inner">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none tracking-wider">Active Mission</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-white block leading-none tracking-wide">{primaryMissionVal}</span>
                    <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase", badgeStyle)}>
                      {badgeText}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 block mt-1 leading-none">{secondaryMissionVal}</span>
                </div>
              </div>
            )
          })()}

          {/* 4. Simulation Clock Widget (Clean UTC Separation) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shadow-inner">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none tracking-wider">Simulation</span>
                <span className="text-sm font-bold text-white block mt-1 leading-none tracking-wide">Day 1</span>
                <span className="text-[11px] text-brand-gold font-mono block mt-1 leading-none">{simTime} UTC</span>
              </div>
              <div className="flex items-center bg-slate-900/60 rounded-lg p-0.5 border border-brand-blue/15">
                <button 
                  onClick={() => setSimSpeed('1x')}
                  className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all", simSpeed === '1x' ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white")}
                  title="Normal Speed (1x)"
                >
                  1x
                </button>
                <button 
                  onClick={() => setSimSpeed('2x')}
                  className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all", simSpeed === '2x' ? "bg-brand-blue text-white" : "text-slate-400 hover:text-white")}
                  title="Fast Speed (2x)"
                >
                  2x
                </button>
                <button 
                  onClick={() => setSimSpeed(simSpeed === 'pause' ? '1x' : 'pause')}
                  className={cn("p-1 rounded cursor-pointer transition-all flex items-center justify-center w-5 h-5", simSpeed === 'pause' ? "bg-brand-coral text-white" : "text-slate-400 hover:text-white")}
                  title={simSpeed === 'pause' ? "Resume Simulation" : "Pause Simulation"}
                >
                  {simSpeed === 'pause' ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 5. Mission Progress Widget (Information-Dense) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10 min-w-[150px]">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shadow-inner">
              <Target className="h-4 w-4" />
            </div>
            <div className="w-full">
              <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none tracking-wider">Mission Progress</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-20 bg-slate-900 rounded-full h-2 border border-brand-blue/15 overflow-hidden">
                  <div 
                    className="bg-brand-gold h-full rounded-full transition-all duration-300"
                    style={{ width: `${isMissionActive ? progressPercent : 0}%` }}
                  />
                </div>
                <span className="text-sm font-mono font-bold text-white leading-none">{isMissionActive ? progressPercent : 0}%</span>
              </div>
              <span className="text-[11px] text-slate-300 block mt-1 leading-none font-medium">
                {isMissionActive 
                  ? `Phase ${simState.currentSceneId === 'ship_office' ? 1 : simState.currentSceneId === 'bridge' ? 2 : 3} of 3`
                  : simState.status === 'success'
                    ? 'Phase 3 of 3'
                    : 'Awaiting Launch'}
              </span>
            </div>
          </div>

          {/* 6. Captain Status Widget (Split Rank and XP Levels) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10">
            <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center shadow-inner">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block leading-none tracking-wider">Captain Status</span>
              <span className="text-sm font-bold text-white block mt-1 leading-none tracking-wide">Master Mariner</span>
              <span className="text-[11px] text-slate-300 block mt-1 leading-none font-medium">
                Level 8 • { (4250 + simState.playerState.score).toLocaleString() } XP
              </span>
            </div>
          </div>

          {/* 7. Weather Widget Placeholder (Future Extensibility) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10 opacity-30 hover:opacity-60 transition-opacity duration-200">
            <div className="p-2 bg-brand-blue/5 text-slate-400 rounded-xl flex items-center justify-center">
              <SunDim className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block leading-none tracking-wider">Weather</span>
              <span className="text-sm font-bold text-slate-400 block mt-1 leading-none tracking-wide">Clear Sky</span>
              <span className="text-[11px] text-slate-500 block mt-1 leading-none">Beaufort 3 • Calm</span>
            </div>
          </div>

          {/* 8. Compliance Widget Placeholder (Future Extensibility) */}
          <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-brand-blue/10 opacity-30 hover:opacity-60 transition-opacity duration-200">
            <div className="p-2 bg-brand-blue/5 text-slate-400 rounded-xl flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono block leading-none tracking-wider">Compliance</span>
              <span className="text-sm font-bold text-slate-400 block mt-1 leading-none tracking-wide">95% Score</span>
              <span className="text-[11px] text-slate-500 block mt-1 leading-none">SOLAS Chapter II-2</span>
            </div>
                    {/* 9. Quick Actions Panel (Keyboards & Badge Badging) */}
          <div className="flex items-center gap-1.5 pl-2 shrink-0">
            {/* Desktop Panel */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Checklist */}
              <button 
                onClick={() => setActivePanel('checklist')}
                className="relative group p-2 hover:bg-brand-blue/20 rounded-xl text-slate-300 hover:text-white cursor-pointer transition-all focus-ring active:scale-95 animate-in fade-in"
                title="Checklist"
                tabIndex={0}
                aria-label="Checklist navigation shortcut"
              >
                <ClipboardIcon className="h-4 w-4" />
                {isMissionActive && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-[9px] font-bold text-white rounded-full bg-brand-blue flex items-center justify-center ring-2 ring-brand-navy">
                    {3 - completedObjectivesCount}
                  </span>
                )}
                {/* Custom Tooltip */}
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  Checklist (C)
                </span>
              </button>

              {/* Certificates */}
              <button 
                onClick={() => setActivePanel('certificates')}
                className="relative group p-2 hover:bg-brand-blue/20 rounded-xl text-slate-300 hover:text-white cursor-pointer transition-all focus-ring active:scale-95"
                title="Certificates"
                tabIndex={0}
                aria-label="Certificates panel shortcut"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 text-[9px] font-bold text-white rounded-full bg-brand-coral flex items-center justify-center ring-2 ring-brand-navy">
                  1
                </span>
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  Certificates (G)
                </span>
              </button>

              {/* Regulations */}
              <button 
                onClick={() => setActivePanel('regulations')}
                className="relative group p-2 hover:bg-brand-blue/20 rounded-xl text-slate-300 hover:text-white cursor-pointer transition-all focus-ring active:scale-95"
                title="Regulations"
                tabIndex={0}
                aria-label="Regulations panel shortcut"
              >
                <BookOpen className="h-4 w-4" />
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  Regulations (R)
                </span>
              </button>

              {/* Mission Notes */}
              <button 
                onClick={() => setActivePanel('notes')}
                className="relative group p-2 hover:bg-brand-blue/20 rounded-xl text-slate-300 hover:text-white cursor-pointer transition-all focus-ring active:scale-95"
                title="Mission Notes"
                tabIndex={0}
                aria-label="Mission Notes shortcut"
              >
                <FileText className="h-4 w-4" />
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  Mission Notes (N)
                </span>
              </button>

              {/* Ship Documents */}
              <button 
                onClick={() => setActivePanel('documents')}
                className="relative group p-2 hover:bg-brand-blue/20 rounded-xl text-slate-300 hover:text-white cursor-pointer transition-all focus-ring active:scale-95"
                title="Ship Documents"
                tabIndex={0}
                aria-label="Ship Documents shortcut"
              >
                <Briefcase className="h-4 w-4" />
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  Ship Documents (D)
                </span>
              </button>

              {/* Emergency */}
              <button 
                onClick={() => setActivePanel('emergency')}
                className="relative group p-2 hover:bg-brand-coral/10 hover:text-brand-coral rounded-xl text-brand-coral/80 cursor-pointer transition-all focus-ring active:scale-95"
                title="Emergency Alarms"
                tabIndex={0}
                aria-label="Trigger emergency protocol shortcut"
              >
                <Flame className="h-4 w-4" />
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  Emergency Protocol (E)
                </span>
              </button>

              {/* AI Assistant */}
              <button 
                className="relative group p-2 rounded-xl text-slate-600 cursor-not-allowed"
                title="AI Assistant (Reserved)"
                disabled
              >
                <Cpu className="h-4 w-4" />
                <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-955 text-white text-[9px] font-bold px-2 py-1 rounded shadow-large select-none pointer-events-none whitespace-nowrap z-55 border border-brand-blue/20">
                  AI Assistant
                </span>
              </button>
            </div>

            {/* Tablet Dropdown Overflow trigger */}
            <div className="lg:hidden relative">
              <button 
                onClick={() => setActivePanel('checklist')}
                className="p-2 hover:bg-brand-blue/20 rounded-xl text-slate-300 hover:text-white cursor-pointer focus-ring" 
                title="Quick Actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Left scroll fade arrow indicator */}
        {showScrollArrowLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none flex items-center justify-start pl-3 bg-gradient-to-r from-brand-navy via-brand-navy/60 to-transparent z-20 animate-in fade-in duration-300">
            <ChevronLeft className="h-5 w-5 text-brand-gold animate-pulse" />
          </div>
        )}

        {/* Right scroll fade arrow indicator */}
        {showScrollArrowRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none flex items-center justify-end pr-3 bg-gradient-to-l from-brand-navy via-brand-navy/60 to-transparent z-20 animate-in fade-in duration-300">
            <ChevronRight className="h-5 w-5 text-brand-gold animate-pulse" />
          </div>
        )}
      </div>
      </div>
    </header>

      {/* QUICK ACTION SLIDE-OVER PANELS – portalled to document.body to escape header z-index stacking context */}
      {activePanel && createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end select-text">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setActivePanel(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-brand-blue/20 shadow-2xl flex flex-col animate-in slide-in-from-right duration-350 ease-out z-10 text-slate-100">
            {/* Panel header */}
            <div className="p-5 border-b border-brand-blue/15 flex items-center justify-between shrink-0 bg-slate-950/40">
              <div className="flex items-center gap-3">
                {activePanel === 'checklist'    && <ClipboardIcon className="h-5 w-5 text-brand-gold" />}
                {activePanel === 'certificates' && <ShieldCheck   className="h-5 w-5 text-brand-blue" />}
                {activePanel === 'regulations'  && <BookOpen      className="h-5 w-5 text-brand-blue" />}
                {activePanel === 'notes'        && <FileText      className="h-5 w-5 text-brand-gold" />}
                {activePanel === 'documents'    && <Briefcase     className="h-5 w-5 text-brand-blue" />}
                {activePanel === 'emergency'    && <Flame         className="h-5 w-5 text-brand-coral animate-pulse" />}
                <div>
                  <h3 className="font-sans font-bold text-sm tracking-wide text-white uppercase">
                    {activePanel === 'emergency' ? 'Emergency Alerts' : `${activePanel} Board`}
                  </h3>
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                    {activePanel === 'emergency' ? 'Defects Monitoring' : 'PSC Audit Reference Data'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePanel(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
              {activePanel === 'checklist' && (
                <div className="space-y-4">
                  <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-3.5">
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Checklist items are designed to address the highest-detention risk areas cited in maritime audit records.
                    </p>
                  </div>
                  
                  <div className="space-y-2.5">
                    {[
                      { id: 'chk-1', label: 'Navigational Charts & Publications (SOLAS Ch. V)', checked: true, note: 'All charts corrected up to latest Notices to Mariners.' },
                      { id: 'chk-2', label: 'Emergency Fire Pump & Valving (SOLAS Ch. II-2)', checked: false, note: 'Verify fuel supply line and starter box contacts are clean.' },
                      { id: 'chk-3', label: 'Fire Dampers & Ventilation Closures', checked: false, note: 'Inspect damper flaps on deck for corrosion and manual linkages.' },
                      { id: 'chk-4', label: 'Life-Saving Appliances (Lifeboats & Lifejackets)', checked: false, note: 'Check expiry dates on pyrotechnics and hydrostatic release units.' },
                      { id: 'chk-5', label: 'Oily Water Separator & Bilge Pump (MARPOL Annex I)', checked: false, note: 'Ensure three-way valve discharges to holding tank below 15 ppm.' },
                      { id: 'chk-6', label: 'MLC Rest Hours Logs Verification (MLC 2006)', checked: true, note: 'Watchkeeper logs validated. Ensure 77 hours rest per week.' },
                      { id: 'chk-7', label: 'Engine Room Cleanliness & Bilge Wells (SP-185)', checked: false, note: 'Absorb stray oil, keep escape paths entirely unobstructed.' },
                      { id: 'chk-8', label: 'Galley & Provision Rooms Hygiene', checked: false, note: 'Ensure no expired meats, clear out drains and grease traps.' }
                    ].map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-slate-950/20 border border-slate-800 rounded-xl hover:border-brand-blue/15 transition-all">
                        <div className="mt-0.5">
                          <input 
                            type="checkbox" 
                            checked={item.checked} 
                            readOnly 
                            className="rounded border-slate-700 bg-slate-900 text-brand-blue focus:ring-brand-blue/30 h-4 w-4 cursor-pointer"
                          />
                        </div>
                        <div>
                          <span className={cn("text-xs font-bold block", item.checked ? "text-slate-400 line-through" : "text-white")}>
                            {item.label}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'certificates' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Document Compliance Alert</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Crews must check validity dates. If any mandatory certificate expires or shows incomplete audit history, the vessel is subject to immediate Code 30 detention.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Cargo Ship Safety Construction Certificate', convention: 'SOLAS', status: 'valid', expiry: 'Expires in 18 months', style: 'border-emerald-500/20 bg-emerald-500/5' },
                      { name: 'Cargo Ship Safety Equipment Certificate', convention: 'SOLAS', status: 'valid', expiry: 'Expires in 6 months', style: 'border-emerald-500/20 bg-emerald-500/5' },
                      { name: 'Cargo Ship Safety Radio Certificate', convention: 'SOLAS', status: 'valid', expiry: 'Expires in 12 months', style: 'border-emerald-500/20 bg-emerald-500/5' },
                      { name: 'International Oil Pollution Prevention (IOPP) Cert', convention: 'MARPOL Annex I', status: 'valid', expiry: 'Expires in 24 months', style: 'border-emerald-500/20 bg-emerald-500/5' },
                      { name: 'International Load Line Certificate', convention: 'Load Line 1966', status: 'valid', expiry: 'Expires in 8 months', style: 'border-emerald-500/20 bg-emerald-500/5' },
                      { name: 'Maritime Labour Certificate (MLC 2006)', convention: 'MLC Convention', status: 'warning', expiry: 'Interim Audit required next week!', style: 'border-brand-gold/20 bg-brand-gold/5' },
                      { name: 'Third Officer GMDSS Certificate of Competency', convention: 'STCW', status: 'alert', expiry: 'Expires in 2 days!', style: 'border-brand-coral/20 bg-brand-coral/5' }
                    ].map((cert, idx) => (
                      <div key={idx} className={cn("p-3.5 border rounded-xl flex items-center justify-between gap-3", cert.style)}>
                        <div>
                          <span className="text-xs font-bold text-white block">{cert.name}</span>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mt-1">
                            {cert.convention} • {cert.expiry}
                          </span>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase",
                          cert.status === 'valid' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          cert.status === 'warning' ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20" :
                          "bg-brand-coral/10 text-brand-coral border border-brand-coral/20 animate-pulse"
                        )}>
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'regulations' && (
                <div className="space-y-4">
                  <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-3.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-brand-blue" />
                      Applicable Conventions
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      PSC inspects the vessel based on key IMO and ILO conventions. Familiarize yourself with the core compliance boundaries.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* SOLAS */}
                    <div className="p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl">
                      <span className="text-xs font-bold text-white block">SOLAS (Safety of Life at Sea)</span>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Covers emergency power systems, fire doors, lifeboats, fire dampers, and safety drill frequency. Self-closing fire doors tied open are heavily penalized (Code 30 risk).
                      </p>
                    </div>

                    {/* MARPOL */}
                    <div className="p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl">
                      <span className="text-xs font-bold text-white block">MARPOL (Pollution Prevention)</span>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Annex I enforces strict bilge logging and bilge discharge limits (&lt; 15 ppm via OWS). Illegal modifications or bypassing the treatment piping leads to immediate detention and heavy fines.
                      </p>
                    </div>

                    {/* MLC */}
                    <div className="p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">MLC (Rest Hours Compliance)</span>
                        <span className="text-[9px] font-mono text-brand-gold uppercase tracking-wider font-bold">A2.3</span>
                      </div>
                      <ul className="text-[10px] text-slate-400 mt-2 space-y-1 list-disc pl-4 leading-relaxed">
                        <li>Minimum 10 hours rest in any 24-hour period.</li>
                        <li>Minimum 77 hours rest in any 7-day period.</li>
                        <li>Rest periods split into maximum 2 parts (one part must be at least 6 hours continuous).</li>
                        <li>Maximum 14 hours interval between rest periods.</li>
                      </ul>
                    </div>

                    {/* Load Line */}
                    <div className="p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl">
                      <span className="text-xs font-bold text-white block">Load Line 1966 (Hull & Deck Integrity)</span>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        Ensures weather-tight integrity. Focuses on air vent flaps, hatch coamings, quick-acting cleats, and sealing gaskets.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'notes' && (
                <div className="space-y-4">
                  {/* Company Records */}
                  <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide font-sans">Company Deficiencies History</h4>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                        <span className="text-slate-400 text-[10px] block font-mono">2023 LOGS</span>
                        <span className="text-sm font-bold text-white mt-1 block">37 Vessels</span>
                        <span className="text-[9px] text-slate-500">Deficiencies recorded</span>
                      </div>
                      <div className="p-2.5 bg-brand-coral/5 border border-brand-coral/10 rounded-lg">
                        <span className="text-brand-coral text-[10px] block font-mono">2024 (9 MOS)</span>
                        <span className="text-sm font-bold text-brand-coral mt-1 block">31 Vessels</span>
                        <span className="text-[9px] text-brand-coral/80">6 detentions recorded</span>
                      </div>
                    </div>
                  </div>

                  {/* Case Study */}
                  <div className="p-4 bg-slate-950/20 border border-slate-800 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-white block">PSC Case Study: Shekou Detention</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      A fleet vessel was detained in Shekou, China. The audit reported:
                    </p>
                    <ul className="text-[11px] text-slate-450 space-y-1 list-disc pl-4 font-medium">
                      <li><strong className="text-brand-coral text-xs">4 Code 30 Deficiencies</strong> (immediate detention)</li>
                      <li><strong className="text-brand-gold text-xs">3 Code 17 Deficiencies</strong> (rectify before departure)</li>
                      <li>Required Recognized Organisation (Class) attendance and survey.</li>
                    </ul>
                    <div className="border-t border-slate-850 pt-2.5 mt-2">
                      <span className="text-[10px] font-mono text-brand-coral font-bold uppercase tracking-wider block">Financial Impact</span>
                      <p className="text-[10px] text-slate-550 mt-1 leading-relaxed">
                        Resulted in off-hire penalties, class survey fees, operational delay, and reputational downgrades with local authorities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'documents' && (
                <div className="space-y-4">
                  <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-3.5">
                    <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                      The PSC officer reviews certificates, licensing, and logs on arrival. Keeping logs up-to-date is a key compliance parameter.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Oil Record Book (Part I - Machinery)', desc: 'Record of bilge water transfers, oil sludge discharges, and OWS operations. Counter logs must match counter readings.', status: 'updated' },
                      { name: 'Garbage Record Book & Management Plan', desc: 'Disposal logs of plastic, food waste, and cargo residues. Ensure garbage bins are color-coded.', status: 'updated' },
                      { name: 'Crew Rest Hour Records', desc: 'Watchkeeper schedules showing compliance with MLC rules. Logs must reflect actual hours to combat fatigue.', status: 'review' },
                      { name: 'Safety Drill Records & Muster List', desc: 'Confirm monthly abandon ship and fire drills are executed and logged within SOLAS requirements.', status: 'updated' },
                      { name: 'Charts & Nautical Publications Log', desc: 'Chart correction logs, notices to mariners portfolio, and active routes catalog.', status: 'updated' }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-950/20 border border-slate-800 rounded-xl flex gap-3 hover:border-slate-700 transition-colors">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white block">{doc.name}</span>
                          <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{doc.desc}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase shrink-0 h-fit",
                          doc.status === 'updated' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                        )}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'emergency' && (
                <div className="space-y-4">
                  {/* Warning hotline */}
                  <div className="bg-brand-coral/5 border border-brand-coral/20 rounded-xl p-3.5 flex gap-3">
                    <Flame className="h-5 w-5 text-brand-coral shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Emergency Alarm Protocols</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Crews must know standard alarms. PSC inspectors routinely test fire door alarms and steering gear override controls. Use Open Reporting Hotline <strong className="text-brand-coral font-mono">SP-231</strong> for environment violations.
                      </p>
                    </div>
                  </div>

                  {/* Live Alerts list */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold block">Active Defects List</span>
                    
                    <div className="p-3.5 border border-brand-coral/20 bg-brand-coral/5 rounded-xl flex gap-3">
                      <AlertCircle className="h-4 w-4 text-brand-coral shrink-0 mt-0.5 animate-bounce" />
                      <div>
                        <span className="text-xs font-bold text-white block">Generator #2 Exhaust Gas Leakage</span>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          Hot gas escaping from flange. Code 17 risk (rectify before sailing). Must patch immediately!
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 border border-brand-gold/20 bg-brand-gold/5 rounded-xl flex gap-3">
                      <AlertTriangle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Emergency Fire Pump Starter Box</span>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                          Contactors showing high electrical resistance. Tests might fail if pressure drops. Inspect now!
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 border border-slate-800 bg-slate-950/20 rounded-xl flex gap-3">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-350 block">Fire Damper Links</span>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          Lubricated and tested manual release mechanisms. Cleared for inspection.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brand-blue/15 bg-slate-950/30 flex items-center justify-end shrink-0">
              <button 
                onClick={() => setActivePanel(null)}
                className="px-4 py-1.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Dismiss Panel
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  )
}
