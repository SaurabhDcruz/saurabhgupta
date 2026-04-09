import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import SceneManager from '@/scenes/core/SceneManager.jsx'
import RenderPipeline from '@/scenes/core/RenderPipeline.jsx'

export default function CanvasContainer() {
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return

    const handleContextLost = (event) => {
      event.preventDefault()
      console.warn('WebGL context lost. Attempting recovery...')
    }

    canvas.addEventListener('webglcontextlost', handleContextLost)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
    }
  }, [])

  return (
    <div className="canvas-container" ref={containerRef}>
      <Canvas
        camera={{ position: [0, 1.5, 8], fov: 36 }}
        dpr={[1, 1.5]}
        shadows
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          stencil: false,
          depth: true,
          alpha: true,
          preserveDrawingBuffer: false
        }}
      >
        <color attach="background" args={[0x05070f]} />
        <Suspense fallback={<Html center className="canvas-fallback">Loading scene...</Html>}>
          <SceneManager />
          <RenderPipeline />
        </Suspense>
      </Canvas>
    </div>
  )
}
