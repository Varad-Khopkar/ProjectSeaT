import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Feedback'
import { Trophy, Clock, CheckCircle, Target, Award, ArrowLeft, RotateCcw, FileText } from 'lucide-react'
import { MissionHelpers, RewardHelpers } from '../utils'
import { useNavigate } from 'react-router-dom'

/**
 * DebriefLayout
 *
 * End-of-mission summary screen showing:
 *   - Final score & pass/fail badge
 *   - Elapsed time
 *   - Objectives completion grid
 *   - Earned rewards (XP + badges)
 *   - Navigation actions (retry / return to hub)
 */
export const DebriefLayout: React.FC = () => {
  const { state, activeMission, resetSimulation } = useSimulation()
  const navigate = useNavigate()

  if (!activeMission) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <p className="text-slate-400">No mission data to debrief. Start a mission first.</p>
        <Button variant="outline" onClick={() => navigate('/simulation')} className="mt-4">
          Go to Simulation Hub
        </Button>
      </div>
    )
  }

  const totalPossible = Object.values(activeMission.scenes).reduce(
    (acc, scene) => acc + scene.objectives.reduce((s, o) => s + o.points, 0),
    0
  )
  const percentage = MissionHelpers.calculateScorePercentage(state.playerState.score, totalPossible)
  // To pass, the player must achieve the passing score AND maintain a trustScore >= 50%
  const trustPassed = state.playerState.trustScore >= 50
  const passed = percentage >= activeMission.settings.passingScore && trustPassed
  const finalXP = RewardHelpers.xpMultiplier(percentage, activeMission.rewards.xp)

  const allObjectives = Object.values(activeMission.scenes).flatMap((s) => s.objectives)

  const handleReturnToHub = () => {
    resetSimulation()
    navigate('/simulation')
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Result banner */}
      <div className={`rounded-[16px] p-6 text-center border-2 ${passed ? 'bg-emerald-50/50 border-emerald-200/60' : 'bg-red-50/50 border-red-200/60'}`}>
        <div className="flex justify-center mb-3">
          {passed ? (
            <Trophy className="h-12 w-12 text-brand-gold" />
          ) : (
            <Target className="h-12 w-12 text-brand-coral" />
          )}
        </div>
        <h2 className="font-h2 text-xl text-brand-navy mb-1">
          {passed 
            ? 'Inspection Passed!' 
            : !trustPassed 
              ? 'Vessel Detained (Low Cooperation Trust)' 
              : 'Inspection Failed'}
        </h2>
        <p className="text-sm text-slate-500">
          {passed
            ? 'The vessel M/V Sea Guardian has cleared the PSC audit.'
            : !trustPassed 
              ? 'Inspector Kowalski issued a Code 30 detention due to non-cooperative behavior or unaddressed safety infractions.'
              : 'The vessel did not meet the minimum compliance threshold.'}
        </p>
      </div>

      {/* Score card grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-4 text-center">
          <Trophy className="h-5 w-5 text-brand-gold mx-auto mb-1.5" />
          <p className="font-mono text-lg font-bold text-brand-navy">{state.playerState.score}</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Points</p>
        </Card>
        <Card className="p-4 text-center">
          <Target className="h-5 w-5 text-brand-blue mx-auto mb-1.5" />
          <p className="font-mono text-lg font-bold text-brand-navy">{percentage}%</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Accuracy</p>
        </Card>
        <Card className="p-4 text-center">
          <Award className="h-5 w-5 text-emerald-500 mx-auto mb-1.5" />
          <p className="font-mono text-lg font-bold text-brand-navy">
            {state.playerState.trustScore}%
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Inspector Trust</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
          <p className="font-mono text-lg font-bold text-brand-navy">
            {state.timeRemaining !== null
              ? `${Math.floor((activeMission.settings.timerLimitSeconds! - state.timeRemaining) / 60)}m`
              : '--'}
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Elapsed</p>
        </Card>
        <Card className="p-4 text-center">
          <Award className="h-5 w-5 text-purple-500 mx-auto mb-1.5" />
          <p className="font-mono text-lg font-bold text-brand-navy">+{passed ? finalXP : 0}</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">XP Earned</p>
        </Card>
      </div>

      {/* Score progress bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-brand-navy uppercase">Score Progress</span>
          <span className="text-xs font-mono text-slate-400">
            Passing: {activeMission.settings.passingScore}%
          </span>
        </div>
        <ProgressBar value={percentage} />
      </Card>

      {/* Objectives review */}
      <Card className="p-4">
        <h3 className="font-h4 text-sm text-brand-navy mb-3 uppercase tracking-wide">Objectives Review</h3>
        <ul className="space-y-2">
          {allObjectives.map((obj) => {
            const done = state.playerState.completedObjectiveIds.includes(obj.id)
            return (
              <li key={obj.id} className="flex items-center gap-2.5 text-sm">
                {done ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Target className="h-4 w-4 text-slate-300 shrink-0" />
                )}
                <span className={done ? 'text-slate-600' : 'text-slate-400'}>{obj.title}</span>
                <span className="ml-auto font-mono text-[10px] text-slate-400">+{obj.points}</span>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-8">
        {activeMission.settings.allowRetries && (
          <Button variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={resetSimulation}>
            Retry Mission
          </Button>
        )}
        <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />} onClick={() => navigate('/simulation/results')}>
          View Detailed Audit
        </Button>
        <Button leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={handleReturnToHub}>
          Return to Hub
        </Button>
      </div>
    </div>
  )
}
