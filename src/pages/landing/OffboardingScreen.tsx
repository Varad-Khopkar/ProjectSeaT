import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, CheckCircle, Loader2, Ship } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const STEPS = [
  { label: 'Securing vessel logs & telemetry',   duration: 1000 },
  { label: 'Syncing watchkeeper rest hours',     duration: 1200 },
  { label: 'Verifying active mission status',    duration: 1000 },
  { label: 'Filing local Port Authority clearance', duration: 1100 },
  { label: 'Confirming harbor anchorage mooring', duration: 900 },
  { label: 'Securing crew manifest database',    duration: 800 },
]

const OFFBOARD_CSS = `
@keyframes pulseGlow {
  0%, 100% { opacity: 0.3; transform: scale(0.98); }
  50%       { opacity: 0.8; transform: scale(1.02); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`

export const OffboardingScreen: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIdx = 0
    let elapsed = 0
    const totalDuration = STEPS.reduce((sum, s) => sum + s.duration, 0)

    // Trigger logout as soon as offboarding begins
    logout()

    const runStep = () => {
      if (stepIdx >= STEPS.length) {
        setTimeout(() => {
          navigate('/landing', { replace: true })
        }, 500)
        return
      }

      setCurrentStep(stepIdx)
      const stepDur = STEPS[stepIdx].duration
      const start = Date.now()

      const interval = setInterval(() => {
        const now = Date.now()
        const stepElapsed = now - start
        const frac = Math.min(stepElapsed / stepDur, 1)
        const totalProgress = ((elapsed + frac * stepDur) / totalDuration) * 100
        setProgress(totalProgress)

        if (frac >= 1) {
          clearInterval(interval)
          setCompletedSteps(prev => [...prev, stepIdx])
          elapsed += stepDur
          stepIdx++
          setTimeout(runStep, 100)
        }
      }, 30)
    }

    const timer = setTimeout(runStep, 300)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center select-none"
      style={{
        background: 'linear-gradient(135deg, #050e1a 0%, #0a1f35 50%, #020b14 100%)',
        fontFamily: 'Manrope, system-ui, sans-serif',
      }}
    >
      <style>{OFFBOARD_CSS}</style>

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(47,102,144,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(47,102,144,0.8) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-8 text-center" style={{ animation: 'slideUp 0.6s ease-out both' }}>
        {/* Animated Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-brand-coral/10 blur-xl scale-150 animate-pulse" />
          <div className="relative bg-brand-coral/10 p-5 rounded-2xl border border-brand-coral/30 shadow-large text-brand-coral">
            <Anchor className="h-10 w-10 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-extrabold text-xl text-white tracking-wide uppercase mb-1">Crew Off-boarding Active</h2>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.25em] mb-10">
          Entering Break at Port Sequence
        </div>

        {/* Progress Bar */}
        <div className="relative mb-8">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #E76F51, #F4A261)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
            <span>VESSEL SECURING SEQUENCE</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Log messages */}
        <div className="bg-slate-950/40 border border-brand-blue/10 rounded-2xl p-5 space-y-3 text-left">
          {STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isCurrent = currentStep === i && !isCompleted
            return (
              <div
                key={step.label}
                className="flex items-center gap-3 transition-opacity duration-300"
                style={{
                  opacity: i > currentStep && !completedSteps.includes(i) ? 0.3 : 1,
                }}
              >
                <div className="shrink-0 w-4.5 h-4.5 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-brand-coral animate-spin" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
                <span
                  className={`text-xs font-mono truncate ${
                    isCompleted
                      ? 'text-slate-400 line-through decoration-slate-600'
                      : isCurrent
                      ? 'text-brand-gold font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Port Status badge */}
        <div className="mt-10 inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
          <Ship className="h-3.5 w-3.5 text-brand-gold" />
          <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest">Mooring Status: Docked</span>
        </div>
      </div>
    </div>
  )
}
