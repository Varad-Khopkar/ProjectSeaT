import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { MessageSquare, User } from 'lucide-react'

// Import Captain image assets
import captainWelcome from '../../Images/SeaT Captain/Captain_welcome.png'
import captainConcerned from '../../Images/SeaT Captain/Captain_Concerned.png'
import captainAdvice from '../../Images/SeaT Captain/Captain_Giving_Advice.png'
import captainEncouraging from '../../Images/SeaT Captain/Captain_encouraging.png'
import captainPointing from '../../Images/SeaT Captain/Captain_pointing_right_up.png'

// Import Cadet image assets
import cadetWelcome from '../../Images/SeaT Cadet/Cadet_welcome.png'
import cadetAdvice from '../../Images/SeaT Cadet/Cadet_Giving_Advice.png'
import cadetConcerned from '../../Images/SeaT Cadet/Cadet_Concerned.png'

const CAPTAIN_POSES: Record<string, string> = {
  regular: captainWelcome,
  concerned: captainConcerned,
  giving_advice: captainAdvice,
  encouraging: captainEncouraging,
  pointing_right_up: captainPointing
}

const CADET_POSES: Record<string, string> = {
  welcome: cadetWelcome,
  advice: cadetAdvice,
  concerned: cadetConcerned
}

export const DialoguePanel: React.FC = () => {
  const { activeDialogue, makeDialogueChoice, state } = useSimulation()

  if (!activeDialogue || state.status !== 'running') return null

  const speakerName = activeDialogue.speaker.toLowerCase()
  const isKai = speakerName.includes('kai')
  const isInspector = speakerName.includes('kowalski') || speakerName.includes('inspector')
  const isCaptain = speakerName.includes('henderson') || speakerName.includes('captain')

  // Render character portraits based on active speaker
  const renderPortrait = () => {
    if (isKai) {
      let pose = 'welcome'
      const activeId = state.activeDialogueId || ''
      if (activeId.includes('fail') || activeId.includes('concerned')) {
        pose = 'concerned'
      } else if (activeId.includes('success') || activeId.includes('advice') || activeId.includes('pillars')) {
        pose = 'advice'
      }
      const imgPath = CADET_POSES[pose] || cadetWelcome

      return (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full border-2 border-brand-gold bg-slate-950 p-0.5 overflow-hidden shadow-medium select-none animate-[float_3s_infinite] shadow-[0_0_15px_rgba(244,162,97,0.6)]">
          <img 
            src={imgPath} 
            alt="Cadet Kai" 
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-center py-0.5">
            <span className="text-[7.5px] font-extrabold text-brand-gold block">CADET KAI</span>
          </div>
        </div>
      )
    }

    if (isInspector) {
      return (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 select-none animate-[pulse_4s_infinite]">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_4px_10px_rgba(231,111,81,0.3)]">
            <circle cx="60" cy="60" r="50" fill="#0b1e33" stroke="#E76F51" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="46" fill="none" stroke="#E76F51" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="53" y="68" width="14" height="15" rx="3" fill="#E0A988" />
            <circle cx="60" cy="52" r="23" fill="#FFE5D9" />
            <rect x="42" y="46" width="14" height="8" rx="2" fill="none" stroke="#222" strokeWidth="1.5" />
            <rect x="64" y="46" width="14" height="8" rx="2" fill="none" stroke="#222" strokeWidth="1.5" />
            <line x1="56" y1="50" x2="64" y2="50" stroke="#222" strokeWidth="1.5" />
            <circle cx="49" cy="50" r="1.5" fill="#111" />
            <circle cx="71" cy="50" r="1.5" fill="#111" />
            <path d="M48 57 Q60 62 72 57" stroke="#4A3B32" strokeWidth="2" fill="none" />
            <path d="M35 34 C35 18, 85 18, 85 34 Z" fill="#F4A261" stroke="#333" strokeWidth="1.5" />
            <path d="M28 34 Q60 40 92 34 Q75 39 45 39 Z" fill="#E76F51" />
            <path d="M32 82 Q42 74 60 74 T88 82 L90 105 L30 105 Z" fill="#E9C46A" />
            <path d="M44 80 L44 105 M76 80 L76 105" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
          <div className="absolute bottom-0 inset-x-1.5 bg-slate-900/90 text-center py-0.5 rounded border border-white/5 shadow-medium">
            <span className="text-[8px] font-extrabold text-brand-coral tracking-wider block">INSPECTOR</span>
          </div>
        </div>
      )
    }

    if (isCaptain) {
      // Show Captain Henderson portrait
      return (
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full border-2 border-brand-gold bg-slate-950 p-0.5 overflow-hidden shadow-medium select-none animate-[float_4s_infinite]">
          <img 
            src={CAPTAIN_POSES.regular} 
            alt="Captain Henderson" 
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 text-center py-0.5">
            <span className="text-[7.5px] font-extrabold text-white block">CAPTAIN</span>
          </div>
        </div>
      )
    }

    return (
      <div className="p-2 bg-brand-blue/30 text-brand-gold rounded-full border border-brand-blue/20">
        <User className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div className="absolute inset-x-0 bottom-4 z-40 px-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto flex items-end gap-4">
        
        {/* Render portrait to the side */}
        {renderPortrait()}

        {/* Speech Bubble dialogue panel */}
        <div className="flex-1 bg-slate-900/95 backdrop-blur-lg border border-slate-700/60 rounded-[18px] p-4.5 shadow-xl animate-in slide-in-from-bottom-2 duration-300 relative text-left">
          
          {/* Dialogue Speaker header */}
          <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
            <span className="font-extrabold text-brand-gold text-[11.5px] tracking-wider uppercase">
              {activeDialogue.speaker}
            </span>
            <MessageSquare className="h-3 w-3 text-slate-500" />
          </div>

          {/* Dialogue text message */}
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-3">
            {activeDialogue.message}
          </p>

          {/* Concept Diagrams / Visual Illustrations */}
          {state.activeDialogueId === 'dlg-m1-inspector-intro' && (
            <div className="grid grid-cols-3 gap-2 my-3 animate-in zoom-in-95 duration-200">
              <div className="bg-red-500/10 border border-brand-coral/20 rounded-xl p-2 text-center flex flex-col items-center justify-center gap-1">
                <span className="text-[14px]">🛡️</span>
                <span className="text-[8.5px] font-extrabold text-brand-coral uppercase">SOLAS</span>
                <span className="text-[7.5px] text-slate-400 font-mono">Safety</span>
              </div>
              <div className="bg-brand-blue/15 border border-brand-blue/30 rounded-xl p-2 text-center flex flex-col items-center justify-center gap-1">
                <span className="text-[14px]">🔒</span>
                <span className="text-[8.5px] font-extrabold text-brand-blue uppercase">ISPS</span>
                <span className="text-[7.5px] text-slate-400 font-mono">Security</span>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-center flex flex-col items-center justify-center gap-1">
                <span className="text-[14px]">🌊</span>
                <span className="text-[8.5px] font-extrabold text-emerald-400 uppercase">MARPOL</span>
                <span className="text-[7.5px] text-slate-400 font-mono">Environment</span>
              </div>
            </div>
          )}

          {state.activeDialogueId === 'dlg-m1-kai-intro' && (
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 my-3 flex items-center gap-3 animate-in zoom-in-95 duration-200">
              <span className="text-2xl shrink-0">🌍</span>
              <div className="text-[9.5px] leading-relaxed text-slate-400">
                <strong className="text-brand-gold">PSC (Port State Control):</strong> Regional safety inspections checking foreign flagged vessels entering domestic harbors to ensure standard sea safety.
              </div>
            </div>
          )}

          {/* Dialogue choice buttons */}
          <div className="space-y-1.5">
            {activeDialogue.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => makeDialogueChoice(choice.id)}
                className="w-full text-left px-3.5 py-2 bg-slate-800/80 hover:bg-brand-blue/20 border border-slate-700/50 hover:border-brand-blue/40 rounded-[8px] text-xs sm:text-sm text-slate-300 hover:text-white transition-all duration-150 cursor-pointer"
              >
                <span className="font-mono text-[9px] text-brand-gold mr-1.5 font-bold">▸</span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
