import React from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProgressBar, Badge } from '@/components/ui/Feedback'
import { useApp } from '@/contexts/AppContext'
import { mockModules, mockUser } from '@/mock/db'
import { Trophy, Anchor, CheckCircle, Bell, ArrowRight, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatScore } from '@/utils/formatters'

export const Home: React.FC = () => {
  const { notifications } = useApp()

  // Find PSC module for active resume block
  const activeModule = mockModules.find((m) => m.id === 'mod-1') || mockModules[0]
  const completedCount = mockModules.filter((m) => m.status === 'completed').length

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-brand-navy border border-brand-blue/30 rounded-[20px] p-6 text-brand-pearl relative overflow-hidden shadow-medium">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Anchor className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-xl">
          <Badge variant="gold">M/V SEA GUARDIAN</Badge>
          <h1 className="font-h1 text-white mt-3">Welcome Aboard, {mockUser.name}</h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            You are currently serving as <strong className="text-white">{mockUser.rank}</strong>. Port State Control (PSC) is active at the current harbor anchorage. Keep checklists up to code.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/modules">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Go to Training Modules
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="border-brand-blue/60 text-white hover:bg-brand-blue/20">
                View Credentials
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="standard" className="flex items-center gap-4 p-5">
          <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-[12px] border border-brand-gold/20 shrink-0">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">TOTAL SCORE</span>
            <h3 className="font-h3 text-brand-navy mt-0.5">{formatScore(mockUser.totalScore)} PTS</h3>
          </div>
        </Card>

        <Card variant="standard" className="flex items-center gap-4 p-5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[12px] border border-emerald-100 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">MISSIONS COMPLETED</span>
            <h3 className="font-h3 text-brand-navy mt-0.5">{completedCount} / {mockModules.length}</h3>
          </div>
        </Card>

        <Card variant="standard" className="flex items-center gap-4 p-5">
          <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-[12px] border border-brand-blue/20 shrink-0">
            <Anchor className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">RANK STANDING</span>
            <h3 className="font-h3 text-brand-navy mt-0.5">{mockUser.rankTitle}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active mission checklist card */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-h3 text-brand-navy">Active Training Mission</h3>
          <Card variant="elevated" className="p-6 border-l-4 border-brand-gold space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-brand-gold/15 text-brand-gold px-2.5 py-0.5 rounded-full uppercase">
                  {activeModule.code} • IN PROGRESS
                </span>
                <h4 className="font-h4 text-brand-navy mt-2.5">{activeModule.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeModule.description}</p>
              </div>
            </div>

            <div className="pt-2">
              <ProgressBar value={activeModule.progress} label="Mission Progress Checklist" showValueLabel={true} />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                Estimated duration: {activeModule.duration}
              </span>
              <Link to="/modules">
                <Button size="sm">Resume Checklists</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Dashboard alerts feed */}
        <div className="space-y-4">
          <h3 className="font-h3 text-brand-navy">Vessel Safety Feed</h3>
          <Card variant="standard" className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">ALERTS FEED</span>
              <Bell className="h-4 w-4 text-slate-400" />
            </div>
            
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n.id} className="flex gap-2.5 items-start text-xs border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                  {n.type === 'warning' ? (
                    <ShieldAlert className="h-4.5 w-4.5 text-brand-gold shrink-0 mt-0.5" />
                  ) : n.type === 'error' ? (
                    <ShieldAlert className="h-4.5 w-4.5 text-brand-coral shrink-0 mt-0.5" />
                  ) : (
                    <Anchor className="h-4.5 w-4.5 text-brand-blue shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h5 className="font-semibold text-brand-navy leading-tight">{n.message}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{n.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
