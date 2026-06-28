import React from 'react'

interface SectionContainerProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
}) => {
  return (
    <section className={`bg-white border border-slate-200/80 rounded-[16px] p-6 sm:p-8 shadow-small ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <h2 className="font-h2 text-brand-navy">{title}</h2>
          {subtitle && <p className="font-small text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
      <div className="w-full">{children}</div>
    </section>
  )
}
