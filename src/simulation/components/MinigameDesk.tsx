import React, { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'
import { RestHoursPuzzle } from './RestHoursPuzzle'
import { playSound } from '../utils/audio'
import {
  FileText,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
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
