import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Mission, MissionScene, Dialogue, SimulationState, PlayerState } from '../types'
import { pscMissionTemplate, mockDialogues } from '../mock/missionTemplate'

interface SimulationContextType {
  state: SimulationState
  activeMission: Mission | null
  currentScene: MissionScene | null
  activeDialogue: Dialogue | null
  startMission: (missionId: string) => void
  transitionToScene: (sceneId: string) => void
  triggerHotspot: (hotspotId: string) => void
  makeDialogueChoice: (choiceId: string) => void
  pauseSimulation: () => void
  resumeSimulation: () => void
  resetSimulation: () => void
  completeObjective: (objectiveId: string, customPoints?: number) => void
  closeFeedback: () => void
  toggleDocumentDesk: (open: boolean) => void
  toggleRestHourLog: (open: boolean) => void
  completeDocumentAudit: (trustDelta: number, pointsDelta: number) => void
  completeRestHourAudit: (trustDelta: number, pointsDelta: number) => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

const initialPlayerState: PlayerState = {
  score: 0,
  completedObjectiveIds: [],
  inventory: [],
  decisionsMade: {},
  attempts: {},
  trustScore: 100,
  documentChecked: false,
  restHoursChecked: false,
}

const initialSimulationState: SimulationState = {
  currentMissionId: null,
  currentSceneId: null,
  playerState: initialPlayerState,
  activeDialogueId: null,
  timeRemaining: null,
  status: 'idle',
  activeFeedback: null,
  activeDocumentDesk: false,
  activeRestHourLog: false,
}

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SimulationState>(initialSimulationState)
  const [activeMission, setActiveMission] = useState<Mission | null>(null)

