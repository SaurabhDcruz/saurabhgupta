import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function StarParticleField({ count = 120 }) {
  const pointsRef = useRef(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = 4.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.35 + Math.random() * 0.65)
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.55
      positions[i * 3 + 2] = Math.cos(phi) * r - 1.8
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += state.clock.delta * 0.02
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.01
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={particles} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#9b5cf6"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  )
}
