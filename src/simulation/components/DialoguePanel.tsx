import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { MessageSquare, User } from 'lucide-react'

export const DialoguePanel: React.FC = () => {
  const { activeDialogue, makeDialogueChoice, state } = useSimulation()

  if (!activeDialogue || state.status !== 'running') return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700/60 rounded-[16px] p-5 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Speaker header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 bg-brand-blue/20 rounded-full border border-brand-blue/30">
              <User className="h-4 w-4 text-brand-gold" />
            </div>
            <span className="font-semibold text-brand-gold text-sm tracking-wide">
              {activeDialogue.speaker}
            </span>
            <MessageSquare className="h-3.5 w-3.5 text-slate-500 ml-auto" />
          </div>

          {/* Dialogue message */}
          <p className="text-slate-200 text-sm leading-relaxed mb-4">
            {activeDialogue.message}
          </p>

          {/* Choice buttons */}
          <div className="space-y-2">
            {activeDialogue.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => makeDialogueChoice(choice.id)}
                className="w-full text-left px-4 py-2.5 bg-slate-800/80 hover:bg-brand-blue/20 border border-slate-700/50 hover:border-brand-blue/40 rounded-[10px] text-sm text-slate-300 hover:text-white transition-all duration-150 cursor-pointer"
              >
                <span className="font-mono text-[10px] text-brand-gold mr-2 font-bold">▸</span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
