import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Data'
import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, Target, ArrowLeft, Building, Compass, Settings, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/formatters'

const objectiveActionCodes: Record<string, string> = {
  'obj-inspect-orb': 'Code 30',
  'obj-audit-docs': 'Code 30',
  'obj-audit-rest': 'Code 17',
  'obj-verify-bridge-log': 'Code 17',
  'obj-test-dsc-radio': 'Code 30',
  'obj-fix-fire-door': 'Code 17',
  'obj-check-separator': 'Code 30',
}

/**
 * SimulationResults
 *
 * Detailed results audit page showing a full itemized breakdown
 * of each objective across all scenes. This is a secondary view
 * from the debrief — useful for reviewing specific inspection items.
 */
export const SimulationResults: React.FC = () => {
  const { state, activeMission } = useSimulation()
  const navigate = useNavigate()

  if (!activeMission) {
    return (
      <EmptyState
        title="No Results Available"
        description="Complete a simulation mission first to view detailed results."
        action={
          <Button variant="outline" onClick={() => navigate('/simulation')}>
            Go to Simulation Hub
          </Button>
        }
      />
    )
  }

  const scenes = Object.values(activeMission.scenes)

  const renderSceneIcon = (sceneId: string) => {
    switch (sceneId) {
      case 'ship_office':
        return <Building className="h-4 w-4 text-brand-blue" />
      case 'bridge':
        return <Compass className="h-4 w-4 text-brand-blue" />
      default:
        return <Settings className="h-4 w-4 text-brand-blue" />
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-[12px] border border-brand-blue/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-h2 text-brand-navy text-lg">Detailed Results</h1>
            <p className="text-sm text-slate-500">{activeMission.title} — Itemized Audit</p>
          </div>
        </div>

        {/* Final Inspector Trust Card */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
          <span className="text-xs text-slate-500 font-bold">Inspector Trust:</span>
          <span className={cn(
            "font-mono text-sm font-bold",
            state.playerState.trustScore > 70 
              ? "text-emerald-600" 
              : state.playerState.trustScore > 40 
                ? "text-brand-gold" 
                : "text-brand-coral"
          )}>
            {state.playerState.trustScore}%
          </span>
        </div>
      </div>

      {scenes.map((scene) => (
        <Card key={scene.id} className="p-4">
          <h3 className="font-h4 text-sm text-brand-navy mb-3 uppercase tracking-wide flex items-center gap-2">
            {renderSceneIcon(scene.id)}
            {scene.title}
          </h3>
          <ul className="space-y-2">
            {scene.objectives.map((obj) => {
              const done = state.playerState.completedObjectiveIds.includes(obj.id)
              const actionCode = objectiveActionCodes[obj.id]
              return (
                <li key={obj.id} className="flex items-start gap-2.5 text-sm p-2 rounded-lg hover:bg-slate-50/50 transition-colors">
                  {done ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Target className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={done ? 'text-slate-600 font-medium' : 'text-slate-400'}>{obj.title}</p>
                      {actionCode && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded font-mono text-[9px] font-bold",
                          actionCode === 'Code 30' 
                            ? "bg-red-50 text-red-600 border border-red-100" 
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        )}>
                          {actionCode}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{obj.description}</p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">+{obj.points}</span>
                </li>
              )
            })}
          </ul>
        </Card>
      ))}

      {/* Trust Warning Callout if low */}
      {state.playerState.trustScore < 50 && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-800 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <div>
            <strong className="block font-bold">Low Cooperation Trust Alert</strong>
            Inspector Kowalski flagged this ship for elevated compliance observation due to evasive behavior or unspotted critical deficiencies (Code 30). Professionalism and transparency are key to avoiding vessel detention.
          </div>
        </div>
      )}

      <div className="flex justify-center pb-8">
        <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/simulation/debrief')}>
          Back to Debrief
        </Button>
      </div>
    </div>
  )
}
