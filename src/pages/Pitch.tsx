import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
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

export const Pitch: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0)

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

  // Set up intersection observer to detect active slide via native scroll snapping
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-slide-index') || '0', 10)
            setActiveSlide(index)
          }
        })
      },
      {
        root: null,
        threshold: 0.5, // Slide is active if 50% or more is visible
      }
    )

    const elements = document.querySelectorAll('[data-slide-item]')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        if (activeSlide < SLIDES_COUNT - 1) {
          scrollToSlide(activeSlide + 1)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        if (activeSlide > 0) {
          scrollToSlide(activeSlide - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSlide])

  const scrollToSlide = (index: number) => {
    const element = document.querySelector(`[data-slide-index="${index}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSlide(index)
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

      {/* 🚀 Main Fullscreen Slides Container */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-none">
        
        {/* SLIDE 0: Hero / Onboarding */}
        <section 
          data-slide-index="0"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 overflow-hidden bg-radial from-[#0d2b45] to-[#0A192F]"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div 
            className={`max-w-4xl text-center z-10 transition-all duration-1000 transform ${
              activeSlide === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold rounded-full text-xs font-mono uppercase tracking-widest mb-6">
              <Sparkles className="h-3 w-3 animate-pulse" /> Reimagining Seafarer Learning
            </div>
            
            <h1 className="font-display text-white text-4xl md:text-6xl font-extrabold leading-tight">
              Transforming Maritime Training <br />
              <span className="bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent">
                Into Interactive Experience
              </span>
            </h1>
            
            <p className="text-slate-300 font-body-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              We convert static slides and completion-only quizzes into fully playable, decision-driven simulation workflows built for the modern seafarer.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => scrollToSlide(1)}
                className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/80 text-white font-semibold rounded-xl flex items-center gap-2 shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Begin Presentation <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 font-mono text-[10px] tracking-widest uppercase">
            <span>Scroll or Press Space</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </section>

        {/* SLIDE 1: The Training Gap (Problem) */}
        <section 
          data-slide-index="1"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-[#091526]"
        >
          <div 
            className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10 transition-all duration-1000 transform ${
              activeSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="flex flex-col justify-center text-left">
              <span className="text-brand-coral text-xs font-mono uppercase tracking-widest mb-3">01. The Problem</span>
              <h2 className="font-h1 text-white font-bold mb-6">
                Training Is Completed,<br />
                <span className="text-brand-coral">But Is It Experienced?</span>
              </h2>
              <p className="text-slate-300 font-body leading-relaxed mb-6">
                Maritime operations are highly demanding, hands-on, and practical. Yet, current digital learning solutions rely heavily on static slides, text lists, and passive modules.
              </p>
              
              <div className="p-4 bg-brand-coral/10 border border-brand-coral/30 rounded-2xl flex items-start gap-3">
                <Shield className="h-5 w-5 text-brand-coral shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-white">The Compliance Trap</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Standard training prioritizes ticking check boxes. When crew focus on "completing the slides" instead of mastering the situation, real-world operational risk increases.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-[#12355B]/40 border border-brand-blue/20 rounded-3xl p-6 md:p-8 relative shadow-large">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">The Traditional Lifecycle</span>
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-950/20 border border-brand-coral/20 rounded-xl">
                  <div className="h-8 w-8 rounded-lg bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-center text-xs font-mono text-brand-coral font-bold">1</div>
                  <span className="text-sm text-slate-200">Open Training Module</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-950/20 border border-brand-coral/20 rounded-xl">
                  <div className="h-8 w-8 rounded-lg bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-center text-xs font-mono text-brand-coral font-bold">2</div>
                  <span className="text-sm text-slate-200">Click Through 40+ Static Slides</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-950/20 border border-brand-coral/20 rounded-xl">
                  <div className="h-8 w-8 rounded-lg bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-center text-xs font-mono text-brand-coral font-bold">3</div>
                  <span className="text-sm text-slate-200">Complete Basic Quiz (A/B/C/D)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-950/20 border border-brand-coral/20 rounded-xl">
                  <div className="h-8 w-8 rounded-lg bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-center text-xs font-mono text-brand-coral font-bold">4</div>
                  <span className="text-sm text-slate-200">Mark as Completed & File Certificate</span>
                </div>
              </div>
              
              <div className="w-full mt-6 pt-4 border-t border-brand-blue/20 text-center text-xs font-mono text-brand-coral font-semibold">
                Result: Zero Context. Low Engagement. Unprepared Crew.
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 2: The Opportunity (Opportunity) */}
        <section 
          data-slide-index="2"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-radial from-[#091f36] to-[#0A192F]"
        >
          <div 
            className={`max-w-6xl w-full z-10 text-center transition-all duration-1000 transform ${
              activeSlide === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <span className="text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 inline-block">02. The Opportunity</span>
            <h2 className="font-h1 text-white font-bold mb-6">
              Existing Training Knowledge, <span className="text-brand-gold">Reimagined</span>
            </h2>
            <p className="text-slate-300 font-body max-w-2xl mx-auto leading-relaxed mb-12">
              You do not need to rebuild your corporate training documents from scratch. ProjectSeaT provides a framework to convert existing material into immersive learning pipelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#12355B]/40 hover:bg-brand-navy/60 border border-brand-blue/20 p-6 rounded-2xl text-left shadow-medium transition-all duration-300 hover:scale-[1.03]">
                <div className="h-10 w-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mb-4 text-brand-gold font-bold font-mono">I</div>
                <h4 className="text-white font-semibold mb-2">Interactive Lessons</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Briefings that present objectives, notes, and rules in organized cards rather than long slide blocks.
                </p>
              </div>

              <div className="bg-[#12355B]/40 hover:bg-brand-navy/60 border border-brand-blue/20 p-6 rounded-2xl text-left shadow-medium transition-all duration-300 hover:scale-[1.03]">
                <div className="h-10 w-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mb-4 text-brand-gold font-bold font-mono">II</div>
                <h4 className="text-white font-semibold mb-2">Decision-Based Scenarios</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Real operational choices where trainees must decide the next actions, facing consequences in real-time.
                </p>
              </div>

              <div className="bg-[#12355B]/40 hover:bg-brand-navy/60 border border-brand-blue/20 p-6 rounded-2xl text-left shadow-medium transition-all duration-300 hover:scale-[1.03]">
                <div className="h-10 w-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mb-4 text-brand-gold font-bold font-mono">III</div>
                <h4 className="text-white font-semibold mb-2">Simulated Environments</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Fully explorable visual areas representing ship locations (Bridge, Engine Room, Ship Office).
                </p>
              </div>

              <div className="bg-[#12355B]/40 hover:bg-brand-navy/60 border border-brand-blue/20 p-6 rounded-2xl text-left shadow-medium transition-all duration-300 hover:scale-[1.03]">
                <div className="h-10 w-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mb-4 text-brand-gold font-bold font-mono">IV</div>
                <h4 className="text-white font-semibold mb-2">Measurable Performance</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  Metrics mapping how crew make decisions, identify deficiencies, and handle conversations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3: ProjectSeaT Stages (Solution) */}
        <section 
          data-slide-index="3"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-[#091526]"
        >
          <div 
            className={`max-w-6xl w-full z-10 text-center transition-all duration-1000 transform ${
              activeSlide === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 inline-block">03. The Lifecycle</span>
            <h2 className="font-h1 text-white font-bold mb-6">
              The ProjectSeaT Training Journey
            </h2>
            <p className="text-slate-300 font-body max-w-2xl mx-auto leading-relaxed mb-12">
              ProjectSeaT structures the learner's journey into three clear phases that build operational competence.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
              <div className="absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-blue via-brand-gold to-brand-coral hidden lg:block opacity-30" />
              
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-brand-blue/20 border-2 border-brand-blue flex items-center justify-center font-bold text-white z-10 shadow-medium mb-6">
                  01
                </div>
                <h4 className="text-white font-semibold mb-2">Mission Briefing</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-normal">
                  Trainees understand the situation, review mandatory regulations, and validate theory checks before starting the activity.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center font-bold text-white z-10 shadow-medium mb-6">
                  02
                </div>
                <h4 className="text-white font-semibold mb-2">Preparation Stage</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-normal">
                  Trainees review required logs, verify procedures, study certificates, and prepare mental models for operational checks.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-brand-coral/20 border-2 border-brand-coral flex items-center justify-center font-bold text-white z-10 shadow-medium mb-6">
                  03
                </div>
                <h4 className="text-white font-semibold mb-2">Simulation Run</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-normal">
                  Trainees enter the scenario, explore areas, handle dialogues, audit logs, and complete checklist objects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4: The Core USP (The Peak) */}
        <section 
          data-slide-index="4"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-radial from-[#1A0B1A] to-[#0A192F]"
        >
          <div className="absolute h-96 w-96 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          
          <div 
            className={`max-w-4xl text-center z-10 transition-all duration-1000 transform ${
              activeSlide === 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <span className="text-brand-gold text-xs font-mono uppercase tracking-widest mb-6 inline-block">04. The Core USP</span>
            
            <div className="border border-brand-gold/30 bg-[#12355B]/20 p-8 md:p-12 rounded-[32px] shadow-large relative overflow-hidden">
              <div className="absolute inset-0 border border-brand-coral/10 rounded-[32px] pointer-events-none" />
              
              <h2 className="font-display text-white text-3xl md:text-5xl font-extrabold leading-tight">
                "We Don't Gamify Slides.<br />
                <span className="bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent">
                  We Gamify Decisions."
                </span>
              </h2>
              
              <div className="h-0.5 bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent my-8" />
              
              <p className="text-slate-300 font-body max-w-2xl mx-auto leading-relaxed">
                Adding simple quizzes, badge rewards, and completion points to standard text blocks is not gamification. ProjectSeaT focuses on **decisions with consequences**.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { step: '01', title: 'Observe', desc: 'Scan environment' },
                  { step: '02', title: 'Understand', desc: 'Analyse status' },
                  { step: '03', title: 'Evaluate', desc: 'Review choices' },
                  { step: '04', title: 'Decide', desc: 'Take action' },
                  { step: '05', title: 'Experience', desc: 'Accept impact' },
                  { step: '06', title: 'Learn', desc: 'Debrief scores' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-brand-navy/60 border border-brand-blue/20 p-3 rounded-xl flex flex-col items-center">
                    <span className="text-[10px] font-mono text-brand-gold font-bold">{item.step}</span>
                    <span className="text-xs text-white font-semibold mt-1">{item.title}</span>
                    <span className="text-[9px] text-slate-400 mt-0.5 text-center leading-tight">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 5: Content Metamorphosis */}
        <section 
          data-slide-index="5"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-[#091526]"
        >
          <div 
            className={`max-w-6xl w-full z-10 transition-all duration-1000 transform ${
              activeSlide === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="text-center mb-8">
              <span className="text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 inline-block">05. Content Transformation</span>
              <h2 className="font-h1 text-white font-bold">Traditional Content ➔ Interactive Simulation</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#12355B]/30 border border-brand-blue/20 rounded-2xl overflow-hidden shadow-medium">
                <div className="grid grid-cols-2 bg-[#12355B]/60 p-4 border-b border-brand-blue/20 text-xs font-mono uppercase tracking-widest text-slate-300">
                  <span>Traditional Material</span>
                  <span>ProjectSeaT Experience</span>
                </div>
                
                <div className="divide-y divide-brand-blue/15 text-left text-xs md:text-sm">
                  {[
                    { old: 'PPT Training Slide', new: 'Mission Briefing Section' },
                    { old: 'Standard Procedure List', new: 'Interactive Preparation Notes' },
                    { old: 'Static Diagram Illustration', new: 'Explorable Compartment Area' },
                    { old: 'Multiple Choice Quiz Item', new: 'Branching Dialogue Decision' },
                    { old: 'Right or Wrong Answer Tag', new: 'Dialogue Outcome & Consequence' },
                    { old: 'Module Mark as Completed', new: 'Trainee Performance Recorded' }
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 p-3">
                      <span className="text-slate-400">{row.old}</span>
                      <span className="text-brand-gold font-medium flex items-center gap-2">
                        <ArrowRight className="h-3 w-3 text-brand-blue shrink-0" /> {row.new}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between bg-brand-navy/30 border border-brand-blue/20 rounded-2xl p-6 shadow-medium text-left">
                <h4 className="text-white font-semibold mb-6">The Transformation Workflow</h4>
                
                <div className="space-y-4">
                  {[
                    { title: 'Training Content Input', desc: 'Existing documents, checklists, regulations, and procedure sheets.' },
                    { title: 'Scenario Design mapping', desc: 'Mapping text guidelines into interactive locations, dialogues, and objects.' },
                    { title: 'Interactive Activity builds', desc: 'Designing checklists, logs audit desk overlays, and hotspot coordinates.' },
                    { title: 'Decision Simulation tests', desc: 'Running active decision nodes and checking for inspector feedback outcomes.' },
                    { title: 'Performance Insights dashboards', desc: 'Translating activity choices into scoring reports for dashboard visibility.' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="h-8 w-8 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-xs font-bold text-white shrink-0">
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
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-radial from-[#091f36] to-[#0A192F]"
        >
          <div 
            className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10 transition-all duration-1000 transform ${
              activeSlide === 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="flex flex-col justify-center text-left">
              <span className="text-brand-gold text-xs font-mono uppercase tracking-widest mb-3">06. Scalability</span>
              <h2 className="font-h1 text-white font-bold mb-6">
                Built to Scale Across<br />
                <span className="text-brand-gold">Your Training Ecosystem</span>
              </h2>
              <p className="text-slate-300 font-body leading-relaxed mb-6">
                ProjectSeaT is not built around a single PSC simulation. The platform employs a completely configuration-driven model that makes scaling quick and cost-effective.
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
                  <div key={idx} className="flex items-center gap-2 p-2 bg-brand-navy/40 border border-brand-blue/20 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                    <span className="text-xs text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12355B]/40 border border-brand-blue/20 rounded-3xl p-6 md:p-8 flex flex-col justify-center relative shadow-large text-left">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6 block text-center">Structure Hierarchy</span>
              
              <div className="space-y-4">
                {[
                  { level: 'Learning Path', item: 'Deck Department Compliance paths' },
                  { level: 'Course', item: 'PSC Inspection Preparation course' },
                  { level: 'Module', item: 'PSC Port State Control Inspection' },
                  { level: 'Lesson', item: 'Vessel Compartments Audits' },
                  { level: 'Activity', item: 'MLC Rest Hours Logs validation' }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-24 shrink-0 text-xs font-mono text-brand-gold uppercase tracking-wider">{row.level}</div>
                    <div className="h-5 w-5 flex items-center justify-center text-slate-500">➔</div>
                    <div className="w-full bg-[#12355B]/60 border border-brand-blue/30 p-2 rounded-lg text-xs font-semibold text-white">
                      {row.item}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 text-center font-mono mt-6">
                Reusable engines + structured data configs = immediate content expansion.
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 7: Beyond Completion */}
        <section 
          data-slide-index="7"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-[#091526]"
        >
          <div 
            className={`max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 z-10 transition-all duration-1000 transform ${
              activeSlide === 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="bg-[#12355B]/30 border border-brand-blue/20 rounded-3xl p-6 relative shadow-large flex flex-col justify-between text-left">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Active Performance Insights</span>
                <span className="text-xs font-mono text-brand-gold font-semibold bg-brand-gold/10 px-2 py-0.5 border border-brand-gold/20 rounded">PSC-01</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Inspector Trust Rating</span>
                    <span className="text-brand-gold font-bold">85%</span>
                  </div>
                  <div className="w-full bg-brand-navy border border-brand-blue/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-gold h-full w-[85%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Inspection Deficiencies Found</span>
                    <span className="text-brand-coral font-bold">4 / 5</span>
                  </div>
                  <div className="w-full bg-brand-navy border border-brand-blue/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-coral h-full w-[80%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Decision Compliance Score</span>
                    <span className="text-brand-blue font-bold">92%</span>
                  </div>
                  <div className="w-full bg-brand-navy border border-brand-blue/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-blue h-full w-[92%] rounded-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-brand-blue/20">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Completion Time</span>
                  <span className="text-sm font-semibold text-white">12 min 45s</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Status Result</span>
                  <span className="text-sm font-semibold text-green-400">Passed</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-left">
              <span className="text-brand-blue text-xs font-mono uppercase tracking-widest mb-3">07. Business Value</span>
              <h2 className="font-h1 text-white font-bold mb-6">
                From Completion Tracking<br />
                <span className="text-brand-blue">To Performance Visibility</span>
              </h2>
              <p className="text-slate-300 font-body leading-relaxed mb-6 font-medium">
                "Because completing training and understanding training are not the same thing."
              </p>
              <p className="text-slate-400 font-small leading-relaxed mb-6">
                Traditional LMS platforms tell you if someone scrolled to the end of a presentation. ProjectSeaT logs how crew evaluate situations under pressure, how they verify logbook records, and whether they understand the operational impact of their dialogue choices.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-brand-gold" />
                  <span className="text-xs text-slate-300">Track decisions made during operational scenarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-brand-gold" />
                  <span className="text-xs text-slate-300">Identify incorrect actions and repeated crew mistakes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-brand-gold" />
                  <span className="text-xs text-slate-300">Monitor learning progression and compliance scores</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 8: The Minimum Sellable Product (MSP) */}
        <section 
          data-slide-index="8"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-radial from-[#091f36] to-[#0A192F]"
        >
          <div 
            className={`max-w-6xl w-full z-10 text-center transition-all duration-1000 transform ${
              activeSlide === 8 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <span className="text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 inline-block">08. The Commercial Baseline</span>
            <h2 className="font-h1 text-white font-bold mb-6">
              The Minimum Sellable Product <span className="text-brand-gold">(MSP)</span>
            </h2>
            <p className="text-slate-300 font-body max-w-2xl mx-auto leading-relaxed mb-12">
              Start focused. Prove the experience. Scale the platform. The ProjectSeaT MSP delivers the complete operational training lifecycle.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
              <div className="bg-[#12355B]/40 border border-brand-blue/20 p-6 rounded-2xl shadow-medium flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-blue/20 border border-brand-blue/30 rounded-xl flex items-center justify-center text-brand-gold">
                      <Users className="h-5 w-5" />
                    </div>
                    <h4 className="text-white font-semibold">Platform Experience</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex gap-2">➔ <span>Learner login and profile roles</span></li>
                    <li className="flex gap-2">➔ <span>Structured learning compliance paths</span></li>
                    <li className="flex gap-2">➔ <span>Course and training module navigation</span></li>
                    <li className="flex gap-2">➔ <span>General progress and scoring visibility</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#12355B]/40 border border-brand-blue/20 p-6 rounded-2xl shadow-medium flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-blue/20 border border-brand-blue/30 rounded-xl flex items-center justify-center text-brand-gold">
                      <Activity className="h-5 w-5" />
                    </div>
                    <h4 className="text-white font-semibold">Interactive Training</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex gap-2">➔ <span>Mandatory pre-briefing MCQ assessments</span></li>
                    <li className="flex gap-2">➔ <span>Interactive vessel audit inspection rooms</span></li>
                    <li className="flex gap-2">➔ <span>Branching dialogues with trust scores</span></li>
                    <li className="flex gap-2">➔ <span>MLC Watchkeeper rest-hour audit tools</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#12355B]/40 border border-brand-blue/20 p-6 rounded-2xl shadow-medium flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-brand-blue/20 border border-brand-blue/30 rounded-xl flex items-center justify-center text-brand-gold">
                      <Database className="h-5 w-5" />
                    </div>
                    <h4 className="text-white font-semibold">Training Management</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex gap-2">➔ <span>Admin-based training assignment checks</span></li>
                    <li className="flex gap-2">➔ <span>Automatic learner progression tracking</span></li>
                    <li className="flex gap-2">➔ <span>Detailed metrics on deficiencies and decisions</span></li>
                    <li className="flex gap-2">➔ <span>Structured completion performance reports</span></li>
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
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-[#091526]"
        >
          <div 
            className={`max-w-4xl text-center z-10 transition-all duration-1000 transform ${
              activeSlide === 9 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <span className="text-brand-blue text-xs font-mono uppercase tracking-widest mb-3 inline-block">09. The Vision</span>
            <h2 className="font-h1 text-white font-bold mb-6">
              A Training Ecosystem Built Around Maritime Experience
            </h2>
            
            <div className="p-8 md:p-10 bg-[#12355B]/30 border border-brand-blue/20 rounded-3xl shadow-large max-w-3xl mx-auto text-left relative overflow-hidden">
              <span className="text-6xl text-brand-blue/20 font-serif absolute -top-2 left-4 pointer-events-none">“</span>
              <p className="text-slate-200 font-body-lg italic leading-relaxed relative z-10">
                Training should not end when the learner clicks 'Complete'. Training should create an experience the learner understands, remembers, and applies.
              </p>
              <div className="mt-6 pt-4 border-t border-brand-blue/20 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">ProjectSeaT Core Philosophy</span>
              </div>
            </div>

            <p className="text-slate-400 font-small max-w-2xl mx-auto mt-8 leading-relaxed">
              Our vision is to build a digital training environment where maritime professionals do not simply study operational situations. They experience them.
            </p>
          </div>
        </section>

        {/* SLIDE 10: Closing CTA */}
        <section 
          data-slide-index="10"
          data-slide-item
          className="h-full w-full snap-start snap-always flex flex-col justify-center items-center relative p-6 md:p-12 bg-gradient-to-b from-[#0A192F] via-[#12355B] to-[#0A192F]"
        >
          <div 
            className={`max-w-4xl text-center z-10 transition-all duration-1000 transform ${
              activeSlide === 10 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
          >
            <span className="text-brand-gold text-xs font-mono uppercase tracking-widest mb-3 inline-block">⚓ ProjectSeaT</span>
            
            <h2 className="font-display text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4">
              Your Training Knowledge. <br />
              <span className="bg-gradient-to-r from-brand-gold to-brand-coral bg-clip-text text-transparent">
                Transformed Into Experience.
              </span>
            </h2>
            
            <p className="text-slate-300 font-h3 font-semibold mb-12">
              Train. Decide. Experience.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link to="/landing" className="w-full">
                <button className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold/80 text-brand-navy font-bold rounded-xl flex items-center justify-center gap-2 shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
                  Explore Platform Demo <Play className="h-4 w-4 fill-brand-navy text-brand-navy" />
                </button>
              </Link>
              
              <button 
                onClick={() => scrollToSlide(0)}
                className="w-full px-6 py-4 bg-transparent hover:bg-brand-blue/20 border-2 border-brand-blue text-brand-pearl font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Back to Beginning <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-center gap-2 text-slate-500 text-[10px] font-mono tracking-widest uppercase">
            <span>ProjectSeaT © 2026. All rights reserved.</span>
            <span>From watching training to experiencing it.</span>
          </div>
        </section>

      </div>
    </div>
  )
}
