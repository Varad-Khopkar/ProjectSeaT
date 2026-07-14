import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Feedback'
import { pscMissionTemplate } from '../mock/missionTemplate'
import { useNavigate } from 'react-router-dom'
import { Compass, Clock, Star, Shield, ArrowRight, Anchor, Lock, CheckCircle2, Play } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

/**
 * SimulationHub
 *
 * Landing page listing all available simulation missions.
 * Renders missions with dynamically locked/briefing CTA flow.
 */
export const SimulationHub: React.FC = () => {
  const navigate = useNavigate()
  const { modules, theoryProgressMap } = useApp()

  // Config-driven mission catalog
  const missions = [pscMissionTemplate]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 text-left">
        <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-[12px] border border-brand-blue/20">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-h2 text-brand-navy text-xl">Simulation Hub</h1>
          <p className="text-sm text-slate-500">Select a mission to begin your maritime training simulation.</p>
        </div>
      </div>

      {/* Mission cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        {missions.map((mission) => {
          const matchingModule = modules.find((m) => m.code === mission.code)
          const isLocked = matchingModule ? matchingModule.status === 'locked' : false
          const progress = theoryProgressMap[mission.id]
          const isBriefingPassed = progress ? progress.assessmentPassed : false
          const isBriefingStarted = progress ? progress.status === 'in_progress' : false

          return (
            <Card 
              key={mission.id} 
              variant={isLocked ? 'standard' : 'interactive'} 
              className={`p-0 overflow-hidden group transition-all duration-300 ${
                isLocked 
                  ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
                  : 'hover:scale-[1.02] hover:shadow-medium bg-white border-slate-200'
              }`}
            >
              {/* Mission card banner */}
              <div className="relative bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy p-5 pb-8">
                <div className="flex items-start justify-between">
                  <Badge variant={isLocked ? 'blue' : isBriefingPassed ? 'coral' : 'gold'}>
                    {mission.code}
                  </Badge>
                  {isLocked ? (
                    <Lock className="h-5 w-5 text-slate-400" />
                  ) : isBriefingPassed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 font-bold" />
                  ) : (
                    <Shield className="h-5 w-5 text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-300" />
                  )}
                </div>
                <h3 className="font-h3 text-white text-base mt-3 leading-snug">{mission.title}</h3>
                <Anchor className="absolute -bottom-3 -right-2 h-16 w-16 text-white/5 rotate-12 group-hover:text-white/10 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300" />
              </div>

              {/* Mission card body */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {mission.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
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

                {/* Conditional Actions based on Unlock Hierarchy */}
                {isLocked ? (
                  <Button size="sm" className="w-full" disabled>
                    Prerequisites Locked
                  </Button>
                ) : !isBriefingPassed ? (
                  <Button
                    size="sm"
                    className="w-full bg-brand-gold hover:bg-amber-400 text-brand-navy border border-brand-gold/20"
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    onClick={() => navigate(`/simulation/${mission.id}/theory`)}
                  >
                    {isBriefingStarted ? 'Resume Theory Briefing' : 'Begin Theory Briefing'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    rightIcon={<Play className="h-3.5 w-3.5" />}
                    onClick={() => navigate(`/simulation/${mission.id}`)}
                  >
                    Launch Simulator
                  </Button>
                )}
              </div>
            </Card>
          )
        })}

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

