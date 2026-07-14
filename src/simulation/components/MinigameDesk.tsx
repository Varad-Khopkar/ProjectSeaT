import React, { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { RestHoursPuzzle } from './RestHoursPuzzle'
import { playSound } from '../utils/audio'
import {
  FileText,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Scissors,
  Wrench,
  Brush,
  Eraser,
  ShieldAlert,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

// Certificates dataset
const CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Cargo Ship Safety Equipment Certificate',
    issueDate: '2024-03-15',
    expiryDate: '2029-03-14',
    stamps: 'Port Authority Endorsed',
    mismatch: false,
    detail: 'Equipped for 25 crew members. Lifeboats and liferafts inspected and certified.'
  },
  {
    id: 'cert-2',
    title: 'International Oil Pollution Prevention (IOPP)',
    issueDate: '2019-06-10',
    expiryDate: '2024-06-09', // EXPIRED!
    stamps: 'Class Renewal Overdue',
    mismatch: true,
    detail: 'MARPOL Annex I discharge valves. Inspection date has expired.'
  },
  {
    id: 'cert-3',
    title: 'Minimum Safe Manning Document',
    issueDate: '2023-01-20',
    expiryDate: '2028-01-19',
    stamps: 'Flag Registry Signed',
    mismatch: false,
    detail: 'Vessel matches minimum requirements of 14 crew members.'
  }
]

