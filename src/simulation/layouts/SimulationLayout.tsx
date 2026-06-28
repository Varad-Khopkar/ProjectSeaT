import React from 'react'
import { MissionHeader } from '../components/MissionHeader'
import { MissionFooter } from '../components/MissionFooter'
import { SceneContainer } from '../components/SceneContainer'
import { ObjectivePanel } from '../components/ObjectivePanel'
import { DialoguePanel } from '../components/DialoguePanel'
import { MissionOverlay } from '../components/MissionOverlay'
import { FeedbackModal } from '../components/FeedbackModal'
import { DocumentDesk } from '../components/DocumentDesk'
import { RestHourLog } from '../components/RestHourLog'

/**
 * SimulationLayout
 *
 * The primary viewport layout for active simulation sessions.
 * Grid composition:
 *   - Top: MissionHeader (timer + score + pause + trust meter)
 *   - Center: SceneContainer (16:9 viewport with hotspot layer)
 *   - Right sidebar (desktop) / below (mobile): ObjectivePanel
 *   - Bottom: MissionFooter (hints)
 *   - Overlays: DialoguePanel (bottom sheet) + MissionOverlay (pause/complete) + FeedbackModal + DocumentDesk + RestHourLog
 */
export const SimulationLayout: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Mission status header */}
      <MissionHeader />

      {/* Main simulation viewport grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Scene viewport */}
        <SceneContainer />

        {/* Objectives sidebar */}
        <ObjectivePanel />
      </div>

      {/* Footer hints bar */}
      <MissionFooter />

      {/* Dialogue panel overlay — anchored to bottom of screen */}
      <DialoguePanel />

      {/* Full-screen overlay for pause / success / fail states */}
      <MissionOverlay />

      {/* Explanation & Point Updates Modal */}
      <FeedbackModal />

      {/* Document verification desk clipboard */}
      <DocumentDesk />

      {/* MLC Rest hours logs audit panel */}
      <RestHourLog />
    </div>
  )
}
