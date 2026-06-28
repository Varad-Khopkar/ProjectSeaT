import React, { createContext, useContext, useState } from 'react'

export interface AuthUser {
  username: string
  role: string
  name: string
  rank: string
}

interface AuthContextType {
  isAuthenticated: boolean
  authUser: AuthUser | null
  login: (username: string, password: string, role: string) => Promise<boolean>
  logout: () => void
}

export const DEMO_CREDENTIALS = [
  { username: 'captain',   password: 'demo2025', name: 'Capt. Henderson',      rank: 'Master Mariner'  },
  { username: 'officer',   password: 'demo2025', name: 'Lt. Cmdr. Sharma',     rank: 'Chief Officer'   },
  { username: 'inspector', password: 'demo2025', name: 'Insp. Reyes',           rank: 'PSC Inspector'   },
  { username: 'trainee',   password: 'demo2025', name: 'Cadet Williams',        rank: 'Officer Cadet'   },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('seat_auth_v1')
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch {
      return null
    }
  })

  const login = async (username: string, password: string, role: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const match = DEMO_CREDENTIALS.find(
      c => c.username === username.trim().toLowerCase() && c.password === password,
    )
    if (match) {
      const user: AuthUser = { username: match.username, role: role || match.rank, name: match.name, rank: match.rank }
      setAuthUser(user)
      try { sessionStorage.setItem('seat_auth_v1', JSON.stringify(user)) } catch { /* noop */ }
      return true
    }
    return false
  }

  const logout = () => {
    setAuthUser(null)
    try { sessionStorage.removeItem('seat_auth_v1') } catch { /* noop */ }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: authUser !== null, authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
