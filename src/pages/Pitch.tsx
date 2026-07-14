import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowDown,
  Play,
  CheckCircle,
  Shield,
  Compass,
  RefreshCw,
  Sparkles,
  Activity,
  Users,
  Database
} from 'lucide-react'

const SLIDES_COUNT = 11

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  return prefersReducedMotion
}

export const Pitch: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const prefersReducedMotion = usePrefersReducedMotion()

  const slideTitles = [
    '01. Aboard the Job',
    '02. The Training Gap',
    '03. Existing Knowledge',
    '04. ProjectSeaT Stages',
    '05. The Core USP',
    '06. Content Metamorphosis',
    '07. Enterprise Scale',
    '08. Beyond Completion',
    '09. Minimal Sellable Product',
    '10. The Ultimate Vision',
    '11. Transform Now'
  ]

  const changeSlide = (nextIndex: number) => {
    if (nextIndex > activeSlide) {
      setDirection('forward')
    } else if (nextIndex < activeSlide) {
      setDirection('backward')
    }
    setActiveSlide(nextIndex)
  }

  const scrollToSlide = (index: number) => {
    changeSlide(index)
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        if (activeSlide < SLIDES_COUNT - 1) {
          changeSlide(activeSlide + 1)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        if (activeSlide > 0) {
          changeSlide(activeSlide - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSlide])

  // Handle wheel input with cooldown lock to prevent skipping
  useEffect(() => {
    let lastScrollTime = 0
    const cooldown = 900 // Cooldown to let transitions finish

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 20) return // Ignore tiny scrolling jitter
      
      const now = Date.now()
      if (now - lastScrollTime < cooldown) {
        e.preventDefault()
        return
      }

      if (e.deltaY > 0) {
        if (activeSlide < SLIDES_COUNT - 1) {
          e.preventDefault()
          changeSlide(activeSlide + 1)
          lastScrollTime = now
        }
      } else if (e.deltaY < 0) {
        if (activeSlide > 0) {
          e.preventDefault()
          changeSlide(activeSlide - 1)
          lastScrollTime = now
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [activeSlide])

  // Handle touch swipe navigation with cooldown
  useEffect(() => {
    let startY = 0
    let lastScrollTime = 0
    const cooldown = 900

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastScrollTime < cooldown) {
        e.preventDefault()
        return
      }

      const currentY = e.touches[0].clientY
      const diffY = startY - currentY

      if (Math.abs(diffY) > 50) {
        if (diffY > 0) {
          if (activeSlide < SLIDES_COUNT - 1) {
            e.preventDefault()
            changeSlide(activeSlide + 1)
            lastScrollTime = now
          }
        } else {
          if (activeSlide > 0) {
            e.preventDefault()
            changeSlide(activeSlide - 1)
            lastScrollTime = now
          }
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [activeSlide])

  const getSlideTransitionClass = (index: number) => {
    const isActive = activeSlide === index
    const isPast = index < activeSlide

    if (prefersReducedMotion) {
      return isActive ? 'opacity-100 scale-100 pointer-events-auto z-20' : 'opacity-0 scale-100 pointer-events-none z-10'
    }

    if (isActive) {
      return 'opacity-100 translate-y-0 pointer-events-auto z-20'
    }

    if (direction === 'forward') {
      if (isPast) {
        return 'opacity-0 -translate-y-16 pointer-events-none z-10'
      } else {
        return 'opacity-0 translate-y-16 pointer-events-none z-10 font-normal'
      }
    } else {
      if (isPast) {
        return 'opacity-0 -translate-y-16 pointer-events-none z-10'
      } else {
        return 'opacity-0 translate-y-16 pointer-events-none z-10'
      }
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0A192F] text-brand-pearl relative select-none">
      {/* 🧭 Presentation Progress HUD (Fixed Overlay) */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#0A192F]/80 to-transparent p-4 md:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center justify-center h-10 w-10 bg-brand-blue/30 border border-brand-blue/50 rounded-xl">
            <Compass className="h-6 w-6 text-brand-gold animate-spin-slow" />
          </div>
          <div>
            <h4 className="font-h4 text-white font-bold leading-none tracking-tight">ProjectSeaT</h4>
            <span className="text-[10px] text-brand-gold tracking-widest font-mono uppercase">Interactive Pitch</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="hidden md:flex items-center gap-4 w-1/3 max-w-[400px]">
          <div className="w-full bg-[#12355B]/60 h-1 rounded-full overflow-hidden border border-brand-blue/20">
            <div 
              className="bg-gradient-to-r from-brand-blue to-brand-gold h-full transition-all duration-500 ease-out"
              style={{ width: `${((activeSlide + 1) / SLIDES_COUNT) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {activeSlide + 1} / {SLIDES_COUNT}
          </span>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <Link to="/landing">
            <button className="px-4 py-2 bg-brand-navy/60 hover:bg-brand-blue/20 border border-brand-blue/40 hover:border-brand-blue text-xs font-semibold rounded-xl text-brand-pearl shadow-small transition-all duration-300">
              Exit Pitch
            </button>
          </Link>
        </div>
      </div>

      {/* 🔴 Floating Vertical Dot Navigation (Fixed Overlay) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
        {Array.from({ length: SLIDES_COUNT }).map((_, index) => {
          const isActive = activeSlide === index
          return (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className="group relative flex items-center animate-fade-in"
            >
              <div 
                className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-gold border-brand-gold scale-125 shadow-[0_0_8px_rgba(244,162,97,0.8)]' 
                    : 'bg-transparent border-slate-500 hover:border-brand-blue hover:bg-brand-blue/20'
                }`}
              />
              <span className="absolute left-6 px-2 py-1 bg-brand-navy/95 border border-brand-blue/30 rounded-lg text-[10px] font-semibold text-brand-pearl opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap shadow-medium">
                {slideTitles[index]}
              </span>
            </button>
          )
        })}
      </div>

      {/* 🕹️ Floating Previous / Next Controls (Fixed Overlay) */}
      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-3 pointer-events-auto">
        <button
          onClick={() => activeSlide > 0 && scrollToSlide(activeSlide - 1)}
          disabled={activeSlide === 0}
          className={`h-11 w-11 flex items-center justify-center border rounded-xl text-brand-pearl transition-all duration-300 ${
            activeSlide === 0
              ? 'opacity-30 cursor-not-allowed border-slate-700 bg-transparent'
              : 'bg-brand-navy/80 hover:bg-brand-blue border-brand-blue/40 shadow-small'
          }`}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          onClick={() => activeSlide < SLIDES_COUNT - 1 && scrollToSlide(activeSlide + 1)}
          disabled={activeSlide === SLIDES_COUNT - 1}
          className={`h-11 w-11 flex items-center justify-center border rounded-xl text-brand-pearl transition-all duration-300 ${
            activeSlide === SLIDES_COUNT - 1
              ? 'opacity-30 cursor-not-allowed border-slate-700 bg-transparent'
              : 'bg-brand-navy/80 hover:bg-brand-blue border-brand-blue/40 shadow-small'
          }`}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Global Ambient Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#0A192F]">
        <style>{`
          @keyframes pulseSlow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.15); }
          }
          @keyframes pulseSlower {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(1.2); }
          }
          @keyframes horizonShift {
            0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.7; }
            50% { transform: translateY(-5px) scaleY(1.05); opacity: 0.9; }
          }
          .animate-pulse-slow {
            animation: pulseSlow 15s ease-in-out infinite;
          }
          .animate-pulse-slower {
            animation: pulseSlower 22s ease-in-out infinite;
          }
          .animate-horizon-glow {
            animation: horizonShift 12s ease-in-out infinite;
          }
          
          /* Slide 3 connection line animation */
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
          .animate-dash-line {
            stroke-dasharray: 8 6;
            stroke-dashoffset: 100;
            animation: dash 8s linear infinite;
          }
        `}</style>
        
        {/* Ocean glow lights */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-blue/5 blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-gold/3 blur-[140px] animate-pulse-slower pointer-events-none" />
        
        {/* Chart pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Ambient Horizon Glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-coral/5 via-[#12355B]/10 to-transparent opacity-80 animate-horizon-glow" />
      </div>

      {/* 🚀 Main Fullscreen Slides Container */}
      <div className="h-full w-full relative overflow-hidden z-10" id="slides-viewport">
        
        {/* SLIDE 0: Hero / Onboarding */}
        <section 
          data-slide-index="0"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 overflow-hidden bg-radial from-[#0d2b45] to-[#0A192F] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(0)
          }`}
        >
          <div className="max-w-4xl text-center z-10">
            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-full text-xs font-mono uppercase tracking-widest mb-6 transition-all duration-700 transform ${
              activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              <Sparkles className="h-3 w-3 animate-pulse" /> Reimagining Seafarer Learning
            </div>
            
            <h1 className="font-display text-white text-4xl md:text-6xl font-extrabold leading-tight">
              <span className={`inline-block transition-all duration-700 transform ${
                activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[300ms]`}>
                Transforming Maritime Training
              </span>
              <br />
              <span className={`inline-block bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent transition-all duration-700 transform ${
                activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[550ms]`}>
                Into Interactive Experience
              </span>
            </h1>
            
            <p className={`text-slate-300 font-body-lg mt-6 max-w-2xl mx-auto leading-relaxed transition-all duration-700 transform ${
              activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[800ms]`}>
              Maritime training is practical. The way it is delivered should be too.
            </p>
            <p className={`text-slate-400 font-body mt-4 max-w-2xl mx-auto leading-relaxed transition-all duration-700 transform ${
              activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[1050ms]`}>
              ProjectSeaT transforms existing training content into interactive, decision-based learning experiences.
            </p>
            
            <div className={`mt-10 flex flex-wrap justify-center gap-4 transition-all duration-700 transform ${
              activeSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[1300ms]`}>
              <button 
                onClick={() => scrollToSlide(1)}
                className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/80 text-white font-semibold rounded-xl flex items-center gap-2 shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Begin Presentation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 font-mono text-[10px] tracking-widest uppercase pointer-events-none">
            <span>Scroll or Press Space</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </section>

        {/* SLIDE 1: The Training Gap (Problem) */}
        <section 
          data-slide-index="1"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-[#091526] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(1)
          }`}
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10">
            <div className="flex flex-col justify-center text-left">
              <span className={`text-brand-coral text-xs font-mono uppercase tracking-widest mb-3 transition-all duration-700 transform ${
                activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[100ms]`}>
                01. The Problem
              </span>
              
              <h2 className={`font-h1 text-white font-bold mb-6 transition-all duration-700 transform ${
                activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[300ms]`}>
                Training Is Completed,<br />
                <span className="text-brand-coral">But Is It Experienced?</span>
              </h2>
              
              <p className={`text-slate-300 font-body leading-relaxed mb-6 transition-all duration-700 transform ${
                activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[500ms]`}>
                Maritime operations are highly demanding, hands-on, and practical. Yet, current digital learning solutions rely heavily on static slides, text lists, and passive modules.
              </p>
              
              <div className={`p-4 bg-brand-coral/10 border border-brand-coral/30 rounded-2xl flex items-start gap-3 transition-all duration-700 transform ${
                activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[1800ms]`}>
                <Shield className="h-5 w-5 text-brand-coral shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">The Completion Gap</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Traditional training is effective at delivering information, but static formats provide limited opportunities for learners to actively apply that knowledge.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-[#12355B]/40 border border-brand-blue/20 rounded-3xl p-6 md:p-8 relative shadow-large">
              <span className={`text-xs font-mono text-slate-400 uppercase tracking-widest mb-6 transition-all duration-700 transform ${
                activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[100ms]`}>
                The Traditional Lifecycle
              </span>
              
              <div className="w-full space-y-4">
                {[
                  { id: 1, text: 'Open Training Module', delay: 300 },
                  { id: 2, text: 'Click Through 40+ Static Slides', delay: 600 },
                  { id: 3, text: 'Complete Basic Quiz (A/B/C/D)', delay: 900 },
                  { id: 4, text: 'Mark as Completed & File Certificate', delay: 1200 }
                ].map((step) => (
                  <div 
                    key={step.id} 
                    className={`flex items-center gap-3 p-3 bg-[#12355B]/50 border border-brand-blue/30 rounded-xl transition-all duration-500 transform ${
                      activeSlide === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: activeSlide === 1 ? `${step.delay}ms` : '0ms' }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-xs font-mono text-brand-blue font-bold">
                      {step.id}
                    </div>
                    <span className="text-sm text-slate-200">{step.text}</span>
                  </div>
                ))}
              </div>
              
              <div 
                className={`w-full mt-6 pt-4 border-t border-brand-blue/20 text-center text-xs font-mono text-brand-gold font-semibold transition-all duration-700 transform ${
                  activeSlide === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: activeSlide === 1 ? '1500ms' : '0ms' }}
              >
                Result: Limited Interaction. Passive Learning. Completion-Focused Training.
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2: The Opportunity (Opportunity) */}
        <section 
          data-slide-index="2"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-radial from-[#091f36] to-[#0A192F] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(2)
          }`}
        >
          <div className="max-w-6xl w-full z-10 text-center relative">
            <span className={`text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 inline-block transition-all duration-700 transform ${
              activeSlide === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              02. The Opportunity
            </span>
            
            <h2 className={`font-h1 text-white font-bold mb-6 transition-all duration-700 transform ${
              activeSlide === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[250ms]`}>
              Existing Training Knowledge, <span className="text-brand-gold">Reimagined</span>
            </h2>
            
            <p className={`text-slate-300 font-body max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-700 transform ${
              activeSlide === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[400ms]`}>
              You do not need to rebuild your corporate training documents from scratch. ProjectSeaT provides a framework to convert existing material into structured, interactive learning experiences.
            </p>

            {/* Central Node & Branching Lines for Desktop */}
            <div className="absolute inset-0 hidden lg:flex items-center justify-center pointer-events-none z-0">
              <div 
                className={`h-16 w-16 rounded-full bg-brand-navy border-2 border-brand-gold flex items-center justify-center z-30 transition-all duration-700 transform ${
                  activeSlide === 2 ? 'opacity-100 scale-100 shadow-[0_0_25px_rgba(244,162,97,0.4)]' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <Compass className="h-8 w-8 text-brand-gold animate-spin-slow" />
              </div>
              
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line 
                  x1="50%" y1="50%" x2="15%" y2="70%" 
                  className={`stroke-brand-blue stroke-2 transition-all duration-1000 animate-dash-line ${
                    activeSlide === 2 ? 'opacity-30' : 'opacity-0'
                  }`} 
                />
                <line 
                  x1="50%" y1="50%" x2="40%" y2="70%" 
                  className={`stroke-brand-blue stroke-2 transition-all duration-1000 animate-dash-line ${
                    activeSlide === 2 ? 'opacity-30' : 'opacity-0'
                  }`} 
                />
                <line 
                  x1="50%" y1="50%" x2="60%" y2="70%" 
                  className={`stroke-brand-blue stroke-2 transition-all duration-1000 animate-dash-line ${
                    activeSlide === 2 ? 'opacity-30' : 'opacity-0'
                  }`} 
                />
                <line 
                  x1="50%" y1="50%" x2="85%" y2="70%" 
                  className={`stroke-brand-blue stroke-2 transition-all duration-1000 animate-dash-line ${
                    activeSlide === 2 ? 'opacity-30' : 'opacity-0'
                  }`} 
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 z-10 relative">
              {[
                { Roman: 'I', title: 'Interactive Lessons', desc: 'Briefings that present objectives, notes, and rules in organized cards rather than long slide blocks.', delay: 600 },
                { Roman: 'II', title: 'Decision-Based Scenarios', desc: 'Real operational choices where trainees must decide the next actions, facing consequences in real-time.', delay: 850 },
                { Roman: 'III', title: 'Simulated Environments', desc: 'Fully explorable visual areas representing ship locations (Bridge, Engine Room, Ship Office).', delay: 1100 },
                { Roman: 'IV', title: 'Performance Visibility', desc: 'Training interactions can provide greater visibility into learner decisions, repeated mistakes, and activity performance.', delay: 1350 }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`bg-[#12355B]/40 hover:bg-brand-navy/60 border border-brand-blue/20 p-6 rounded-2xl text-left shadow-medium transition-all duration-500 transform hover:scale-[1.03] ${
                    activeSlide === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: activeSlide === 2 ? `${card.delay}ms` : '0ms' }}
                >
                  <div className="h-10 w-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mb-4 text-brand-gold font-bold font-mono">{card.Roman}</div>
                  <h4 className="text-white font-semibold mb-2">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-normal">{card.desc}</p>
                </div>
              ))}
            </div>
            
            <div className={`mt-8 text-xs font-mono text-slate-400 transition-all duration-700 ${
              activeSlide === 2 ? 'opacity-100' : 'opacity-0'
            } delay-[1600ms]`}>
              Existing Training Knowledge ➔ Multiple Interactive Experiences
            </div>
          </div>
        </section>

        {/* SLIDE 3: ProjectSeaT Stages (Solution) */}
        <section 
          data-slide-index="3"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-[#091526] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(3)
          }`}
        >
          <div className="max-w-6xl w-full z-10 text-center relative">
            <span className={`text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 inline-block transition-all duration-700 transform ${
              activeSlide === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              03. The Lifecycle
            </span>
            
            <h2 className={`font-h1 text-white font-bold mb-6 transition-all duration-700 transform ${
              activeSlide === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[250ms]`}>
              The ProjectSeaT Training Journey
            </h2>
            
            <p className={`text-slate-300 font-body max-w-2xl mx-auto leading-relaxed mb-4 transition-all duration-700 transform ${
              activeSlide === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[400ms]`}>
              ProjectSeaT structures the learner's journey into three clear phases that build operational competence.
            </p>
            
            <p className={`text-brand-gold font-mono text-xs uppercase tracking-widest mb-12 transition-all duration-700 transform ${
              activeSlide === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[550ms]`}>
              Learn the mission. Prepare for it. Experience it.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
              {/* Horizontal line with dynamic path fill */}
              <div className="absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-brand-blue/20 hidden lg:block overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-coral transition-all ease-out"
                  style={{
                    width: activeSlide === 3 ? '100%' : '0%',
                    transitionDuration: '1800ms',
                    transitionDelay: '600ms'
                  }}
                />
              </div>
              
              {[
                { step: '01', title: 'Mission Briefing', desc: 'Understand the situation, training objectives, and operational context before entering the activity.', delay: 600, colorClass: 'border-brand-blue bg-brand-blue/20 text-brand-blue' },
                { step: '02', title: 'Preparation Stage', desc: 'Review procedures, equipment, and critical information required for the scenario.', delay: 1200, colorClass: 'border-brand-gold bg-brand-gold/20 text-brand-gold' },
                { step: '03', title: 'Simulation Stage', desc: 'Enter an interactive environment, evaluate the situation, and make operational decisions.', delay: 1800, colorClass: 'border-brand-coral bg-brand-coral/20 text-brand-coral' }
              ].map((node, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col items-center transition-all duration-700 transform ${
                    activeSlide === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: activeSlide === 3 ? `${node.delay}ms` : '0ms' }}
                >
                  <div className={`h-14 w-14 rounded-full border-2 flex items-center justify-center font-bold text-white z-10 shadow-medium mb-6 transition-all duration-500 ${
                    activeSlide === 3 ? `${node.colorClass} scale-110 shadow-medium` : 'border-slate-700 bg-transparent scale-100'
                  }`}
                  style={{ transitionDelay: activeSlide === 3 ? `${node.delay + 200}ms` : '0ms' }}
                  >
                    {node.step}
                  </div>
                  <h4 className="text-white font-semibold mb-2">{node.title}</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-normal">
                    {node.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 4: The Core USP (The Peak) */}
        <section 
          data-slide-index="4"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-radial from-[#1A0B1A] to-[#0A192F] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(4)
          }`}
        >
          <div className="absolute h-96 w-96 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-4xl text-center z-10">
            <span className={`text-brand-gold text-xs font-mono uppercase tracking-widest mb-6 inline-block transition-all duration-700 transform ${
              activeSlide === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              04. The Core USP
            </span>
            
            <div className="border border-brand-gold/30 bg-[#12355B]/20 p-8 md:p-12 rounded-[32px] shadow-large relative overflow-hidden">
              <div className="absolute inset-0 border border-brand-coral/10 rounded-[32px] pointer-events-none" />
              
              <h2 className="font-display text-white text-3xl md:text-5xl font-extrabold leading-tight">
                <span className={`inline-block transition-all duration-700 transform ${
                  activeSlide === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                } delay-[300ms]`}>
                  We Don't Gamify{' '}
                  <span className={`transition-all duration-500 delay-[800ms] ${
                    activeSlide === 4 ? 'text-slate-500 line-through opacity-50' : 'text-white'
                  }`}>
                    Slides.
                  </span>
                </span>
                <br />
                <span className={`inline-block transition-all duration-700 transform ${
                  activeSlide === 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
                style={{ transitionDelay: activeSlide === 4 ? '1200ms' : '0ms' }}
                >
                  We Gamify{' '}
                  <span className="bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent font-extrabold shadow-sunset">
                    Decisions.
                  </span>
                </span>
              </h2>
              
              <div className="h-0.5 bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent my-8" />
              
              <p className={`text-slate-300 font-body max-w-2xl mx-auto leading-relaxed transition-all duration-700 ${
                activeSlide === 4 ? 'opacity-100' : 'opacity-0'
              } delay-[1500ms]`}>
                ProjectSeaT focuses on meaningful learner interaction. The learner observes, understands, evaluates, decides, experiences the outcome, and learns from it.
              </p>

              {/* Connecting line behind loop indicators */}
              <div className="relative mt-8">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-brand-gold/10 hidden md:block z-0 pointer-events-none" />
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10">
                  {[
                    { step: '01', title: 'Observe', desc: 'Scan environment' },
                    { step: '02', title: 'Understand', desc: 'Analyse status' },
                    { step: '03', title: 'Evaluate', desc: 'Review choices' },
                    { step: '04', title: 'Decide', desc: 'Take action' },
                    { step: '05', title: 'Experience', desc: 'Accept outcome' },
                    { step: '06', title: 'Learn', desc: 'Review performance' }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        transitionDelay: activeSlide === 4 ? `${1800 + idx * 150}ms` : '0ms',
                      }}
                      className={`bg-brand-navy/60 border border-brand-blue/20 p-3 rounded-xl flex flex-col items-center transition-all duration-700 transform ${
                        activeSlide === 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-brand-gold font-bold">{item.step}</span>
                      <span className="text-xs text-white font-semibold mt-1">{item.title}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 text-center leading-tight">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: Content Metamorphosis */}
        <section 
          data-slide-index="5"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-[#091526] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(5)
          }`}
        >
          <div className="max-w-6xl w-full z-10">
            <div className="text-center mb-8">
              <span className={`text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 inline-block transition-all duration-700 transform ${
                activeSlide === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[100ms]`}>
                05. Content Transformation
              </span>
              <h2 className={`font-h1 text-white font-bold transition-all duration-700 transform ${
                activeSlide === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[250ms]`}>
                Traditional Content ➔ Interactive Simulation
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`bg-[#12355B]/30 border border-brand-blue/20 rounded-2xl overflow-hidden shadow-medium transition-all duration-700 ${
                activeSlide === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              } delay-[400ms]`}>
                <div className="grid grid-cols-2 bg-[#12355B]/60 p-4 border-b border-brand-blue/20 text-xs font-mono uppercase tracking-widest text-slate-300">
                  <span>Traditional Material</span>
                  <span>ProjectSeaT Experience</span>
                </div>
                
                <div className="divide-y divide-brand-blue/15 text-left text-xs md:text-sm">
                  {[
                    { old: 'PPT Slide', new: 'Mission Briefing', delay: 500 },
                    { old: 'Procedure List', new: 'Interactive Preparation', delay: 800 },
                    { old: 'Static Diagram', new: 'Explorable Environment', delay: 1100 },
                    { old: 'Multiple Choice Question', new: 'Operational Decision', delay: 1400 },
                    { old: 'Correct / Incorrect', new: 'Decision Consequence', delay: 1700 },
                    { old: 'Module Completed', new: 'Performance Recorded', delay: 2000 }
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 p-3">
                      <span className={`text-slate-400 transition-all duration-500 transform ${
                        activeSlide === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                      }`}
                      style={{ transitionDelay: activeSlide === 5 ? `${row.delay}ms` : '0ms' }}
                      >
                        {row.old}
                      </span>
                      <span className={`text-brand-gold font-medium flex items-center gap-2 transition-all duration-500 transform ${
                        activeSlide === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                      }`}
                      style={{ transitionDelay: activeSlide === 5 ? `${row.delay + 150}ms` : '0ms' }}
                      >
                        <ArrowRight className="h-3 w-3 text-brand-blue shrink-0 animate-pulse" /> {row.new}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex flex-col justify-between bg-brand-navy/30 border border-brand-blue/20 rounded-2xl p-6 shadow-medium text-left transition-all duration-700 ${
                activeSlide === 5 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              } delay-[400ms]`}>
                <h4 className="text-white font-semibold mb-6">The Transformation Process</h4>
                
                <div className="space-y-4">
                  {[
                    { title: 'Existing Training Content', desc: 'Training modules, procedures, and learning material.', delay: 600 },
                    { title: 'Scenario Design', desc: 'Identify situations where learners can actively apply knowledge.', delay: 900 },
                    { title: 'Interactive Experience', desc: 'Transform learning objectives into activities and decisions.', delay: 1200 },
                    { title: 'Decision Simulation', desc: 'Allow learners to evaluate situations and experience outcomes.', delay: 1500 },
                    { title: 'Performance Insights', desc: 'Capture meaningful interaction and training performance.', delay: 1800 }
                  ].map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-4 transition-all duration-500 transform ${
                        activeSlide === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                      style={{ transitionDelay: activeSlide === 5 ? `${step.delay}ms` : '0ms' }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-[0_0_8px_rgba(30,144,255,0.2)]">
                        {idx + 1}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                        <p className="text-xs text-slate-400 mt-0.5 leading-normal">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 6: Enterprise Scale */}
        <section 
          data-slide-index="6"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-radial from-[#091f36] to-[#0A192F] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(6)
          }`}
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10">
            <div className="flex flex-col justify-center text-left">
              <span className={`text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 transition-all duration-700 transform ${
                activeSlide === 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[100ms]`}>
                06. Scalability
              </span>
              
              <h2 className={`font-h1 text-white font-bold mb-6 transition-all duration-700 transform ${
                activeSlide === 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[250ms]`}>
                Built to Scale Across<br />
                <span className="text-brand-gold">Your Training Ecosystem</span>
              </h2>
              
              <p className={`text-slate-300 font-body leading-relaxed mb-4 transition-all duration-700 transform ${
                activeSlide === 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[400ms]`}>
                ProjectSeaT is not designed around a single simulation.
              </p>
              
              <p className={`text-slate-400 font-small leading-relaxed mb-6 transition-all duration-700 transform ${
                activeSlide === 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[550ms]`}>
                It is designed as a repeatable training framework capable of supporting multiple courses, modules, lessons, and interactive activities.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Port State Control Inspections',
                  'Vessel Vetting Preparation',
                  'Safety and Drills Scenarios',
                  'Equipment Familiarization',
                  'Environmental Compliance checks',
                  'Operational Watchkeeper roles'
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 p-2 bg-brand-navy/40 border border-brand-blue/20 rounded-xl transition-all duration-500 transform ${
                      activeSlide === 6 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}
                    style={{ transitionDelay: activeSlide === 6 ? `${1800 + idx * 150}ms` : '0ms' }}
                  >
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                    <span className="text-xs text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12355B]/40 border border-brand-blue/20 rounded-3xl p-6 md:p-8 flex flex-col justify-center relative shadow-large text-left overflow-hidden">
              <span className={`text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 block text-center transition-all duration-700 ${
                activeSlide === 6 ? 'opacity-100' : 'opacity-0'
              } delay-[100ms]`}>
                Structure Hierarchy
              </span>
              <span className={`text-xs text-brand-gold font-mono font-semibold block text-center mb-6 transition-all duration-700 ${
                activeSlide === 6 ? 'opacity-100' : 'opacity-0'
              } delay-[300ms]`}>
                One structured framework. Multiple training experiences.
              </span>
              
              <div className="space-y-2 relative flex flex-col items-center w-full">
                {[
                  { level: 'Learning Path', item: 'Deck Operations', delay: 400 },
                  { level: 'Course', item: 'Operational Compliance', delay: 650 },
                  { level: 'Module', item: 'Inspection Preparation', delay: 900 },
                  { level: 'Lesson', item: 'Vessel Compartment Review', delay: 1150 },
                  { level: 'Activity', item: 'Interactive Inspection Scenario', delay: 1400 }
                ].map((row, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div 
                      className={`w-full max-w-md bg-[#12355B]/60 border p-3 rounded-xl flex items-center justify-between transition-all duration-500 transform ${
                        activeSlide === 6 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                      } ${
                        activeSlide === 6 ? 'border-brand-gold/40 shadow-[0_0_15px_rgba(244,162,97,0.1)]' : 'border-brand-blue/10 shadow-none'
                      }`}
                      style={{ transitionDelay: activeSlide === 6 ? `${row.delay}ms` : '0ms' }}
                    >
                      <div className="text-xs font-mono text-brand-gold uppercase tracking-widest font-bold">{row.level}</div>
                      <div className="text-xs font-semibold text-white font-body">{row.item}</div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div 
                        className={`transition-all duration-500 transform ${
                          activeSlide === 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                        }`}
                        style={{ transitionDelay: activeSlide === 6 ? `${row.delay + 150}ms` : '0ms' }}
                      >
                        <ArrowDown className="h-4 w-4 text-brand-gold my-1 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className={`text-[10px] text-slate-400 text-center font-mono mt-6 transition-all duration-700 ${
                activeSlide === 6 ? 'opacity-100' : 'opacity-0'
              } delay-[1600ms]`}>
                Repeatable training framework for enterprise scale.
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 7: Beyond Completion */}
        <section 
          data-slide-index="7"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-[#091526] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(7)
          }`}
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10">
            <div className={`bg-[#12355B]/30 border border-brand-blue/20 rounded-3xl p-6 relative shadow-large flex flex-col justify-between text-left transition-all duration-700 ${
              activeSlide === 7 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            } delay-[300ms]`}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">ILLUSTRATIVE TRAINING INSIGHTS</span>
                <span className="text-xs font-mono text-brand-gold font-semibold bg-brand-gold/10 px-2 py-0.5 border border-brand-gold/20 rounded">DEMO</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Decisions Made', val: '85%', width: '85%', color: 'bg-brand-gold' },
                  { name: 'Incorrect Actions', val: '2', width: '20%', color: 'bg-brand-coral' },
                  { name: 'Repeated Mistakes', val: '0', width: '5%', color: 'bg-green-400' },
                  { name: 'Scenario Attempts', val: '1', width: '10%', color: 'bg-brand-blue' },
                  { name: 'Activity Completion Time', val: '12m 45s', width: '60%', color: 'bg-slate-400' },
                  { name: 'Learning Progression', val: '92%', width: '92%', color: 'bg-brand-blue' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`transition-all duration-500 transform ${
                      activeSlide === 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: activeSlide === 7 ? `${400 + idx * 120}ms` : '0ms' }}
                  >
                    <div className="flex justify-between text-xs py-1 border-b border-brand-blue/10">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-brand-gold font-bold font-mono">{item.val}</span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-brand-navy border border-brand-blue/20 h-1.5 rounded-full overflow-hidden mt-1 pointer-events-none">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all ease-out`}
                        style={{ 
                          width: activeSlide === 7 ? item.width : '0%',
                          transitionDuration: '1000ms',
                          transitionDelay: activeSlide === 7 ? `${600 + idx * 120}ms` : '0ms'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center text-left">
              <span className={`text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 transition-all duration-700 transform ${
                activeSlide === 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[100ms]`}>
                07. Business Value
              </span>
              
              <h2 className="font-h1 text-white font-bold mb-6">
                <span className={`inline-block transition-all duration-750 transform ${
                  activeSlide === 7 ? 'opacity-50 translate-y-0 line-through text-slate-500' : 'opacity-0 translate-y-4'
                } delay-[300ms]`}>
                  From Completion Tracking
                </span>
                <br />
                <span className={`inline-block bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent transition-all duration-750 transform ${
                  activeSlide === 7 ? 'opacity-100 translate-y-0 scale-100 font-extrabold shadow-sunset' : 'opacity-0 translate-y-4 scale-95'
                }`}
                style={{ transitionDelay: activeSlide === 7 ? '1000ms' : '0ms' }}
                >
                  To Performance Visibility
                </span>
              </h2>
              
              <p className={`text-slate-300 font-body leading-relaxed mb-6 font-medium transition-all duration-700 transform ${
                activeSlide === 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[1300ms]`}>
                Traditional learning platforms primarily provide visibility into completion and assessment results.
              </p>
              
              <p className={`text-slate-400 font-small leading-relaxed mb-6 transition-all duration-700 transform ${
                activeSlide === 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } delay-[1600ms]`}>
                ProjectSeaT is designed to provide deeper visibility into how learners interact with scenarios, evaluate situations, and make decisions.
              </p>

              <div className="space-y-3">
                {[
                  'Decisions Made',
                  'Incorrect Actions & Repeated Mistakes',
                  'Scenario Attempts & Activity Completion Time'
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 transition-all duration-500 transform ${
                      activeSlide === 7 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                    }`}
                    style={{ transitionDelay: activeSlide === 7 ? `${1800 + idx * 150}ms` : '0ms' }}
                  >
                    <CheckCircle className="h-4 w-4 text-brand-gold" />
                    <span className="text-xs text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 8: The Minimum Sellable Product (MSP) */}
        <section 
          data-slide-index="8"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-radial from-[#091f36] to-[#0A192F] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(8)
          }`}
        >
          <div className="max-w-6xl w-full z-10 text-center">
            <span className={`text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 inline-block transition-all duration-700 transform ${
              activeSlide === 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              08. The Commercial Baseline
            </span>
            
            <h2 className={`font-h1 text-white font-bold mb-6 transition-all duration-700 transform ${
              activeSlide === 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[250ms]`}>
              The Minimum Sellable Product <span className="text-brand-gold">(MSP)</span>
            </h2>
            
            <p className={`text-slate-300 font-body max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-700 transform ${
              activeSlide === 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[400ms]`}>
              Start focused. Prove the experience. Scale the platform. The ProjectSeaT MSP delivers the complete operational training lifecycle.
            </p>

            <div className={`p-4 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl max-w-2xl mx-auto mb-8 text-center text-xs transition-all duration-700 transform ${
              activeSlide === 8 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } delay-[600ms]`}>
              <span className="text-brand-gold font-semibold uppercase block mb-1">MSP Objective</span>
              <span className="text-slate-300">Prove that existing maritime training content can be transformed into an engaging, repeatable, and interactive learning experience.</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              {/* Card 1 */}
              <div className={`bg-[#12355B]/40 border border-brand-blue/20 p-6 rounded-2xl shadow-medium flex flex-col justify-between transition-all duration-700 transform ${
                activeSlide === 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: activeSlide === 8 ? '800ms' : '0ms' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-blue/20 border border-brand-blue/30 rounded-xl flex items-center justify-center text-brand-gold shadow-[0_0_8px_rgba(30,144,255,0.15)]">
                      <Users className="h-5 w-5" />
                    </div>
                    <h4 className="text-white font-semibold">Platform Experience</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {[
                      'Learner authentication',
                      'Structured learning paths',
                      'Course and module navigation',
                      'Training progress visibility',
                      'Role-based platform experience'
                    ].map((item, bulletIdx) => (
                      <li 
                        key={bulletIdx} 
                        className={`flex gap-2 transition-all duration-500 transform ${
                          activeSlide === 8 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        }`}
                        style={{ transitionDelay: activeSlide === 8 ? `${1400 + bulletIdx * 100}ms` : '0ms' }}
                      >
                        <span className="text-brand-gold">➔</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2 */}
              <div className={`bg-[#12355B]/40 border border-brand-blue/20 p-6 rounded-2xl shadow-medium flex flex-col justify-between transition-all duration-700 transform ${
                activeSlide === 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: activeSlide === 8 ? '1000ms' : '0ms' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-blue/20 border border-brand-blue/30 rounded-xl flex items-center justify-center text-brand-gold shadow-[0_0_8px_rgba(244,162,97,0.15)]">
                      <Activity className="h-5 w-5" />
                    </div>
                    <h4 className="text-white font-semibold">Interactive Training</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {[
                      'Mission Briefing',
                      'Preparation Stage',
                      'Interactive Simulation',
                      'Decision-based activities',
                      'Scenario outcomes'
                    ].map((item, bulletIdx) => (
                      <li 
                        key={bulletIdx} 
                        className={`flex gap-2 transition-all duration-500 transform ${
                          activeSlide === 8 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        }`}
                        style={{ transitionDelay: activeSlide === 8 ? `${1900 + bulletIdx * 100}ms` : '0ms' }}
                      >
                        <span className="text-brand-gold">➔</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 3 */}
              <div className={`bg-[#12355B]/40 border border-brand-blue/20 p-6 rounded-2xl shadow-medium flex flex-col justify-between transition-all duration-700 transform ${
                activeSlide === 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: activeSlide === 8 ? '1200ms' : '0ms' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-blue/20 border border-brand-blue/30 rounded-xl flex items-center justify-center text-brand-gold shadow-[0_0_8px_rgba(244,162,97,0.15)]">
                      <Database className="h-5 w-5" />
                    </div>
                    <h4 className="text-white font-semibold">Training Management</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {[
                      'Training assignment',
                      'Learner progress tracking',
                      'Basic performance visibility'
                    ].map((item, bulletIdx) => (
                      <li 
                        key={bulletIdx} 
                        className={`flex gap-2 transition-all duration-500 transform ${
                          activeSlide === 8 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                        }`}
                        style={{ transitionDelay: activeSlide === 8 ? `${2400 + bulletIdx * 100}ms` : '0ms' }}
                      >
                        <span className="text-brand-gold">➔</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 9: Vision & Core Philosophy */}
        <section 
          data-slide-index="9"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-[#091526] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(9)
          }`}
        >
          <div className="max-w-4xl text-center z-10">
            <span className={`text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 inline-block transition-all duration-700 transform ${
              activeSlide === 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              09. The Vision
            </span>
            
            <h2 className={`font-h1 text-white font-bold mb-8 transition-all duration-700 transform ${
              activeSlide === 9 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[250ms]`}>
              A Training Ecosystem Built Around Maritime Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10 text-left">
              {/* Today Card */}
              <div className={`p-6 bg-brand-navy/60 border border-brand-blue/20 rounded-2xl transition-all duration-700 transform ${
                activeSlide === 9 ? 'opacity-70 scale-100 translate-x-0' : 'opacity-0 scale-95 -translate-x-4'
              }`}
              style={{ transitionDelay: activeSlide === 9 ? '500ms' : '0ms' }}
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-2">Today</span>
                <span className="text-sm font-semibold text-white">One Training Module ➔ One Interactive Experience</span>
              </div>
              
              {/* Opportunity Card (pulses/glows) */}
              <div className={`p-6 bg-[#12355B]/60 border rounded-2xl transition-all duration-700 transform ${
                activeSlide === 9 ? 'opacity-100 scale-105 translate-x-0 border-brand-gold/60 shadow-[0_0_20px_rgba(244,162,97,0.2)]' : 'opacity-0 scale-95 translate-x-4 border-brand-blue/20 shadow-none'
              }`}
              style={{ transitionDelay: activeSlide === 9 ? '750ms' : '0ms' }}
              >
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest block mb-2 font-bold animate-pulse">The Opportunity</span>
                <span className="text-sm font-semibold text-white">Hundreds of Training Modules ➔ A Maritime Training Ecosystem</span>
              </div>
            </div>
            
            <div className={`p-6 md:p-8 bg-[#12355B]/30 border border-brand-blue/20 rounded-3xl shadow-large max-w-3xl mx-auto text-left relative overflow-hidden transition-all duration-1000 transform ${
              activeSlide === 9 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: activeSlide === 9 ? '1100ms' : '0ms' }}
            >
              <span className="text-6xl text-brand-blue/20 font-serif absolute -top-2 left-4 pointer-events-none">“</span>
              <p className="text-slate-200 font-body italic leading-relaxed relative z-10">
                Training should not end when the learner clicks 'Complete'. Training should create an experience the learner understands, remembers, and applies.
              </p>
              <div className="mt-4 pt-4 border-t border-brand-blue/20 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">ProjectSeaT Core Philosophy</span>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 10: Closing CTA */}
        <section 
          data-slide-index="10"
          data-slide-item
          className={`absolute inset-0 h-full w-full flex flex-col justify-center items-center p-6 md:p-12 bg-gradient-to-b from-[#0A192F] via-[#12355B] to-[#0A192F] transition-all duration-1000 ease-out ${
            getSlideTransitionClass(10)
          }`}
        >
          <div className="max-w-4xl text-center z-10">
            <span className={`text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 inline-block transition-all duration-700 transform ${
              activeSlide === 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[100ms]`}>
              ⚓ ProjectSeaT
            </span>
            
            <h2 className={`font-display text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4 transition-all duration-700 transform ${
              activeSlide === 10 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            } delay-[250ms]`}>
              Your Training Knowledge. <br />
              <span className="bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent font-extrabold shadow-sunset">
                Transformed Into Experience.
              </span>
            </h2>
            
            <p className={`text-slate-300 font-h3 font-semibold mb-12 transition-all duration-700 transform ${
              activeSlide === 10 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } delay-[550ms]`}>
              Train. Decide. Experience.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link 
                to="/landing" 
                className={`w-full transition-all duration-700 transform ${
                  activeSlide === 10 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
                style={{ transitionDelay: activeSlide === 10 ? '800ms' : '0ms' }}
              >
                <button className="group w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold/80 text-brand-navy font-bold rounded-xl flex items-center justify-center gap-2 shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
                  Experience ProjectSeaT{' '}
                  <Play className="h-4 w-4 fill-brand-navy text-brand-navy group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              
              <button 
                onClick={() => scrollToSlide(0)}
                className={`w-full px-6 py-4 bg-transparent hover:bg-brand-blue/20 border-2 border-brand-blue text-brand-pearl font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer transition-all duration-700 transform ${
                  activeSlide === 10 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
                style={{ transitionDelay: activeSlide === 10 ? '1000ms' : '0ms' }}
              >
                Back to Beginning <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className={`absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-center gap-2 text-slate-500 text-[10px] font-mono tracking-widest uppercase transition-all duration-700 ${
            activeSlide === 10 ? 'opacity-100' : 'opacity-0'
          } delay-[1300ms]`}>
            <span>ProjectSeaT © 2026. All rights reserved.</span>
            <span>From watching training to experiencing it.</span>
          </div>
        </section>

      </div>
    </div>
  )
}
