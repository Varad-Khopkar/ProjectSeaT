import React, { useState, useEffect } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { 
  Shield, 
  Lock, 
  Waves, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw,
  BookOpen
} from 'lucide-react'

// Import Captain image assets
import captainWelcome from '../../Images/SeaT Captain/Captain_welcome.png'
import captainConcerned from '../../Images/SeaT Captain/Captain_Concerned.png'
import captainAdvice from '../../Images/SeaT Captain/Captain_Giving_Advice.png'
import captainEncouraging from '../../Images/SeaT Captain/Captain_encouraging.png'
import captainPointing from '../../Images/SeaT Captain/Captain_pointing_right_up.png'

// Map of Captain poses
const CAPTAIN_POSES: Record<string, string> = {
  regular: captainWelcome,
  concerned: captainConcerned,
  giving_advice: captainAdvice,
  encouraging: captainEncouraging,
  pointing_right_up: captainPointing
}

// Inline styles for anims
const GUIDE_CSS = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`

export const GuideOverlay: React.FC = () => {
  const { currentScene, transitionToScene, state, completeObjective } = useSimulation()
  
  // Local states for interactivity
  const [activityState, setActivityState] = useState<'prompt' | 'incorrect' | 'correct'>('prompt')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [revealedTaps, setRevealedTaps] = useState<string[]>([])
  const [activeTapDetails, setActiveTapDetails] = useState<string | null>(null)
  
  // Reset local state when scene changes
  useEffect(() => {
    setActivityState('prompt')
    setSelectedOption(null)
    setRevealedTaps([])
    setActiveTapDetails(null)
  }, [currentScene?.id])

  if (!currentScene || !currentScene.guide || state.currentMissionId !== 'module1') return null

  const { guide, activity, success, failure, next, type } = currentScene

  // Render SVG avatar for Kai or Captain image
  const renderAvatar = () => {
    if (guide.character.toLowerCase() === 'captain') {
      const imgPath = CAPTAIN_POSES[guide.pose] || captainWelcome
      return (
        <div 
          className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl border border-brand-gold/30 bg-slate-950 p-1 overflow-hidden shadow-large select-none animate-[float_4s_ease-in-out_infinite]"
        >
          <img 
            src={imgPath} 
            alt="Captain Henderson" 
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="absolute bottom-1 inset-x-1 bg-slate-900/90 text-center py-0.5 rounded-lg border border-white/5">
            <span className="text-[9px] font-extrabold text-white block">Capt. Henderson</span>
          </div>
        </div>
      )
    }

    // Default to Cadet Kai custom SVG avatar
    return (
      <div 
        className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 select-none animate-[float_3s_ease-in-out_infinite]"
        title="Cadet Kai"
      >
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(244,162,97,0.3)]"
        >
          {/* Background Ring */}
          <circle cx="60" cy="60" r="50" fill="#0b1e33" stroke="#F4A261" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="46" fill="none" stroke="#2F6690" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Hair back */}
          <path d="M40 70 Q25 45 45 25 T80 30 Q95 45 80 70 Z" fill="#4A3B32" />
          
          {/* Neck */}
          <rect x="53" y="68" width="14" height="15" rx="3" fill="#FFD1B3" />
          
          {/* Face */}
          <circle cx="60" cy="52" r="23" fill="#FFE5D9" />
          <circle cx="60" cy="52" r="23" fill="#FFD1B3" opacity="0.3" clipPath="url(#face-clip)" />
          
          {/* Hair front/sides */}
          <path d="M38 48 Q35 30 52 28 Q60 28 65 34 Q78 30 82 48 Q84 55 81 60 Q76 40 60 40 Q44 40 39 60 Z" fill="#5C483C" />
          
          {/* Eyes */}
          <circle cx="51" cy="50" r="2.5" fill="#2F6690" />
          <circle cx="69" cy="50" r="2.5" fill="#2F6690" />
          <path d="M48 44 Q51 42 54 44" stroke="#4A3B32" strokeWidth="1.5" fill="none" />
          <path d="M66 44 Q69 42 72 44" stroke="#4A3B32" strokeWidth="1.5" fill="none" />
          
          {/* Cheeks */}
          <circle cx="47" cy="55" r="3" fill="#E76F51" opacity="0.35" />
          <circle cx="73" cy="55" r="3" fill="#E76F51" opacity="0.35" />
          
          {/* Mouth (Moves based on state) */}
          {activityState === 'incorrect' ? (
            <path d="M55 60 Q60 57 65 60" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M54 58 Q60 64 66 58" stroke="#E76F51" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Officer Cadet Cap */}
          <path d="M34 36 C34 22, 86 22, 86 36 Z" fill="#0A1F35" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Cap Visor */}
          <path d="M30 36 Q60 42 90 36 Q75 42 45 42 Z" fill="#111" />
          {/* Cap Gold Trim & Emblem */}
          <path d="M34 36 Q60 38 86 36" stroke="#F4A261" strokeWidth="2" fill="none" />
          <circle cx="60" cy="29" r="4.5" fill="#F4A261" />
          <path d="M58 29 L62 29 M60 27 L60 32" stroke="#050e1a" strokeWidth="1" />
          
          {/* Shirt Collar */}
          <path d="M46 80 L52 68 L60 76 L68 68 L74 80 Z" fill="#FFFFFF" stroke="#CCCCCC" strokeWidth="1" />
          {/* Uniform Jacket */}
          <path d="M32 82 Q42 74 60 74 T88 82 L90 105 L30 105 Z" fill="#0A1F35" />
          {/* Shoulder Epaulets (Gold) */}
          <path d="M32 82 L42 78 L44 84 L34 88 Z" fill="#F4A261" />
          <path d="M88 82 L78 78 L76 84 L86 88 Z" fill="#F4A261" />
        </svg>
        <div className="absolute bottom-0 inset-x-2 bg-slate-900/90 text-center py-0.5 rounded-lg border border-white/5 shadow-medium">
          <span className="text-[9.5px] font-extrabold text-brand-gold tracking-wider block">CADET KAI</span>
        </div>
      </div>
    )
  }

  // Quiz Choices submission
  const handleSelectOption = (optionId: string) => {
    if (activityState !== 'prompt') return
    setSelectedOption(optionId)
  }

  const handleSubmitQuiz = () => {
    if (!activity || !selectedOption) return
    const isCorrect = selectedOption === activity.correctOption
    if (isCorrect) {
      setActivityState('correct')
      completeObjective('obj-intro-onboarding', 25) // Earn onboarding points
    } else {
      setActivityState('incorrect')
    }
  }

  const handleRetryQuiz = () => {
    setSelectedOption(null)
    setActivityState('prompt')
  }

  // Completion gate card click checks
  const handleTapItem = (itemId: string, details: string) => {
    setActiveTapDetails(details)
    if (!revealedTaps.includes(itemId)) {
      const nextTaps = [...revealedTaps, itemId]
      setRevealedTaps(nextTaps)
      if (activity?.requiredTaps && nextTaps.length === activity.requiredTaps.length) {
        setActivityState('correct')
        completeObjective('obj-intro-pillars', 25)
      }
    }
  }

  // Advanced transitions
  const handleAdvance = () => {
    if (success?.next) {
      transitionToScene(success.next)
    } else if (next) {
      transitionToScene(next)
    }
  }

  // Select layout icons dynamically
  const getIconForTap = (id: string) => {
    if (id === 'safety') return <Shield className="h-5 w-5 text-brand-gold" />
    if (id === 'security') return <Lock className="h-5 w-5 text-brand-gold" />
    return <Waves className="h-5 w-5 text-brand-gold" />
  }

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/40 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-center gap-6 pointer-events-auto">
      <style>{GUIDE_CSS}</style>

      {/* ── LEFT: Guide Character Model ──────────────────────────────────────── */}
      {renderAvatar()}

      {/* ── RIGHT: Dialogue Bubble Panel ─────────────────────────────────────── */}
      <div 
        className="w-full max-w-xl bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans"
        style={{ animation: 'slideIn 0.3s ease-out both' }}
      >
        {/* Scenario Header badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono font-bold bg-brand-blue/30 text-brand-gold px-2 py-0.5 rounded border border-brand-blue/20 uppercase tracking-widest">
            {currentScene.title}
          </span>
          {activityState === 'correct' && (
            <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
              ✔ Cleared
            </span>
          )}
        </div>

        {/* Current speech text */}
        <p className="text-slate-100 text-sm leading-relaxed mb-4">
          {activityState === 'correct' && success?.dialogue 
            ? success.dialogue
            : activityState === 'incorrect' && failure?.dialogue
            ? failure.dialogue
            : guide.text
          }
        </p>

        {/* ── INTERACTIVE CONTENT AREA ────────────────────────────────────────── */}

        {/* Quiz Gate Rendering */}
        {type === 'quiz_gate' && activity && (
          <div className="mt-2 space-y-3">
            {/* Options list */}
            {activityState === 'prompt' && (
              <div className="space-y-2">
                {activity.options?.map(opt => {
                  const isSelected = selectedOption === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'bg-brand-blue/20 border-brand-gold text-white font-bold ring-2 ring-brand-gold/15'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-3 text-[10px] font-bold ${
                        isSelected ? 'bg-brand-gold text-brand-navy' : 'bg-slate-900 text-slate-400'
                      }`}>
                        {opt.id}
                      </span>
                      {opt.text}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Verification Success/Fail overlays */}
            {activityState === 'correct' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-400">CORRECT ANSWER</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">You earned +25 XP. Ready to proceed to next compartment.</div>
                </div>
              </div>
            )}

            {activityState === 'incorrect' && (
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-brand-coral shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-brand-coral">INCORRECT ANSWER</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Let's review the guidelines and try again.</div>
                    </div>
                  </div>
                  {activity.hint && (
                    <div className="text-[10.5px] bg-slate-950/60 border border-brand-gold/15 rounded-lg p-2.5 text-slate-300 font-sans italic mt-1">
                      💡 <strong>Hint:</strong> {activity.hint}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quiz submission actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
              {activityState === 'prompt' && (
                <button
                  disabled={!selectedOption}
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-brand-navy font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-large active:scale-[0.98]"
                >
                  Submit Answer
                </button>
              )}
              {activityState === 'incorrect' && (
                <button
                  onClick={handleRetryQuiz}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer border border-slate-700 flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </button>
              )}
              {activityState === 'correct' && (
                <button
                  onClick={handleAdvance}
                  className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-large flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Completion Gate (Tap to Reveal) Rendering */}
        {type === 'completion_gate' && activity && (
          <div className="mt-2 space-y-4">
            {/* Columns grid */}
            <div className="grid grid-cols-3 gap-2">
              {activity.items?.map(item => {
                const isTapped = revealedTaps.includes(item.id)
                const isActive = activeTapDetails === item.details
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTapItem(item.id, item.details)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150 cursor-pointer select-none relative ${
                      isActive
                        ? 'bg-brand-blue/20 border-brand-gold text-white shadow-medium'
                        : isTapped
                        ? 'bg-slate-800/80 border-emerald-500/30 text-slate-300'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-400'
                    }`}
                  >
                    {/* Tick Checkbox */}
                    {isTapped && (
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500/20 text-emerald-400 p-0.5 rounded-full border border-emerald-500/30">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                    )}
                    {getIconForTap(item.id)}
                    <span className="text-[10px] sm:text-xs font-bold mt-2 truncate max-w-full">
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Revealed details panel */}
            {activeTapDetails ? (
              <div 
                className="bg-slate-950/60 border border-brand-blue/20 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed font-sans shadow-inner animate-in fade-in duration-200 flex items-start gap-3"
              >
                <BookOpen className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                <div>{activeTapDetails}</div>
              </div>
            ) : (
              <div className="bg-slate-950/30 border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500 italic">
                * Click on each of the 3 columns above to review details...
              </div>
            )}

            {/* Next actions */}
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[10.5px] font-mono text-slate-500">
                Pillars verified: {revealedTaps.length}/3
              </span>
              <button
                disabled={activityState !== 'correct'}
                onClick={handleAdvance}
                className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-brand-navy font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-large flex items-center gap-2"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Linear Progression Rendering */}
        {type === 'linear' && (
          <div className="flex justify-end pt-3 border-t border-white/5 mt-2">
            <button
              onClick={handleAdvance}
              className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-large flex items-center gap-2"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Terminal/Rewards Screen Rendering */}
        {type === 'terminal' && (
          <div className="mt-2 space-y-4">
            <div className="bg-brand-blue/10 border border-brand-gold/20 rounded-xl p-4 flex flex-col gap-2.5">
              <div className="text-xs font-extrabold text-brand-gold tracking-widest uppercase">Rewards Claimed</div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-950/80 px-3.5 py-2 rounded-lg border border-brand-gold/15 text-center">
                  <span className="text-[9px] text-slate-500 block">XP REWARD</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">+150 XP</span>
                </div>
                <div className="bg-slate-950/80 px-3.5 py-2 rounded-lg border border-brand-gold/15 text-center">
                  <span className="text-[9px] text-slate-500 block">BADGE UNLOCKED</span>
                  <span className="text-sm font-extrabold text-brand-gold block mt-0.5">First Watch ⚓</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  // Finalizing linear onboarding sequence
                  // Reset context state and redirect user back to SimulationHub
                  transitionToScene('debrief')
                }}
                className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-large flex items-center gap-2"
              >
                Finish Onboarding
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
