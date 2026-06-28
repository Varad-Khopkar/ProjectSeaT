import React from 'react'
import { DebriefLayout } from '../layouts/DebriefLayout'

/**
 * SimulationDebrief
 *
 * Post-mission summary route. Renders the DebriefLayout
 * which shows scores, objectives audit, and XP rewards.
 */
export const SimulationDebrief: React.FC = () => {
  return <DebriefLayout />
}
