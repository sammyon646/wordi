import { useEffect, useRef } from 'react'

type Theme = 'purple' | 'green' | 'yellow'
type Spark = { x: number; y: number; life: number; maxLife: number; size: number }

const WAVE_CONFIG: Record<Theme, {
  top: string
  bottom: string
  glow: string
  waves: { amp: number; freq: number; speed: number; color: string; lw: number }[]
  sparkBase: string
}> = {
  purple: {
    top: '#18052e',
    bottom: '#0b031a',
    glow: 'rgba(90, 40, 200, 0.22)',
    waves: [
      { amp: 0.05, freq: 0.013, speed: 0.9, color: 'rgba(140,72,255,0.20)', lw: 2.4 },
      { amp: 0.03, freq: 0.020, speed: 1.4, color: 'rgba(255,120,255,0.16)', lw: 2.0 },
      { amp: 0.02, freq: 0.030, speed: 1.9, color: 'rgba(90,180,255,0.10)', lw: 1.6 },
    ],
    sparkBase: 'rgba(200,140,255,',
  },
  green: {
    top: '#0d1f17',
    bottom: '#08130e',
    glow: 'rgba(30, 120, 80, 0.22)',
    waves: [
      { amp: 0.05, freq: 0.013, speed: 0.9, color: 'rgba(74,222,128,0.20)', lw: 2.4 },
      { amp: 0.03, freq: 0.020, speed: 1.4, color: 'rgba(52,211,153,0.16)', lw: 2.0 },
      { amp: 0.02, freq: 0.030, speed: 1.9, color: 'rgba(16,185,129,0.12)', lw: 1.6 },
    ],
    sparkBase: 'rgba(160,255,200,',
  },
  yellow: {
    top: '#1c1404',
    bottom: '#0f0a02',
    glow: 'rgba(180, 120, 20, 0.22)',
    waves: [
      { amp: 0.05, freq: 0.013, speed: 0.9, color: 'rgba(245,158,11,0.20)', lw: 2.4 },
      { amp: 0.03, freq: 0.020, speed: 1.4, color: 'rgba(251,191,36,0.16)', lw: 2.0 },
      { amp: 0.02, freq: 0.030, speed: 1.9, color: 'rgba(217,119,6,0.10)', lw: 1.6 },
    ],
    sparkBase: 'rgba(255,220,140,',
  },
}

export default function WaveBackground({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafId = useRef<number>()
  const sparks = useRef<Spark[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const cfg = WAVE_CONFIG[theme]

    const spawnSpark = () => {
      const { width: w, height: h } = canvas
      sparks.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        life: 0,
        maxLife: 80 + Math.random() * 80,
        size: 1 + Math.random() * 2,
      })
      if (sparks.current.length > 30) sparks.current.shift()
    }

    const render = () => {
      t += 0.02
      const { width: w, height: h } = canvas

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, cfg.top)
      grad.addColorStop(1, cfg.bottom)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, h * 0.9)
      glow.addColorStop(0, cfg.glow)
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      const drawWave = (amp: number, freq: number, speed: number, color: string, lw = 2) => {
        ctx.beginPath()
        for (let y = 0; y <= h; y += 2) {
          const x = w * 0.5 + Math.sin(y * freq + t * speed) * amp
          ctx[y === 0 ? 'moveTo' : 'lineTo'](x, y)
        }
        ctx.lineWidth = lw
        ctx.strokeStyle = color
        ctx.stroke()
      }
      cfg.waves.forEach((wCfg) => drawWave(w * wCfg.amp, wCfg.freq, wCfg.speed, wCfg.color, wCfg.lw))

      if (Math.random() < 0.4) spawnSpark()
      sparks.current.forEach((s) => {
        s.life++
        const a = 1 - s.life / s.maxLife
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `${cfg.sparkBase}${0.35 * a})`
        ctx.fill()
      })
      sparks.current = sparks.current.filter((s) => s.life < s.maxLife)

      rafId.current = requestAnimationFrame(render)
    }

    render()
    return () => {
      window.removeEventListener('resize', resize)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}