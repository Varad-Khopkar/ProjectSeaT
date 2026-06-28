export interface MissionSettings {
  timerLimitSeconds?: number
  passingScore: number
  allowRetries: boolean
}

export interface Reward {
  xp: number
  badges: string[]
}

export interface Objective {
  id: string
  title: string
  description: string
  points: number
  status: 'pending' | 'completed' | 'failed'
}

export interface DialogueChoice {
  id: string
  text: string
  targetDialogueId?: string
  triggerEventId?: string
}

export interface Dialogue {
  id: string
  speaker: string
  message: string
  choices: DialogueChoice[]
}

export interface Hotspot {
  id: string
  x: number // X coordinate relative percentage (0-100)
  y: number // Y coordinate relative percentage (0-100)
  width: number // Width relative percentage
  height: number // Height relative percentage
  label: string
  type: 'inspect' | 'dialogue' | 'action' | 'transition'
  actionId?: string
  targetSceneId?: string
  isDecoy?: boolean
  explanationTitle?: string
  explanationText?: string
  actionCode?: string // e.g. "Code 30", "Code 17", "Code 15", "Code 10"
}

export interface SceneTransition {
  id: string
  sourceSceneId: string
  targetSceneId: string
  triggerCondition?: string
}

export interface MissionScene {
  id: string
  title: string
  description: string
  imageUrl?: string
  hotspots: Hotspot[]
  objectives: Objective[]
  transitions: SceneTransition[]
}

export interface Mission {
  id: string
  title: string
  code: string
  description: string
  settings: MissionSettings
  initialSceneId: string
  scenes: Record<string, MissionScene>
  rewards: Reward
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  icon: string
}

export interface PlayerState {
  score: number
  completedObjectiveIds: string[]
  inventory: string[]
  decisionsMade: Record<string, string> // maps choiceId to dialogueId
  attempts: Record<string, number> // tracks click attempts per hotspot
  trustScore: number // Captures inspector cooperation rating (0-100)
  documentChecked: boolean // Tracks document audit clipboard completion
  restHoursChecked: boolean // Tracks MLC rest-hours sheet audit completion
}

export interface FeedbackDetail {
  title: string
  text: string
  delta: number
  isSuccess: boolean
}

export interface SimulationState {
  currentMissionId: string | null
  currentSceneId: string | null
  playerState: PlayerState
  activeDialogueId: string | null
  timeRemaining: number | null // in seconds
  status: 'idle' | 'running' | 'paused' | 'debrief' | 'success' | 'failed'
  activeFeedback: FeedbackDetail | null // active regulations explanation popup
  activeDocumentDesk: boolean // toggles document desk clipboard popups
  activeRestHourLog: boolean // toggles MLC rest hour logs board popup
}

export interface MissionResult {
  missionId: string
  score: number
  success: boolean
  completedObjectives: string[]
  badgesUnlocked: string[]
  durationSeconds: number
}
