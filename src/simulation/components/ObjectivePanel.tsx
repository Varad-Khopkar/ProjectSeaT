import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { CheckCircle, Circle, Target } from 'lucide-react'
import { cn } from '@/utils/formatters'

export const ObjectivePanel: React.FC = () => {
  const { currentScene, state } = useSimulation()

  if (!currentScene) return null

  const completedIds = state.playerState.completedObjectiveIds

  // Gather all objectives across all scenes for the sidebar
  const sceneObjectives = currentScene.objectives

  return (
    <aside className="bg-white border border-slate-200/80 rounded-[16px] p-4 shadow-small w-full">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-4 w-4 text-brand-blue" />
        <h3 className="font-h4 text-brand-navy text-sm font-bold uppercase tracking-wide">
          Objectives
        </h3>
        <span className="ml-auto font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {completedIds.filter((id) => sceneObjectives.some((o) => o.id === id)).length}/{sceneObjectives.length}
        </span>
      </div>

      <ul className="space-y-2.5">
        {sceneObjectives.map((objective) => {
          const isCompleted = completedIds.includes(objective.id)
          return (
            <li
              key={objective.id}
              className={cn(
                'flex items-start gap-2.5 p-2.5 rounded-[10px] border transition-all duration-200',
                isCompleted
                  ? 'bg-emerald-50/70 border-emerald-200/60'
                  : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
              )}
            >
              {isCompleted ? (
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-4.5 w-4.5 text-slate-300 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm font-semibold leading-tight',
                    isCompleted ? 'text-emerald-700 line-through' : 'text-brand-navy'
                  )}
                >
                  {objective.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{objective.description}</p>
              </div>
              <span
                className={cn(
                  'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0',
                  isCompleted
                    ? 'text-emerald-600 bg-emerald-100/80'
                    : 'text-brand-gold bg-brand-gold/10'
                )}
              >
                +{objective.points}
              </span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
