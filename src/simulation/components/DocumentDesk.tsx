import React, { useState, useEffect } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { Clipboard, X, Check, FileText } from 'lucide-react'
import { cn } from '@/utils/formatters'

interface CertItem {
  id: string
  name: string
  reference: string
  expiryDate: string
  status: 'valid' | 'expired'
  isDeficient: boolean
  details: string
}

export const DocumentDesk: React.FC = () => {
  const { state, completeDocumentAudit, toggleDocumentDesk } = useSimulation()
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.activeDocumentDesk) {
        toggleDocumentDesk(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.activeDocumentDesk, toggleDocumentDesk])
  
  if (!state.activeDocumentDesk) return null

  const certificates: CertItem[] = [
    {
      id: 'manning',
      name: 'Minimum Safe Manning Certificate',
      reference: 'IMO Res. A.1047(27)',
      expiryDate: '12 Nov 2028',
      status: 'valid',
      isDeficient: false,
      details: 'States required crew sizes and ranks. Current crew count complies.'
    },
    {
      id: 'iopp',
      name: 'International Oil Pollution Prevention (IOPP) Certificate',
      reference: 'MARPOL Annex I, Reg 6',
      expiryDate: '14 May 2026', // Expired!
      status: 'expired',
      isDeficient: true,
      details: 'EXPIRED. Under MARPOL Reg 6, statutory surveys must be active.'
    },
    {
      id: 'solas-const',
      name: 'Cargo Ship Safety Construction Certificate',
      reference: 'SOLAS Reg I/10',
      expiryDate: '28 Aug 2029',
      status: 'valid',
      isDeficient: false,
      details: 'Valid structural build construction. Surveyed annually.'
    },
    {
      id: 'gmdss-op',
      name: 'Chief Mate GMDSS Operator Endorsement',
      reference: 'STCW Reg IV/2',
      expiryDate: '01 Jun 2026', // Expired!
      status: 'expired',
      isDeficient: true,
      details: 'EXPIRED. GMDSS stations must be operated by certified personnel.'
    }
  ]

  const handleToggleIssue = (id: string) => {
    setSelectedIssues(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSubmitAudit = () => {
    // Correct deficiencies are 'iopp' and 'gmdss-op'
    const correctIdentified = selectedIssues.includes('iopp') && selectedIssues.includes('gmdss-op')
    const falseIdentified = selectedIssues.includes('manning') || selectedIssues.includes('solas-const')

    if (correctIdentified && !falseIdentified) {
      // Success: spotted correct deficiencies, no false alarms
      completeDocumentAudit(15, 20)
    } else {
      // Failed audit
      completeDocumentAudit(-20, 0)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-large border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="bg-brand-navy p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Clipboard className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-h3 text-lg font-bold">Statutory Documentation Desk</h3>
              <p className="text-xs text-slate-300">Inspect the ship certificates and identify those with compliance issues.</p>
            </div>
          </div>
          <button 
            onClick={() => toggleDocumentDesk(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">Instructions</span>
            <p className="text-sm text-slate-600 leading-relaxed">
              Check the expiry dates and reference standards below. Select any certificate that is **expired** or constitutes a compliance infraction, then submit your report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => {
              const isChecked = selectedIssues.includes(cert.id)
              return (
                <div 
                  key={cert.id}
                  onClick={() => handleToggleIssue(cert.id)}
                  className={cn(
                    "p-4 border rounded-[16px] cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-sm",
                    isChecked 
                      ? "border-brand-coral bg-brand-coral/[0.02]" 
                      : "border-slate-200 bg-white"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{cert.name}</h4>
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                        isChecked ? "border-brand-coral bg-brand-coral text-white" : "border-slate-300"
                      )}>
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <span className="text-slate-400">Reference:</span>
                        <p className="font-medium text-slate-600 font-mono truncate">{cert.reference}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Expiry Date:</span>
                        <p className="font-medium text-slate-600 font-mono">{cert.expiryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{cert.details}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      cert.status === 'valid' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                      {cert.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-400">
            {selectedIssues.length} certificate(s) flagged for deficiency
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toggleDocumentDesk(false)}
              className="px-4 py-2 border border-slate-200 rounded-[12px] text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAudit}
              className="px-5 py-2 bg-brand-navy hover:bg-brand-navy/95 text-white text-sm font-semibold rounded-[12px] shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Submit Audit Report
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
