import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AppProvider } from '@/contexts/AppContext'
import { AppLayout } from '@/components/layout/AppLayout'
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

const SimulationWrapper = () => {
  return (
    <SimulationProvider>
      <Outlet />
    </SimulationProvider>
  )
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/design-system" element={<DesignSystemShowcase />} />

            {/* Simulation Engine Routes sharing single Provider state */}
            <Route element={<SimulationWrapper />}>
              <Route path="/simulation" element={<SimulationHub />} />
              <Route path="/simulation/:missionId" element={<SimulationPlay />} />
              <Route path="/simulation/debrief" element={<SimulationDebrief />} />
              <Route path="/simulation/results" element={<SimulationResults />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </AppProvider>
    </Router>
  )
}

export default App