  // Timer Tick handler
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (state.status === 'running' && state.timeRemaining !== null && state.timeRemaining > 0) {
      interval = setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining !== null && prev.timeRemaining <= 1) {
            return { ...prev, status: 'failed', timeRemaining: 0 }
          }
          return { ...prev, timeRemaining: prev.timeRemaining !== null ? prev.timeRemaining - 1 : null }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [state.status, state.timeRemaining])

  const startMission = (missionId: string) => {
    if (missionId === pscMissionTemplate.id) {
      setActiveMission(pscMissionTemplate)
      setState({
        currentMissionId: missionId,
        currentSceneId: pscMissionTemplate.initialSceneId,
        playerState: {
          score: 0,
          completedObjectiveIds: [],
          inventory: [],
          decisionsMade: {},
          attempts: {},
          trustScore: 100,
          documentChecked: false,
          restHoursChecked: false,
        },
        activeDialogueId: null,
        timeRemaining: pscMissionTemplate.settings.timerLimitSeconds || 600,
        status: 'running',
        activeFeedback: null,
        activeDocumentDesk: false,
        activeRestHourLog: false,
      })
    }
  }

  const transitionToScene = (sceneId: string) => {
    if (!activeMission || !activeMission.scenes[sceneId]) return
    setState((prev) => ({
      ...prev,
      currentSceneId: sceneId,
      activeDialogueId: null,
      activeFeedback: null,
      activeDocumentDesk: false,
      activeRestHourLog: false,
    }))
  }

  const closeFeedback = () => {
    setState((prev) => ({
      ...prev,
      activeFeedback: null,
    }))
  }

  const toggleDocumentDesk = (open: boolean) => {
    setState((prev) => ({
      ...prev,
      activeDocumentDesk: open,
    }))
  }

  const toggleRestHourLog = (open: boolean) => {
    setState((prev) => ({
      ...prev,
      activeRestHourLog: open,
    }))
  }

  const completeDocumentAudit = (trustDelta: number, pointsDelta: number) => {
    setState((prev) => {
      const nextTrust = Math.max(0, Math.min(100, prev.playerState.trustScore + trustDelta))
      const nextScore = prev.playerState.score + pointsDelta
      const completed = prev.playerState.completedObjectiveIds.includes('obj-audit-docs')
        ? prev.playerState.completedObjectiveIds
        : [...prev.playerState.completedObjectiveIds, 'obj-audit-docs']

      const isAllDone = completed.length === (activeMission ? Object.values(activeMission.scenes).reduce(
        (acc, scene) => acc + scene.objectives.length, 0
      ) : 0)
      const status = isAllDone ? 'debrief' : prev.status

      return {
        ...prev,
        activeDocumentDesk: false,
        status,
        playerState: {
          ...prev.playerState,
          documentChecked: true,
          trustScore: nextTrust,
          score: nextScore,
          completedObjectiveIds: completed,
        },
        activeFeedback: {
          title: pointsDelta > 0 ? 'Document Audit Cleared' : 'Document Audit Deficiencies Found',
          text: pointsDelta > 0
            ? 'All statutory vessel certificates are valid. The Safe Manning document and IOPP certification align with flag registrations.'
            : 'You failed to spot expired or invalid documents. Failing to review safe manning and GMDSS operator certificates creates heavy detention risks under SOLAS/STCW rules.',
          delta: pointsDelta,
          isSuccess: pointsDelta > 0,
        },
      }
    })
  }

  const completeRestHourAudit = (trustDelta: number, pointsDelta: number) => {
    setState((prev) => {
      const nextTrust = Math.max(0, Math.min(100, prev.playerState.trustScore + trustDelta))
      const nextScore = prev.playerState.score + pointsDelta
      const completed = prev.playerState.completedObjectiveIds.includes('obj-audit-rest')
        ? prev.playerState.completedObjectiveIds
        : [...prev.playerState.completedObjectiveIds, 'obj-audit-rest']

      const isAllDone = completed.length === (activeMission ? Object.values(activeMission.scenes).reduce(
        (acc, scene) => acc + scene.objectives.length, 0
      ) : 0)
      const status = isAllDone ? 'debrief' : prev.status

      return {
        ...prev,
        activeRestHourLog: false,
        status,
        playerState: {
          ...prev.playerState,
          restHoursChecked: true,
          trustScore: nextTrust,
          score: nextScore,
          completedObjectiveIds: completed,
        },
        activeFeedback: {
          title: pointsDelta > 0 ? 'MLC Rest Hours Verified' : 'MLC Rest Hours Violation Noted',
          text: pointsDelta > 0
            ? 'All OOW and cadet shift logs comply with MLC 2006 limits (no shifts exceed 14h, and watchkeepers maintain rest sheets).'
            : 'You failed to identify key rest hour non-conformities. Excess hours worked without continuous rest periods violate MLC 2006 regulations.',
          delta: pointsDelta,
          isSuccess: pointsDelta > 0,
        },
      }
    })
  }

  const triggerHotspot = (hotspotId: string) => {
    if (!activeMission || !state.currentSceneId) return
    const scene = activeMission.scenes[state.currentSceneId]
    const hotspot = scene.hotspots.find((h) => h.id === hotspotId)
    if (!hotspot) return

    if (hotspot.type === 'transition' && hotspot.targetSceneId) {
      transitionToScene(hotspot.targetSceneId)
      return
    }

    // Toggle popups for special document desk and rest hour hotspots
    if (hotspot.actionId === 'evt-audit-docs') {
      toggleDocumentDesk(true)
      return
    }
    if (hotspot.actionId === 'evt-audit-rest') {
      toggleRestHourLog(true)
      return
    }

    // Increment attempt count for inspect/dialogue hotspots
    const currentAttempts = state.playerState.attempts[hotspotId] || 0
    const nextAttempts = {
      ...state.playerState.attempts,
      [hotspotId]: currentAttempts + 1,
    }

    setState((prev) => ({
      ...prev,
      playerState: {
        ...prev.playerState,
        attempts: nextAttempts,
      },
    }))

    // Handle Decoy Hotspots
    if (hotspot.isDecoy) {
      setState((prev) => {
        const nextScore = Math.max(0, prev.playerState.score - 10)
        // Decoys also decrease inspector trust
        const nextTrust = Math.max(0, prev.playerState.trustScore - 15)
        return {
          ...prev,
          playerState: {
            ...prev.playerState,
            score: nextScore,
            trustScore: nextTrust,
          },
          activeFeedback: {
            title: hotspot.explanationTitle || 'Inspection Alert',
            text: hotspot.explanationText || 'This selection does not match standard compliance requirements.',
            delta: -10,
            isSuccess: false,
          },
        }
      })
      return
    }

    // Handle Correct Hotspots
    if (hotspot.type === 'dialogue' && hotspot.actionId) {
      setState((prev) => ({
        ...prev,
        activeDialogueId: hotspot.actionId || null,
        activeFeedback: hotspot.explanationText
          ? {
              title: hotspot.explanationTitle || 'Inspection Note',
              text: hotspot.explanationText,
              delta: 0,
              isSuccess: true,
            }
          : null,
      }))
    } else if (hotspot.type === 'inspect' && hotspot.actionId) {
      let targetObjectiveId = ''
      if (hotspot.actionId === 'evt-audit-orb') {
        targetObjectiveId = 'obj-inspect-orb'
      } else if (hotspot.actionId === 'evt-inspect-logbook') {
        targetObjectiveId = 'obj-verify-bridge-log'
      } else if (hotspot.actionId === 'evt-test-radio') {
        targetObjectiveId = 'obj-test-dsc-radio'
      } else if (hotspot.actionId === 'evt-check-separator') {
        targetObjectiveId = 'obj-check-separator'
      } else if (hotspot.actionId === 'evt-fire-door') {
        targetObjectiveId = 'obj-fix-fire-door'
      }

      if (targetObjectiveId) {
        let basePoints = 0
        Object.values(activeMission.scenes).forEach((sc) => {
          const obj = sc.objectives.find((o) => o.id === targetObjectiveId)
          if (obj) basePoints = obj.points
        })

        const isFirstAttempt = (currentAttempts + 1) === 1
        const earnedPoints = isFirstAttempt ? basePoints : Math.min(10, basePoints)

        completeObjective(targetObjectiveId, earnedPoints)

        setState((prev) => ({
          ...prev,
          activeFeedback: {
            title: hotspot.explanationTitle || 'Component Verified',
            text: hotspot.explanationText || 'Component is operational and compliant.',
            delta: earnedPoints,
            isSuccess: true,
          },
        }))
      }
    }
  }

  const makeDialogueChoice = (choiceId: string) => {
    if (!state.activeDialogueId) return
    const dialogue = mockDialogues[state.activeDialogueId]
    if (!dialogue) return
    
    const choice = dialogue.choices.find((c) => c.id === choiceId)
    if (!choice) return

    setState((prev) => {
      const updatedDecisions = { ...prev.playerState.decisionsMade, [dialogue.id]: choiceId }
      
      // Calculate trust updates from conversation choices
      let trustDelta = 0
      if (choice.triggerEventId === 'evt-trust-increase') {
        trustDelta = 10
      } else if (choice.triggerEventId === 'evt-trust-decrease-minor') {
        trustDelta = -15
      } else if (choice.triggerEventId === 'evt-trust-decrease-major') {
        trustDelta = -30
      }

      const nextTrust = Math.max(0, Math.min(100, prev.playerState.trustScore + trustDelta))

      if (choice.targetDialogueId) {
        return {
          ...prev,
          activeDialogueId: choice.targetDialogueId,
          playerState: { 
            ...prev.playerState, 
            decisionsMade: updatedDecisions,
            trustScore: nextTrust 
          },
        }
      }

      return {
        ...prev,
        activeDialogueId: null,
        playerState: { 
          ...prev.playerState, 
          decisionsMade: updatedDecisions,
          trustScore: nextTrust 
        },
      }
    })
  }

  const completeObjective = (objectiveId: string, customPoints?: number) => {
    if (!activeMission) return
    
    setState((prev) => {
      if (prev.playerState.completedObjectiveIds.includes(objectiveId)) return prev

      let pointsToAdd = 0
      if (customPoints !== undefined) {
        pointsToAdd = customPoints
      } else {
        Object.values(activeMission.scenes).forEach((scene) => {
          const obj = scene.objectives.find((o) => o.id === objectiveId)
          if (obj) pointsToAdd = obj.points
        })
      }

      const completed = [...prev.playerState.completedObjectiveIds, objectiveId]
      const nextScore = prev.playerState.score + pointsToAdd

      const totalObjectivesCount = Object.values(activeMission.scenes).reduce(
        (acc, scene) => acc + scene.objectives.length,
        0
      )

      const isAllDone = completed.length === totalObjectivesCount
      const status = isAllDone ? 'debrief' : prev.status

      return {
        ...prev,
        status,
        playerState: {
          ...prev.playerState,
          completedObjectiveIds: completed,
          score: nextScore,
        },
      }
    })
  }

  const pauseSimulation = () => {
    setState((prev) => ({ ...prev, status: 'paused' }))
  }

  const resumeSimulation = () => {
    setState((prev) => ({ ...prev, status: 'running' }))
  }

  const resetSimulation = () => {
    setState(initialSimulationState)
    setActiveMission(null)
  }

  const currentScene = activeMission && state.currentSceneId ? activeMission.scenes[state.currentSceneId] : null
  const activeDialogue = state.activeDialogueId ? mockDialogues[state.activeDialogueId] || null : null

  return (
    <SimulationContext.Provider
      value={{
        state,
        activeMission,
        currentScene,
        activeDialogue,
        startMission,
        transitionToScene,
        triggerHotspot,
        makeDialogueChoice,
        pauseSimulation,
        resumeSimulation,
        resetSimulation,
        completeObjective,
        closeFeedback,
        toggleDocumentDesk,
        toggleRestHourLog,
        completeDocumentAudit,
        completeRestHourAudit,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export const useSimulation = () => {
  const context = useContext(SimulationContext)
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider')
  }
  return context
}
