import React, { useEffect } from 'react'
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react'

// 1. Alert
interface AlertProps {
  variant?: 'success' | 'info' | 'warning' | 'error'
  title: string
  description?: string
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, description, onClose }) => {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
  }

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    error: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
  }

  return (
    <div className={`flex gap-3 p-4 border rounded-[12px] shadow-small transition-all font-sans text-sm ${styles[variant]}`}>
      {icons[variant]}
      <div className="flex-1 text-left">
        <h5 className="font-semibold leading-tight">{title}</h5>
        {description && <p className="mt-1 text-xs opacity-90">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="p-0.5 hover:bg-slate-200/50 rounded-[4px] cursor-pointer shrink-0 align-top">
          <X className="h-4 w-4 text-current" />
        </button>
      )}
    </div>
  )
}

// 2. Badge
interface BadgeProps {
  children: React.ReactNode
  variant?: 'navy' | 'blue' | 'gold' | 'coral'
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue' }) => {
  const styles = {
    navy: 'bg-brand-navy/10 text-brand-navy',
    blue: 'bg-brand-blue/10 text-brand-blue',
    gold: 'bg-brand-gold/15 text-brand-gold bg-amber-50 border border-brand-gold/30',
    coral: 'bg-brand-coral/10 text-brand-coral',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold font-mono tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  )
}

// 3. Status Chip
interface StatusChipProps {
  status: 'passed' | 'pending' | 'failed' | 'warning'
  label: string
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label }) => {
  const styles = {
    passed: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    pending: 'bg-slate-50 border-slate-200 text-slate-600',
    failed: 'bg-rose-50 border-rose-200 text-rose-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-sans font-medium uppercase tracking-wide ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${status === 'passed' ? 'bg-emerald-500' : status === 'pending' ? 'bg-slate-400' : status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
      {label}
    </span>
  )
}

// 4. Toast
interface ToastProps {
  message: string
  description?: string
  visible: boolean
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, description, visible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose, duration])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-start gap-3 bg-slate-900 border border-slate-800 text-white rounded-[12px] p-4 shadow-large w-80 animate-slide-in">
      <Info className="h-5 w-5 text-brand-gold mt-0.5 shrink-0" />
      <div className="flex-1 text-left font-sans text-xs">
        <h5 className="font-semibold text-slate-100">{message}</h5>
        {description && <p className="text-slate-400 mt-1">{description}</p>}
      </div>
      <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded-[4px] cursor-pointer text-slate-400 hover:text-white shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// 5. Tooltip
interface TooltipProps {
  text: string
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group inline-block font-sans">
      {children}
      <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] rounded-[6px] shadow-medium opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </div>
    </div>
  )
}

// 6. Modal
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footerActions?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footerActions }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-xs" onClick={onClose} />
      
      {/* Container */}
      <div className="bg-white border border-slate-200 rounded-[20px] shadow-large w-full max-w-lg overflow-hidden animate-scale-in relative z-10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 shrink-0">
          <h3 className="font-h3 text-brand-navy">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-[8px] cursor-pointer transition-colors text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-left font-sans text-sm text-slate-600">
          {children}
        </div>
        {footerActions && (
          <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  )
}

// 7. Progress Bar
interface ProgressBarProps {
  value: number // 0 to 100
  label?: string
  showValueLabel?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, showValueLabel = false }) => {
  const percentage = Math.min(100, Math.max(0, value))
  return (
    <div className="w-full flex flex-col gap-1.5 font-sans">
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          {label && <span>{label}</span>}
          {showValueLabel && <span className="font-mono text-brand-blue font-bold">{percentage}%</span>}
        </div>
      )}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
        <div
          className="bg-brand-gold h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
