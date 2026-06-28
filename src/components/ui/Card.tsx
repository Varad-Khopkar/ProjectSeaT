import React, { useState } from 'react'

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
  const [hovered, setHovered] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setHovered(true)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setHovered(false)
  }

  const baseStyle = 'relative bg-white border border-slate-200/80 rounded-[16px] overflow-hidden transition-all duration-300 group'
  
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
      onMouseEnter={(e) => {
        if (variant === 'interactive') handleMouseEnter(e)
        if (props.onMouseEnter) props.onMouseEnter(e)
      }}
      onMouseLeave={(e) => {
        if (variant === 'interactive') handleMouseLeave(e)
        if (props.onMouseLeave) props.onMouseLeave(e)
      }}
      {...props}
    >
      {variant === 'interactive' && (
        <div 
          className="absolute inset-0 bg-brand-navy pointer-events-none transition-all duration-500 ease-out"
          style={{
            clipPath: hovered 
              ? `circle(150% at ${coords.x}px ${coords.y}px)` 
              : `circle(0% at ${coords.x}px ${coords.y}px)`,
            zIndex: 0
          }}
        />
      )}
      <div className={variant === 'interactive' ? 'relative z-10 w-full h-full' : 'w-full h-full'}>
        {children}
      </div>
    </div>
  )
}
