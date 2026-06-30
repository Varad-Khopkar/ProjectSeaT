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
    <div className="absolute inset-0 w-full h-full z-10 select-none">
      {/* Scene title bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2 shadow-large">
        <MapPin className="h-3.5 w-3.5 text-brand-gold animate-pulse" />
        <span className="text-xs font-bold text-white tracking-wide">{currentScene.title}</span>
      </div>

      {/* Scene viewport background */}
      {currentScene.imageUrl ? (
        <>
          <img
            src={currentScene.imageUrl}
            alt={currentScene.title}
            className="w-full h-full object-cover select-none pointer-events-none transition-all duration-500 ease-in-out filter brightness-[0.85] contrast-[1.05]"
          />
          {/* Visual ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
          <div className="text-center opacity-45 select-none">
            {renderPlaceholderIcon()}
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-2">
              {currentScene.title} — Active Viewport
            </p>
          </div>
        </div>
      )}

      {/* Hotspot interactive layer */}
      <HotspotLayer />
    </div>
  )
}
