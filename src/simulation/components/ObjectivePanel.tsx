import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { CheckCircle, Circle, Target, X } from 'lucide-react'
import { cn } from '@/utils/formatters'

interface ObjectivePanelProps {
  onClose?: () => void
}

export const ObjectivePanel: React.FC<ObjectivePanelProps> = ({ onClose }) => {
  const { currentScene, state } = useSimulation()

  if (!currentScene) return null

  const completedIds = state.playerState.completedObjectiveIds

  // Gather all objectives across all scenes for the sidebar
  const sceneObjectives = currentScene.objectives

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 select-none">
        <Target className="h-4 w-4 text-brand-gold shrink-0" />
        <h3 className="font-h4 text-white text-[11px] font-bold uppercase tracking-wider">
          Objectives
        </h3>
        <span className="ml-auto font-mono text-[9px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-white/5 shrink-0">
          {completedIds.filter((id) => sceneObjectives.some((o) => o.id === id)).length}/{sceneObjectives.length}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-1 p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Hide (ESC)"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {sceneObjectives.map((objective) => {
          const isCompleted = completedIds.includes(objective.id)
          return (
            <li
              key={objective.id}
              className={cn(
                'flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-200',
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-slate-950/40 border-white/5 hover:border-brand-blue/20'
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-xs font-bold leading-tight tracking-tight',
                    isCompleted ? 'text-emerald-400/80 line-through' : 'text-white'
                  )}
                >
                  {objective.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">{objective.description}</p>
              </div>
              <span
                className={cn(
                  'text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0',
                  isCompleted
                    ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-900/30'
                    : 'text-brand-gold bg-brand-gold/10 border border-brand-gold/20'
                )}
              >
                +{objective.points}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
