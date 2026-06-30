import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/utils/formatters'

/**
 * FeedbackModal
 *
 * Pop-up explanation that displays immediately when a component is clicked.
 * Handles both correct inspections (success) and decoys (warnings/deductions).
 */
export const FeedbackModal: React.FC = () => {
  const { state, closeFeedback } = useSimulation()
  const feedback = state.activeFeedback

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && feedback) {
        closeFeedback()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [feedback, closeFeedback])

  if (!feedback) return null

  const isSuccess = feedback.isSuccess

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={cn(
          "relative w-full max-w-md bg-white rounded-[20px] shadow-large border overflow-hidden",
          "transform transition-all duration-300 animate-slide-up",
          isSuccess ? "border-emerald-100" : "border-brand-coral/20"
        )}
      >
        {/* Color stripe banner */}
        <div className={cn("h-2.5 w-full", isSuccess ? "bg-emerald-500" : "bg-brand-coral")} />

        {/* Close Button */}
        <button 
          onClick={closeFeedback}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close explanation"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Header Outcome Indicator */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className={cn(
              "p-3 rounded-full shrink-0",
              isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-brand-coral/10 text-brand-coral"
            )}>
              {isSuccess ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </div>
            <div>
              <span className={cn(
                "font-mono text-xs font-bold uppercase tracking-wider",
                isSuccess ? "text-emerald-600" : "text-brand-coral"
              )}>
                {isSuccess ? "Inspection Passed" : "Compliance Infraction"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-xl font-bold text-slate-800">
                  {feedback.delta >= 0 ? `+${feedback.delta}` : feedback.delta} PTS
                </span>
                <span className="text-xs text-slate-400 font-medium">score update</span>
              </div>
            </div>
          </div>

          {/* Explanation Content */}
          <div className="space-y-3">
            <h4 className="font-h4 text-brand-navy text-base font-bold leading-tight">
              {feedback.title}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-sans bg-slate-50/60 p-4 rounded-[12px] border border-slate-100">
              {feedback.text}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={closeFeedback}
              className={cn(
                "px-5 py-2.5 rounded-[12px] font-sans text-sm font-semibold text-white transition-all shadow-sm cursor-pointer",
                isSuccess 
                  ? "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700" 
                  : "bg-brand-coral hover:bg-brand-coral/95 active:bg-brand-coral/90"
              )}
            >
              Continue Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
