import { useEffect, useRef } from 'react'

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafId = useRef<number>()

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
    const render = () => {
      if (!ctx) return
      t += 0.02
      const { width: w, height: h } = canvas

      // фон градиент
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, '#1c0b2f')
      grad.addColorStop(1, '#0d041c')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // волны
      const drawWave = (amp: number, freq: number, speed: number, color: string) => {
        ctx.beginPath()
        for (let y = 0; y <= h; y += 2) {
          const x = w * 0.5 + Math.sin(y * freq + t * speed) * amp
          ctx[y === 0 ? 'moveTo' : 'lineTo'](x, y)
        }
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        ctx.stroke()
      }

      drawWave(w * 0.04, 0.015, 1.0, 'rgba(140, 72, 255, 0.25)')
      drawWave(w * 0.02, 0.025, 1.6, 'rgba(255, 120, 255, 0.18)')

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