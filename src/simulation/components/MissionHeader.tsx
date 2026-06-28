import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Button } from '@/components/ui/Button'
import { Play, Pause, Clock, Star, Shield } from 'lucide-react'
import { cn } from '@/utils/formatters'

export const MissionHeader: React.FC = () => {
  const { state, activeMission, pauseSimulation, resumeSimulation } = useSimulation()

  if (!activeMission) return null

  // Format time remaining as mm:ss
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isPaused = state.status === 'paused'

  return (
    <header className="w-full bg-slate-900 border border-slate-800 rounded-[16px] p-4 flex flex-wrap items-center justify-between gap-4 shadow-medium text-left">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-blue/30 text-brand-gold rounded-[8px] border border-brand-blue/20">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
            {activeMission.code} • Simulating Watch
          </span>
          <h2 className="font-h3 text-white text-base leading-tight mt-0.5">{activeMission.title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
        {/* Trust Rating Meter */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-[12px] text-xs">
          <span className="text-slate-400 font-sans font-bold">Inspector Trust:</span>
          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden shrink-0">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                state.playerState.trustScore > 70 
                  ? "bg-emerald-500" 
                  : state.playerState.trustScore > 40 
                    ? "bg-brand-gold" 
                    : "bg-brand-coral"
              )}
              style={{ width: `${state.playerState.trustScore}%` }}
            />
          </div>
          <span className={cn(
            "font-mono font-bold shrink-0",
            state.playerState.trustScore > 70 
              ? "text-emerald-400" 
              : state.playerState.trustScore > 40 
                ? "text-brand-gold" 
                : "text-brand-coral"
          )}>
            {state.playerState.trustScore}%
          </span>
        </div>

        {/* Timer Panel */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-[12px] font-mono text-sm font-bold text-slate-300">
          <Clock className="h-4 w-4 text-slate-400 shrink-0" />
          <span className={state.timeRemaining !== null && state.timeRemaining < 60 ? 'text-brand-coral animate-pulse' : 'text-slate-200'}>
            {formatTime(state.timeRemaining)}
          </span>
        </div>

        {/* Score Panel */}
        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 px-3.5 py-1.5 rounded-[12px] font-mono text-sm font-bold text-slate-300">
          <Star className="h-4 w-4 text-brand-gold shrink-0 fill-brand-gold/10" />
          <span className="text-slate-200">{state.playerState.score} PTS</span>
        </div>

        {/* Pause toggle action button */}
        {isPaused ? (
          <Button
            size="sm"
            onClick={resumeSimulation}
            leftIcon={<Play className="h-3.5 w-3.5" />}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            Resume
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={pauseSimulation}
            leftIcon={<Pause className="h-3.5 w-3.5" />}
            className="border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            Pause
          </Button>
        )}
      </div>
    </header>
  )
}
