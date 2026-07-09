import React from 'react'
import type { Hotspot as HotspotType } from '../types'
import { useSimulation } from '../state/SimulationContext'
import { SceneHelpers } from '../utils'
import { cn } from '@/utils/formatters'
import { Eye, MessageSquare, MousePointerClick, ArrowRight } from 'lucide-react'

const hotspotIcons: Record<HotspotType['type'], React.ReactNode> = {
  inspect: <Eye className="h-3.5 w-3.5" />,
  dialogue: <MessageSquare className="h-3.5 w-3.5" />,
  action: <MousePointerClick className="h-3.5 w-3.5" />,
  transition: <ArrowRight className="h-3.5 w-3.5" />,
}

const hotspotColors: Record<HotspotType['type'], string> = {
  inspect: 'border-brand-gold/50 bg-brand-gold/10 hover:bg-brand-gold/25 text-brand-gold',
  dialogue: 'border-brand-blue/50 bg-brand-blue/10 hover:bg-brand-blue/25 text-brand-blue',
  action: 'border-brand-coral/50 bg-brand-coral/10 hover:bg-brand-coral/25 text-brand-coral',
  transition: 'border-emerald-400/50 bg-emerald-400/10 hover:bg-emerald-400/25 text-emerald-400',
}

export const HotspotLayer: React.FC = () => {
  const { currentScene, triggerHotspot, state } = useSimulation()

  if (!currentScene || state.status !== 'running') return null

  return (
    <>
      {(currentScene.hotspots || []).map((hotspot) => {
        const completed = state.playerState.completedObjectiveIds
        let isGlow = false

        if (state.currentMissionId === 'module1') {
          if (state.currentSceneId === 'm1_s1_boarding') {
            if (!completed.includes('obj-m1-kai-intro')) {
              isGlow = hotspot.id === 'hs-m1-kai-gangway'
            } else if (!completed.includes('obj-m1-netting')) {
              isGlow = hotspot.id === 'hs-m1-netting'
            } else {
              isGlow = hotspot.id === 'hs-m1-enter-office'
            }
          } else if (state.currentSceneId === 'm1_s2_office') {
            if (!completed.includes('obj-m1-inspector-intro')) {
              isGlow = hotspot.id === 'hs-m1-inspector'
            } else if (!completed.includes('obj-audit-docs')) {
              isGlow = hotspot.id === 'hs-m1-certificates'
            } else if (!completed.includes('obj-audit-rest')) {
              isGlow = hotspot.id === 'hs-m1-rest-hours'
            } else {
              isGlow = hotspot.id === 'hs-m1-office-to-bridge'
            }
          } else if (state.currentSceneId === 'm1_s3_bridge') {
            if (!completed.includes('obj-test-radio')) {
              isGlow = hotspot.id === 'hs-m1-gmdss'
            } else if (!completed.includes('obj-m1-firedoor')) {
              isGlow = hotspot.id === 'hs-m1-firedoor'
            } else {
              isGlow = hotspot.id === 'hs-m1-bridge-to-engine'
            }
          } else if (state.currentSceneId === 'm1_s4_engine') {
            if (!completed.includes('obj-m1-ows')) {
              isGlow = hotspot.id === 'hs-m1-ows'
            } else if (!completed.includes('obj-m1-kai-engine')) {
              isGlow = hotspot.id === 'hs-m1-kai-engine'
            }
          }
        }

        const style = SceneHelpers.calculateHotspotPosition(
          hotspot.x,
          hotspot.y,
          hotspot.width,
          hotspot.height
        )

        // Decoys use standard inspect styling to blend in and create a challenge
        const activeType = hotspot.isDecoy ? 'inspect' : hotspot.type
        const colorClasses = hotspotColors[activeType]

        return (
          <button
            key={hotspot.id}
            onClick={() => triggerHotspot(hotspot.id)}
            style={style}
            className={cn(
              'absolute border-2 rounded-[8px] cursor-pointer',
              'flex flex-col items-center justify-center gap-1',
              'transition-all duration-300 group',
              'backdrop-blur-[1px]',
              colorClasses,
              isGlow
                ? 'animate-[pulse_1.8s_infinite] border-brand-gold border-2 shadow-[0_0_15px_rgba(244,162,97,0.85)] bg-slate-900/40'
                : 'border-dashed hover:scale-[1.03] hover:shadow-md hover:border-solid'
            )}
            title={hotspot.label}
          >
            <div className="opacity-80 group-hover:opacity-100 transition-opacity">
              {hotspotIcons[activeType]}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity text-center leading-tight px-1 max-w-full truncate">
              {hotspot.label}
            </span>

            {/* Pulse ring for attract attention */}
            <span className="absolute inset-0 rounded-[8px] border border-current animate-ping opacity-15 pointer-events-none group-hover:animate-none" />
          </button>
        )
      })}
    </>
  )
}
