import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass, Shield, BarChart3, FileText,
  CheckCircle, ArrowRight, Globe,
  BookOpen, Award, Target,
  Lock, ChevronDown, Menu, X, Play, ExternalLink,
} from 'lucide-react'

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setCount(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])
  return count
}

/* ─── data ────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Shield,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
    border: 'border-brand-blue/20',
    title: 'PSC Inspection Simulator',
    desc: 'Full-fidelity Port State Control inspection scenarios covering documentation review, accommodation inspections, engine room walk-throughs, and closing meetings — all mapped to actual MOU detention criteria.',
    tags: ['SOLAS', 'MARPOL', 'PSC MOU'],
  },
  {
    icon: BookOpen,
    color: 'text-brand-gold',
    bg: 'bg-brand-gold/10',
    border: 'border-brand-gold/20',
    title: 'MLC 2006 Compliance Engine',
    desc: 'Track seafarer welfare obligations across hours of rest, medical fitness, wage accounts, and grievance procedures — with automated flag state deficiency alerts and audit-ready reports.',
    tags: ['MLC 2006', 'ILO', 'Flag State'],
  },
  {
    icon: BarChart3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    title: 'Real-Time Performance Analytics',
    desc: 'Live scoring engine evaluates decision quality, response timing, and regulatory accuracy. Trainees receive instant AI-powered feedback at each simulation milestone.',
    tags: ['Analytics', 'AI Feedback', 'KPIs'],
  },
  {
    icon: FileText,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    title: 'Certificate & Document Tracker',
    desc: 'Centralized registry of STCW certificates, statutory documents, and survey records with expiry countdowns, renewal reminders, and PSC readiness scoring.',
    tags: ['STCW', 'DOC', 'ISSC'],
  },
  {
    icon: Target,
    color: 'text-brand-coral',
    bg: 'bg-brand-coral/10',
    border: 'border-brand-coral/20',
    title: 'Rank-Specific Training Paths',
    desc: 'Curated simulation sequences tailored for Cadet through Master level — with progressive competency gates, scenario branching, and STCW Table mapping for each rank.',
    tags: ['STCW Tables', 'Competency', 'Rank-Based'],
  },
  {
    icon: Globe,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
    title: 'IMO Regulatory Database',
    desc: 'Built-in, always-updated reference covering SOLAS, MARPOL, MLC, STCW, Load Line Convention and ISM Code — with contextual cross-references during live simulations.',
    tags: ['IMO', 'SOLAS Ch.V', 'ISM Code'],
  },
]

const COMPARISON = [
  { aspect: 'PSC Inspection Practice', traditional: 'Only during actual port calls', seat: 'On-demand, any time, any scenario' },
  { aspect: 'Error Consequence', traditional: 'Real deficiencies & detentions', seat: 'Safe sandboxed environment' },
  { aspect: 'Feedback Speed', traditional: 'Post-voyage debriefs', seat: 'Instant AI-powered scoring' },
  { aspect: 'Regulatory Updates', traditional: 'Manual circulars & bulletins', seat: 'Auto-synced IMO database' },
  { aspect: 'Certificate Tracking', traditional: 'Spreadsheets & paper files', seat: 'Real-time digital registry' },
  { aspect: 'Progress Measurement', traditional: 'Subjective officer reports', seat: 'Quantitative KPI dashboards' },
  { aspect: 'Availability', traditional: 'Fixed academy schedule', seat: '24 / 7 from any device' },
]

const TIMELINE = [
  { step: '01', title: 'Platform Onboarding', desc: 'Select your rank, review the Mission Control dashboard, and review your active vessel status and port assignment.' },
  { step: '02', title: 'Training Module Selection', desc: 'Browse the module catalogue. Choose from PSC Inspection, Emergency Procedures, Cargo Documentation, or MLC Audit scenarios.' },
  { step: '03', title: 'Mission Briefing', desc: 'Review the scenario briefing — PSC inspector boarding details, vessel type, port authority, and deficiency risk profile.' },
  { step: '04', title: 'Live Simulation', desc: 'Execute the inspection in real time. Navigate documentation requests, inspector challenges, and compartment walk-throughs.' },
  { step: '05', title: 'Deficiency Encounters', desc: 'Respond to surprise deficiency findings with realistic decision branches — each choice logged and scored automatically.' },
  { step: '06', title: 'Closing Meeting & Debrief', desc: 'Conduct the closing meeting, issue responses, and receive your full performance debrief with regulatory citations.' },
]

const TECH = [
  { name: 'React 19', sub: 'UI Framework' },
  { name: 'TypeScript', sub: 'Type Safety' },
  { name: 'Vite 6', sub: 'Build System' },
  { name: 'Tailwind v4', sub: 'Design System' },
  { name: 'Custom Sim Engine', sub: 'Scenario Runtime' },
  { name: 'IMO Database', sub: 'Regulatory Layer' },
  { name: 'STCW API Layer', sub: 'Competency Mapping' },
  { name: 'Event Bus', sub: 'Real-time Sync' },
]

const TEAM = [
  {
    initials: 'VK',
    color: 'bg-brand-blue',
    name: 'Varad Vijay Khopkar',
    role: 'Product Architect',
    detail: 'Cyber Security Engineer. Leads product vision, platform architecture, and system design for Project SeaT.',
    linkedin: 'https://www.linkedin.com/in/varadkhopkar/',
  },
  {
    initials: 'TJ',
    color: 'bg-violet-600',
    name: 'Tejas Jadhav',
    role: 'Product Developer',
    detail: 'Software Engineer Professional. Drives full-stack development and feature engineering across the platform.',
    linkedin: 'https://www.linkedin.com/in/tejas-jadhav-b7230a211/',
  },
  {
    initials: 'AS',
    color: 'bg-emerald-600',
    name: 'Aditya Sharma',
    role: 'Product Security Architect',
    detail: 'Cyber Security Professional. Owns security architecture, threat modelling, and compliance posture for the platform.',
    linkedin: 'https://www.linkedin.com/in/aditya-sharma-4b550824a/',
  },
]

/* ─── sub-sections ────────────────────────────────────────────────────────── */
function NavBar({ onDemo }: { onDemo: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  const links = ['Overview', 'Features', 'Comparison', 'Timeline', 'Team']
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a1f35]/95 backdrop-blur-md border-b border-brand-blue/20 shadow-large' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-blue/30 p-2 rounded-xl border border-brand-blue/40 text-brand-gold">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <span className="font-sans font-bold tracking-wide text-white text-sm uppercase block leading-none">ProjectSeaT</span>
            <span className="text-[9px] tracking-widest text-brand-gold uppercase font-mono">Maritime Training</span>
          </div>
        </div>
        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-xs font-medium text-slate-300 hover:text-white transition-colors tracking-wide"
            >
              {l}
            </a>
          ))}
        </div>
        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-4 py-2 cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onDemo}
            className="bg-brand-gold hover:bg-amber-400 text-brand-navy font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-[0_0_24px_rgba(244,162,97,0.5)] active:scale-95"
          >
            Start Live Demo
          </button>
        </div>
        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0a1f35]/98 border-t border-brand-blue/20 px-6 py-4 space-y-3">
          {links.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-slate-300 hover:text-white py-1"
            >
              {l}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button onClick={() => navigate('/login')} className="w-full text-center py-2 text-sm text-slate-300 border border-slate-700 rounded-xl cursor-pointer">Sign In</button>
            <button onClick={onDemo} className="w-full py-2.5 bg-brand-gold text-brand-navy font-bold text-sm rounded-xl cursor-pointer">Start Live Demo</button>
          </div>
        </div>
      )}
    </nav>
  )
}

