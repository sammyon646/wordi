import { useEffect, useRef } from 'react'

type Spark = { x: number; y: number; life: number; maxLife: number; size: number }

export default function WaveBackground() {
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
      if (!ctx) return
      t += 0.02
      const { width: w, height: h } = canvas

      // фон‑градиент + мягкое свечение
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#18052e')
      grad.addColorStop(1, '#0b031a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, h * 0.9)
      glow.addColorStop(0, 'rgba(90, 40, 200, 0.22)')
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      // волны
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
      drawWave(w * 0.05, 0.013, 0.9, 'rgba(140,72,255,0.20)', 2.4)
      drawWave(w * 0.03, 0.020, 1.4, 'rgba(255,120,255,0.16)', 2.0)
      drawWave(w * 0.02, 0.030, 1.9, 'rgba(90,180,255,0.10)', 1.6)

      // искры
      if (Math.random() < 0.4) spawnSpark()
      sparks.current.forEach((s) => {
        s.life++
        const a = 1 - s.life / s.maxLife
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,140,255,${0.35 * a})`
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: -1, width: '100%', height: '100%', display: 'block' }}
    />
  )
}