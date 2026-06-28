import React from 'react'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Data'
import { mockLeaderboard, mockUser } from '@/mock/db'
import { Trophy, Medal, Star } from 'lucide-react'
import { formatScore } from '@/utils/formatters'
import { cn } from '@/utils/formatters'

export const Leaderboard: React.FC = () => {
  const headers = ['Rank', 'Crew Member', 'Rank / Title', 'Score (PTS)', 'Badges Earned']

  const rows = mockLeaderboard.map((entry) => {
    const isCurrentUser = entry.name === mockUser.name
    
    // Add visual indicator for rank medals
    const rankCell = (
      <div className="flex items-center gap-1.5 font-mono font-bold">
        {entry.rank === 1 ? (
          <Trophy className="h-4 w-4 text-brand-gold shrink-0" />
        ) : entry.rank === 2 ? (
          <Medal className="h-4 w-4 text-slate-400 shrink-0" />
        ) : entry.rank === 3 ? (
          <Medal className="h-4 w-4 text-amber-600 shrink-0" />
        ) : null}
        <span className={cn(entry.rank <= 3 ? 'text-brand-navy' : 'text-slate-500')}>{entry.rank}</span>
      </div>
    )

    const nameCell = (
      <div className="flex items-center gap-3 select-none">
        <div className={cn(
          'h-7 w-7 rounded-[8px] flex items-center justify-center font-bold text-xs uppercase shadow-small shrink-0',
          isCurrentUser ? 'bg-brand-gold text-brand-navy' : 'bg-slate-100 text-slate-600'
        )}>
          {entry.avatar}
        </div>
        <span className={cn('text-sm font-semibold truncate', isCurrentUser ? 'text-brand-blue font-bold' : 'text-brand-navy')}>
          {entry.name} {isCurrentUser && '(You)'}
        </span>
      </div>
    )

    const titleCell = (
      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200/40">
        {entry.rankTitle}
      </span>
    )

    const scoreCell = (
      <span className="font-mono font-bold text-brand-navy text-sm">
        {formatScore(entry.score)}
      </span>
    )

    const badgesCell = (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600">
        <Star className="h-4 w-4 text-brand-gold shrink-0 fill-brand-gold/10" />
        <span>{entry.badgeCount} Badges</span>
      </div>
    )

    return [rankCell, nameCell, titleCell, scoreCell, badgesCell]
  })

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="font-h1 text-brand-navy">Vessel Leaderboard</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
          Real-time compliance scorecard for the crew of the <strong className="text-brand-navy">M/V Sea Guardian</strong>. High scores indicate exceptional safety checklist accuracy and zero audit deficiencies.
        </p>
      </div>

      {/* Top 3 podium mock display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2">
        {/* Rank 2 */}
        <Card variant="standard" className="p-4 flex items-center justify-between border-t-2 border-slate-300 bg-white/70 order-2 sm:order-1 shadow-small">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">2</div>
            <div>
              <h4 className="font-h4 text-sm text-brand-navy truncate max-w-[120px]">{mockLeaderboard[1].name}</h4>
              <span className="font-mono text-[9px] text-slate-400 uppercase font-semibold">{formatScore(mockLeaderboard[1].score)} PTS</span>
            </div>
          </div>
          <Medal className="h-5 w-5 text-slate-300" />
        </Card>

        {/* Rank 1 */}
        <Card variant="elevated" className="p-5 flex items-center justify-between border-t-4 border-brand-gold bg-gradient-to-br from-amber-50/20 to-white order-1 sm:order-2 shadow-medium relative -top-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-brand-gold/10 flex items-center justify-center font-bold text-brand-gold">1</div>
            <div>
              <h4 className="font-h4 text-sm text-brand-navy truncate max-w-[120px] font-bold">{mockLeaderboard[0].name}</h4>
              <span className="font-mono text-[9px] text-brand-gold uppercase font-bold">{formatScore(mockLeaderboard[0].score)} PTS</span>
            </div>
          </div>
          <Trophy className="h-6 w-6 text-brand-gold animate-bounce" />
        </Card>

        {/* Rank 3 */}
        <Card variant="standard" className="p-4 flex items-center justify-between border-t-2 border-amber-600/40 bg-white/70 order-3 shadow-small">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-amber-700/80">3</div>
            <div>
              <h4 className="font-h4 text-sm text-brand-navy truncate max-w-[120px]">{mockLeaderboard[2].name}</h4>
              <span className="font-mono text-[9px] text-slate-400 uppercase font-semibold">{formatScore(mockLeaderboard[2].score)} PTS</span>
            </div>
          </div>
          <Medal className="h-5 w-5 text-amber-600/70" />
        </Card>
      </div>

      {/* Main Leaderboard Table */}
      <Table headers={headers} rows={rows} />
    </div>
  )
}
