import React, { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { 
  Clock, 
  ArrowRight,
  TrendingDown
} from 'lucide-react'

export const RestHoursPuzzle: React.FC = () => {
  const { completeMinigame } = useSimulation()

  // State representing the active watch allocations
  // Chief Mate has watch 00-06, maintenance 10-16, and overtime drill 18-22 (Total: 16h work - VIOLATION)
  const [mateMaintenance, setMateMaintenance] = useState(6) // 10:00 to 16:00 (6h)
  const [mateOvertime, setMateOvertime] = useState(4)      // 18:00 to 22:00 (4h)

  // Cadet has training 08-14, watch 16-20, and emergency drill 21-23 (Total: 12h work - COMPLIANT but close)
  const [cadetDrill, setCadetDrill] = useState(2)          // 21:00 to 23:00 (2h)

  // Recalculate watch metrics
  const mateWorkHours = 6 + mateMaintenance + mateOvertime // Watch (6h) + Maintenance + Overtime
  const cadetWorkHours = 6 + 4 + cadetDrill                // Training (6h) + Watch (4h) + Drill

  const mateRestHours = 24 - mateWorkHours
  const cadetRestHours = 24 - cadetWorkHours

  const mateCompliant = mateRestHours >= 10
  const cadetCompliant = cadetRestHours >= 10
  const isCompliant = mateCompliant && cadetCompliant

  const handleVerify = () => {
    if (isCompliant) {
      // Success! Clear compliance, add +20 points and decrease inspector suspicion
      completeMinigame(true, 20, -15)
    } else {
      // Failed! Penalize score and increase suspicion
      completeMinigame(false, -10, 20)
    }
  }

  // Helper to generate 24 hour grid classes
  const getHourClass = (hour: number, type: 'mate' | 'cadet') => {
    if (type === 'mate') {
      // Watch 00-06 (Work)
      if (hour < 6) return 'bg-brand-coral border-brand-coral/40 text-white font-bold'
      // Maintenance 10 to (10 + mateMaintenance)
      if (hour >= 10 && hour < 10 + mateMaintenance) return 'bg-amber-500 border-amber-400/40 text-white'
      // Overtime 18 to (18 + mateOvertime)
      if (hour >= 18 && hour < 18 + mateOvertime) return 'bg-amber-600 border-amber-500/40 text-white'
    } else {
      // Training 08-14 (Work)
      if (hour >= 8 && hour < 14) return 'bg-brand-blue border-brand-blue/40 text-white'
      // Watch 16-20 (Work)
      if (hour >= 16 && hour < 20) return 'bg-brand-coral border-brand-coral/40 text-white'
      // Drill 21 to (21 + cadetDrill)
      if (hour >= 21 && hour < 21 + cadetDrill) return 'bg-amber-600 border-amber-500/40 text-white'
    }
    // Rest hours
    return 'bg-slate-950 border-slate-800 text-slate-600'
  }

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col font-sans text-left animate-in zoom-in-95 duration-200">
      
      {/* Mini-game header */}
      <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-4">
        <div>
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-gold animate-pulse" />
            MLC 2006 Rest Hours Audit
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">
            <strong>Regulation 2.3:</strong> Seafarers must have at least <strong>10 hours of rest</strong> in any 24-hour period to prevent fatigue.
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold ${
          isCompliant 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-brand-coral animate-pulse'
        }`}>
          {isCompliant ? '✔ LOG COMPLIANT' : '⚠ MLC VIOLATION'}
        </div>
      </div>

      {/* ── TIMELINE TRACKS ────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-6">
        
        {/* CHIEF MATE TRACK */}
        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wide">Chief Mate (Watchkeeper)</span>
            <span className={`text-[10px] font-mono font-bold ${mateCompliant ? 'text-emerald-400' : 'text-brand-coral'}`}>
              Rest: {mateRestHours}h / Work: {mateWorkHours}h {mateCompliant ? '(Compliant)' : '(Fatigue Risk!)'}
            </span>
          </div>
          
          {/* 24-hour blocks */}
          <div className="grid grid-cols-24 gap-0.5 border border-slate-800 rounded overflow-hidden h-7">
            {Array.from({ length: 24 }).map((_, h) => (
              <div 
                key={h} 
                className={`flex items-center justify-center text-[9px] border-r border-slate-900/40 last:border-0 ${getHourClass(h, 'mate')}`}
                title={`Hour ${h}:00`}
              >
                {h}
              </div>
            ))}
          </div>
          
          {/* Legend indicators */}
          <div className="flex gap-4 mt-2 text-[9px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-coral rounded" />Watch (6h)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded" />Maintenance ({mateMaintenance}h)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-600 rounded" />Drill Overtime ({mateOvertime}h)</span>
          </div>
        </div>

        {/* DECK CADET TRACK */}
        <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wide">Deck Cadet (Trainee)</span>
            <span className={`text-[10px] font-mono font-bold ${cadetCompliant ? 'text-emerald-400' : 'text-slate-400'}`}>
              Rest: {cadetRestHours}h / Work: {cadetWorkHours}h {cadetCompliant ? '(Compliant)' : '(Fatigue Risk!)'}
            </span>
          </div>
          
          {/* 24-hour blocks */}
          <div className="grid grid-cols-24 gap-0.5 border border-slate-800 rounded overflow-hidden h-7">
            {Array.from({ length: 24 }).map((_, h) => (
              <div 
                key={h} 
                className={`flex items-center justify-center text-[9px] border-r border-slate-900/40 last:border-0 ${getHourClass(h, 'cadet')}`}
                title={`Hour ${h}:00`}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Legend indicators */}
          <div className="flex gap-4 mt-2 text-[9px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-blue rounded" />Training (6h)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-brand-coral rounded" />Watch (4h)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-600 rounded" />Auxiliary Drill ({cadetDrill}h)</span>
          </div>
        </div>
      </div>

      {/* ── ACTION CONTROLS ────────────────────────────────────────────────── */}
      <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 mb-6">
        <h3 className="text-xs font-bold text-slate-300 uppercase mb-3 flex items-center gap-1">
          <TrendingDown className="h-4 w-4 text-brand-gold" />
          Rectification Controls (Adjust Work Shifts)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => setMateMaintenance(prev => (prev === 6 ? 2 : 6))}
            className={`px-3 py-2 text-left rounded-xl border text-[11px] font-bold transition-all duration-150 cursor-pointer ${
              mateMaintenance === 2
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-white'
            }`}
          >
            <div className="font-mono text-[9px] text-slate-400">CHIEF MATE Maintenance:</div>
            {mateMaintenance === 2 ? 'Reduced to 2h (Rest +4h)' : 'Delegate Cleaning Tasks (Reduce to 2h)'}
          </button>

          <button
            onClick={() => setMateOvertime(prev => (prev === 4 ? 0 : 4))}
            className={`px-3 py-2 text-left rounded-xl border text-[11px] font-bold transition-all duration-150 cursor-pointer ${
              mateOvertime === 0
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-white'
            }`}
          >
            <div className="font-mono text-[9px] text-slate-400">CHIEF MATE Overtime:</div>
            {mateOvertime === 0 ? 'Cancelled (Rest +4h)' : 'Cancel Evening Drill (Cancel overtime)'}
          </button>

          <button
            onClick={() => setCadetDrill(prev => (prev === 2 ? 0 : 2))}
            className={`px-3 py-2 text-left rounded-xl border text-[11px] font-bold transition-all duration-150 cursor-pointer ${
              cadetDrill === 0
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-white'
            }`}
          >
            <div className="font-mono text-[9px] text-slate-400">CADET Auxiliary Drill:</div>
            {cadetDrill === 0 ? 'Excused (Rest +2h)' : 'Excuse from Auxiliary Drill (Excuse 2h)'}
          </button>
        </div>
      </div>

      {/* ── VERIFY FOOTER ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-[10px] text-slate-500 max-w-sm">
          * Reducing shifts moves maintenance/drills to anchor watches next port, keeping crew rested.
        </span>
        <button
          onClick={handleVerify}
          className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy font-extrabold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-large flex items-center gap-2"
        >
          Verify & Sign Logs
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
