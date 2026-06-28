/**
 * Simulation Engine Module
 *
 * This is the gateway entry point for the entire simulation subsystem.
 * All public exports from the simulation module are re-exported here
 * so consumers can import from '@/simulation' directly.
 */

// Core type definitions
export type {
  Mission,
  MissionScene,
  Hotspot,
  Objective,
  Dialogue,
  DialogueChoice,
  Reward,
  MissionResult,
  PlayerState,
  SimulationState,
  InventoryItem,
  MissionSettings,
  SceneTransition,
} from './types'

// State management
export { SimulationProvider, useSimulation } from './state/SimulationContext'

// Route pages
export {
  SimulationHub,
  SimulationPlay,
  SimulationDebrief,
  SimulationResults,
} from './routes'

// Engine entry points
export { SimulationEngine, MissionEngine, SceneEngine } from './engine'

// Services
export {
  MissionService,
  SceneService,
  EventService,
  DialogueService,
  RewardService,
  ProgressService,
} from './services'

// Utilities
export { MissionHelpers, SceneHelpers, EventHelpers, RewardHelpers } from './utils'

// Layout components
export { SimulationLayout } from './layouts/SimulationLayout'
export { DebriefLayout } from './layouts/DebriefLayout'
