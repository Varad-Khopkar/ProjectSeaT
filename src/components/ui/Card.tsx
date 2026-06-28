import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'elevated' | 'interactive'
  padding?: 'none' | 'compact' | 'standard'
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  padding = 'standard',
  className = '',
  ...props
}) => {
  const baseStyle = 'bg-white border border-slate-200/80 rounded-[16px] overflow-hidden transition-all duration-200'
  
  const variants = {
    standard: 'shadow-small',
    elevated: 'shadow-medium',
    interactive: 'shadow-small hover:shadow-medium hover:border-brand-blue/50 cursor-pointer active:scale-[0.99]',
  }

  const paddings = {
    none: '',
    compact: 'p-4',
    standard: 'p-6 sm:p-8',
  }

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
