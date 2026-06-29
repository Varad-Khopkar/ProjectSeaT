import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'

// Landing / auth flow
import { LandingPage } from '@/pages/landing/LandingPage'
import { InitializationScreen } from '@/pages/landing/InitializationScreen'
import { LoginPage } from '@/pages/landing/LoginPage'
import { OffboardingScreen } from '@/pages/landing/OffboardingScreen'

// App pages
import { Home } from '@/pages/Home'
import { Modules } from '@/pages/Modules'
import { Leaderboard } from '@/pages/Leaderboard'
import { Profile } from '@/pages/Profile'
import { Settings } from '@/pages/Settings'
import { Help } from '@/pages/Help'
import { NotFound } from '@/pages/NotFound'
import { DesignSystemShowcase } from '@/pages/DesignSystemShowcase'
import {
  SimulationProvider,
  SimulationHub,
  SimulationPlay,
  SimulationDebrief,
  SimulationResults,
} from '@/simulation'

/* ─── AuthGuard: redirects unauthenticated users to /landing ──────────────── */
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/landing" replace />
  return <>{children}</>
}

/* ─── Protected app routes (existing dashboard, unchanged) ───────────────── */
function ProtectedApp() {
  return (
    <AuthGuard>
      <AppProvider>
        <SimulationProvider>
          <AppLayout>
            <Routes>
              <Route path="/"               element={<Home />} />
              <Route path="/modules"        element={<Modules />} />
              <Route path="/leaderboard"    element={<Leaderboard />} />
              <Route path="/profile"        element={<Profile />} />
              <Route path="/settings"       element={<Settings />} />
              <Route path="/help"           element={<Help />} />
              <Route path="/design-system"  element={<DesignSystemShowcase />} />

              {/* Simulation Engine Routes */}
              <Route path="/simulation"           element={<SimulationHub />} />
              <Route path="/simulation/:missionId" element={<SimulationPlay />} />
              <Route path="/simulation/debrief"   element={<SimulationDebrief />} />
              <Route path="/simulation/results"   element={<SimulationResults />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </SimulationProvider>
      </AppProvider>
    </AuthGuard>
  )
}

/* ─── Root app ────────────────────────────────────────────────────────────── */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public entry routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/init"    element={<InitializationScreen />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/offboard" element={<OffboardingScreen />} />

          {/* All other paths go through the auth guard + existing layout */}
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
