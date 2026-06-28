import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Info, HelpCircle } from 'lucide-react'

export const MissionFooter: React.FC = () => {
  const { currentScene } = useSimulation()

  if (!currentScene) return null

  return (
    <footer className="w-full bg-slate-50 border border-slate-200/80 rounded-[12px] p-3 flex items-center gap-3 text-left font-sans text-xs text-slate-500 shadow-small">
      <Info className="h-4.5 w-4.5 text-brand-blue shrink-0" />
      <div className="flex-1">
        <span className="font-semibold text-brand-navy">Current Location Hint: </span>
        <span>
          {currentScene.id === 'ship_office'
            ? 'Speak to the PSC inspector standing by the desk, or inspect the Oil Record Book logs.'
            : currentScene.id === 'bridge'
              ? 'Examine the logged entries in the bridge book on the console desk, or perform loop tests on the GMDSS radio.'
              : 'Audit the bilge lock valves on the oily water separator unit.'}
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 font-semibold uppercase">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>Watch Stand</span>
      </div>
    </footer>
  )
}
