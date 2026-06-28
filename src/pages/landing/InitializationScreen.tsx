import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, CheckCircle, Loader2 } from 'lucide-react'

const SEQUENCE: { label: string; duration: number }[] = [
  { label: 'Initializing Platform',          duration: 700  },
  { label: 'Loading Secure Workspace',        duration: 900  },
  { label: 'Preparing Simulation Engine',     duration: 1100 },
  { label: 'Verifying Components',            duration: 800  },
  { label: 'Calibrating Regulatory Database', duration: 700  },
  { label: 'Redirecting to Secure Login',     duration: 600  },
]

const INIT_CSS = `
@keyframes initPulse {
  0%, 100% { opacity: 0.4; transform: scale(0.97); }
  50%       { opacity: 1;   transform: scale(1.03); }
}
@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(244,162,97,0.4); }
  50%       { box-shadow: 0 0 24px rgba(244,162,97,0.9); }
}
@keyframes scanLine {
  from { top: 0; }
  to   { top: 100%; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}
`

export const InitializationScreen: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let stepIdx = 0
    let elapsed = 0
    const totalDuration = SEQUENCE.reduce((s, step) => s + step.duration, 0)

    const runStep = () => {
      if (stepIdx >= SEQUENCE.length) {
        setDone(true)
        setTimeout(() => navigate('/login', { replace: true }), 600)
        return
      }
      setCurrentStep(stepIdx)
      const dur = SEQUENCE[stepIdx].duration
      const start = Date.now()

      const tick = setInterval(() => {
        const now = Date.now()
        const stepElapsed = now - start
        const frac = Math.min(stepElapsed / dur, 1)
        const overallProgress = ((elapsed + frac * dur) / totalDuration) * 100
        setProgress(overallProgress)
        if (frac >= 1) {
          clearInterval(tick)
          setCompletedSteps(prev => [...prev, stepIdx])
          elapsed += dur
          stepIdx++
          setTimeout(runStep, 120)
        }
      }, 30)
    }

    const startTimer = setTimeout(runStep, 400)
    return () => clearTimeout(startTimer)
  }, [navigate])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center select-none"
      style={{
        background: 'linear-gradient(135deg, #030b15 0%, #0a1f35 50%, #050e1a 100%)',
        fontFamily: 'Manrope, system-ui, sans-serif',
      }}
    >
      <style>{INIT_CSS}</style>

      {/* Subtle scanline overlay */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none opacity-10"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(47,102,144,0.8), transparent)',
          animation: 'scanLine 4s linear infinite',
        }}
      />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(47,102,144,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(47,102,144,0.8) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center" style={{ animation: 'fadeIn 0.5s ease-out both' }}>
        {/* Logo mark */}
        <div
          className="relative inline-flex items-center justify-center mb-8"
          style={{ animation: 'initPulse 2s ease-in-out infinite' }}
        >
          <div className="absolute inset-0 rounded-full bg-brand-blue/20 blur-xl scale-150" />
          <div className="relative bg-brand-blue/30 p-5 rounded-2xl border border-brand-blue/50 shadow-large">
            <Compass className="h-10 w-10 text-brand-gold" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <span className="font-bold text-lg text-white uppercase tracking-widest">ProjectSeaT</span>
        </div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] mb-10">
          Maritime Training Platform
        </div>

        {/* Progress bar */}
        <div className="relative mb-8">
          <div className="h-0.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2F6690, #F4A261)',
                animation: progress > 0 && progress < 100 ? 'progressGlow 1.5s ease-in-out infinite' : 'none',
              }}
            />
          </div>
          <div className="mt-2 text-right text-[10px] font-mono text-slate-600">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-2.5 text-left">
          {SEQUENCE.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isCurrent = currentStep === i && !isCompleted
            return (
              <div
                key={step.label}
                className="flex items-center gap-3 transition-all duration-300"
                style={{
                  opacity: i > currentStep && !completedSteps.includes(i) ? 0.25 : 1,
                  animation: isCurrent || isCompleted ? 'slideInLeft 0.3s ease-out both' : 'none',
                }}
              >
                <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-brand-gold animate-spin" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
                <span
                  className={`text-xs font-mono ${
                    isCompleted
                      ? 'text-emerald-400'
                      : isCurrent
                      ? 'text-brand-gold'
                      : 'text-slate-600'
                  }`}
                >
                  {step.label}
                  {isCurrent && <span className="animate-pulse">...</span>}
                </span>
              </div>
            )
          })}
        </div>

        {/* Done message */}
        {done && (
          <div className="mt-8 text-xs font-mono text-brand-gold uppercase tracking-widest animate-pulse">
            System Ready — Redirecting…
          </div>
        )}

        {/* Footer note */}
        <p className="mt-12 text-[10px] font-mono text-slate-700 uppercase tracking-widest">
          Secure · IMO-Aligned · Enterprise Grade
        </p>
      </div>
    </div>
  )
}
