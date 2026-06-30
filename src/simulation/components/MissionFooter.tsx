import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Info, HelpCircle } from 'lucide-react'

export const MissionFooter: React.FC = () => {
  const { currentScene } = useSimulation()

  if (!currentScene) return null

  return (
    <footer className="w-full bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-3 text-left font-sans text-[11px] text-slate-300 shadow-large">
      <Info className="h-4.5 w-4.5 text-brand-gold shrink-0" />
      <div className="flex-1">
        <span className="font-bold text-white">Current Location Hint: </span>
        <span>
          {currentScene.id === 'ship_office'
            ? 'Speak to the PSC inspector standing by the desk, or inspect the Oil Record Book logs.'
            : currentScene.id === 'bridge'
              ? 'Examine the logged entries in the bridge book on the console desk, or perform loop tests on the GMDSS radio.'
              : 'Audit the bilge lock valves on the oily water separator unit.'}
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono text-slate-500 font-semibold uppercase">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>Watch Stand</span>
      </div>
    </footer>
  )
}
