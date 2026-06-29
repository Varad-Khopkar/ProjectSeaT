import React, { createContext, useContext, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { mockUser, mockLeaderboard } from '@/mock/db'

export interface User {
  id: string
  name: string
  rank: string
  avatar: string
  email: string
}

export interface Notification {
  id: string
  message: string
  description?: string
  time: string
  type: 'info' | 'warning' | 'error'
  read: boolean
}

export interface Preferences {
  textScale: 'normal' | 'large'
  highContrast: boolean
}

interface AppContextType {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (val: boolean) => void
  sidebarMobileOpen: boolean
  setSidebarMobileOpen: (val: boolean) => void
  activeUser: User
  globalLoading: boolean
  setGlobalLoading: (val: boolean) => void
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  preferences: Preferences
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>
  markNotificationRead: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Default mock values

const initialNotifications: Notification[] = [
  {
    id: 'nt-1',
    message: 'PSC Inspection Active',
    description: 'PSC Inspector has boarded and is reviewing logs in the Ship Office.',
    time: '08:30 LT',
    type: 'info',
    read: false,
  },
  {
    id: 'nt-2',
    message: 'Deficiency Warning Issued',
    description: 'Bilge Oil Separator valve check is outstanding.',
    time: '09:00 LT',
    type: 'warning',
    read: false,
  },
]

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [globalLoading, setGlobalLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [preferences, setPreferences] = useState<Preferences>({
    textScale: 'normal',
    highContrast: false,
  })

  // Dynamically sync static mockUser and mockLeaderboard with logged-in user
  if (authUser) {
    mockUser.id = `usr-${authUser.username}`
    mockUser.name = authUser.name
    mockUser.rank = authUser.role || authUser.rank
    mockUser.avatar = authUser.username === 'captain' ? 'CH' :
                      authUser.username === 'officer' ? 'CS' :
                      authUser.username === 'inspector' ? 'IR' :
                      authUser.username === 'trainee' ? 'CW' : 'US'
    mockUser.email = `${authUser.username}@sea-voyager.com`
    mockUser.rankTitle = authUser.username === 'captain' ? 'Captain of the Fleet' :
                         authUser.username === 'officer' ? 'Chief Operations Officer' :
                         authUser.username === 'inspector' ? 'Lead Port State Auditor' :
                         authUser.username === 'trainee' ? 'Trainee Officer' : 'Staff Member'

    if (mockLeaderboard && mockLeaderboard[1]) {
      mockLeaderboard[1].name = authUser.name
      mockLeaderboard[1].rankTitle = authUser.role || authUser.rank
      mockLeaderboard[1].avatar = mockUser.avatar
    }
  }

  const activeUser: User = {
    id: mockUser.id,
    name: mockUser.name,
    rank: mockUser.rank,
    avatar: mockUser.avatar,
    email: mockUser.email,
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        sidebarMobileOpen,
        setSidebarMobileOpen,
        activeUser,
        globalLoading,
        setGlobalLoading,
        notifications,
        setNotifications,
        preferences,
        setPreferences,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
