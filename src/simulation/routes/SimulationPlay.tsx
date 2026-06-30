import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSimulation } from '../state/SimulationContext'
import { SimulationLayout } from '../layouts/SimulationLayout'
import { pscMissionTemplate } from '../mock/missionTemplate'
import { Play, Clock, Compass, Star, ChevronRight, UserCheck } from 'lucide-react'
import welcomeCaptain from '@/Images/SeaT Captain/Captain_welcome.png'

export const SimulationPlay: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>()
  const navigate = useNavigate()
  const { state, startMission } = useSimulation()

  const [showBriefing, setShowBriefing] = useState(true)
  const simContainerRef = useRef<HTMLDivElement>(null)

  // Redirect to debrief when mission completes
  useEffect(() => {
    if (state.status === 'debrief') {
      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
      navigate('/simulation/debrief', { replace: true })
    }
  }, [state.status, navigate])

  const handleStartMission = () => {
    if (!missionId) return

    // Trigger browser fullscreen on the simulator container
    if (simContainerRef.current) {
      const el = simContainerRef.current
      if (el.requestFullscreen) {
        el.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request rejected by browser:', err)
        })
      } else if ((el as any).webkitRequestFullscreen) {
        ;(el as any).webkitRequestFullscreen()
      } else if ((el as any).msRequestFullscreen) {
        ;(el as any).msRequestFullscreen()
      }
    }

    // Initialize the simulation run and close the briefing screen
    if (missionId === pscMissionTemplate.id) {
      startMission(missionId)
      setShowBriefing(false)
    } else {
      navigate('/simulation', { replace: true })
    }
  }

  // If showing briefing, render the Captain's welcome and scenario introduction
  if (showBriefing) {
    return (
      <div 
        className="fixed inset-0 z-[100] w-screen h-screen overflow-y-auto p-4 md:p-8 flex items-center justify-center select-none"
        style={{
          background: 'linear-gradient(135deg, #050e1a 0%, #0a1f35 45%, #12355B 100%)'
        }}
      >
        <div className="w-full max-w-5xl rounded-[24px] overflow-hidden border border-brand-blue/20 bg-slate-900/70 backdrop-blur-md text-slate-100 shadow-large p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-300 text-left font-sans">
          {/* Left column: Captain's Image Card */}
          <div className="w-full lg:w-[380px] shrink-0 flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-brand-blue/30 bg-slate-950/40 p-2 shadow-medium">
              <img 
                src={welcomeCaptain} 
                alt="Captain Henderson" 
                className="w-full h-auto object-cover rounded-xl border border-brand-blue/15"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xs border border-brand-blue/20 rounded-xl p-3 text-center">
                <span className="text-xs font-extrabold text-white block">Capt. Henderson</span>
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-wider block mt-0.5">Master Mariner • commanding</span>
              </div>
            </div>
          </div>

          {/* Right column: Scenario Briefing details */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Header info */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  INCOMING TRANSMISSION • BRIDGE COMMUNICATIONS
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Port State Control Audit Briefing
              </h1>

              {/* Captain's Scenario Quote */}
              <div className="bg-slate-950/60 border-l-4 border-brand-gold rounded-r-xl p-4 text-xs md:text-sm text-slate-300 italic leading-relaxed font-sans shadow-inner">
                "Welcome to the Bridge, Officer. I am Captain Henderson. A Port State Control (PSC) boarding inspector has just boarded the M/V Sea Guardian at Rotterdam Anchorage. This is a critical audit. Any minor deficiency can lead to operational delays, and a Code 30 detention will halt our charter completely. Your duty is to conduct a thorough pre-inspection audit. Inspect our ship certificates, check the watchkeeping rest logs, and verify the engine oily water separator. Fix any deficiencies before the inspector flags them. Protect our trust score, keep our compliance rating high, and complete the checklist before the inspector's timer runs out. The eyes of the company are on you. Let's make this ship compliant."
              </div>

              {/* Objective stats details */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-slate-800 rounded-xl p-3 text-center">
                  <Clock className="h-4 w-4 text-brand-gold mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 block font-mono">TIME LIMIT</span>
                  <span className="text-xs font-bold text-white block mt-0.5">10 Minutes</span>
                </div>
                <div className="bg-white/5 border border-slate-800 rounded-xl p-3 text-center">
                  <Star className="h-4 w-4 text-brand-gold mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 block font-mono">PASSING SCORE</span>
                  <span className="text-xs font-bold text-white block mt-0.5">80% Accuracy</span>
                </div>
                <div className="bg-white/5 border border-slate-800 rounded-xl p-3 text-center">
                  <Compass className="h-4 w-4 text-brand-gold mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 block font-mono">COMPARTMENTS</span>
                  <span className="text-xs font-bold text-white block mt-0.5">3 Audit Scenes</span>
                </div>
              </div>
            </div>

            {/* Start CTA actions */}
            <div className="pt-4 border-t border-brand-blue/15 flex flex-col sm:flex-row items-center gap-4 justify-end">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <UserCheck className="h-4 w-4 text-brand-gold" />
                <span>OFFICER INCHARGE: STCW SEC. II/1 READY</span>
              </div>
              <button
                onClick={handleStartMission}
                className="flex items-center gap-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(244,162,97,0.25)] hover:scale-[1.03] active:scale-[0.97]"
              >
                <Play className="h-4 w-4" />
                Start Mission
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Renders the full-window simulation container once started
  return (
    <div 
      ref={simContainerRef} 
      className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-2 sm:p-4"
    >
      <SimulationLayout />
    </div>
  )
}
