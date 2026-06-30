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
import { Target } from 'lucide-react'

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

  if (!currentScene) return null

  const completedIds = state.playerState.completedObjectiveIds
  const sceneObjectives = currentScene.objectives
  const completedCount = completedIds.filter((id) => sceneObjectives.some((o) => o.id === id)).length
  const totalCount = sceneObjectives.length

  return (
    <div 
      className="relative bg-slate-950 overflow-hidden shadow-2xl rounded-2xl flex items-center justify-center select-none border border-white/10"
      style={{
        width: '100vw',
        height: '56.25vw', /* 16:9 Aspect Ratio */
        maxHeight: '100vh',
        maxWidth: '177.78vh', /* 16:9 Aspect Ratio */
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
      {isObjectivesOpen ? (
        <div className="absolute top-20 right-4 bottom-28 z-30 w-72 sm:w-80 max-h-[58%] overflow-y-auto pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-large p-4 scrollbar-none animate-in fade-in slide-in-from-right-4 duration-200">
          <ObjectivePanel onClose={() => setIsObjectivesOpen(false)} />
        </div>
      ) : (
        <button
          onClick={() => setIsObjectivesOpen(true)}
          className="absolute top-20 right-4 z-30 flex items-center gap-2 bg-slate-900/95 hover:bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white shadow-large hover:shadow-xl hover:border-brand-blue/30 transition-all duration-150 cursor-pointer pointer-events-auto select-none animate-in fade-in slide-in-from-right-2"
          title="Show Objectives (ESC to hide)"
        >
          <Target className="h-4 w-4 text-brand-gold animate-pulse" />
          <span>Objectives ({completedCount}/{totalCount})</span>
        </button>
      )}

      {/* Bottom Operational Hub (Scene Description + Location Hints) */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-2 max-w-4xl mx-auto w-[calc(100%-2rem)] pointer-events-auto">
        {/* Scene description panel */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-[10.5px] text-slate-300 shadow-large text-left leading-normal font-sans">
          {currentScene.description}
        </div>

        {/* Mission Location Hints */}
        <MissionFooter />
      </div>

      {/* dialogue panel overlay — anchored absolute to bottom of card */}
      <DialoguePanel />

      {/* Full-screen overlays & auditer logs */}
      <MissionOverlay />
      <FeedbackModal />
      <DocumentDesk />
      <RestHourLog />
    </div>
  )
}
