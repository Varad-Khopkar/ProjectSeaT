import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { mockUser, mockLeaderboard, mockModules } from '@/mock/db'
import type { TrainingModule } from '@/mock/db'
import type { TheoryProgress } from '@/simulation/types'

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

  // Platform Briefing Engine State
  modules: TrainingModule[]
  theoryProgressMap: Record<string, TheoryProgress>
  updateTheoryProgress: (missionId: string, updates: Partial<TheoryProgress>) => void
  completeTheory: (missionId: string) => void
  completeSimulation: (moduleCode: string, score: number) => void
  resetTheoryProgress: (missionId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

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

// Mapping helper functions between Module ID and Mission ID
export const getMissionIdFromModuleId = (moduleId: string): string => {
  switch (moduleId) {
    case 'mod-1': return 'psc-mission-01'
    case 'mod-2': return 'lfb-mission-02'
    case 'mod-3': return 'eng-mission-03'
    case 'mod-4': return 'sls-mission-04'
    case 'mod-5': return 'crg-mission-05'
    default: return ''
  }
}

export const getModuleIdFromMissionId = (missionId: string): string => {
  switch (missionId) {
    case 'psc-mission-01': return 'mod-1'
    case 'lfb-mission-02': return 'mod-2'
    case 'eng-mission-03': return 'mod-3'
    case 'sls-mission-04': return 'mod-4'
    case 'crg-mission-05': return 'mod-5'
    default: return ''
  }
}

const createInitialProgress = (missionId: string): TheoryProgress => ({
  missionId,
  status: missionId === 'sls-mission-04' ? 'completed' : 'not_started',
  progressPercentage: missionId === 'sls-mission-04' ? 100 : 0,
  currentSectionId: null,
  currentBlockId: null,
  assessmentAttempts: 0,
  assessmentHighScore: 0,
  assessmentPassed: missionId === 'sls-mission-04',
  completionTimestamp: missionId === 'sls-mission-04' ? new Date().toISOString() : null,
  durationSeconds: 0,
  answers: {},
  readSectionIds: missionId === 'sls-mission-04' ? ['sec-cert-docs', 'sec-reg-standards'] : [],
})

const PREREQUISITES_MAP: Record<string, string[]> = {
  'mod-1': [],
  'mod-2': [],
  'mod-3': [],
  'mod-4': [],
  'mod-5': ['mod-1'], // Cargo Stowage requires PSC-01 completion
}

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

  // Dynamic modules list state
  const [modules, setModules] = useState<TrainingModule[]>(() => {
    const saved = localStorage.getItem('projectseat_modules')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing projectseat_modules:', e)
      }
    }
    return mockModules
  })

  // Dynamic theory progress map state
  const [theoryProgressMap, setTheoryProgressMap] = useState<Record<string, TheoryProgress>>(() => {
    const saved = localStorage.getItem('projectseat_theory_progress')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing projectseat_theory_progress:', e)
      }
    }
    
    // Initialize default progress for mock modules
    const initialMap: Record<string, TheoryProgress> = {}
    mockModules.forEach((m) => {
      const missionId = getMissionIdFromModuleId(m.id)
      if (missionId) {
        initialMap[missionId] = createInitialProgress(missionId)
      }
    })
    return initialMap
  })

  // Persist modules to local storage on changes
  useEffect(() => {
    localStorage.setItem('projectseat_modules', JSON.stringify(modules))
  }, [modules])

  // Persist theory progress to local storage on changes
  useEffect(() => {
    localStorage.setItem('projectseat_theory_progress', JSON.stringify(theoryProgressMap))
  }, [theoryProgressMap])

  // Synchronize modules and unlocking statuses based on theoryProgress and simulation results
  useEffect(() => {
    setModules((prevModules) => {
      const updated = prevModules.map((m) => {
        const missionId = getMissionIdFromModuleId(m.id)
        const progress = theoryProgressMap[missionId]

        // Sync theoryCompleted flag
        const theoryCompleted = progress ? progress.assessmentPassed : (m.id === 'mod-4')

        // Evaluate prerequisites
        const prereqs = PREREQUISITES_MAP[m.id] || []
        const prereqsMet = prereqs.every((prereqId) => {
          const prereqModule = prevModules.find((pm) => pm.id === prereqId)
          return prereqModule && prereqModule.status === 'completed'
        })

        let status = m.status
        if (!prereqsMet) {
          status = 'locked'
        } else if (m.status === 'locked') {
          status = 'available'
        }

        return {
          ...m,
          theoryCompleted,
          status,
        }
      })

      // Only return updated array if elements actually changed to avoid infinite loop
      if (JSON.stringify(updated) !== JSON.stringify(prevModules)) {
        return updated
      }
      return prevModules
    })
  }, [theoryProgressMap])

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

  // Update specific theory progress attributes
  const updateTheoryProgress = (missionId: string, updates: Partial<TheoryProgress>) => {
    setTheoryProgressMap((prev) => {
      const current = prev[missionId] || createInitialProgress(missionId)
      return {
        ...prev,
        [missionId]: {
          ...current,
          ...updates,
          status: updates.status || (current.status === 'not_started' ? 'in_progress' : current.status),
        },
      }
    })
  }

  // Mark a theory assessment as passed and completed
  const completeTheory = (missionId: string) => {
    updateTheoryProgress(missionId, {
      status: 'completed',
      progressPercentage: 100,
      assessmentPassed: true,
      completionTimestamp: new Date().toISOString(),
    })

    const moduleId = getModuleIdFromMissionId(missionId)
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            theoryCompleted: true,
            status: m.status === 'locked' ? 'locked' : (m.status === 'available' ? 'in_progress' : m.status),
          }
        }
        return m
      })
    )
  }

  // Mark a simulator session as completed, update score and unlock dependent modules
  const completeSimulation = (moduleCode: string, score: number) => {
    setModules((prev) => {
      const updated = prev.map((m) => {
        if (m.code === moduleCode) {
          return {
            ...m,
            status: 'completed' as const,
            progress: 100,
            completedItemsCount: m.itemsCount,
          }
        }
        return m
      })

      // Re-evaluate dependent unlocking rules in-place
      return updated.map((m) => {
        const prereqs = PREREQUISITES_MAP[m.id] || []
        const prereqsMet = prereqs.every((prereqId) => {
          const pm = updated.find((mod) => mod.id === prereqId)
          return pm && pm.status === 'completed'
        })
        if (prereqsMet && m.status === 'locked') {
          return { ...m, status: 'available' as const }
        }
        return m
      })
    })

    // Update global static user metrics
    mockUser.totalScore += score
    const totalCompleted = modules.filter((m) => m.code === moduleCode ? true : m.status === 'completed').length
    mockUser.completedMissions = totalCompleted

    // Push completion alert notification
    const completionTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    const targetModule = modules.find((m) => m.code === moduleCode)
    const moduleTitle = targetModule ? targetModule.title : 'Simulation'

    setNotifications((prev) => [
      {
        id: `nt-completion-${Date.now()}`,
        message: 'Module Certification Unlocked',
        description: `Successfully completed ${moduleTitle} simulator with ${score} PTS.`,
        time: `${completionTime} LT`,
        type: 'info',
        read: false,
      },
      ...prev,
    ])
  }

  // Reset a module's theory progress state
  const resetTheoryProgress = (missionId: string) => {
    setTheoryProgressMap((prev) => ({
      ...prev,
      [missionId]: createInitialProgress(missionId),
    }))
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
        modules,
        theoryProgressMap,
        updateTheoryProgress,
        completeTheory,
        completeSimulation,
        resetTheoryProgress,
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

