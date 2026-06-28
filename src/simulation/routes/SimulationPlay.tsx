import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSimulation } from '../state/SimulationContext'
import { SimulationLayout } from '../layouts/SimulationLayout'
import { pscMissionTemplate } from '../mock/missionTemplate'

/**
 * SimulationPlay
 *
 * Active simulation route. Reads :missionId from URL params,
 * loads the matching mission config, and renders the SimulationLayout.
 */
export const SimulationPlay: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>()
  const navigate = useNavigate()
  const { state, startMission } = useSimulation()

  useEffect(() => {
    // Auto-start mission when page loads and simulation is idle
    if (state.status === 'idle' && missionId) {
      // Validate mission exists in our config catalog
      if (missionId === pscMissionTemplate.id) {
        startMission(missionId)
      } else {
        // Unknown mission — redirect to hub
        navigate('/simulation', { replace: true })
      }
    }
  }, [missionId, state.status, startMission, navigate])

  // Redirect to debrief when mission completes
  useEffect(() => {
    if (state.status === 'debrief') {
      navigate('/simulation/debrief', { replace: true })
    }
  }, [state.status, navigate])

  return <SimulationLayout />
}
