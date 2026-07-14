import React, { useState, useEffect } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { MissionHeader } from '../components/MissionHeader'
import { MissionFooter } from '../components/MissionFooter'
import { SceneContainer } from '../components/SceneContainer'
import { ObjectivePanel } from '../components/ObjectivePanel'
import { DialoguePanel } from '../components/DialoguePanel'
import { MissionOverlay } from '../components/MissionOverlay'
import { FeedbackModal } from '../components/FeedbackModal'
import { DocumentDesk } from '../components/DocumentDesk'
import { RestHourLog } from '../components/RestHourLog'
import { Target, RotateCcw } from 'lucide-react'
import { GuideOverlay } from '../components/GuideOverlay'
import { MinigameDesk } from '../components/MinigameDesk'
import { cn } from '@/utils/formatters'

/**
 * SimulationLayout
 *
 * Immersive 16:9 aspect-ratio layout for active sessions.
 * Viewport is locked to the browser window size without cropping or stretching the background image.
 * All controls and logs overlay absolute on top of the active scene.
 */
export const SimulationLayout: React.FC = () => {
  const { currentScene, state } = useSimulation()
  const [isObjectivesOpen, setIsObjectivesOpen] = useState(true)

  // Listen to Escape key to collapse the Objectives panel
  useEffect(() => {
    if (!isObjectivesOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsObjectivesOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isObjectivesOpen])

  // Orientation enforcement — block portrait mode on small screens
  const [isPortrait, setIsPortrait] = useState(() => {
    return window.innerHeight > window.innerWidth && window.innerWidth < 768
  })
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768)
    }
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  if (!currentScene) return null

  // Block gameplay on small portrait screens
  if (isPortrait) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center gap-6 px-8 text-center">
        <div className="animate-[spin_2s_linear_infinite] text-brand-gold">
          <RotateCcw className="h-16 w-16" />
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Rotate Your Device</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          The Simulator requires a landscape orientation to play. Please rotate your device to continue.
        </p>
      </div>
    )
  }

  const isModule1 = state.currentMissionId === 'module1'

  return (
    <div 
      className="relative bg-slate-950 overflow-hidden shadow-2xl rounded-2xl flex items-center justify-center select-none border border-white/10"
      style={{
        width: '100%',
        aspectRatio: '16/9',
        maxHeight: '100%',
        maxWidth: '100%',
      }}
    >
      {/* Background Layer (Scene Viewport & Hotspots) */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <SceneContainer />
      </div>

      {/* OVERLAY LAYERS (z-30) */}

      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-30 pointer-events-auto">
        <MissionHeader />
      </div>

      {/* Objectives Panel (Full or Retracted) */}
      {!isModule1 && (
        isObjectivesOpen ? (
          <div className="absolute top-20 right-4 bottom-28 z-30 w-72 sm:w-80 max-h-[58%] overflow-y-auto pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-large p-4 scrollbar-none animate-in fade-in slide-in-from-right-4 duration-200">
            <ObjectivePanel onClose={() => setIsObjectivesOpen(false)} />
          </div>
        ) : (
          <button
            onClick={() => setIsObjectivesOpen(true)}
            className="absolute top-20 right-4 z-30 flex items-center gap-2 bg-slate-900/95 hover:bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white shadow-large hover:shadow-xl hover:border-brand-blue/30 transition-all duration-150 cursor-pointer pointer-events-auto select-none animate-in fade-in slide-in-from-right-2"
            title="Show Objectives (ESC to hide)"
          >
            <Target className="h-4 w-4 text-brand-gold shrink-0" />
            Objectives Panel
          </button>
        )
      )}

      {/* Onboarding steps panel for Module 1 */}
      {isModule1 && (
        <div className="absolute top-20 right-4 z-30 w-72 sm:w-80 pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-large p-4 text-left animate-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2.5">
            <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Onboarding Steps</h3>
          </div>
          <ul className="space-y-3 text-[11px] font-sans">
            <li className={cn("flex items-start gap-2", state.currentSceneId === 'm1_s1_boarding' ? 'text-brand-gold font-bold scale-[1.01]' : 'text-slate-500 opacity-60')}>
              <span className="font-mono text-[9px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 leading-none">1</span>
              <div>
                <span>Rig Gangway Safety Netting</span>
                <span className="block text-[9.5px] font-mono text-slate-400 font-normal mt-0.5">Rig net on deck ladder, then walk to Ship Office.</span>
              </div>
            </li>
            <li className={cn("flex items-start gap-2", state.currentSceneId === 'm1_s2_office' ? 'text-brand-gold font-bold scale-[1.01]' : 'text-slate-500 opacity-60')}>
              <span className="font-mono text-[9px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 leading-none">2</span>
              <div>
                <span>Complete Ship Office Audits</span>
                <span className="block text-[9.5px] font-mono text-slate-400 font-normal mt-0.5">Swipe valid certificates & align MLC rest hours. Go to Bridge.</span>
              </div>
            </li>
            <li className={cn("flex items-start gap-2", state.currentSceneId === 'm1_s3_bridge' ? 'text-brand-gold font-bold scale-[1.01]' : 'text-slate-500 opacity-60')}>
              <span className="font-mono text-[9px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 leading-none">3</span>
              <div>
                <span>Test Bridge Radio & Fire Door</span>
                <span className="block text-[9.5px] font-mono text-slate-400 font-normal mt-0.5">Run GMDSS DSC test loop & check safety fire doors. Go to Engine.</span>
              </div>
            </li>
            <li className={cn("flex items-start gap-2", state.currentSceneId === 'm1_s4_engine' ? 'text-brand-gold font-bold scale-[1.01]' : 'text-slate-500 opacity-60')}>
              <span className="font-mono text-[9px] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 leading-none">4</span>
              <div>
                <span>De-brief with Cadet Kai</span>
                <span className="block text-[9.5px] font-mono text-slate-400 font-normal mt-0.5">Speak with Cadet Kai in Engine Room to complete onboarding.</span>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Bottom Operational Hub (Scene Description + Location Hints) */}
      {!isModule1 && (
        <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2 max-w-4xl mx-auto w-[calc(100%-2rem)] pointer-events-auto">
          {/* Scene description panel */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-[10.5px] text-slate-300 shadow-large text-left leading-normal font-sans">
            {currentScene.description}
          </div>

          {/* Mission Location Hints */}
          <MissionFooter />
        </div>
      )}

      {/* dialogue panel overlay — anchored absolute to bottom of card */}
      <DialoguePanel />

      {/* Full-screen overlays & auditer logs */}
      <GuideOverlay />
      <MinigameDesk />
      <MissionOverlay />
      <FeedbackModal />
      <DocumentDesk />
      <RestHourLog />
    </div>
  )
}