function HeroSection({ onDemo }: { onDemo: () => void }) {
  const navigate = useNavigate()
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #050e1a 0%, #0a1f35 40%, #12355B 70%, #0f2a47 100%)',
      }}
    >
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(rgba(47,102,144,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(47,102,144,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'gridDrift 25s linear infinite',
        }}
      />
      {/* Radial glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #2F6690 0%, transparent 70%)', animation: 'blobFloat1 12s ease-in-out infinite' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #F4A261 0%, transparent 70%)', animation: 'blobFloat2 16s ease-in-out infinite' }} />
      <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-2xl" style={{ background: 'radial-gradient(circle, #E76F51 0%, transparent 70%)', animation: 'blobFloat3 10s ease-in-out infinite' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-blue/20 border border-brand-blue/40 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-xs font-mono text-brand-gold uppercase tracking-widest">Enterprise Maritime Training Platform</span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
          style={{ animation: 'fadeSlideUp 0.8s ease-out both' }}
        >
          The Future of{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #F4A261, #E76F51, #F4A261)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmerText 4s linear infinite',
            }}
          >
            Maritime Training
          </span>
        </h1>

        {/* Sub */}
        <p
          className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
          style={{ animation: 'fadeSlideUp 0.8s 0.15s ease-out both' }}
        >
          Project SeaT delivers immersive, regulation-accurate Port State Control simulations that prepare seafarers and maritime officers for real-world inspections — without real-world risk.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: 'fadeSlideUp 0.8s 0.3s ease-out both' }}
        >
          <button
            onClick={onDemo}
            className="group relative flex items-center gap-3 bg-brand-gold hover:bg-amber-400 text-brand-navy font-extrabold px-8 py-4 rounded-[14px] text-base transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 32px rgba(244,162,97,0.4)' }}
          >
            <Play className="h-5 w-5" />
            Start Live Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-8 py-4 rounded-[14px] border border-slate-600 hover:border-brand-blue/60 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 cursor-pointer backdrop-blur-sm bg-white/5 hover:bg-white/10"
          >
            Sign In to Platform
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-14 text-slate-400"
          style={{ animation: 'fadeSlideUp 0.8s 0.45s ease-out both' }}
        >
          {[
            { icon: Shield, label: 'IMO Aligned' },
            { icon: Award, label: 'STCW Mapped' },
            { icon: CheckCircle, label: 'MLC 2006 Compliant' },
            { icon: Lock, label: 'Secure Platform' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
              <Icon className="h-3.5 w-3.5 text-brand-gold" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="text-[10px] font-mono uppercase tracking-widest">Explore</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  )
}

function StatsSection() {
  const [ref, inView] = useInView(0.3)
  const s1 = useCountUp(6, 1600, inView)
  const s2 = useCountUp(12, 1600, inView)
  const s3 = useCountUp(47, 1800, inView)
  const s4 = useCountUp(2400, 2000, inView)

  const stats = [
    { value: s1, suffix: '', label: 'Training Modules', sub: 'PSC · MLC · SOLAS · Emergency' },
    { value: s2, suffix: '+', label: 'Simulation Scenarios', sub: 'Branching decision trees' },
    { value: s3, suffix: '', label: 'Compliance Standards', sub: 'IMO · STCW · ILO · FLAG' },
    { value: s4, suffix: '+', label: 'Simulation Hours', sub: 'Across all rank tracks' },
  ]

  return (
    <section id="overview" className="py-24 relative" style={{ background: 'linear-gradient(180deg, #0a1f35 0%, #0d2540 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section intro */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Platform Overview</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Built for the Real World of Maritime Operations</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Every simulation in Project SeaT is grounded in actual PSC detention statistics, IMO circular requirements, and flag state inspection patterns from major MOU regions worldwide.
          </p>
        </div>

        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, suffix, label, sub }) => (
            <div
              key={label}
              className="relative bg-white/5 border border-brand-blue/20 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-brand-blue/40 transition-all duration-300 hover:bg-white/8 group"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}
            >
              <div className="text-4xl sm:text-5xl font-extrabold text-white mb-1 font-mono tracking-tight">
                {value}{suffix}
              </div>
              <div className="text-sm font-bold text-brand-gold mb-1">{label}</div>
              <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{sub}</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-brand-gold/0 group-hover:bg-brand-gold/60 transition-all duration-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const [ref, inView] = useInView(0.1)
  return (
    <section id="features" className="py-24 relative" style={{ background: '#0a1f35' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Enterprise Features for Maritime Excellence</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Designed with input from serving officers, PSC inspectors, and maritime educators — every feature addresses a real operational gap.
          </p>
        </div>
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group relative border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${f.border}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                animation: inView ? `fadeSlideUp 0.6s ${i * 0.08}s ease-out both` : 'none',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <div className={`inline-flex p-2.5 rounded-xl mb-4 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${f.bg}`} style={{ background: `radial-gradient(circle at top left, ${f.bg.includes('blue') ? 'rgba(47,102,144,0.08)' : 'rgba(244,162,97,0.06)'}, transparent 60%)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  const [ref, inView] = useInView(0.1)
  return (
    <section id="comparison" className="py-24" style={{ background: 'linear-gradient(180deg, #0a1f35 0%, #0d2842 100%)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Why Project SeaT</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Simulation vs. Traditional Training</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">The gap between classroom theory and on-board reality is where maritime incidents happen. SeaT closes that gap.</p>
        </div>
        <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Header row */}
          <div className="grid grid-cols-3 mb-3">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 pl-4">Aspect</div>
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 text-center">Traditional Training</div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-gold text-center">Project SeaT</div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-brand-blue/20" style={{ background: 'rgba(255,255,255,0.03)' }}>
            {COMPARISON.map((row, i) => (
              <div
                key={row.aspect}
                className={`grid grid-cols-3 py-4 px-4 border-b border-brand-blue/10 last:border-b-0 hover:bg-white/3 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}
              >
                <div className="text-sm font-semibold text-slate-300 pr-4">{row.aspect}</div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 text-center px-2">
                  <X className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  {row.traditional}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-400 font-medium text-center px-2">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  {row.seat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineSection({ onDemo }: { onDemo: () => void }) {
  const [ref, inView] = useInView(0.1)
  return (
    <section id="timeline" className="py-24 relative" style={{ background: '#0a1f35' }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Platform Walkthrough</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">What You'll Experience After Login</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">A complete PSC inspection from boarding to closing meeting — in under 30 minutes.</p>
        </div>
        <div ref={ref} className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-brand-blue/20 hidden sm:block" />
          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <div
                key={item.step}
                className="relative flex gap-6 items-start"
                style={{ animation: inView ? `fadeSlideUp 0.6s ${i * 0.1}s ease-out both` : 'none' }}
              >
                {/* Step number */}
                <div className="relative z-10 shrink-0 w-16 h-16 rounded-2xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center">
                  <span className="font-mono font-bold text-brand-gold text-sm">{item.step}</span>
                </div>
                {/* Content */}
                <div className="flex-1 pt-3 pb-2">
                  <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={onDemo}
            className="inline-flex items-center gap-3 bg-brand-gold hover:bg-amber-400 text-brand-navy font-extrabold px-8 py-4 rounded-[14px] text-base transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 32px rgba(244,162,97,0.3)' }}
          >
            <Play className="h-5 w-5" />
            Launch Live Simulation
          </button>
        </div>
      </div>
    </section>
  )
}

function TechStackSection() {
  return (
    <section className="py-20 border-t border-brand-blue/10" style={{ background: 'linear-gradient(180deg, #0a1f35 0%, #0d2540 100%)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Engineering</span>
          <h2 className="text-2xl font-bold text-white mt-3 mb-2">Built on Modern Infrastructure</h2>
          <p className="text-slate-500 text-sm">Enterprise-grade stack designed for reliability, performance, and extensibility.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TECH.map(t => (
            <div
              key={t.name}
              className="group text-center border border-brand-blue/15 rounded-xl py-5 px-3 bg-white/3 hover:border-brand-blue/40 hover:bg-white/6 transition-all duration-300 cursor-default"
            >
              <div className="text-sm font-bold text-white group-hover:text-brand-gold transition-colors">{t.name}</div>
              <div className="text-[11px] text-slate-500 font-mono uppercase tracking-wider mt-1">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const [ref, inView] = useInView(0.1)
  return (
    <section id="team" className="py-24" style={{ background: '#0a1f35' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">The Team</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Maritime Expertise Meets Engineering</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">Built by a multidisciplinary team spanning 22+ years of seafaring experience and enterprise software development.</p>
        </div>
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <div
              key={m.name}
              className="group relative border border-brand-blue/15 rounded-2xl p-6 bg-white/3 hover:border-brand-blue/35 hover:bg-white/6 transition-all duration-300"
              style={{ animation: inView ? `fadeSlideUp 0.6s ${i * 0.08}s ease-out both` : 'none' }}
            >
              <div className={`h-12 w-12 rounded-xl ${m.color} flex items-center justify-center text-white font-bold text-sm mb-4 shadow-medium`}>
                {m.initials}
              </div>
              <h3 className="text-sm font-bold text-white mb-0.5">{m.name}</h3>
              <p className="text-xs font-semibold text-brand-gold mb-2">{m.role}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection({ onDemo }: { onDemo: () => void }) {
  const navigate = useNavigate()
  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2842 0%, #12355B 50%, #1a3d6e 100%)' }}>
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #2F6690 0%, transparent 70%)' }} />
      </div>
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-brand-gold">Get Started</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">Ready to Elevate Maritime Training?</h2>
        <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-xl mx-auto">
          Project SeaT is purpose-built for maritime academies, shipping companies, flag state authorities, and classification societies. Experience the full platform — request an access credential from the team.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onDemo}
            className="flex items-center gap-3 bg-brand-gold hover:bg-amber-400 text-brand-navy font-extrabold px-8 py-4 rounded-[14px] text-base transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 32px rgba(244,162,97,0.4)' }}
          >
            <Play className="h-5 w-5" />
            Start Live Simulation
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-8 py-4 rounded-[14px] border border-slate-500 hover:border-brand-blue/60 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 cursor-pointer bg-white/5 hover:bg-white/10"
          >
            Sign In <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-mono uppercase tracking-wider">
          <span>For Maritime Academies</span>
          <span className="text-slate-700">·</span>
          <span>For Shipping Companies</span>
          <span className="text-slate-700">·</span>
          <span>For Flag State Authorities</span>
        </div>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-brand-blue/15 py-10" style={{ background: '#050e1a' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-blue/20 p-1.5 rounded-lg border border-brand-blue/30 text-brand-gold">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white text-xs uppercase tracking-wide">ProjectSeaT</span>
              <span className="text-slate-600 text-xs ml-2 font-mono">v1.0 · 2025</span>
            </div>
          </div>
          {/* Info */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono text-slate-600 uppercase tracking-wider">
            <span>IMO Regulations Aligned</span>
            <span>STCW Competency Mapped</span>
            <span>MLC 2006 Compliant</span>
          </div>
          {/* Copyright */}
          <p className="text-[11px] text-slate-600 font-mono">
            © {new Date().getFullYear()} Project SeaT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── keyframe CSS ────────────────────────────────────────────────────────── */
const LANDING_CSS = `
@keyframes gridDrift {
  from { background-position: 0 0; }
  to   { background-position: 60px 60px; }
}
@keyframes blobFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(40px, -60px) scale(1.1); }
}
@keyframes blobFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(-50px, 40px) scale(0.9); }
}
@keyframes blobFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(30px, 30px) scale(1.05); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmerText {
  from { background-position: 0% center; }
  to   { background-position: 200% center; }
}
`

/* ─── main export ─────────────────────────────────────────────────────────── */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const handleDemo = () => navigate('/init')

  return (
    <div className="min-h-screen" style={{ background: '#0a1f35', fontFamily: 'Manrope, system-ui, sans-serif' }}>
      <style>{LANDING_CSS}</style>
      <NavBar onDemo={handleDemo} />
      <HeroSection onDemo={handleDemo} />
      <StatsSection />
      <FeaturesSection />
      <ComparisonSection />
      <TimelineSection onDemo={handleDemo} />
      <TechStackSection />
      <TeamSection />
      <ContactSection onDemo={handleDemo} />
      <LandingFooter />
    </div>
  )
}
