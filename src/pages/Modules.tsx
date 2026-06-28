import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar, Badge } from '@/components/ui/Feedback'
import { mockModules } from '@/mock/db'
import { Lock, Clock } from 'lucide-react'
import { CATEGORY_COLORS } from '@/constants'
import { cn } from '@/utils/formatters'

export const Modules: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="font-h1 text-brand-navy">Training Modules</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Standardized interactive checklists aligned with IMO SOLAS protocols. Complete missions to certify competencies and crew safety skills.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockModules.map((module) => {
          const colorStyles = CATEGORY_COLORS[module.category] || 'bg-slate-100 text-slate-700'
          const isLocked = module.status === 'locked'
          const isCompleted = module.status === 'completed'

          return (
            <Card
              key={module.id}
              variant={isLocked ? 'standard' : 'interactive'}
              className={cn(
                'p-6 flex flex-col justify-between h-full border relative overflow-hidden',
                isLocked ? 'bg-slate-50/50 border-slate-200/60 opacity-75' : 'bg-white border-slate-200/80 shadow-small'
              )}
            >
              {/* Category & Status Badges */}
              <div className="flex items-center justify-between gap-4 shrink-0">
                <span className={cn('text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase', colorStyles)}>
                  {module.category}
                </span>
                
                <div className="flex gap-1.5 items-center">
                  <Badge variant={module.difficulty === 'Advanced' ? 'coral' : module.difficulty === 'Intermediate' ? 'navy' : 'blue'}>
                    {module.difficulty.toUpperCase()}
                  </Badge>
                  {isLocked && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="my-5 flex-1 text-left">
                <span className="text-[10px] font-mono text-slate-400 font-bold block leading-none mb-1.5 uppercase">
                  Code: {module.code}
                </span>
                <h3 className="font-h3 text-brand-navy leading-snug">{module.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{module.description}</p>
              </div>

              {/* Progress & Actions */}
              <div className="space-y-4 shrink-0">
                {/* Progress bar (only if available, in progress or completed) */}
                {!isLocked && (
                  <div className="pt-1.5">
                    <ProgressBar value={module.progress} />
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1.5 font-semibold">
                      <span>ITEMS COMPLETED</span>
                      <span>{module.completedItemsCount} / {module.itemsCount} DONE ({module.progress}%)</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100 mt-3">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 font-semibold uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Est: {module.duration}</span>
                  </div>

                  {isLocked ? (
                    <Button size="sm" variant="ghost" disabled className="text-slate-400 cursor-not-allowed">
                      Prerequisites Locked
                    </Button>
                  ) : isCompleted ? (
                    <Button size="sm" variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                      Completed / Review
                    </Button>
                  ) : module.progress > 0 ? (
                    <Button size="sm" variant="primary">
                      Resume Checklist
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      Start Training
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
