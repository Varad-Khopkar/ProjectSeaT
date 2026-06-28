import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Inbox, ChevronLeft, ChevronRight } from 'lucide-react'

// 1. Table
interface TableProps {
  headers: string[]
  rows: (React.ReactNode | string)[][]
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-200/80 rounded-[12px] bg-white shadow-small font-sans text-xs">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200/80">
            {headers.map((h, idx) => (
              <th key={idx} className="px-5 py-3.5 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-5 py-4 font-normal">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 2. Timeline
interface TimelineProps {
  steps: { title: string; desc: string; date: string; status: 'completed' | 'active' | 'upcoming' }[]
}

export const Timeline: React.FC<TimelineProps> = ({ steps }) => {
  return (
    <div className="w-full flex flex-col gap-6 font-sans text-xs text-left relative pl-6 border-l border-slate-200/80">
      {steps.map((step, idx) => {
        const dotStyles = {
          completed: 'bg-brand-blue border-brand-blue ring-4 ring-brand-blue/10',
          active: 'bg-white border-brand-gold ring-4 ring-brand-gold/30',
          upcoming: 'bg-white border-slate-200',
        }

        return (
          <div key={idx} className="relative flex flex-col gap-1">
            {/* Timeline Dot */}
            <div className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 transition-all shrink-0 ${dotStyles[step.status]}`} />
            
            <div className="flex items-baseline justify-between gap-4">
              <h5 className={`font-semibold text-sm ${step.status === 'active' ? 'text-brand-blue' : 'text-brand-navy'}`}>
                {step.title}
              </h5>
              <span className="font-mono text-[10px] text-slate-400 font-semibold">{step.date}</span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
          </div>
        )
      })}
    </div>
  )
}

// 3. Accordion
interface AccordionItem {
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
}

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="w-full border border-slate-200/80 rounded-[12px] bg-white overflow-hidden divide-y divide-slate-100 shadow-small font-sans">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx
        return (
          <div key={idx} className="flex flex-col">
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="flex items-center justify-between p-4 text-left font-medium text-brand-navy hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              <span className="text-sm font-semibold">{item.title}</span>
              {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
            </button>
            <div
              className={`transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-96 border-t border-slate-50 p-4 bg-slate-50/30' : 'max-h-0'}`}
            >
              <div className="text-xs text-slate-600 leading-relaxed">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// 4. Empty State
interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 text-center font-sans border border-dashed border-slate-200 rounded-[16px] bg-slate-50/40">
      <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
        <Inbox className="h-8 w-8" />
      </div>
      <h4 className="font-h4 text-brand-navy font-semibold text-sm mb-1">{title}</h4>
      <p className="text-slate-500 text-xs max-w-sm mb-5 leading-normal">{description}</p>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// 5. Pagination
interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ current, total, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 font-sans text-xs">
      <button
        onClick={() => current > 1 && onChange(current - 1)}
        disabled={current === 1}
        className="p-2 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => {
        const isActive = page === current
        return (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`h-9 w-9 rounded-[8px] font-mono font-bold flex items-center justify-center cursor-pointer focus-ring border transition-all ${isActive ? 'bg-brand-blue border-brand-blue text-white shadow-small' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => current < total && onChange(current + 1)}
        disabled={current === total}
        className="p-2 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

// 6. Skeleton Loader
export const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-3.5 animate-pulse">
      <div className="h-6 bg-slate-200 rounded-[6px] w-2/5" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded-[6px] w-full" />
        <div className="h-4 bg-slate-200 rounded-[6px] w-11/12" />
        <div className="h-4 bg-slate-200 rounded-[6px] w-4/5" />
      </div>
    </div>
  )
}
