import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Button } from '@/components/ui/Button'
import { Pause, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react'

export const MissionOverlay: React.FC = () => {
  const { state, resumeSimulation, resetSimulation, activeMission } = useSimulation()

  // Only render for paused, success (debrief), or failed states
  if (state.status === 'running' || state.status === 'idle') return null

  const overlayConfig: Record<string, { icon: React.ReactNode; title: string; subtitle: string; accent: string }> = {
    paused: {
      icon: <Pause className="h-10 w-10 text-brand-gold" />,
      title: 'Simulation Paused',
      subtitle: 'Your timer is held. Resume when ready.',
      accent: 'border-brand-gold/30',
    },
    debrief: {
      icon: <CheckCircle className="h-10 w-10 text-emerald-400" />,
      title: 'Mission Complete',
      subtitle: `All objectives verified. Final score: ${state.playerState.score} points.`,
      accent: 'border-emerald-400/30',
    },
    success: {
      icon: <CheckCircle className="h-10 w-10 text-emerald-400" />,
      title: 'Inspection Passed',
      subtitle: 'Congratulations, Captain. The vessel has passed the PSC audit.',
      accent: 'border-emerald-400/30',
    },
    failed: {
      icon: <XCircle className="h-10 w-10 text-brand-coral" />,
      title: 'Time Expired',
      subtitle: 'The inspection window has closed. The vessel has been detained.',
      accent: 'border-brand-coral/30',
    },
  }

  const config = overlayConfig[state.status]
  if (!config) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className={`bg-slate-900 border-2 ${config.accent} rounded-[20px] p-8 max-w-md w-full mx-4 text-center shadow-2xl`}>
        <div className="mb-4 flex justify-center">{config.icon}</div>
        <h2 className="font-h2 text-white text-xl mb-2">{config.title}</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{config.subtitle}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {state.status === 'paused' && (
            <Button onClick={resumeSimulation} leftIcon={<Play className="h-4 w-4" />}>
              Resume Mission
            </Button>
          )}

          {(state.status === 'debrief' || state.status === 'success') && (
            <Button
              onClick={resetSimulation}
              leftIcon={<CheckCircle className="h-4 w-4" />}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              View Debrief
            </Button>
          )}

          {state.status === 'failed' && activeMission?.settings.allowRetries && (
            <Button onClick={resetSimulation} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Retry Mission
            </Button>
          )}

          <Button variant="ghost" onClick={resetSimulation} className="text-slate-400 hover:text-white">
            Exit to Hub
          </Button>
        </div>
      </div>
    </div>
  )
}