const GmdssLoopTest: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [dialFreq, setDialFreq] = useState(156.000)
  const [transmitting, setTransmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0) // 0: Tune, 1: Ready to Transmit, 2: Transmitting, 3: Completed

  const targetFreq = 156.525 // Channel 70 DSC
  const isTuned = Math.abs(dialFreq - targetFreq) < 0.01

  // Handle dial adjustment
  const handleDialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setDialFreq(val)
    if (Math.abs(val - targetFreq) < 0.01) {
      playSound('beep')
      setStep(1)
    } else {
      setStep(0)
    }
  }

  const handleStartTx = () => {
    if (step !== 1) return
    playSound('beep')
    setTransmitting(true)
    setStep(2)
    let currentProg = 0
    const interval = setInterval(() => {
      currentProg += 10
      setProgress(currentProg)
      if (currentProg >= 100) {
        clearInterval(interval)
        setTransmitting(false)
        setStep(3)
        playSound('success')
      }
    }, 150)
  }

  const handleConfirm = () => {
    if (step !== 3) return
    onComplete(true, 20, -15)
  }

  const handleReset = () => {
    setStep(0)
    setDialFreq(156.000)
    setTransmitting(false)
    setProgress(0)
  }

  // Generate noisy or clean sine wave path based on tuning closeness
  const getWavePath = () => {
    const closeness = Math.max(0, 1 - Math.abs(dialFreq - targetFreq) / 0.5) // 0 to 1
    const points = []
    const width = 240
    const height = 40
    const midY = height / 2
    const frequency = isTuned ? 0.15 : 0.4
    const amplitude = isTuned ? 12 : 2 + (1 - closeness) * 12

    for (let x = 0; x <= width; x += 4) {
      // Add random jitter to simulate static noise when untuned
      const noise = isTuned ? 0 : (Math.random() - 0.5) * (1 - closeness) * 15
      const y = midY + Math.sin(x * frequency) * amplitude + noise
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')}`
  }

  return (
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      <div className="border-b border-white/5 pb-3 mb-4">
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="p-1 bg-amber-500/20 text-brand-gold rounded border border-amber-500/10">VHF</span>
          GMDSS DSC Loop Test
        </h2>
        <p className="text-[10px] text-slate-400 mt-1">
          Perform a Digital Selective Calling self-test loop verification to check transceiver circuits (SOLAS Chapter IV).
        </p>
      </div>

      {/* Screen Monitor with Oscilloscope wave */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[140px] flex flex-col justify-between font-mono text-xs mb-5 shadow-inner">
        <div className="text-[10px] text-brand-gold/60 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
          <span>DSC SIGNAL SCOPE</span>
          <span className={isTuned ? "text-emerald-400 font-extrabold" : "text-amber-500 animate-pulse"}>
            {step === 3 ? "● ONLINE" : isTuned ? "● SIGNAL LOCK" : "● NO SIGNAL"}
          </span>
        </div>

        {/* Dynamic Sine wave visualizer */}
        <div className="w-full h-10 bg-slate-900/80 rounded border border-white/5 my-2 overflow-hidden relative flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full">
            <path
              d={getWavePath()}
              fill="none"
              stroke={isTuned ? '#10B981' : '#F59E0B'}
              strokeWidth="2"
              className={isTuned ? "animate-[pulse_1s_infinite]" : ""}
            />
          </svg>
        </div>

        <div className="text-white mt-1 leading-relaxed text-xs space-y-1">
          <div>FREQ: <span className="text-brand-gold font-bold">{dialFreq.toFixed(3)} MHz</span> (CH 70)</div>
          <div className="text-[10px] text-slate-400 uppercase">
            STATUS: {step === 3 ? "LOOPBACK RECEIPT: OK (100% SIGNAL)" : transmitting ? "TRANSMITTING TEST SIGNAL..." : isTuned ? "TUNED! READY TO INITIATE LOOP TEST" : "TUNE ROTARY DIAL TO 156.525 MHZ"}
          </div>
        </div>

        {transmitting && (
          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-brand-gold h-full transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Mechanical Tuning dial slider */}
      <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 mb-6">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
          Rotary Tuning Knob:
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="156.000"
            max="157.000"
            step="0.025"
            value={dialFreq}
            onChange={handleDialChange}
            disabled={transmitting || step === 3}
            className="flex-1 accent-brand-gold h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="font-mono text-xs text-brand-gold bg-slate-950 px-2 py-1 rounded border border-white/5">
            {dialFreq.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Verify / Reset Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <button
          onClick={handleReset}
          disabled={transmitting}
          className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Controller
        </button>

        <button
          onClick={step === 1 ? handleStartTx : handleConfirm}
          disabled={(step !== 1 && step !== 3) || transmitting}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large ${step === 1 || step === 3
            ? 'bg-brand-gold hover:bg-amber-400 text-brand-navy'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
        >
          {step === 3 ? "Verify & Log Test" : "Send DSC Test"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

const GangwayNettingTest: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [tension, setTension] = useState(20)

  // Status mapping
  let statusText = 'CRITICAL FAILURE'
  let detailsText = 'Net is loose and sagging into the water. Large gaps (>1.5m) between the ladder and ship hull.'
  let statusColor = 'text-brand-coral bg-brand-coral/10 border-brand-coral/20'
  let isCompliant = false

  if (tension >= 65 && tension <= 85) {
    statusText = 'COMPLIANT (SOLAS APPROVED)'
    detailsText = 'Perfect tension. Gaps are closed under 0.5m. Netting is fully suspended 1.5m above the concrete pier.'
    statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    isCompliant = true
  } else if (tension > 85) {
    statusText = 'NON-COMPLIANT (TOO TIGHT)'
    detailsText = 'Netting is over-tensioned. Hooks and secure ropes are under extreme stress and risk failure/tearing.'
    statusColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  } else if (tension >= 40 && tension < 65) {
    statusText = 'NON-COMPLIANT (LOOSE)'
    detailsText = 'Net is partially rigged, but slack creates safety gaps of 0.8m. Violates international standards.'
    statusColor = 'text-amber-600 bg-amber-600/10 border-amber-600/20'
  }

  const handleTighten = () => {
    setTension(prev => Math.min(100, prev + 15))
  }

  const handleLoosen = () => {
    setTension(prev => Math.max(0, prev - 15))
  }

  const handleVerify = () => {
    if (isCompliant) {
      onComplete(true, 20, -15)
    } else {
      onComplete(false, -10, 20)
    }
  }

  // Calculate SVG curve sag based on tension
  const sagOffset = 60 - (tension * 0.45) // higher tension = lower sag (flatter curve)

  return (
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      <div className="border-b border-white/5 pb-3 mb-4">
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="p-1 bg-brand-gold/25 text-brand-gold rounded border border-brand-gold/10">SOLAS</span>
          Gangway Safety Net Calibration
        </h2>
        <p className="text-[10px] text-slate-400 mt-1">
          Adjust the accommodation ladder netting tension. Prevent safety netting gaps and water fall hazards.
        </p>
      </div>

      {/* Visual Canvas (Responsive SVG diagram) */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 h-32 flex items-center justify-center mb-4 relative overflow-hidden shadow-inner">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Ship Hull (Left) */}
          <rect x="0" y="0" width="35" height="100" fill="#0A1F35" />
          <line x1="35" y1="0" x2="35" y2="100" stroke="#F4A261" strokeWidth="1.5" />

          {/* Pier Dock (Right) */}
          <rect x="165" y="80" width="35" height="20" fill="#222" />

          {/* Ladder (Angled) */}
          <line x1="35" y1="20" x2="165" y2="85" stroke="#CCC" strokeWidth="4" strokeLinecap="round" />
          {/* Ladder rungs */}
          <line x1="55" y1="29.5" x2="57" y2="34.5" stroke="#444" strokeWidth="2" />
          <line x1="75" y1="39.5" x2="77" y2="44.5" stroke="#444" strokeWidth="2" />
          <line x1="95" y1="49.5" x2="97" y2="54.5" stroke="#444" strokeWidth="2" />
          <line x1="115" y1="59.5" x2="117" y2="64.5" stroke="#444" strokeWidth="2" />
          <line x1="135" y1="69.5" x2="137" y2="74.5" stroke="#444" strokeWidth="2" />

          {/* Safety Netting (Hanging curve from Hull to Pier below ladder) */}
          <path
            d={`M 35 30 Q 100 ${sagOffset + 50} 165 85`}
            fill="none"
            stroke="#2F6690"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            className="transition-all duration-300"
          />
          {/* Net mesh visual cross bars */}
          <path
            d={`M 35 30 Q 100 ${sagOffset + 55} 165 85`}
            fill="none"
            stroke="#2F6690"
            strokeWidth="1.5"
            strokeDasharray="1 3"
            className="transition-all duration-300"
          />

          {/* Water (Bottom) */}
          <rect x="35" y="90" width="130" height="10" fill="#1d3557" opacity="0.8" />
        </svg>

        {/* Tension Meter Overlay */}
        <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 rounded px-1.5 py-0.5 text-[8.5px] font-mono text-brand-gold">
          TENSION: {tension}%
        </div>
      </div>

      {/* Status Indicators */}
      <div className={`border rounded-xl p-3 text-xs mb-5 font-medium ${statusColor}`}>
        <div className="font-extrabold uppercase text-[10px] tracking-wide mb-0.5">{statusText}</div>
        <p className="opacity-90 leading-normal">{detailsText}</p>
      </div>

      {/* Adjust buttons */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={handleLoosen}
          disabled={tension <= 0}
          className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          Loosen Net
        </button>
        <button
          onClick={handleTighten}
          disabled={tension >= 100}
          className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          Tighten Net
        </button>
      </div>

      {/* Conclude Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[9px] text-slate-500 max-w-[150px]">
          * SOLAS netting prevents safety gaps and crew falls.
        </span>

        <button
          onClick={handleVerify}
          className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large active:scale-[0.98]"
        >
          Rig & Confirm Net
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

const FireDoorTest: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [_leverReleased, setLeverReleased] = useState(false)
  const [closingTime, setClosingTime] = useState(0) // seconds
  const [hydraulicValve, setHydraulicValve] = useState(25) // 0 to 100% flow restriction
  const [step, setStep] = useState<number>(0) // 0: Released electromagnet, 1: Timing, 2: Closed, 3: Completed

  const handleRelease = () => {
    playSound('beep')
    setLeverReleased(true)
    setStep(1)

    // closing time = hydraulicValve * 0.15 + (random between 2 and 4s)
    const duration = Math.round((hydraulicValve * 0.18 + 2.5) * 10) / 10

    let currentT = 0
    const interval = setInterval(() => {
      currentT += 0.5
      setClosingTime(Math.min(duration, currentT))
      if (currentT >= duration) {
        clearInterval(interval)
        setStep(2)
        playSound(duration >= 4 && duration <= 15 ? 'success' : 'failure')
      }
    }, 150)
  }

  const handleVerify = () => {
    // Compliant SOLAS closing duration is 4 to 15 seconds
    const success = closingTime >= 4 && closingTime <= 15
    if (success) {
      playSound('success')
      onComplete(true, 20, -10)
    } else {
      playSound('failure')
      onComplete(false, -15, 25)
    }
  }

  const handleReset = () => {
    setLeverReleased(false)
    setClosingTime(0)
    setStep(0)
  }

  const isCompliant = closingTime >= 4 && closingTime <= 15

  return (
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      <div className="border-b border-white/5 pb-3 mb-4">
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="p-1 bg-red-500/20 text-brand-coral rounded border border-red-500/10">SOLAS</span>
          Fire Door Release Timer
        </h2>
        <p className="text-[10px] text-slate-400 mt-1">
          Release the electromagnetic bulkhead lock. Calibrate the hydraulic screw valve to ensure closing time fits the 4-15 second requirement.
        </p>
      </div>

      {/* Visual Door display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[140px] flex flex-col justify-between font-mono text-xs mb-5 shadow-inner">
        <div className="text-[10px] text-brand-gold/60 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
          <span>BULKHEAD DOOR</span>
          <span className={step === 2 ? (isCompliant ? "text-emerald-400" : "text-brand-coral") : "text-amber-500"}>
            {step === 0 ? "● HELD (MAGNET ON)" : step === 1 ? "● CLOSING..." : isCompliant ? "● SECURED (COMPLIANT)" : "● NON-COMPLIANT"}
          </span>
        </div>

        {/* Door animation box */}
        <div className="w-full h-12 bg-slate-900 rounded border border-white/5 relative my-2 overflow-hidden flex items-center">
          {/* Electromagnetic holdback */}
          <div className="absolute left-2 w-3 h-6 bg-slate-800 border border-white/10 rounded" />

          {/* Sliding door */}
          <div
            className="absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-red-800 to-red-650 border border-red-500/30 rounded shadow-md flex items-center justify-center transition-all duration-200"
            style={{
              left: step === 0
                ? '8px'
                : step === 1
                  ? `${8 + (closingTime / (hydraulicValve * 0.18 + 2.5)) * 170}px`
                  : '180px'
            }}
          >
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">FIRE DOOR</span>
          </div>

          {/* Door Frame Latch */}
          <div className="absolute right-2 w-2 h-10 bg-slate-700 rounded" />
        </div>

        <div className="text-white mt-1 leading-relaxed text-[11px] space-y-1">
          <div>CLOSING SPEED: <span className="text-brand-gold font-bold">{closingTime.toFixed(1)} seconds</span></div>
          <div className="text-[10px] text-slate-400 uppercase">
            STATUS: {step === 0 ? "LOCK ENGAGED. PULL EMERGENCY RELEASE SWITCH." : step === 1 ? "DOOR SWINGING IN PROCESS..." : isCompliant ? `SUCCESS! CLOSED IN ${closingTime.toFixed(1)}S (SOLAS APPROVED)` : `FAIL! CLOSED IN ${closingTime.toFixed(1)}S (MUST BE 4 - 15 SECONDS)`}
          </div>
        </div>
      </div>

      {/* Hydraulic Closer Valve Calibration */}
      <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 mb-6">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
          Hydraulic Adjustment Screw (Flow restriction):
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5"
            max="95"
            value={hydraulicValve}
            onChange={(e) => { playSound('click'); setHydraulicValve(parseInt(e.target.value)) }}
            disabled={step === 1}
            className="flex-1 accent-brand-coral h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="font-mono text-xs text-brand-coral bg-slate-950 px-2 py-1 rounded border border-white/5">
            {hydraulicValve}%
          </span>
        </div>
        <span className="text-[9.5px] text-slate-500 mt-1 block">
          * Higher restriction increases closing time. Lower restriction makes door slam faster.
        </span>
      </div>

      {/* Verify / Reset Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <button
          onClick={handleReset}
          disabled={step === 1}
          className="px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Door
        </button>

        <button
          onClick={step === 0 ? handleRelease : handleVerify}
          disabled={step === 1 || step === 3}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large ${step === 0 || step === 2
            ? 'bg-brand-gold hover:bg-amber-400 text-brand-navy'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
        >
          {step === 0 ? "Release Switch" : "Verify & Log Test"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

const OwsTest: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [ppm, setPpm] = useState(25)
  const [step, setStep] = useState<number>(0) // 0: Injecting sample, 1: Verifying alarm redirect, 2: Flushing sensor, 3: Completed
  const [flushed, setFlushed] = useState(false)
  const [valveRedirected, setValveRedirected] = useState(false)

  const handleInject = () => {
    if (ppm >= 15) {
      playSound('alarm')
      setValveRedirected(true)
      setStep(1)
    } else {
      playSound('failure')
    }
  }

  const handleFlush = () => {
    playSound('success')
    setPpm(2)
    setFlushed(true)
    setStep(2)
  }

  const handleReset = () => {
    playSound('beep')
    setPpm(25)
    setStep(0)
    setFlushed(false)
    setValveRedirected(false)
  }

  const handleVerify = () => {
    if (valveRedirected && flushed && ppm < 15) {
      playSound('success')
      onComplete(true, 20, -10)
    } else {
      playSound('failure')
      onComplete(false, -15, 25)
    }
  }

  return (
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      <div className="border-b border-white/5 pb-3 mb-4">
        <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/10">MARPOL</span>
          OWS 15PPM Bilge Alarm
        </h2>
        <p className="text-[10px] text-slate-400 mt-1">
          Audit the 15ppm Bilge Alarm. Adjust input PPM, trigger the failsafe 3-way solenoid valve, and flush the sensor (MARPOL Annex I).
        </p>
      </div>

      {/* Screen Monitor and Flow Schematic */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 min-h-[160px] flex flex-col justify-between font-mono text-xs mb-5 shadow-inner">
        <div className="text-[10px] text-brand-gold/60 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
          <span>OWS PROCESS FLOW</span>
          <span className={ppm >= 15 ? "text-brand-coral animate-pulse font-extrabold" : "text-emerald-400"}>
            {ppm >= 15 ? "● OVER LIMIT ALARM" : "● LIMIT OK"}
          </span>
        </div>

        {/* Schematic SVG */}
        <div className="w-full h-16 bg-slate-900/60 rounded border border-white/5 my-2 relative flex items-center justify-center">
          <svg className="w-full h-full text-slate-500">
            {/* OWS Cylinder */}
            <rect x="15" y="10" width="30" height="40" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="30" y="34" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">OWS</text>

            {/* Input Line */}
            <path d="M 5,30 L 15,30" fill="none" stroke="#475569" strokeWidth="3" />

            {/* Output to Valve */}
            <path d="M 45,30 L 100,30" fill="none" stroke="#475569" strokeWidth="3" />

            {/* 3-Way Solenoid Valve */}
            <circle cx="100" cy="30" r="8" fill={step === 1 ? "#EF4444" : "#10B981"} stroke="#fff" strokeWidth="1" />
            <text x="100" y="33" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">V</text>

            {/* Overboard Line */}
            <path
              d="M 108,30 L 160,30"
              fill="none"
              stroke={step !== 1 ? "#0EA5E9" : "#334155"}
              strokeWidth="2.5"
              className={step !== 1 ? "animate-[pulse_1s_infinite]" : ""}
            />
            <text x="155" y="24" fill={step !== 1 ? "#0EA5E9" : "#475569"} fontSize="7" fontWeight="bold" textAnchor="end">OVERBOARD</text>

            {/* Recirculation Line */}
            <path
              d="M 100,38 L 100,55 L 70,55"
              fill="none"
              stroke={step === 1 ? "#EF4444" : "#334155"}
              strokeWidth="2.5"
              className={step === 1 ? "animate-[pulse_1s_infinite]" : ""}
            />
            <text x="65" y="58" fill={step === 1 ? "#EF4444" : "#475569"} fontSize="7" fontWeight="bold">BILGE TANK</text>
          </svg>
        </div>

        <div className="text-white mt-1 leading-relaxed text-[11px] space-y-1">
          <div>OIL CONTENT: <span className={ppm >= 15 ? "text-brand-coral font-bold" : "text-emerald-400 font-bold"}>{ppm} PPM</span></div>
          <div className="text-[10px] text-slate-400 uppercase">
            VALVE DESTINATION: {step === 1 ? "RECIRCULATION BACK TO BILGE TANK" : "OVERBOARD DISCHARGE"}
          </div>
          <div className="text-[9.5px] text-brand-gold uppercase tracking-wider font-bold mt-1.5 pt-1.5 border-t border-white/5">
            {step === 0 && ppm < 15 && "● SENSOR ONLINE. INCREASE PPM TO 15+ TO TRIGGER ALARM TEST."}
            {step === 0 && ppm >= 15 && "● READY TO TEST. CLICK 'INJECT TEST SAMPLE' TO SEND FLOW."}
            {step === 1 && "● ALARM TRIGGERED! SOLENOID DIVERTED TO BILGE. CLICK 'FLUSH SENSOR'."}
            {step === 2 && "● SENSOR CLEANED. FLOW SAFE. CLICK 'VERIFY & LOG TEST' TO COMPLETE."}
          </div>
        </div>
      </div>

      {/* Slider adjustment for oil sample */}
      <div className="bg-slate-950/40 border border-white/5 rounded-xl p-4 mb-6">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
          Adjust Oil Concentration (PPM Slider):
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="40"
            value={ppm}
            onChange={(e) => { playSound('click'); setPpm(parseInt(e.target.value)) }}
            disabled={step !== 0}
            className="flex-1 accent-emerald-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className={`font-mono text-xs px-2 py-1 rounded border border-white/5 ${ppm >= 15 ? "text-brand-coral bg-brand-coral/10" : "text-emerald-400 bg-emerald-500/10"}`}>
            {ppm} PPM
          </span>
        </div>
      </div>

      {/* Verify / Reset Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <button
          onClick={step === 1 ? handleFlush : handleReset}
          disabled={step === 0}
          className={`px-4 py-2 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${step === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {step === 1 ? "Flush Sensor" : "Reset Test"}
        </button>

        <button
          onClick={step === 0 ? handleInject : handleVerify}
          disabled={step === 1 || (step === 0 && ppm < 15)}
          className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large ${(step === 0 && ppm >= 15) || step === 2
            ? 'bg-brand-gold hover:bg-amber-400 text-brand-navy'
            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
        >
          {step === 0 ? "Inject Test Sample" : "Verify & Log Test"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export const MinigameDesk: React.FC = () => {
  const { state, completeMinigame } = useSimulation()

  // Certificate Stamp states
  const [currentIndex, setCurrentIndex] = useState(0)
  const [auditedStates, setAuditedStates] = useState<Record<string, 'approved' | 'deficiency'>>({})
  const [finished, setFinished] = useState(false)
  const [activeStampTool, setActiveStampTool] = useState<'approved' | 'deficiency' | null>(null)
  const [stampCoords, setStampCoords] = useState<Record<string, { x: number; y: number } | null>>({})

  if (!state.activeMinigame) return null

  // If the active minigame is rest hours, return the RestHoursPuzzle component
  if (state.activeMinigame === 'rest_hours') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <RestHoursPuzzle />
      </div>
    )
  }

  // If the active minigame is gangway safety netting tension
  if (state.activeMinigame === 'gangway_netting') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <GangwayNettingTest onComplete={completeMinigame} />
      </div>
    )
  }

  // If GMDSS DSC radio loop test minigame
  if (state.activeMinigame === 'gmdss_loop') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <GmdssLoopTest onComplete={completeMinigame} />
      </div>
    )
  }

  // If the active minigame is fire door release test
  if (state.activeMinigame === 'fire_door_test') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <FireDoorTest onComplete={completeMinigame} />
      </div>
    )
  }

  // If the active minigame is OWS bilge alarm test
  if (state.activeMinigame === 'ows_test') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <OwsTest onComplete={completeMinigame} />
      </div>
    )
  }

  // If the active minigame is Detention Sort
  if (state.activeMinigame === 'detention_sort') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <ZenithCaseStudy onComplete={completeMinigame} />
      </div>
    )
  }

  // If the active minigame is Escort Safety Locker Gear-up
  if (state.activeMinigame === 'escort_gear') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <EscortGear onComplete={completeMinigame} />
      </div>
    )
  }

  // If the active minigame is Escort Cooperation Trust Challenge
  if (state.activeMinigame === 'escort_trust') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <EscortTrust onComplete={completeMinigame} />
      </div>
    )
  }

  // If the active minigame is Case Studies
  if (state.activeMinigame === 'case_studies') {
    return (
      <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <CaseStudies onComplete={completeMinigame} />
      </div>
    )
  }

  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeStampTool || finished) return

    // Get relative click coordinates inside card
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cert = CERTIFICATES[currentIndex]
    setAuditedStates((prev) => ({ ...prev, [cert.id]: activeStampTool }))
    setStampCoords((prev) => ({ ...prev, [cert.id]: { x, y } }))

    // Play stamp "clunk" sound
    playSound('beep')

    // Auto transition next or completed after a brief animation delay
    setTimeout(() => {
      if (currentIndex < CERTIFICATES.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setActiveStampTool(null)
      } else {
        setFinished(true)
      }
    }, 800)
  }

  const handleVerifyCertificates = () => {
    const cert1Correct = auditedStates['cert-1'] === 'approved'
    const cert2Correct = auditedStates['cert-2'] === 'deficiency'
    const cert3Correct = auditedStates['cert-3'] === 'approved'

    const success = cert1Correct && cert2Correct && cert3Correct
    if (success) {
      completeMinigame(true, 20, -15)
    } else {
      completeMinigame(false, -10, 20)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setAuditedStates({})
    setStampCoords({})
    setActiveStampTool(null)
    setFinished(false)
  }

  const activeCert = CERTIFICATES[currentIndex]

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-gold" />
              Statutory Certificates Audit
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Select a rubber stamp tool from below, then click anywhere on the certificate to stamp it.
            </p>
          </div>
          <span className="text-[10.5px] font-mono text-brand-gold bg-brand-blue/30 px-2.5 py-0.5 rounded-full border border-brand-blue/20">
            {finished ? 'Completed' : `${currentIndex + 1}/${CERTIFICATES.length}`}
          </span>
        </div>

        {/* Card Content */}
        {!finished ? (
          <div className="flex-1 flex flex-col justify-between py-2 min-h-[260px]">
            {/* Active Document Card */}
            <div
              onClick={handleDocumentClick}
              className={`bg-amber-50/95 border-2 border-amber-250 rounded-xl p-5 shadow-lg space-y-3 relative overflow-hidden transition-all duration-200 select-none ${activeStampTool
                ? 'cursor-crosshair hover:bg-amber-100/90 hover:scale-[1.01]'
                : 'cursor-default'
                }`}
            >
              {/* Retro certificate stamp graphic inside card */}
              <div className="absolute top-2 right-2 w-12 h-12 border border-dashed border-amber-300 rounded-full flex items-center justify-center text-[7px] text-amber-500 font-bold uppercase tracking-wider rotate-12 select-none">
                Official Seal
              </div>

              <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider border-b border-amber-200 pb-1">
                📜 {activeCert.title}
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-[10px] font-mono text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Issue Date:</span>
                  <span>{activeCert.issueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Expiry Date:</span>
                  <span>{activeCert.expiryDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Stamps & Checks:</span>
                  <span>{activeCert.stamps}</span>
                </div>
              </div>
              <p className="text-[10.5px] text-slate-600 border-t border-amber-100 pt-2 italic leading-relaxed">
                {activeCert.detail}
              </p>

              {/* Stamped visual marker if clicked */}
              {stampCoords[activeCert.id] && (
                <div
                  className={`absolute font-extrabold uppercase text-[12px] border-4 px-3 py-1.5 rounded-lg select-none pointer-events-none scale-110 tracking-widest rotate-[-12deg] shadow-md animate-[bounce_0.2s_ease-out] ${auditedStates[activeCert.id] === 'approved'
                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50/80'
                    : 'border-red-600 text-red-600 bg-red-50/80'
                    }`}
                  style={{
                    left: `${stampCoords[activeCert.id]!.x - 60}px`,
                    top: `${stampCoords[activeCert.id]!.y - 20}px`
                  }}
                >
                  {auditedStates[activeCert.id] === 'approved' ? '✓ APPROVED' : '⚠ DEFICIENT'}
                </div>
              )}
            </div>

            {/* Stamp selection actions */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="text-[9.5px] text-slate-400 uppercase tracking-wider text-center font-bold">
                {!activeStampTool ? "1. Select rubber stamp from below:" : "2. Now click inside the certificate to stamp it!"}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { playSound('click'); setActiveStampTool('deficiency') }}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${activeStampTool === 'deficiency'
                    ? 'bg-red-650 border-red-500 text-white scale-[1.03] ring-2 ring-red-400/40'
                    : 'bg-red-500/10 border-red-500/20 text-brand-coral hover:bg-red-500/20'
                    }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  STAMP DEFICIENCY
                </button>
                <button
                  onClick={() => { playSound('click'); setActiveStampTool('approved') }}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border shadow-sm ${activeStampTool === 'approved'
                    ? 'bg-emerald-650 border-emerald-500 text-white scale-[1.03] ring-2 ring-emerald-400/40'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  STAMP APPROVED
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Audit review list */}
            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-2">Audit Stamp Results</h3>
              {CERTIFICATES.map(c => {
                const decision = auditedStates[c.id]
                return (
                  <div key={c.id} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-400 truncate max-w-[200px]">{c.title}</span>
                    <span className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${decision === 'approved'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-brand-coral'
                      }`}>
                      {decision === 'approved' ? 'STAMP APPROVED' : 'STAMP DEFICIENT'}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 border border-slate-700 bg-slate-800 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Stamps
              </button>
              <button
                onClick={handleVerifyCertificates}
                className="px-5 py-2 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large active:scale-[0.98]"
              >
                Submit Certificates
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface StorySlide {
  title: string
  subtitle: string
  text: string
}

const STORY_SLIDES: StorySlide[] = [
  {
    title: "1. Disabled Fuel Cutoffs",
    subtitle: "Safety Warnings Ignored",
    text: "The S.S. Zenith propped open the emergency fuel quick-closing valve wire and ignored a fuel coupler drip in the generator flat."
  },
  {
    title: "2. The Boarding",
    subtitle: "Inspector Kowalski Boards",
    text: "During the audit, Kowalski noted the disabled fuel cutoffs, generator fuel leaks, and loose battery terminal clamps."
  },
  {
    title: "3. The Failure",
    subtitle: "Immediate Detention Arrest",
    text: "The emergency generator failed to start due to corroded terminals, and hot exhaust lagging presented a major fire hazard. Kowalski issued a Code 30!"
  },
  {
    title: "4. Your Mission",
    subtitle: "Rectify Hazards Immediately",
    text: "Enter the Emergency Generator room. Use your tool dock (Knife, Wrench, Rag, Brush) to resolve all 4 hazards before Kowalski boards!"
  }
]

const ZenithCaseStudy: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'slides' | 'game' | 'summary'>('slides')
  const [slideIndex, setSlideIndex] = useState(0)
  
  // Interactive tool states
  const [activeTool, setActiveTool] = useState<'knife' | 'wrench' | 'rag' | 'brush' | null>(null)
  
  // Puzzle completed flags
  const [ropeCut, setRopeCut] = useState(false)
  const [couplerTight, setCouplerTight] = useState(false)
  const [oilCleaned, setOilCleaned] = useState(false)
  const [strainerClean, setStrainerClean] = useState(false)
  
  // Feedback and scores
  const [feedbackText, setFeedbackText] = useState<string>("Select a tool from the dock and click on a hazard to fix it.")
  const [points, setPoints] = useState(15) // Start with base points
  const [errors, setErrors] = useState(0)

  const handleNextSlide = () => {
    playSound('click')
    if (slideIndex < STORY_SLIDES.length - 1) {
      setSlideIndex((prev) => prev + 1)
    } else {
      setStage('game')
    }
  }

  const handlePrevSlide = () => {
    playSound('click')
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1)
    }
  }

  const handleToolSelect = (tool: 'knife' | 'wrench' | 'rag' | 'brush') => {
    playSound('click')
    setActiveTool(tool === activeTool ? null : tool)
    setFeedbackText(`Tool selected: ${tool.toUpperCase()}. Click on the matching hazard to apply it.`)
  }

  const handleInteractRope = () => {
    if (ropeCut) return
    if (activeTool === 'knife') {
      playSound('success')
      setRopeCut(true)
      setPoints((prev) => prev + 10)
      setFeedbackText("SUCCESS: Sliced the wooden block jam! The emergency quick-closing valve is now operational.")
      setActiveTool(null)
    } else {
      playSound('failure')
      setErrors((prev) => prev + 1)
      setPoints((prev) => Math.max(0, prev - 5))
      setFeedbackText("ERROR: You need a sharp KNIFE to slice the wood blocking the quick-closing valve wire.")
    }
  }

  const handleInteractCoupler = () => {
    if (couplerTight) return
    if (activeTool === 'wrench') {
      playSound('success')
      setCouplerTight(true)
      setPoints((prev) => prev + 10)
      setFeedbackText("SUCCESS: Tightened exhaust lagging clamps! Fire hazard from exposed hot piping eliminated.")
      setActiveTool(null)
    } else {
      playSound('failure')
      setErrors((prev) => prev + 1)
      setPoints((prev) => Math.max(0, prev - 5))
      setFeedbackText("ERROR: You need a WRENCH to tighten loose exhaust lagging clamps on the hot exhaust pipe.")
    }
  }

  const handleInteractOil = () => {
    if (oilCleaned) return
    if (activeTool === 'rag') {
      playSound('success')
      setOilCleaned(true)
      setPoints((prev) => prev + 10)
      setFeedbackText("SUCCESS: Oily pool wiped from the generator drip tray!")
      setActiveTool(null)
    } else {
      playSound('failure')
      setErrors((prev) => prev + 1)
      setPoints((prev) => Math.max(0, prev - 5))
      setFeedbackText("ERROR: You need an absorbent RAG to wipe the pooled fuel oil leak.")
    }
  }

  const handleInteractStrainer = () => {
    if (strainerClean) return
    if (activeTool === 'brush') {
      playSound('success')
      setStrainerClean(true)
      setPoints((prev) => prev + 10)
      setFeedbackText("SUCCESS: Brushed corrosion off generator starter battery terminals! Voltage restored.")
      setActiveTool(null)
    } else {
      playSound('failure')
      setErrors((prev) => prev + 1)
      setPoints((prev) => Math.max(0, prev - 5))
      setFeedbackText("ERROR: You need a wire BRUSH to scrub rust and corrosion off the battery terminals.")
    }
  }

  const checkGameCompleted = ropeCut && couplerTight && oilCleaned && strainerClean

  const handleFinish = () => {
    playSound('click')
    setStage('summary')
  }

  const handleSubmit = () => {
    const success = errors <= 2
    onComplete(success, points, success ? -15 : 25)
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      
      {/* 1. Slides view */}
      {stage === 'slides' && (
        <div className="flex flex-col justify-between min-h-[360px]">
          {/* Header */}
          <div className="border-b border-white/5 pb-2.5">
            <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
              Module 3: Avoiding Detentions
            </span>
            <h3 className="font-h3 text-white text-sm mt-0.5">S.S. Zenith Case Study</h3>
          </div>

          {/* Slide graphic placeholder */}
          <div className="my-4 h-24 bg-slate-950/80 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
            {slideIndex === 0 && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4 animate-in fade-in duration-200">
                <FileText className="h-7 w-7 text-brand-coral" />
                <span className="text-[10px] text-slate-400">Departing port with unrecorded safety leaks and tied doors</span>
              </div>
            )}
            {slideIndex === 1 && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4 animate-in fade-in duration-200">
                <ShieldAlert className="h-7 w-7 text-brand-gold" />
                <span className="text-[10px] text-slate-400">Inspector Kowalski logs major fire and oil spill hazards</span>
              </div>
            )}
            {slideIndex === 2 && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4 animate-in fade-in duration-200">
                <AlertTriangle className="h-7 w-7 text-red-500 animate-pulse" />
                <span className="text-[10px] text-brand-coral font-bold font-mono">CODE 30 DETENTION ARREST ($25K/DAY FINES)</span>
              </div>
            )}
            {slideIndex === 3 && (
              <div className="flex flex-col items-center gap-1.5 text-center px-4 animate-in fade-in duration-200">
                <Wrench className="h-7 w-7 text-emerald-400" />
                <span className="text-[10px] text-slate-400">Prepare your tools. Time travel back and fix all 3 risks!</span>
              </div>
            )}
          </div>

          {/* Slide text */}
          <div className="flex-1 px-1">
            <span className="text-[10px] font-bold font-mono text-brand-gold uppercase tracking-wider">
              {STORY_SLIDES[slideIndex].title}
            </span>
            <h4 className="text-white text-xs font-bold font-sans mt-0.5">{STORY_SLIDES[slideIndex].subtitle}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2">
              {STORY_SLIDES[slideIndex].text}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="border-t border-white/5 pt-3.5 mt-3 flex items-center justify-between">
            <button
              onClick={handlePrevSlide}
              disabled={slideIndex === 0}
              className={`px-3 py-1.5 bg-slate-800 text-white rounded-lg text-2xs font-bold uppercase transition-all cursor-pointer ${slideIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-700"}`}
            >
              Back
            </button>
            <div className="flex gap-1">
              {STORY_SLIDES.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === slideIndex ? "bg-brand-gold w-3" : "bg-slate-700"}`} />
              ))}
            </div>
            <button
              onClick={handleNextSlide}
              className="px-4 py-1.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-lg text-2xs font-extrabold uppercase transition-all cursor-pointer flex items-center gap-0.5"
            >
              {slideIndex === STORY_SLIDES.length - 1 ? "Start Audit" : "Next"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Interactive Game stage */}
      {stage === 'game' && (
        <div className="flex flex-col justify-between min-h-[380px]">
          {/* Header */}
          <div className="border-b border-white/5 pb-2 mb-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
                Emergency Generator Room
              </span>
              <h3 className="font-h3 text-white text-sm mt-0.5">Pre-Arrival Rectification</h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block font-mono">Score</span>
              <span className="font-mono text-xs text-white font-bold">{points} PTS</span>
            </div>
          </div>

          {/* Interactive Ghibli Background Image Container */}
          <div className="relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden bg-slate-950">
            <img 
              src="/assets/images/emergency_gen.png" 
              alt="Emergency Generator Room" 
              className="w-full h-full object-cover select-none"
            />
            {/* Dark tint vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20 pointer-events-none" />

            {/* Hotspot 1: Fuel quick-closing valve wire (Left side) */}
            <button 
              onClick={handleInteractRope}
              className={`absolute left-[15%] top-[35%] w-16 h-12 flex flex-col items-center justify-center rounded-lg border transition-all cursor-pointer ${
                ropeCut 
                  ? "border-emerald-500/40 bg-emerald-950/30" 
                  : "border-brand-coral/50 bg-brand-coral/10 hover:bg-brand-coral/20 animate-pulse"
              }`}
            >
              <div className="bg-slate-950/80 px-1 py-0.5 rounded text-[8px] font-mono text-white">
                {ropeCut ? "✓ VALVE OK" : "⚠ CUT BLOCK"}
              </div>
            </button>

            {/* Hotspot 2: Exhaust lagging (Center-left) */}
            <button 
              onClick={handleInteractCoupler}
              className={`absolute left-[45%] top-[30%] w-16 h-12 flex flex-col items-center justify-center rounded-lg border transition-all cursor-pointer ${
                couplerTight 
                  ? "border-emerald-500/40 bg-emerald-950/30" 
                  : "border-brand-gold/50 bg-brand-gold/10 hover:bg-brand-gold/20 animate-pulse"
              }`}
            >
              {!couplerTight && (
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full absolute top-1 animate-ping" />
              )}
              <div className="bg-slate-950/80 px-1 py-0.5 rounded text-[8px] font-mono text-white mt-auto">
                {couplerTight ? "✓ LAGGING OK" : "⚠ TIGHTEN"}
              </div>
            </button>

            {/* Hotspot 3: Fuel leak puddle (Center-bottom) */}
            <button 
              onClick={handleInteractOil}
              className={`absolute left-[38%] bottom-[12%] w-24 h-10 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                oilCleaned 
                  ? "border-emerald-500/40 bg-emerald-950/10" 
                  : "border-red-500/50 bg-red-950/20 hover:bg-red-950/30 animate-pulse"
              }`}
            >
              <div className="bg-slate-950/90 px-1.5 py-0.5 rounded text-[8px] font-mono text-white">
                {oilCleaned ? "✓ TRAY CLEAN" : "⚠ WIPE OIL"}
              </div>
            </button>

            {/* Hotspot 4: Battery terminals (Right-bottom) */}
            <button 
              onClick={handleInteractStrainer}
              className={`absolute right-[12%] top-[45%] w-16 h-14 flex flex-col items-center justify-center rounded-lg border transition-all cursor-pointer ${
                strainerClean 
                  ? "border-emerald-500/40 bg-emerald-950/30" 
                  : "border-red-500/50 bg-red-950/10 hover:bg-red-950/20 animate-pulse"
              }`}
            >
              <div className="bg-slate-950/80 px-1 py-0.5 rounded text-[8px] font-mono text-white">
                {strainerClean ? "✓ BATTERY OK" : "⚠ CLEAN CLAMP"}
              </div>
            </button>
          </div>

          {/* User Feedback Board */}
          <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 text-[10px] text-slate-300 leading-relaxed font-mono min-h-[48px]">
            {feedbackText}
          </div>

          {/* TOOL DOCK PANEL */}
          <div className="mt-2.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Select Wards Audit Tool:
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleToolSelect('knife')}
                className={`py-2 px-1 rounded-xl text-3xs font-extrabold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  activeTool === 'knife'
                    ? 'bg-brand-gold/25 border-brand-gold text-brand-gold scale-[1.03]'
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Scissors className="h-4 w-4" />
                <span>1. KNIFE</span>
              </button>
              <button
                onClick={() => handleToolSelect('wrench')}
                className={`py-2 px-1 rounded-xl text-3xs font-extrabold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  activeTool === 'wrench'
                    ? 'bg-brand-gold/25 border-brand-gold text-brand-gold scale-[1.03]'
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Wrench className="h-4 w-4" />
                <span>2. WRENCH</span>
              </button>
              <button
                onClick={() => handleToolSelect('rag')}
                className={`py-2 px-1 rounded-xl text-3xs font-extrabold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  activeTool === 'rag'
                    ? 'bg-brand-gold/25 border-brand-gold text-brand-gold scale-[1.03]'
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Eraser className="h-4 w-4" />
                <span>3. CLEAN RAG</span>
              </button>
              <button
                onClick={() => handleToolSelect('brush')}
                className={`py-2 px-1 rounded-xl text-3xs font-extrabold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                  activeTool === 'brush'
                    ? 'bg-brand-gold/25 border-brand-gold text-brand-gold scale-[1.03]'
                    : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Brush className="h-4 w-4" />
                <span>4. BRUSH</span>
              </button>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="border-t border-white/5 pt-3 mt-3 flex justify-end">
            <button
              onClick={handleFinish}
              disabled={!checkGameCompleted}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 shadow-large active:scale-[0.98] ${
                checkGameCompleted
                  ? 'bg-brand-gold hover:bg-amber-400 text-brand-navy cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              Verify Audit Logs
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Summary stage */}
      {stage === 'summary' && (
        <div className="flex flex-col justify-between min-h-[360px]">
          {/* Header */}
          <div className="border-b border-white/5 pb-2.5 mb-4">
            <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
              Evaluation Concluded
            </span>
            <h3 className="font-h3 text-white text-sm mt-0.5">SS Zenith Audit Report</h3>
          </div>

          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto text-brand-gold animate-bounce">
              ✓
            </div>
            <h4 className="text-sm font-bold text-white">Hazards Rectified Successfully</h4>
            <p className="text-[11px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              By cutting the fire door rope, sealing the fuel coupler leak, wiping the bilge spill, and brushing clean the emergency pump strainer, you successfully prevented the Code 30 detention!
            </p>
            <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4 max-w-[280px] mx-auto text-left space-y-1.5 font-mono text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span>Total Score:</span>
                <span className="text-white font-bold">{points} PTS</span>
              </div>
              <div className="flex justify-between">
                <span>Wasted Tool Attempts:</span>
                <span className={errors > 2 ? "text-brand-coral font-bold" : "text-emerald-400 font-bold"}>
                  {errors} / 2 Allowed
                </span>
              </div>
              <div className="flex justify-between">
                <span>PSC Clearance Status:</span>
                <span className={errors <= 2 ? "text-emerald-400 font-bold" : "text-brand-coral font-bold"}>
                  {errors <= 2 ? "APPROVED (CLEAN CERT)" : "DETENTION WARNING"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large active:scale-[0.98]"
            >
              Submit Audit Logs
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODULE 4: COOPERATING WITH PSC INSPECTOR MINIGAMES
   ───────────────────────────────────────────────────────────────────────────── */

interface LockerItem {
  id: string
  title: string
  icon: string
  isRequired: boolean
  isBribe: boolean
  description: string
}

const LOCKER_ITEMS: LockerItem[] = [
  {
    id: 'helmet',
    title: 'Safety Helmet',
    icon: '⛑️',
    isRequired: true,
    isBribe: false,
    description: 'Impact protection helmet. SOLAS mandatory safety wear.'
  },
  {
    id: 'boots',
    title: 'Safety Boots',
    icon: '🥾',
    isRequired: true,
    isBribe: false,
    description: 'Steel-toed slip-resistant safety boots.'
  },
  {
    id: 'detector',
    title: 'Gas Detector',
    icon: '📟',
    isRequired: true,
    isBribe: false,
    description: 'Multi-gas monitor. Mandatory for enclosed space walkarounds.'
  },
  {
    id: 'flashlight',
    title: 'Ex-Proof Flashlight',
    icon: '🔦',
    isRequired: true,
    isBribe: false,
    description: 'Intrinsically safe flashlight for machinery flat inspections.'
  },
  {
    id: 'cigarettes',
    title: 'Carton of Cigarettes',
    icon: '🚬',
    isRequired: false,
    isBribe: true,
    description: 'Banned offering. Violates anti-bribery ship policies.'
  },
  {
    id: 'cash_envelope',
    title: 'Envelope of Cash',
    icon: '💵',
    isRequired: false,
    isBribe: true,
    description: 'Banned offering. Criminal offense leading to immediate arrest.'
  }
]

export const EscortGear: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [equipped, setEquipped] = useState<Record<string, boolean>>({})
  const [alertText, setAlertText] = useState<string>("Select the correct safety equipment from your locker to gear up for the inspection escort.")
  const [score, setScore] = useState(20)

  const handleToggleItem = (item: LockerItem) => {
    if (item.isBribe) {
      playSound('failure')
      setScore((prev) => Math.max(0, prev - 10))
      setAlertText("ANTI-CORRUPTION ALERT: Attempting to carry cigarettes or cash as 'gifts' to a Port State Control Officer is a severe compliance violation and leads to immediate vessel arrest.")
      return
    }

    playSound('click')
    setEquipped((prev) => ({
      ...prev,
      [item.id]: !prev[item.id]
    }))
    setAlertText(`Equipped: ${item.title}. Ensure all 4 mandatory safety tools are selected.`)
  }

  const allEquipped = LOCKER_ITEMS.filter(i => i.isRequired).every(i => equipped[i.id])

  const handleConfirm = () => {
    playSound('success')
    onComplete(true, score, 0)
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      <div className="border-b border-white/5 pb-2.5 mb-4">
        <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
          Module 4 Activity 1
        </span>
        <h3 className="font-h3 text-white text-sm mt-0.5">Mandatory Safety Escort Gear</h3>
      </div>

      <p className="text-2xs text-slate-400 leading-relaxed mb-4">
        As the escort officer, you must wear complete PPE and carry atmospheric gas monitors. Never attempt to take contraband, gifts, or envelopes to the inspection walkaround.
      </p>

      {/* Grid of items */}
      <div className="grid grid-cols-3 gap-3 my-2">
        {LOCKER_ITEMS.map((item) => {
          const isSelected = equipped[item.id]
          return (
            <button
              key={item.id}
              onClick={() => handleToggleItem(item)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all duration-150 cursor-pointer h-24 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 scale-[1.02]'
                  : item.isBribe
                  ? 'bg-red-500/5 border-red-500/20 text-slate-400 hover:bg-red-500/10'
                  : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[9px] font-bold leading-tight block">{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Alert Board */}
      <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3 text-[10px] text-slate-300 leading-relaxed font-mono min-h-[48px] my-3">
        {alertText}
      </div>

      <div className="border-t border-white/5 pt-3 flex justify-between items-center mt-2">
        <span className="text-[9px] text-slate-500 font-mono">PPE Checklist: {LOCKER_ITEMS.filter(i => i.isRequired && equipped[i.id]).length} / 4</span>
        <button
          onClick={handleConfirm}
          disabled={!allEquipped}
          className={`px-4 py-2 rounded-xl text-2xs font-extrabold uppercase transition-all flex items-center gap-1 shadow-large active:scale-[0.98] ${
            allEquipped
              ? 'bg-brand-gold hover:bg-amber-400 text-brand-navy cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
          }`}
        >
          Confirm Escort Gear
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

interface EscortTrustSlide {
  title: string
  subtitle: string
  text: string
  icon: React.ReactNode
}

export const EscortTrust: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'slides' | 'game' | 'failed' | 'success'>('slides')
  const [slideIndex, setSlideIndex] = useState(0)

  // Trust game states
  const [trustScore, setTrustScore] = useState(80)
  const [step, setStep] = useState(0)
  const [logbookHanded, setLogbookHanded] = useState(false)
  const [points, setPoints] = useState(15)
  const [feedback, setFeedback] = useState("Kowalski is inspecting. Drag/click to provide logs or answer questions.")

  const slides: EscortTrustSlide[] = [
    {
      title: "1. Escort Responsibility",
      subtitle: "Accompany the Inspector",
      text: "You must escort the PSC officer throughout his inspection loop. Guide him safely through high-voltage/hazardous areas.",
      icon: <FileText className="h-7 w-7 text-brand-gold" />
    },
    {
      title: "2. The Zero-Tolerance Rule",
      subtitle: "Bribes Guarantee Arrest",
      text: "Offering cartons of cigarettes, liquor, or cash envelopes is illegal. PSC officers are instructed to arrest and detain vessels immediately upon bribe attempts.",
      icon: <ShieldAlert className="h-7 w-7 text-brand-coral" />
    },
    {
      title: "3. Transparency Over Defense",
      subtitle: "Own the Deficiencies",
      text: "If the inspector spots an issue, acknowledge it honestly. Hiding files or lying causes trust to collapse and triggers immediate detentions.",
      icon: <CheckCircle className="h-7 w-7 text-emerald-400" />
    }
  ]

  const handleNextSlide = () => {
    playSound('click')
    if (slideIndex < slides.length - 1) {
      setSlideIndex((prev) => prev + 1)
    } else {
      setStage('game')
    }
  }

  const handlePrevSlide = () => {
    playSound('click')
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1)
    }
  }

  const handleStep0Choice = (choice: 'cooperative' | 'uncooperative') => {
    if (choice === 'cooperative') {
      playSound('success')
      setLogbookHanded(true)
      setTrustScore((prev) => Math.min(100, prev + 15))
      setPoints((prev) => prev + 10)
      setFeedback("SUCCESS: You retrieved the oil logs immediately. Kowalski is pleased with our record organization.")
    } else {
      playSound('failure')
      setTrustScore((prev) => Math.max(0, prev - 25))
      setFeedback("WARNING: Delaying logs triggers suspicion. Kowalski starts suspecting record manipulation.")
    }
  };

  const handleStep1Choice = (choice: 'rectify' | 'defensive' | 'bribe') => {
    if (choice === 'bribe') {
      playSound('failure')
      setStage('failed')
      return
    }

    if (choice === 'rectify') {
      playSound('success')
      setTrustScore((prev) => Math.min(100, prev + 15))
      setPoints((prev) => prev + 15)
      setFeedback("SUCCESS: You logged EPIRB replacement immediately. Defect resolved under Code 10 (Rectified).")
      setTimeout(() => {
        setStage('success')
      }, 2000)
    } else {
      playSound('failure')
      setTrustScore((prev) => Math.max(0, prev - 30))
      setFeedback("ERROR: Kowalski takes note of your defensive attitude. Cooperation score collapses.")
    }
  }

  const handleProceedStep1 = () => {
    playSound('click')
    setStep(1)
    setFeedback("Now, Kowalski stops by the bridge EPIRB beacon: 'Its battery seal expired last month.'")
  }

  const handleFinish = () => {
    playSound('success')
    const finalSuccess = trustScore >= 60
    onComplete(finalSuccess, points, finalSuccess ? -20 : 30)
  }

  const handleRestart = () => {
    playSound('click')
    setStage('slides')
    setSlideIndex(0)
    setTrustScore(80)
    setStep(0)
    setLogbookHanded(false)
    setPoints(15)
    setFeedback("Kowalski is inspecting. Drag/click to provide logs or answer questions.")
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      
      {/* Stage 1: Storyboard slides */}
      {stage === 'slides' && (
        <div className="flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-white/5 pb-2.5">
            <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
              Module 4: Cooperating with PSC Inspector
            </span>
            <h3 className="font-h3 text-white text-sm mt-0.5">Escort & Anti-Bribery Rules</h3>
          </div>

          <div className="my-4 h-24 bg-slate-950/80 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="flex flex-col items-center gap-1 text-center px-4 animate-in fade-in duration-200">
              {slides[slideIndex].icon}
              <span className="text-[10px] text-slate-400 mt-1 font-bold">{slides[slideIndex].subtitle}</span>
            </div>
          </div>

          <div className="flex-1 px-1">
            <span className="text-[10px] font-bold font-mono text-brand-gold uppercase tracking-wider">
              {slides[slideIndex].title}
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2">
              {slides[slideIndex].text}
            </p>
          </div>

          <div className="border-t border-white/5 pt-3.5 mt-3 flex items-center justify-between">
            <button
              onClick={handlePrevSlide}
              disabled={slideIndex === 0}
              className={`px-3 py-1.5 bg-slate-800 text-white rounded-lg text-2xs font-bold uppercase transition-all cursor-pointer ${slideIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-700"}`}
            >
              Back
            </button>
            <div className="flex gap-1">
              {slides.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === slideIndex ? "bg-brand-gold w-3" : "bg-slate-700"}`} />
              ))}
            </div>
            <button
              onClick={handleNextSlide}
              className="px-4 py-1.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-lg text-2xs font-extrabold uppercase transition-all cursor-pointer flex items-center gap-0.5"
            >
              {slideIndex === slides.length - 1 ? "Start Escort" : "Next"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Dialogue trust game console */}
      {stage === 'game' && (
        <div className="flex flex-col justify-between min-h-[380px]">
          <div className="border-b border-white/5 pb-2 mb-3 flex items-center justify-between">
            <div>
              <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
                Bridge Walkaround Escort
              </span>
              <h3 className="font-h3 text-white text-sm mt-0.5">Cooperation trust meter</h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block font-mono">Trust Score</span>
              <span className={`font-mono text-xs font-extrabold ${trustScore >= 70 ? 'text-emerald-400' : trustScore >= 40 ? 'text-brand-gold' : 'text-brand-coral'}`}>
                {trustScore}%
              </span>
            </div>
          </div>

          {/* Live trust meter slider */}
          <div className="w-full bg-slate-950 rounded-lg p-2.5 border border-white/5 flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono font-bold shrink-0">TRUST INDEX</span>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative border border-white/5">
              <div 
                className={`h-full transition-all duration-500 ${trustScore >= 70 ? 'bg-emerald-500' : trustScore >= 40 ? 'bg-amber-400 animate-pulse' : 'bg-red-500 animate-pulse'}`}
                style={{ width: `${trustScore}%` }}
              />
            </div>
          </div>

          {/* Active scene / question graphic */}
          <div className="my-3 py-4 px-3 bg-slate-950/60 border border-white/10 rounded-xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-navy border border-white/10 text-white flex items-center justify-center font-bold text-xs shrink-0">
              IK
            </div>
            <div className="space-y-1">
              <span className="text-[8px] text-brand-gold font-bold tracking-widest block font-mono">INSPECTOR KOWALSKI</span>
              <p className="text-xs text-white leading-relaxed font-medium">
                {step === 0 
                  ? "Show me the crew Rest Hour Logs and Oil Record Book files immediately." 
                  : "This EPIRB beacon is valid, but the physical casing shows the emergency battery renewal date is overdue last month."
                }
              </p>
            </div>
          </div>

          {/* User feedback log */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-3 text-[10px] text-slate-300 font-mono leading-relaxed min-h-[48px] my-1">
            {feedback}
          </div>

          {/* Choice controls */}
          <div className="mt-3 space-y-2">
            {step === 0 ? (
              !logbookHanded ? (
                <>
                  <button
                    onClick={() => handleStep0Choice('cooperative')}
                    className="w-full py-2.5 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-between hover:bg-emerald-500/15 transition-all cursor-pointer"
                  >
                    <span>📖 Hand over requested logs immediately</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleStep0Choice('uncooperative')}
                    className="w-full py-2.5 px-3 bg-slate-800 border border-white/5 text-slate-400 text-xs font-bold rounded-xl flex items-center justify-between hover:bg-slate-750 transition-all cursor-pointer"
                  >
                    <span>⚠️ "The cabinet keys are in the Captain's cabin, please wait 30 mins."</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleProceedStep1}
                  className="w-full py-3 bg-brand-gold hover:bg-amber-400 text-brand-navy text-xs font-extrabold rounded-xl transition-all cursor-pointer text-center"
                >
                  Proceed Walkaround to EPIRB Beacon
                </button>
              )
            ) : (
              <>
                <button
                  onClick={() => handleStep1Choice('rectify')}
                  className="w-full py-2.5 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-between hover:bg-emerald-500/15 transition-all cursor-pointer"
                >
                  <span>🔧 "Understood. We have a replacement pack in deck stores. I will fit it now."</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleStep1Choice('defensive')}
                  className="w-full py-2.5 px-3 bg-slate-800 border border-white/5 text-slate-400 text-xs font-bold rounded-xl flex items-center justify-between hover:bg-slate-750 transition-all cursor-pointer"
                >
                  <span>⚠️ "EPIRB doesn't matter, we have satellites. You are finding too many minor issues."</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleStep1Choice('bribe')}
                  className="w-full py-2.5 px-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl flex items-center justify-between hover:bg-red-500/15 transition-all cursor-pointer"
                >
                  <span>🚫 Hand over cash envelope and premium cigarettes for a courtesy stamp</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stage 3: Bribe Failure Screen */}
      {stage === 'failed' && (
        <div className="flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-red-500/20 pb-2 mb-3">
            <span className="font-mono text-[9px] text-brand-coral font-bold uppercase tracking-wider block">
              CRITICAL SAFETY CRIME VIOLATION
            </span>
            <h3 className="font-h3 text-red-500 text-sm mt-0.5">Vessel Detained (Bribe Attempted)</h3>
          </div>

          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mx-auto text-red-500 animate-pulse text-2xl font-bold">
              ✕
            </div>
            <h4 className="text-sm font-extrabold text-white">Inspector Kowalski Issues Immediate Arrest</h4>
            <p className="text-xs text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              Bribing or offering gift cartons/cash to a PSC officer violates international anti-corruption regulations. Kowalski has notified harbor authority police. The vessel is arrested, and the master faces criminal charges.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5 flex gap-3 justify-end">
            <button
              onClick={handleRestart}
              className="px-4 py-2 border border-slate-700 bg-slate-800 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-750 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry Mission
            </button>
          </div>
        </div>
      )}

      {/* Stage 4: Success Screen */}
      {stage === 'success' && (
        <div className="flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-white/5 pb-2.5 mb-4">
            <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
              Evaluation Concluded
            </span>
            <h3 className="font-h3 text-white text-sm mt-0.5">Cooperation Review Summary</h3>
          </div>

          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              ✓
            </div>
            <h4 className="text-sm font-bold text-white">Cooperation Verification Passed</h4>
            <p className="text-[11px] text-slate-400 max-w-[280px] mx-auto leading-relaxed">
              By equipping the mandatory PPE gear, providing the oil logs immediately, and addressing the EPIRB deficiency transparently, you secured safe clearance without warnings!
            </p>
            <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4 max-w-[280px] mx-auto text-left space-y-1.5 font-mono text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span>Cooperation Trust Score:</span>
                <span className="text-emerald-400 font-bold">{trustScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Score:</span>
                <span className="text-white font-bold">{points} PTS</span>
              </div>
              <div className="flex justify-between">
                <span>Cooperation Status:</span>
                <span className="text-emerald-400 font-bold">EXCELLENT (CLEAN REGISTRY)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end">
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large active:scale-[0.98]"
            >
              Conclude Cooperation Review
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODULE 5: REAL CASE STUDIES MINIGAME
   ───────────────────────────────────────────────────────────────────────────── */

interface CaseStudySlide {
  title: string
  subtitle: string
  text: string
  icon: string
}

const CASE_STUDY_SLIDES: CaseStudySlide[] = [
  {
    title: "1. Paris MOU Detention: M/V Baltic Star",
    subtitle: "Hamburg Port Inspection",
    text: "Detained due to an illegal bilge line ('magic pipe') bypassing the Oily Water Separator. The crew forged the Oil Record Book. Fines exceeded $250,000.",
    icon: "🛢️"
  },
  {
    title: "2. USCG Detention: M/V Ocean Pride",
    subtitle: "Miami Port Entry",
    text: "Detained due to rest hour logs manipulation. The Chief Mate logged 10.5 hours of rest while physical watch roster entries showed 19 hours of bridge duty.",
    icon: "⚖️"
  },
  {
    title: "3. Discrepancy Spotter Challenge",
    subtitle: "Spot the Logbook Fraud",
    text: "Compare the Left Log (Crew Logs) against the Right Log (PSC Findings). Click on the 3 data manipulation breaches to learn from these cases.",
    icon: "🔎"
  }
]

interface DiscrepancyItem {
  id: number
  title: string
  leftText: string
  rightText: string
  violationTitle: string
  violationText: string
  code: string
}

const DISCREPANCIES: DiscrepancyItem[] = [
  {
    id: 0,
    title: "MLC Fatigue Rest Logs",
    leftText: "Chief Mate rest hours logbook lists 11 hours rest (Fully MLC compliant).",
    rightText: "Rostering sheets prove Chief Mate was on bridge duty for 19 consecutive hours.",
    violationTitle: "MLC Fatigue Log Manipulation",
    violationText: "Falsifying crew rest logs to mask fatigue levels. Under MLC 2006, seafarers must have a minimum of 10 hours rest in any 24-hour period. record manipulation is a direct detention.",
    code: "Code 30 (Vessel Detention)"
  },
  {
    id: 1,
    title: "EPIRB Beacon Battery",
    leftText: "Weekly safety checklists state: 'EPIRB emergency battery valid and seal secure.'",
    rightText: "EPIRB physical battery seal is broken, and expiration tag is dated 6 months ago.",
    violationTitle: "SOLAS Expired Life-Saving Device",
    violationText: "Logging emergency life-saving equipment as functional while carrying expired battery seals. In a critical sinking event, battery failure makes locating survivors impossible.",
    code: "Code 17 (Rectify Before Departure)"
  },
  {
    id: 2,
    title: "OWS Separator Sludge Logs",
    leftText: "Oil Record Book logs bilge discharging via OWS filter operating under 15 ppm.",
    rightText: "Flexible bypass line ('magic pipe') rigged around OWS to pump sludge overboard.",
    violationTitle: "MARPOL Illegal Bilge Bypass (Magic Pipe)",
    violationText: "Using bypass hoses to dump bilge water directly overboard without separator processing. This is a severe criminal offense leading to heavy vessel arrests and crew prison sentences.",
    code: "Code 30 (Vessel Arrest & Detention)"
  }
]

export const CaseStudies: React.FC<{ onComplete: (success: boolean, score: number, suspicion: number) => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'slides' | 'comparison' | 'success'>('slides')
  const [slideIndex, setSlideIndex] = useState(0)
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [activeViolation, setActiveViolation] = useState<DiscrepancyItem | null>(null)
  const [points, setPoints] = useState(25)
  const [feedback, setFeedback] = useState("Inspect both log sheets side-by-side. Click on the matching rows that show conflicting statements.")

  const handleNextSlide = () => {
    playSound('click')
    if (slideIndex < CASE_STUDY_SLIDES.length - 1) {
      setSlideIndex((prev) => prev + 1)
    } else {
      setStage('comparison')
    }
  }

  const handlePrevSlide = () => {
    playSound('click')
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1)
    }
  }

  const handleRowClick = (item: DiscrepancyItem) => {
    if (selected[item.id]) {
      playSound('click')
      setActiveViolation(item)
      return
    }

    playSound('success')
    setSelected((prev) => ({
      ...prev,
      [item.id]: true
    }))
    setPoints((prev) => prev + 15)
    setActiveViolation(item)
    setFeedback(`Spot-on! Found conflict in: ${item.title}. Read the compliance breach details above.`)
  }

  const allFound = DISCREPANCIES.every((d) => selected[d.id])

  const handleFinish = () => {
    playSound('success')
    onComplete(true, points, 0)
  }

  return (
    <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col text-left font-sans animate-in zoom-in-95 duration-200">
      
      {/* STAGE 1: STORYBOARD SLIDES */}
      {stage === 'slides' && (
        <div className="flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-white/5 pb-2.5">
            <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
              Module 5 Activity: Real Case Studies
            </span>
            <h3 className="font-h3 text-white text-sm mt-0.5">MOU & USCG Historical Detentions</h3>
          </div>

          <div className="my-4 h-24 bg-slate-950/80 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
            <div className="flex flex-col items-center gap-1 text-center px-4 animate-in fade-in duration-200">
              <span className="text-3xl">{CASE_STUDY_SLIDES[slideIndex].icon}</span>
              <span className="text-[10px] text-slate-400 mt-1 font-bold">{CASE_STUDY_SLIDES[slideIndex].subtitle}</span>
            </div>
          </div>

          <div className="flex-1 px-1">
            <span className="text-[11px] font-bold font-mono text-brand-gold uppercase tracking-wider block">
              {CASE_STUDY_SLIDES[slideIndex].title}
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2">
              {CASE_STUDY_SLIDES[slideIndex].text}
            </p>
          </div>

          <div className="border-t border-white/5 pt-3.5 mt-3 flex items-center justify-between">
            <button
              onClick={handlePrevSlide}
              disabled={slideIndex === 0}
              className={`px-3 py-1.5 bg-slate-800 text-white rounded-lg text-2xs font-bold uppercase transition-all cursor-pointer ${slideIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-slate-700"}`}
            >
              Back
            </button>
            <div className="flex gap-1">
              {CASE_STUDY_SLIDES.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === slideIndex ? "bg-brand-gold w-3" : "bg-slate-700"}`} />
              ))}
            </div>
            <button
              onClick={handleNextSlide}
              className="px-4 py-1.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-lg text-2xs font-extrabold uppercase transition-all cursor-pointer flex items-center gap-0.5"
            >
              {slideIndex === CASE_STUDY_SLIDES.length - 1 ? "Start Analysis" : "Next"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: COMPARISON WORKSPACE */}
      {stage === 'comparison' && (
        <div className="flex flex-col min-h-[420px] justify-between">
          <div className="border-b border-white/5 pb-2 flex justify-between items-center">
            <div>
              <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
                Discrepancy Spotter Desk
              </span>
              <h3 className="font-h3 text-white text-sm mt-0.5">Compare Logbooks</h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block font-mono">Found Checkpoints</span>
              <span className="font-mono text-xs font-bold text-brand-gold">
                {Object.keys(selected).length} / 3 Discovered
              </span>
            </div>
          </div>

          {/* Interactive Books Columns */}
          <div className="grid grid-cols-2 gap-4 my-3 flex-1 items-stretch">
            {/* Left page: Ship logbook */}
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-3 text-left relative flex flex-col">
              <div className="border-b border-white/5 pb-1.5 mb-2.5 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">📖 Ship Deck Logbook</span>
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">CONFIDENTIAL</span>
              </div>
              <div className="space-y-2.5 flex-1">
                {DISCREPANCIES.map((d) => {
                  const isSelected = selected[d.id]
                  return (
                    <button
                      key={`left-${d.id}`}
                      onClick={() => handleRowClick(d)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-[10px] cursor-pointer block ${
                        isSelected 
                          ? 'border-brand-coral/40 bg-brand-coral/5 text-brand-coral font-bold scale-[1.01]' 
                          : 'border-white/5 bg-slate-900/40 text-slate-300 hover:bg-slate-900/80 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 block mb-1">
                        {d.title}
                      </span>
                      {d.leftText}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right page: Inspector findings */}
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-3 text-left relative flex flex-col">
              <div className="border-b border-white/5 pb-1.5 mb-2.5 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">📋 PSC Audit Findings</span>
                <span className="text-[8px] bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded font-mono">EVALUATION</span>
              </div>
              <div className="space-y-2.5 flex-1">
                {DISCREPANCIES.map((d) => {
                  const isSelected = selected[d.id]
                  return (
                    <button
                      key={`right-${d.id}`}
                      onClick={() => handleRowClick(d)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-[10px] cursor-pointer block ${
                        isSelected 
                          ? 'border-brand-coral/40 bg-brand-coral/5 text-brand-coral font-bold scale-[1.01]' 
                          : 'border-white/5 bg-slate-900/40 text-slate-300 hover:bg-slate-900/80 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[8px] uppercase tracking-wider font-mono text-slate-500 block mb-1">
                        {d.title}
                      </span>
                      {d.rightText}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education breach information panel */}
          {activeViolation ? (
            <div className="bg-slate-950 border border-brand-coral/20 rounded-xl p-3 text-[10px] text-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-1">
                <span className="font-bold font-mono text-brand-coral uppercase tracking-wide">
                  ⚠️ {activeViolation.violationTitle}
                </span>
                <span className="font-mono text-[9px] bg-brand-coral/10 text-brand-coral px-2 py-0.5 rounded font-extrabold">
                  {activeViolation.code}
                </span>
              </div>
              <p className="leading-relaxed text-slate-400 font-sans">
                {activeViolation.violationText}
              </p>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-[10px] text-slate-500 font-mono leading-relaxed min-h-[48px] flex items-center justify-center text-center">
              {feedback}
            </div>
          )}

          <div className="border-t border-white/5 pt-3 mt-3 flex justify-end">
            <button
              onClick={() => setStage('success')}
              disabled={!allFound}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1 shadow-large active:scale-[0.98] ${
                allFound
                  ? 'bg-brand-gold hover:bg-amber-400 text-brand-navy cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              Verify Findings Analysis
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: SUCCESS CONTEXT */}
      {stage === 'success' && (
        <div className="flex flex-col justify-between min-h-[350px]">
          <div className="border-b border-white/5 pb-2.5 mb-4">
            <span className="font-mono text-[9px] text-brand-gold font-bold uppercase tracking-wider block">
              Analysis Completed
            </span>
            <h3 className="font-h3 text-white text-sm mt-0.5">Logs Audit Concluded</h3>
          </div>

          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              ✓
            </div>
            <h4 className="text-sm font-bold text-white">Record Verification Cleared</h4>
            <p className="text-[11px] text-slate-400 max-w-[290px] mx-auto leading-relaxed font-sans">
              By checking rest hours log entries, EPIRB certificates, and finding the OWS discharge sludge bypass lines, you completed the real case study audits successfully!
            </p>
            <div className="bg-slate-950/50 border border-white/5 rounded-xl p-4 max-w-[280px] mx-auto text-left space-y-1.5 font-mono text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span>Case Analysis Rating:</span>
                <span className="text-emerald-400 font-bold">100% CORRECT</span>
              </div>
              <div className="flex justify-between">
                <span>Earned Audit Score:</span>
                <span className="text-white font-bold">{points} PTS</span>
              </div>
              <div className="flex justify-between">
                <span>Registry Integrity Check:</span>
                <span className="text-emerald-400 font-bold">COMPLIANT (CLEAN RECORDS)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex justify-end">
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 bg-brand-gold hover:bg-amber-400 text-brand-navy rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-large active:scale-[0.98]"
            >
              Conclude Case Studies
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
