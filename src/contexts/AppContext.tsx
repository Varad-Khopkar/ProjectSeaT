import React, { createContext, useContext, useState } from 'react'

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
const initialUser: User = {
  id: 'usr-1',
  name: 'Capt. Henderson',
  rank: 'Master Mariner',
  avatar: 'CH',
  email: 'henderson.c@sea-voyager.com',
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [globalLoading, setGlobalLoading] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [preferences, setPreferences] = useState<Preferences>({
    textScale: 'normal',
    highContrast: false,
  })

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
        activeUser: initialUser,
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
