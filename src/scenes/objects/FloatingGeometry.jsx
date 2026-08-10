import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FloatingGeometry({ count = 18 }) {
  const instancedRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(
    () =>
      new Array(count).fill().map(() => ({
        position: [
          (Math.random() - 0.5) * 8,
          -0.5 + Math.random() * 2.4,
          -2 + Math.random() * 4,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.18 + Math.random() * 0.32,
        speed: 0.5 + Math.random() * 0.6,
      })),
    [count]
  )

  useFrame((state, delta) => {
    if (!instancedRef.current) return

    particles.forEach((particle, index) => {
      const [x, y, z] = particle.position
      const time = state.clock.elapsedTime * particle.speed
      dummy.position.set(x + Math.sin(time * 0.8) * 0.18, y + Math.cos(time * 1.1) * 0.14, z)
      dummy.rotation.set(particle.rotation[0] + time * 0.1, particle.rotation[1] + time * 0.05, particle.rotation[2])
      dummy.scale.setScalar(particle.scale)
      dummy.updateMatrix()
      instancedRef.current.setMatrixAt(index, dummy.matrix)
    })
    instancedRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instancedRef} args={[null, null, count]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial color="#b794f4" roughness={0.35} metalness={0.65} />
    </instancedMesh>
  )
}
