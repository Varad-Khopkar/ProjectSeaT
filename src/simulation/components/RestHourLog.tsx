import React, { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Clock, X, Check } from 'lucide-react'
import { cn } from '@/utils/formatters'

interface RestLogItem {
  id: string
  officer: string
  rank: string
  hoursRest24h: number
  longestRestPeriod: number
  intervalsCount: number
  restPeriods: string
  complianceStatus: 'compliant' | 'non-compliant'
  explanation: string
}

export const RestHourLog: React.FC = () => {
  const { state, completeRestHourAudit, toggleRestHourLog } = useSimulation()
  const [selectedLogs, setSelectedLogs] = useState<string[]>([])

  if (!state.activeRestHourLog) return null

  const logs: RestLogItem[] = [
    {
      id: 'chief-mate',
      officer: 'N. Petrov',
      rank: 'Chief Officer',
      hoursRest24h: 11,
      longestRestPeriod: 7,
      intervalsCount: 2,
      restPeriods: '00:00 - 07:00 (7h) & 13:00 - 17:00 (4h)',
      complianceStatus: 'compliant',
      explanation: 'Complies with MLC/STCW rules. Rest is 10h+ total, maximum 2 rest periods, with one continuous block >= 6h.'
    },
    {
      id: 'deck-cadet',
      officer: 'S. Al-Farsi',
      rank: 'Deck Cadet',
      hoursRest24h: 8, // Non-compliant! (MLC requires min 10h)
      longestRestPeriod: 4, // Non-compliant! (MLC requires at least one block >= 6h)
      intervalsCount: 3, // Non-compliant! (MLC requires max 2 periods)
      restPeriods: '08:00 - 12:00 (4h), 16:00 - 18:00 (2h), & 22:00 - 00:00 (2h)',
      complianceStatus: 'non-compliant',
      explanation: 'NON-CONFORMITY. Total rest hours is only 8h (minimum required is 10h). No single continuous rest period reaches 6h. Watchkeeper fatigue risks are high.'
    }
  ]

  const handleToggleLog = (id: string) => {
    setSelectedLogs(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSubmitAudit = () => {
    const isCadetFlagged = selectedLogs.includes('deck-cadet')
    const isMateFlagged = selectedLogs.includes('chief-mate')

    if (isCadetFlagged && !isMateFlagged) {
      // Success: flagged only the non-compliant cadet log
      completeRestHourAudit(15, 20)
    } else {
      // Fail: incorrect audit choice
      completeRestHourAudit(-20, 0)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-large border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="bg-brand-navy p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Clock className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-h3 text-lg font-bold">MLC 2006 Rest Hours Audit</h3>
              <p className="text-xs text-slate-300">Audit the crew watchkeeping sheets to identify fatigue infractions.</p>
            </div>
          </div>
          <button 
            onClick={() => toggleRestHourLog(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs text-slate-600">
            <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider block">MLC Rest Hours Limits (Rule 2.3)</span>
            <ul className="list-disc list-inside space-y-1">
              <li>Minimum **10 hours of rest** in any 24-hour period.</li>
              <li>Minimum **77 hours of rest** in any 7-day period.</li>
              <li>Rest hours may be divided into maximum **2 periods**, one of which must be at least **6 hours** long.</li>
              <li>The interval between consecutive rest periods shall not exceed **14 hours**.</li>
            </ul>
          </div>

          <div className="space-y-4">
            {logs.map((log) => {
              const isChecked = selectedLogs.includes(log.id)
              return (
                <div 
                  key={log.id}
                  onClick={() => handleToggleLog(log.id)}
                  className={cn(
                    "p-4 border rounded-[16px] cursor-pointer transition-all duration-200 hover:shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center",
                    isChecked 
                      ? "border-brand-coral bg-brand-coral/[0.02]" 
                      : "border-slate-200 bg-white"
                  )}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{log.officer}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-semibold">{log.rank}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      <strong>Rest periods:</strong> {log.restPeriods}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Rest in 24h</span>
                        <span className={cn(
                          "text-sm font-bold",
                          log.hoursRest24h < 10 ? "text-brand-coral" : "text-slate-700"
                        )}>{log.hoursRest24h} hrs</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Longest Block</span>
                        <span className={cn(
                          "text-sm font-bold",
                          log.longestRestPeriod < 6 ? "text-brand-coral" : "text-slate-700"
                        )}>{log.longestRestPeriod} hrs</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Rest Splits</span>
                        <span className={cn(
                          "text-sm font-bold",
                          log.intervalsCount > 2 ? "text-brand-coral" : "text-slate-700"
                        )}>{log.intervalsCount} split</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0 self-stretch justify-between md:justify-center">
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors self-end",
                      isChecked ? "border-brand-coral bg-brand-coral text-white" : "border-slate-300"
                    )}>
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">Click to flag as non-compliant</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-400">
            {selectedLogs.length} logs flagged for rest-hour violations
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toggleRestHourLog(false)}
              className="px-4 py-2 border border-slate-200 rounded-[12px] text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAudit}
              className="px-5 py-2 bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-semibold rounded-[12px] shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Submit Logs Report
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
