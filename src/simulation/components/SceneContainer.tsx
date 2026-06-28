import React from 'react'
import { useSimulation } from '../state/SimulationContext'
import { HotspotLayer } from './HotspotLayer'
import { MapPin, Building, Compass, Settings } from 'lucide-react'

export const SceneContainer: React.FC = () => {
  const { currentScene } = useSimulation()

  if (!currentScene) return null

  const renderPlaceholderIcon = () => {
    switch (currentScene.id) {
      case 'ship_office':
        return <Building className="h-16 w-16 text-slate-400 mx-auto mb-2" />
      case 'bridge':
        return <Compass className="h-16 w-16 text-slate-400 mx-auto mb-2" />
      default:
        return <Settings className="h-16 w-16 text-slate-400 mx-auto mb-2" />
    }
  }

  return (
    <div className="relative w-full bg-slate-100 border border-slate-200/80 rounded-[16px] overflow-hidden shadow-small">
      {/* Scene title bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-[10px] px-3 py-1.5 shadow-sm">
        <MapPin className="h-3.5 w-3.5 text-brand-blue" />
        <span className="text-xs font-bold text-brand-navy">{currentScene.title}</span>
      </div>

      {/* Scene viewport — aspect-ratio locked container for the background image and hotspot overlay */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        {currentScene.imageUrl ? (
          <>
            <img
              src={currentScene.imageUrl}
              alt={currentScene.title}
              className="w-full h-full object-cover select-none pointer-events-none transition-all duration-500 ease-in-out filter brightness-[0.85] contrast-[1.05]"
            />
            {/* Visual ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center opacity-40 select-none">
              {renderPlaceholderIcon()}
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                {currentScene.title} — Scene Viewport
              </p>
            </div>
          </div>
        )}

        {/* Hotspot interactive layer */}
        <HotspotLayer />
      </div>

      {/* Scene description footer */}
      <div className="px-4 py-2.5 bg-white/80 border-t border-slate-100">
        <p className="text-xs text-slate-500 leading-relaxed">{currentScene.description}</p>
      </div>
    </div>
  )
}
