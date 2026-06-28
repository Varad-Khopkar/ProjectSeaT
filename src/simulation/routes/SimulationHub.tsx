import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Feedback'
import { pscMissionTemplate } from '../mock/missionTemplate'
import { useNavigate } from 'react-router-dom'
import { Compass, Clock, Star, Shield, ArrowRight, Anchor } from 'lucide-react'

/**
 * SimulationHub
 *
 * Landing page listing all available simulation missions.
 * Currently renders only the PSC mock mission template.
 * Future missions will be loaded from configuration data and rendered by the same grid.
 */
export const SimulationHub: React.FC = () => {
  const navigate = useNavigate()

  // Config-driven mission catalog — currently only the PSC template
  const missions = [pscMissionTemplate]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-[12px] border border-brand-blue/20">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-h2 text-brand-navy text-xl">Simulation Hub</h1>
          <p className="text-sm text-slate-500">Select a mission to begin your maritime training simulation.</p>
        </div>
      </div>

      {/* Mission cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {missions.map((mission) => (
          <Card key={mission.id} variant="interactive" className="p-0 overflow-hidden group hover:scale-[1.02] hover:bg-brand-navy hover:border-brand-navy transition-all duration-300">
            {/* Mission card banner */}
            <div className="relative bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy p-5 pb-8">
              <div className="flex items-start justify-between">
                <Badge variant="blue">{mission.code}</Badge>
                <Shield className="h-5 w-5 text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-300" />
              </div>
              <h3 className="font-h3 text-white text-base mt-3 leading-snug">{mission.title}</h3>
              <Anchor className="absolute -bottom-3 -right-2 h-16 w-16 text-white/5 rotate-12 group-hover:text-white/10 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300" />
            </div>

            {/* Mission card body */}
            <div className="p-4 space-y-3 transition-colors duration-300">
              <p className="text-xs text-slate-500 group-hover:text-slate-200 leading-relaxed line-clamp-2 transition-colors duration-300">{mission.description}</p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {mission.settings.timerLimitSeconds ? `${Math.floor(mission.settings.timerLimitSeconds / 60)} min` : 'Unlimited'}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {mission.settings.passingScore}% to pass
                </span>
                <span className="flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  {Object.keys(mission.scenes).length} scenes
                </span>
              </div>

              <Button
                size="sm"
                className="w-full"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => navigate(`/simulation/${mission.id}`)}
              >
                Launch Mission
              </Button>
            </div>
          </Card>
        ))}

        {/* Placeholder for future missions */}
        <Card className="p-6 border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center min-h-[250px]">
          <Compass className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-400">More Missions</p>
          <p className="text-xs text-slate-300 mt-1">Additional training modules will appear here as they are configured.</p>
        </Card>
      </div>
    </div>
  )
}
