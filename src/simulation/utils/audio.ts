/**
 * Web Audio API Sound Synthesizer Helper
 * Generates dynamic beep, success, error, and alarm sound effects programmatically.
 */

export const playSound = (type: 'click' | 'success' | 'failure' | 'alarm' | 'beep') => {
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
    } else if (type === 'success') {
      // Ascending compliance chime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.22)
      osc.start()
      osc.stop(ctx.currentTime + 0.22)

      setTimeout(() => {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime) // E5
        gain2.gain.setValueAtTime(0.04, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.32)
        osc2.start()
        osc2.stop(ctx.currentTime + 0.32)
      }, 100)
    } else if (type === 'failure') {
      // Descending buzz
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(180, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.07, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } else if (type === 'alarm') {
      // Repeating warning siren
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
