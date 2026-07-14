import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSimulation } from '../state/SimulationContext'
import { SimulationLayout } from '../layouts/SimulationLayout'
import { pscMissionTemplate } from '../mock/missionTemplate'
import { Play, Clock, Compass, Star, ChevronRight, UserCheck } from 'lucide-react'
import welcomeCaptain from '@/Images/SeaT Captain/Captain_welcome.png'
import { cn } from '@/utils/formatters'

/* ─── Main SimulationPlay component ─────────────────────────────────────── */
export const SimulationPlay: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>()
  const navigate = useNavigate()
  const { state, startMission } = useSimulation()

  const [showBriefing, setShowBriefing] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const simContainerRef = useRef<HTMLDivElement>(null)

  // Redirect to debrief when mission completes
  useEffect(() => {
    if (state.status === 'debrief' || state.status === 'failed') {
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
        el.requestFullscreen().then(() => {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {})
          }
        }).catch((err) => {
          console.warn('Fullscreen request rejected by browser:', err)
        })
      } else if ((el as any).webkitRequestFullscreen) {
        ;(el as any).webkitRequestFullscreen()
      } else if ((el as any).msRequestFullscreen) {
        ;(el as any).msRequestFullscreen()
      }
    }

    if (missionId === pscMissionTemplate.id || missionId === 'module1') {
      setIsLoading(true)
      setTimeout(() => {
        startMission(missionId)
        setIsLoading(false)
        setShowBriefing(false)
      }, 1500)
    } else {
      navigate('/simulation', { replace: true })
    }
  }

  // If showing briefing, render the Captain's welcome and scenario introduction
  if (showBriefing) {
    return (
      <div
        className="fixed inset-0 z-[100] w-screen h-screen overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col select-none"
        style={{
          background: 'linear-gradient(135deg, #050e1a 0%, #0a1f35 45%, #12355B 100%)'
        }}
      >
        <div className="w-full max-w-5xl rounded-[20px] sm:rounded-[24px] overflow-hidden border border-brand-blue/20 bg-slate-900/70 backdrop-blur-md text-slate-100 shadow-large p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-6 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-300 text-left font-sans my-auto mx-auto shrink-0">
          {/* Left column: Captain's Image Card */}
          <div className="w-full sm:w-64 lg:w-[380px] shrink-0 flex flex-col items-center mx-auto lg:mx-0">
            <div className="relative w-full max-w-[280px] sm:max-w-full rounded-2xl overflow-hidden border border-brand-blue/30 bg-slate-950/40 p-2 shadow-medium">
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
          <div className="flex-1 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-4">
              {/* Header info */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  INCOMING TRANSMISSION • BRIDGE COMMUNICATIONS
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {missionId === 'module1'
                  ? "Introduction to Port State Control (PSC) Onboarding"
                  : "Port State Control Audit Briefing"}
              </h1>

              {/* Captain's Scenario Quote */}
              <div className="bg-slate-950/60 border-l-4 border-brand-gold rounded-r-xl p-3 sm:p-4 text-xs sm:text-sm text-slate-300 italic leading-relaxed font-sans shadow-inner max-h-40 sm:max-h-none overflow-y-auto">
                {missionId === 'module1'
                  ? "\"Welcome aboard the M/V Sea Guardian, Officer. I am Captain Henderson, commanding. Before you begin active pre-inspection watches, you must clear your onboarding walkthrough with Cadet Kai. He will guide you sequentially from the gangway to the deck office, bridge, and engine room. Pay close attention to international safety netting rules, certificate validity dates, OOW watchrest hours, GMDSS radio loop tests, and fire door release triggers. A competent officer is the first shield against vessel detentions. Complete your walkaround to unlock the active simulation. Good luck.\""
                  : "\"Welcome to the Bridge, Officer. I am Captain Henderson. A Port State Control (PSC) boarding inspector has just boarded the M/V Sea Guardian at Rotterdam Anchorage. This is a critical audit. Any minor deficiency can lead to operational delays, and a Code 30 detention will halt our charter completely. Your duty is to conduct a thorough pre-inspection audit. Inspect our ship certificates, check the watchkeeping rest logs, and verify the engine oily water separator. Fix any deficiencies before the inspector flags them. Protect our trust score, keep our compliance rating high, and complete the checklist before the inspector's timer runs out. The eyes of the company are on you. Let's make this ship compliant.\""}
              </div>

              {/* Objective stats details */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                <div className="bg-white/5 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                  <Clock className="h-4 w-4 text-brand-gold mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 block font-mono">TIME LIMIT</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {missionId === 'module1' ? "Untimed" : "10 Minutes"}
                  </span>
                </div>
                <div className="bg-white/5 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                  <Star className="h-4 w-4 text-brand-gold mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 block font-mono">PASSING</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {missionId === 'module1' ? "Onboarding" : "80% Accuracy"}
                  </span>
                </div>
                <div className="bg-white/5 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-center">
                  <Compass className="h-4 w-4 text-brand-gold mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400 block font-mono">SCENES</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {missionId === 'module1' ? "4 Walkthrough" : "3 Audit"}
                  </span>
                </div>
              </div>
            </div>

            {/* Start CTA actions */}
            <div className="pt-4 border-t border-brand-blue/15 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-between sm:justify-end">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 order-2 sm:order-1">
                <UserCheck className="h-4 w-4 text-brand-gold shrink-0" />
                <span className="hidden sm:inline">OFFICER INCHARGE: STCW SEC. II/1 READY</span>
                <span className="sm:hidden">STCW SEC. II/1 READY</span>
              </div>
              <button
                onClick={handleStartMission}
                disabled={isLoading}
                className={cn(
                  "order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2.5 font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(244,162,97,0.25)]",
                  isLoading ? "bg-slate-800 text-slate-400 cursor-wait" : "bg-brand-gold hover:bg-amber-400 text-brand-navy hover:scale-[1.03] active:scale-[0.97]"
                )}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-brand-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Simulating Environment...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Mission
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
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
      className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950 overflow-hidden flex items-center justify-center p-1 sm:p-2 md:p-4"
    >
      <SimulationLayout />
      
      {/* Landscape Warning Overlay for Mobile */}
      <div className="portrait-warning hidden z-[9999] fixed inset-0 bg-brand-navy flex-col items-center justify-center p-6 text-center select-none" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <style>
          {`
            @media screen and (max-width: 1024px) and (orientation: portrait) {
              .portrait-warning {
                display: flex !important;
              }
            }
          `}
        </style>
        <div className="w-20 h-20 bg-brand-blue/20 text-brand-gold rounded-full flex items-center justify-center mb-6 border border-brand-blue/40 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-3">Rotate Your Device</h2>
        <p className="text-sm text-slate-400 max-w-[280px] leading-relaxed">
          The maritime simulation requires landscape orientation for the best immersive experience. Please rotate your device to continue.
        </p>
      </div>
    </div>
  )
}
