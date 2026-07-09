import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Mission, MissionScene, Dialogue, SimulationState, PlayerState } from '../types'
import { pscMissionTemplate, mockDialogues } from '../mock/missionTemplate'
import sceneFlowData from '../mock/sceneFlow.json'
import { playSound } from '../utils/audio'

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
  startMinigame: (type: 'rest_hours' | 'cert_swipe' | 'gmdss_loop' | 'gangway_netting' | 'fire_door_test' | 'ows_test' | null) => void
  completeMinigame: (success: boolean, pointsDelta: number, suspicionDelta: number) => void
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
  activeMinigame: null,
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
        activeMinigame: null,
      })
    } else if (missionId === 'module1') {
      const m1Mission: Mission = {
        id: 'module1',
        code: 'MOD-01',
        title: sceneFlowData.title,
        description: 'Introduction to Port State Control (PSC)',
        settings: {
          timerLimitSeconds: 600,
          passingScore: 80,
          allowRetries: true,
        },
        initialSceneId: sceneFlowData.entryScene,
        scenes: sceneFlowData.scenes as any,
        rewards: {
          xp: 150,
          badges: ['first_watch'],
        },
      }
      setActiveMission(m1Mission)
      setState({
        currentMissionId: 'module1',
        currentSceneId: m1Mission.initialSceneId,
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
        activeDialogueId: 'dlg-m1-kai-intro',
        timeRemaining: 600,
        status: 'running',
        activeFeedback: null,
        activeDocumentDesk: false,
        activeRestHourLog: false,
        activeMinigame: null,
      })
    }
  }

  const transitionToScene = (sceneId: string) => {
    if (!activeMission || !activeMission.scenes[sceneId]) return
    setState((prev) => {
      let activeDialogueId: string | null = null
      if (activeMission.id === 'module1') {
        const completed = prev.playerState.completedObjectiveIds
        if (sceneId === 'm1_s1_boarding' && !completed.includes('obj-m1-kai-intro')) {
          activeDialogueId = 'dlg-m1-kai-intro'
        } else if (sceneId === 'm1_s2_office' && !completed.includes('obj-m1-inspector-intro')) {
          activeDialogueId = 'dlg-m1-inspector-intro'
        } else if (sceneId === 'm1_s3_bridge' && !completed.includes('obj-test-radio')) {
          activeDialogueId = 'dlg-m1-kai-bridge'
        } else if (sceneId === 'm1_s4_engine' && !completed.includes('obj-m1-kai-engine')) {
          activeDialogueId = 'dlg-m1-kai-engine'
        }
      }
      return {
        ...prev,
        currentSceneId: sceneId,
        activeDialogueId,
        activeFeedback: null,
        activeDocumentDesk: false,
        activeRestHourLog: false,
      }
    })
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

  const startMinigame = (type: 'rest_hours' | 'cert_swipe' | 'gmdss_loop' | 'gangway_netting' | 'fire_door_test' | 'ows_test' | null) => {
    setState((prev) => ({
      ...prev,
      activeMinigame: type,
    }))
  }

  const completeMinigame = (success: boolean, pointsDelta: number, _suspicionDelta: number) => {
    setState((prev) => {
      const nextScore = Math.max(0, prev.playerState.score + pointsDelta)
      
      const trustDelta = success ? 10 : -25
      const nextTrust = Math.max(0, Math.min(100, prev.playerState.trustScore + trustDelta))
      
      let objectiveId = prev.activeMinigame === 'rest_hours' ? 'obj-audit-rest' : 'obj-audit-docs'
      if (prev.activeMinigame === 'gmdss_loop') {
        objectiveId = activeMission?.id === 'module1' ? 'obj-test-radio' : 'obj-test-dsc-radio'
      } else if (prev.activeMinigame === 'gangway_netting') {
        objectiveId = 'obj-m1-netting'
      } else if (prev.activeMinigame === 'fire_door_test') {
        objectiveId = 'obj-m1-firedoor'
      } else if (prev.activeMinigame === 'ows_test') {
        objectiveId = 'obj-m1-ows'
      }

      const docChecked = prev.activeMinigame === 'cert_swipe' ? true : prev.playerState.documentChecked
      const restChecked = prev.activeMinigame === 'rest_hours' ? true : prev.playerState.restHoursChecked

      const completed = prev.playerState.completedObjectiveIds.includes(objectiveId)
        ? prev.playerState.completedObjectiveIds
        : [...prev.playerState.completedObjectiveIds, objectiveId]

      const allRequiredIds = Object.values(activeMission ? activeMission.scenes : {}).flatMap(
        (scene) => (scene.objectives || []).map((o) => o.id)
      )
      const isAllDone = allRequiredIds.every((id) => completed.includes(id))
      const nextStatus = isAllDone ? 'debrief' : prev.status

      let activeDialogueId = prev.activeDialogueId
      if (activeMission?.id === 'module1') {
        if (prev.activeMinigame === 'gangway_netting') activeDialogueId = 'dlg-m1-netting-success'
        else if (prev.activeMinigame === 'cert_swipe') activeDialogueId = 'dlg-m1-certs-success'
        else if (prev.activeMinigame === 'rest_hours') activeDialogueId = 'dlg-m1-rest-success'
        else if (prev.activeMinigame === 'gmdss_loop') activeDialogueId = 'dlg-m1-gmdss-success'
        else if (prev.activeMinigame === 'fire_door_test') activeDialogueId = 'dlg-m1-firedoor-success'
        else if (prev.activeMinigame === 'ows_test') activeDialogueId = 'dlg-m1-ows-success'
      }

      if (success) {
        playSound('success')
      } else {
        playSound('failure')
      }

      return {
        ...prev,
        status: nextStatus,
        activeMinigame: null,
        activeDialogueId,
        playerState: {
          ...prev.playerState,
          score: nextScore,
          trustScore: nextTrust,
          documentChecked: docChecked,
          restHoursChecked: restChecked,
          completedObjectiveIds: completed,
        },
        activeFeedback: {
          title: success ? 'Audit Minigame Cleared' : 'Deficiencies Found in Minigame',
          text: success
            ? 'Your audit actions complied with international regulations.'
            : 'You failed to identify key deficiencies. Inspector trust decreased.',
          delta: pointsDelta,
          isSuccess: success,
        }
      }
    })
  }

  const completeDocumentAudit = (trustDelta: number, pointsDelta: number) => {
    setState((prev) => {
      const nextTrust = Math.max(0, Math.min(100, prev.playerState.trustScore + trustDelta))
      const nextScore = prev.playerState.score + pointsDelta
      const completed = prev.playerState.completedObjectiveIds.includes('obj-audit-docs')
        ? prev.playerState.completedObjectiveIds
        : [...prev.playerState.completedObjectiveIds, 'obj-audit-docs']

      const allRequiredIds = Object.values(activeMission ? activeMission.scenes : {}).flatMap(
        (scene) => (scene.objectives || []).map((o) => o.id)
      )
      const isAllDone = allRequiredIds.every((id) => completed.includes(id))
      const status = isAllDone ? 'debrief' : prev.status

      let activeDialogueId = prev.activeDialogueId
      if (activeMission?.id === 'module1') {
        activeDialogueId = 'dlg-m1-certs-success'
      }

      return {
        ...prev,
        activeDocumentDesk: false,
        status,
        activeDialogueId,
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

      const allRequiredIds = Object.values(activeMission ? activeMission.scenes : {}).flatMap(
        (scene) => (scene.objectives || []).map((o) => o.id)
      )
      const isAllDone = allRequiredIds.every((id) => completed.includes(id))
      const status = isAllDone ? 'debrief' : prev.status

      let activeDialogueId = prev.activeDialogueId
      if (activeMission?.id === 'module1') {
        activeDialogueId = 'dlg-m1-rest-success'
      }

      return {
        ...prev,
        activeRestHourLog: false,
        status,
        activeDialogueId,
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

    playSound('click')

    if (hotspot.type === 'transition' && hotspot.targetSceneId) {
      transitionToScene(hotspot.targetSceneId)
      return
    }

    // Toggle popups for special document desk and rest hour hotspots
    if (hotspot.actionId === 'evt-audit-docs') {
      if (activeMission?.id === 'module1') {
        startMinigame('cert_swipe')
      } else {
        toggleDocumentDesk(true)
      }
      return
    }
    if (hotspot.actionId === 'evt-audit-rest') {
      if (activeMission?.id === 'module1') {
        startMinigame('rest_hours')
      } else {
        toggleRestHourLog(true)
      }
      return
    }
    
    // Launch interactive minigames for non-document audits
    if (hotspot.actionId === 'evt-m1-netting') {
      startMinigame('gangway_netting')
      return
    }
    if (hotspot.actionId === 'evt-m1-firedoor') {
      startMinigame('fire_door_test')
      return
    }
    if (hotspot.actionId === 'evt-test-radio') {
      if (activeMission?.id === 'module1') {
        startMinigame('gmdss_loop')
        return
      }
      // If not module1, fall through to static inspect checking below
    }
    if (hotspot.actionId === 'evt-m1-ows') {
      startMinigame('ows_test')
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
        targetObjectiveId = activeMission.id === 'module1' ? 'obj-test-radio' : 'obj-test-dsc-radio'
      } else if (hotspot.actionId === 'evt-check-separator') {
        targetObjectiveId = 'obj-check-separator'
      } else if (hotspot.actionId === 'evt-fire-door') {
        targetObjectiveId = 'obj-fix-fire-door'
      } else if (hotspot.actionId === 'evt-m1-netting') {
        targetObjectiveId = 'obj-m1-netting'
      } else if (hotspot.actionId === 'evt-m1-firedoor') {
        targetObjectiveId = 'obj-m1-firedoor'
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

    if (choice.triggerEventId === 'evt-trust-increase') {
      playSound('success')
    } else if (choice.triggerEventId === 'evt-trust-decrease-minor' || choice.triggerEventId === 'evt-trust-decrease-major') {
      playSound('failure')
    } else {
      playSound('click')
    }

    setState((prev) => {
      const updatedDecisions = { ...prev.playerState.decisionsMade, [dialogue.id]: choiceId }
      
      // Calculate trust updates from conversation choices
      let trustDelta = 0
      if (choice.triggerEventId === 'evt-trust-increase') {
        trustDelta = 15
      } else if (choice.triggerEventId === 'evt-trust-decrease-minor') {
        trustDelta = -20
      } else if (choice.triggerEventId === 'evt-trust-decrease-major') {
        trustDelta = -40
      }

      // Check for dialogue objective completion
      let completed = [...prev.playerState.completedObjectiveIds]
      let additionalScore = 0
      
      if (choiceId === 'ch-m1-engine-ok' && !completed.includes('obj-m1-kai-engine')) {
        completed.push('obj-m1-kai-engine')
        additionalScore = 20
      } else if (choiceId === 'ch-m1-intro-success-ok' && !completed.includes('obj-m1-kai-intro')) {
        completed.push('obj-m1-kai-intro')
        additionalScore = 10
      } else if ((choiceId === 'ch-m1-pillars-success-ok' || choiceId === 'ch-m1-pillars-fail-ok') && !completed.includes('obj-m1-inspector-intro')) {
        completed.push('obj-m1-inspector-intro')
        additionalScore = 10
      } else if (choiceId === 'ch-m1-ows-success-ok' && !completed.includes('obj-m1-ows')) {
        completed.push('obj-m1-ows')
        additionalScore = 20
      }

      const nextScore = Math.max(0, prev.playerState.score + additionalScore)
      const nextTrust = Math.max(0, Math.min(100, prev.playerState.trustScore + trustDelta))

      // Check if all objectives are completed
      const allRequiredIds = Object.values(activeMission ? activeMission.scenes : {}).flatMap(
        (scene) => (scene.objectives || []).map((o) => o.id)
      )
      const isAllDone = allRequiredIds.every((id) => completed.includes(id))
      
      let status = nextTrust <= 0 ? 'failed' : prev.status
      if (isAllDone && status !== 'failed') {
        status = 'debrief'
      }

      let nextSceneId = prev.currentSceneId
      let activeDialogueId = choice.targetDialogueId

      if (choiceId === 'ch-m1-netting-success-ok') {
        nextSceneId = 'm1_s2_office'
        activeDialogueId = 'dlg-m1-inspector-intro'
      } else if (choiceId === 'ch-m1-rest-success-ok') {
        nextSceneId = 'm1_s3_bridge'
        activeDialogueId = 'dlg-m1-kai-bridge'
      } else if (choiceId === 'ch-m1-firedoor-success-ok') {
        nextSceneId = 'm1_s4_engine'
        activeDialogueId = 'dlg-m1-ows-intro'
      } else if (choiceId === 'ch-m1-ows-success-ok') {
        activeDialogueId = 'dlg-m1-kai-engine'
      }

      if (activeDialogueId) {
        return {
          ...prev,
          status,
          currentSceneId: nextSceneId,
          activeDialogueId,
          playerState: { 
            ...prev.playerState, 
            decisionsMade: updatedDecisions,
            score: nextScore,
            trustScore: nextTrust,
            completedObjectiveIds: completed,
          },
        }
      }

      return {
        ...prev,
        status,
        currentSceneId: nextSceneId,
        activeDialogueId: null,
        playerState: { 
          ...prev.playerState, 
          decisionsMade: updatedDecisions,
          score: nextScore,
          trustScore: nextTrust,
          completedObjectiveIds: completed,
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
          const obj = scene.objectives?.find((o) => o.id === objectiveId)
          if (obj) pointsToAdd = obj.points
        })
      }

      const completed = [...prev.playerState.completedObjectiveIds, objectiveId]
      const nextScore = prev.playerState.score + pointsToAdd

      const allRequiredIds = Object.values(activeMission.scenes).flatMap(
        (scene) => (scene.objectives || []).map((o) => o.id)
      )
      const isAllDone = allRequiredIds.every((id) => completed.includes(id))
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

  let currentScene = activeMission && state.currentSceneId ? activeMission.scenes[state.currentSceneId] : null

  if (currentScene && activeMission?.id === 'module1') {
    const completed = state.playerState.completedObjectiveIds
    let filteredHotspots = [...currentScene.hotspots]

    if (state.currentSceneId === 'm1_s1_boarding') {
      // Step 1: Kai intro
      if (!completed.includes('obj-m1-kai-intro')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-kai-gangway')
      } 
      // Step 2: Safety Net
      else if (!completed.includes('obj-m1-netting')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-netting')
      }
      // Step 3: Transition to Office
      else {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-enter-office' || h.id === 'hs-m1-kai-gangway')
      }
    } 
    else if (state.currentSceneId === 'm1_s2_office') {
      // Step 1: Inspector intro
      if (!completed.includes('obj-m1-inspector-intro')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-inspector' || h.id === 'hs-m1-kai-office')
      }
      // Step 2: Certificates Swipe (mapped to obj-audit-docs now)
      else if (!completed.includes('obj-audit-docs')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-certificates' || h.id === 'hs-m1-kai-office')
      }
      // Step 3: Rest Hours (mapped to obj-audit-rest now)
      else if (!completed.includes('obj-audit-rest')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-rest-hours' || h.id === 'hs-m1-kai-office')
      }
      // Step 4: Go to Bridge
      else {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-office-to-bridge' || h.id === 'hs-m1-kai-office')
      }
    }
    else if (state.currentSceneId === 'm1_s3_bridge') {
      // Step 1: Radio test
      if (!completed.includes('obj-test-radio')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-gmdss' || h.id === 'hs-m1-kai-bridge')
      }
      // Step 2: Fire Door
      else if (!completed.includes('obj-m1-firedoor')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-firedoor' || h.id === 'hs-m1-kai-bridge')
      }
      // Step 3: Go to Engine Room
      else {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-bridge-to-engine' || h.id === 'hs-m1-kai-bridge')
      }
    }
    else if (state.currentSceneId === 'm1_s4_engine') {
      // Step 1: OWS Separator
      if (!completed.includes('obj-m1-ows')) {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-ows')
      }
      // Step 2: Final Brief
      else {
        filteredHotspots = currentScene.hotspots.filter(h => h.id === 'hs-m1-kai-engine')
      }
    }

    currentScene = {
      ...currentScene,
      hotspots: filteredHotspots
    }
  }

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
        startMinigame,
        completeMinigame,
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
