import type { Mission, MissionScene, Hotspot } from '../types'

/**
 * SimulationEngine
 * Orchestrates global ticks, loads active mission configurations, and delegates
 * updates to the child engines (MissionEngine, SceneEngine).
 */
export class SimulationEngine {
  public activeMissionId: string | null = null

  constructor(config?: Record<string, any>) {
    console.log('[SimulationEngine] Orchestrator initialized with config:', config)
  }

  public initialize(mission: Mission): void {
    this.activeMissionId = mission.id
    console.log(`[SimulationEngine] Loading mission ${mission.code}: ${mission.title}`)
  }

  public tick(_deltaSeconds: number): void {
    // TODO: Handle main simulation clock decrement, ticks animations, and timeout locks.
  }

  public terminate(): void {
    this.activeMissionId = null
    console.log('[SimulationEngine] Terminated active run. System reset.')
  }
}

/**
 * MissionEngine
 * Handles check objective triggers, logs completions, and updates seafarer progress.
 */
export class MissionEngine {
  public completedObjectives: string[] = []

  constructor() {
    console.log('[MissionEngine] Checklist orchestrator initialized.')
  }

  public registerCompletion(objectiveId: string): void {
    if (!this.completedObjectives.includes(objectiveId)) {
      this.completedObjectives.push(objectiveId)
      console.log(`[MissionEngine] Objective verified and locked: ${objectiveId}`)
    }
  }

  public evaluateSuccess(passingScore: number, currentScore: number): boolean {
    // TODO: Verify if score matches SOLAS criteria.
    return currentScore >= passingScore
  }
}

/**
 * SceneEngine
 * Maps visual viewports, binds hotspots coordinates, and executes scene transitions.
 */
export class SceneEngine {
  public activeSceneId: string | null = null

  constructor() {
    console.log('[SceneEngine] Viewport manager initialized.')
  }

  public mountScene(scene: MissionScene): void {
    this.activeSceneId = scene.id
    console.log(`[SceneEngine] Mounted scene: ${scene.title} (#${scene.id})`)
  }

  public processHotspotClick(hotspot: Hotspot): void {
    console.log(`[SceneEngine] Registered click interaction on hotspot ${hotspot.id} (${hotspot.label})`)
    // TODO: Execute corresponding actions (open dialogue panels, inspect logs, or trigger transitions).
  }
}
