/**
 * Web Audio API Sound Synthesizer + File-based Audio Helper
 * Generates dynamic beep, success, error, and alarm sound effects programmatically.
 * Plays real audio files for stamp and rope tighten effects.
 */

// Import audio files (Vite will resolve these as URLs)
import stampAudioUrl from '../assets/audio/stamp.mp3'
import ropeAudioUrl from '../assets/audio/tighten.mp3'

// Cache HTMLAudio elements so we don't re-create them every time
let stampAudio: HTMLAudioElement | null = null
let ropeAudio: HTMLAudioElement | null = null

const playFileAudio = (url: string, cached: HTMLAudioElement | null, setter: (a: HTMLAudioElement) => void) => {
  try {
    if (!cached) {
      cached = new Audio(url)
      setter(cached)
    }
    cached.currentTime = 0
    cached.volume = 0.6
    cached.play().catch(() => {})
  } catch (e) {
    console.warn('Failed to play audio file:', e)
  }
}

export const playSound = (type: 'click' | 'success' | 'failure' | 'alarm' | 'beep' | 'launch' | 'mission_complete' | 'mission_fail' | 'rope' | 'stamp') => {
  if (type === 'stamp') {
    playFileAudio(stampAudioUrl, stampAudio, (a) => { stampAudio = a })
    return
  }
  if (type === 'rope') {
    playFileAudio(ropeAudioUrl, ropeAudio, (a) => { ropeAudio = a })
    return
  }
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (type === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.08)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } else if (type === 'beep') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.12)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } else if (type === 'launch') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.6)
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0)
      osc.start()
      osc.stop(ctx.currentTime + 1.0)
    } else if (type === 'success') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(523.25, ctx.currentTime)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.22)
      osc.start()
      osc.stop(ctx.currentTime + 0.22)
      setTimeout(() => {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'triangle'
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime)
        gain2.gain.setValueAtTime(0.06, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4)
        osc2.start()
        osc2.stop(ctx.currentTime + 0.4)
      }, 100)
    } else if (type === 'failure') {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'square'
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.setValueAtTime(150, ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15)
          gain.gain.setValueAtTime(0.03, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15)
          osc.start()
          osc.stop(ctx.currentTime + 0.15)
        }, i * 120)
      }
    } else if (type === 'mission_complete') {
      const frequencies = [523.25, 659.25, 783.99, 1046.50]
      frequencies.forEach((freq, i) => {
        setTimeout(() => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.frequency.setValueAtTime(freq, ctx.currentTime)
          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2)
          osc.start()
          osc.stop(ctx.currentTime + 1.2)
        }, i * 120)
      })
    } else if (type === 'mission_fail') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.5)
      gain.gain.setValueAtTime(0.0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5)
      osc.start()
      osc.stop(ctx.currentTime + 1.5)
    } else if (type === 'alarm') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(700, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.5)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    }
  } catch (e) {
    console.warn("Web Audio failed to play sound:", e)
  }
}
