import React from 'react'

interface MainContainerProps {
  children: React.ReactNode
  className?: string
}

export const MainContainer: React.FC<MainContainerProps> = ({ children, className = '' }) => {
  return (
    <main className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 flex-1 ${className}`}>
      {children}
    </main>
  )
}
