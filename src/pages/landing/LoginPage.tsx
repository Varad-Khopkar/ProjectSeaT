import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Shield, Lock, Eye, EyeOff, ChevronRight, AlertCircle, CheckCircle, Anchor, Globe, Award } from 'lucide-react'
import { useAuth, DEMO_CREDENTIALS } from '@/contexts/AuthContext'

const ROLES = [
  { value: 'Master Mariner',  label: 'Master Mariner (Captain)' },
  { value: 'Chief Officer',   label: 'Chief Officer' },
  { value: 'Chief Engineer',  label: 'Chief Engineer' },
  { value: 'PSC Inspector',   label: 'PSC Inspector' },
  { value: 'Officer Cadet',   label: 'Officer Cadet (Trainee)' },
  { value: 'Maritime Faculty',label: 'Maritime Academy Faculty' },
]

const LOGIN_CSS = `
@keyframes loginFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes leftPanelIn {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes rightPanelIn {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes shimmerLine {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-14px) rotate(2deg); }
}
`

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole]         = useState(ROLES[0].value)
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter your username and password.')
      return
    }
    setError('')
    setLoading(true)
    const ok = await login(username, password, role)
    setLoading(false)
    if (ok) {
      setSuccess(true)
      setTimeout(() => navigate('/', { replace: true }), 800)
    } else {
      setError('Invalid credentials. Please use the access credentials provided to you.')
    }
  }

  const fillDemo = (cred: typeof DEMO_CREDENTIALS[number]) => {
    setUsername(cred.username)
    setPassword(cred.password)
    setRole(cred.rank)
    setError('')
  }

  return (
    <div
      className="fixed inset-0 flex"
      style={{ fontFamily: 'Manrope, system-ui, sans-serif' }}
    >
      <style>{LOGIN_CSS}</style>

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] xl:w-[560px] shrink-0 relative overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #050e1a 0%, #0a1f35 35%, #12355B 70%, #0f2a47 100%)',
          animation: 'leftPanelIn 0.7s ease-out both',
        }}
      >
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(47,102,144,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(47,102,144,0.8) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #2F6690 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-0 w-60 h-60 rounded-full opacity-15 blur-2xl" style={{ background: 'radial-gradient(circle, #F4A261 0%, transparent 70%)' }} />

        {/* Top: logo */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-blue/30 p-2.5 rounded-xl border border-brand-blue/40 text-brand-gold">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm uppercase tracking-widest block leading-none">ProjectSeaT</span>
              <span className="text-[9px] tracking-[0.2em] text-brand-gold uppercase font-mono">Maritime Training Platform</span>
            </div>
          </div>
        </div>

        {/* Center: headline + description */}
        <div className="relative z-10 px-10 flex-1 flex flex-col justify-center">
          {/* Decorative compass ring */}
          <div
            className="mb-8 relative"
            style={{ animation: 'floatSlow 8s ease-in-out infinite' }}
          >
            <div className="w-20 h-20 rounded-full border border-brand-blue/30 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-spin" style={{ animationDuration: '20s' }} />
              <Anchor className="h-8 w-8 text-brand-gold/60" />
            </div>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            The Bridge to{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #F4A261, #E76F51, #F4A261)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmerLine 4s linear infinite',
              }}
            >
              Maritime Excellence
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Immersive Port State Control simulations, MLC compliance training, and real-time performance analytics — built for seafarers, maritime academies, and shipping companies.
          </p>

          {/* Security badges */}
          <div className="space-y-3">
            {[
              { icon: Shield,  label: 'IMO Regulation Aligned',       sub: 'SOLAS · MARPOL · STCW · MLC 2006' },
              { icon: Lock,    label: 'Secure Workspace',              sub: 'Session-isolated sandbox environment' },
              { icon: Globe,   label: 'Multi-MOU Region Coverage',     sub: 'Paris · Tokyo · Indian Ocean MOU' },
              { icon: Award,   label: 'Competency-Based Assessment',   sub: 'STCW Table II/1 — VI/6 Mapped' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-brand-blue/10">
                <Icon className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">{label}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: version */}
        <div className="relative z-10 p-10 border-t border-brand-blue/10">
          <p className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">
            Version 1.0 · © {new Date().getFullYear()} Project SeaT. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative overflow-y-auto"
        style={{
          background: 'linear-gradient(160deg, #f8f6f1 0%, #faf7f2 60%, #f0ede6 100%)',
          animation: 'rightPanelIn 0.7s 0.1s ease-out both',
        }}
      >
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#12355B 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Mobile logo (shown on small screens) */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="bg-brand-blue/20 p-1.5 rounded-lg border border-brand-blue/30 text-brand-gold">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-bold text-brand-navy text-sm uppercase tracking-widest">ProjectSeaT</span>
        </div>

        <div
          className="relative z-10 w-full max-w-md px-8 py-12"
          style={{ animation: 'loginFadeIn 0.6s 0.2s ease-out both' }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-brand-navy mb-1.5 tracking-tight">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to access your training workspace.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                placeholder="e.g. captain"
                autoComplete="username"
                className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3 text-sm text-brand-navy placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3 pr-11 text-sm text-brand-navy placeholder-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                Your Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-[12px] px-4 py-3 text-sm text-brand-navy focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19 9-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="text-xs">{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold">Authentication successful — loading workspace…</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-blue text-white font-bold py-3.5 rounded-[12px] text-sm transition-all duration-200 cursor-pointer hover:shadow-[0_4px_24px_rgba(47,102,144,0.35)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Entering Workspace…
                </>
              ) : (
                <>
                  Sign In to Platform
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-5 rounded-2xl bg-brand-navy/5 border border-brand-navy/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
              <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">Access Credentials</span>
              <span className="ml-auto text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Platform Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map(cred => (
                <button
                  key={cred.username}
                  type="button"
                  onClick={() => fillDemo(cred)}
                  className="text-left px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-all duration-150 cursor-pointer group"
                >
                  <div className="text-xs font-bold text-brand-navy group-hover:text-brand-blue transition-colors">{cred.username}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{cred.rank}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/landing')}
              className="text-xs text-slate-400 hover:text-brand-navy transition-colors cursor-pointer"
            >
              ← Back to Platform Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
