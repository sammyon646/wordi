// src/WaveBackground.tsx
import { useEffect, useRef } from 'react'
import { Application, Geometry, Shader, Mesh } from 'pixi.js'

export default function WaveBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const app = new Application({
      resizeTo: containerRef.current as any,
      backgroundAlpha: 0,
      antialias: true,
    })

    containerRef.current.appendChild(app.view as HTMLCanvasElement)

    const fragmentShader = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float wave1 = sin(st.y * 4.0 + u_time * 0.5) * 0.04;
        float wave2 = sin(st.y * 7.0 + u_time * 0.9) * 0.02;
        float waveMix = st.x + wave1 + wave2;
        vec3 color = mix(
          vec3(0.12, 0.02, 0.25),
          vec3(0.55, 0.22, 1.0),
          smoothstep(0.2, 0.55, waveMix)
        );
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const uniforms = {
      u_time: 0,
      u_resolution: [window.innerWidth, window.innerHeight],
    }

    const geometry = new Geometry()
      .addAttribute(
        'aVertexPosition',
        [0, 0, window.innerWidth, 0, window.innerWidth, window.innerHeight, 0, window.innerHeight],
        2
      )
      .addIndex([0, 1, 2, 0, 2, 3])

    const shader = Shader.from(
      `
      precision mediump float;
      attribute vec2 aVertexPosition;
      void main() {
        gl_Position = vec4(
          (aVertexPosition / vec2(${window.innerWidth}, ${window.innerHeight}) * 2.0 - 1.0)
          * vec2(1, -1),
          0, 1
        );
      }
      `,
      fragmentShader,
      uniforms
    )

    const mesh = new Mesh(geometry, shader)
    app.stage.addChild(mesh)

    app.ticker.add((delta: number) => {
      shader.uniforms.u_time += delta * 0.02
    })

    return () => {
      app.destroy(true, true)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: -1, overflow: 'hidden' }}
    />
  )
}