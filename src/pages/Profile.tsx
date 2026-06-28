import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge as StatusBadge } from '@/components/ui/Feedback'
import { mockBadges, mockUser } from '@/mock/db'
import {
  ShieldAlert,
  BookOpen,
  Droplet,
  Anchor,
  Mail,
  Award,
  Calendar,
  Lock,
  UserCheck,
} from 'lucide-react'
import { formatDate } from '@/utils/formatters'
import { cn } from '@/utils/formatters'

// Icon lookup dictionary
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  BookOpen,
  Droplet,
  Anchor,
}

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="font-h1 text-brand-navy">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          Manage credentials, training logs, certificates, and safety achievements earned during missions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Info */}
        <Card variant="standard" className="p-6 space-y-6 bg-white border-slate-200/80 shadow-small h-fit">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-16 w-16 rounded-[16px] bg-brand-gold text-brand-navy flex items-center justify-center font-bold text-2xl shadow-medium select-none">
              {mockUser.avatar}
            </div>
            <div>
              <h3 className="font-h3 text-brand-navy">{mockUser.name}</h3>
              <span className="font-mono text-[10px] uppercase font-bold text-brand-blue block mt-0.5 tracking-wider">
                {mockUser.rank}
              </span>
            </div>
            <StatusBadge variant="gold">CAPTAIN OF THE FLEET</StatusBadge>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block font-mono">EMAIL ADDRESS</span>
                <span className="text-slate-700 font-semibold">{mockUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Award className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">LICENSE ID</span>
                <span className="text-slate-700 font-semibold">MT-NET-2026-9875</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UserCheck className="h-4 w-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">COMPLIANCE STANDING</span>
                <span className="text-emerald-600 font-bold uppercase font-mono">GRADE A (EXCELLENT)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Badges and Achievements Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-h3 text-brand-navy flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-blue" />
            Compliance Achievements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockBadges.map((badge) => {
              const IconComponent = iconMap[badge.iconName] || Anchor
              const isUnlocked = badge.unlockedAt !== null

              return (
                <Card
                  key={badge.id}
                  variant={isUnlocked ? 'standard' : 'standard'}
                  className={cn(
                    'p-5 border flex gap-4 items-start h-full text-left transition-all',
                    isUnlocked
                      ? 'bg-white border-slate-200/80 shadow-small'
                      : 'bg-slate-50/50 border-slate-200/50 opacity-60'
                  )}
                >
                  <div className={cn(
                    'p-3 rounded-[12px] border shrink-0',
                    isUnlocked
                      ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                      : 'bg-slate-200 text-slate-400 border-slate-300/40'
                  )}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={cn('text-sm font-semibold truncate', isUnlocked ? 'text-brand-navy' : 'text-slate-500')}>
                        {badge.title}
                      </h4>
                      {!isUnlocked && <Lock className="h-3 w-3 text-slate-400 shrink-0" />}
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-normal">{badge.description}</p>
                    
                    {isUnlocked ? (
                      <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-600 font-bold uppercase mt-2">
                        <Calendar className="h-3 w-3" />
                        <span>Unlocked: {formatDate(badge.unlockedAt)}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-400 uppercase font-semibold block mt-2">
                        LOCKED
                      </span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
