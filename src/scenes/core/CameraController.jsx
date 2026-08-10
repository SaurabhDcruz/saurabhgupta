import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import useStore from '@/store/index.js'
import { getLenis } from '@/utils/lenisRegistry.js'

export default function CameraController() {
  const cursor = useStore((state) => state.cursorState)
  const target = useMemo(() => new THREE.Vector3(), [])
  const orbit = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const camera = state.camera
    const lenis = getLenis()

    // Direct read from Lenis bypasses React state lag for buttery smooth sync
    const scrollProgress = lenis ? lenis.scroll / lenis.limit : 0

    const mouseX = (cursor.x / window.innerWidth - 0.5) * 0.8
    const mouseY = (cursor.y / window.innerHeight - 0.5) * 0.6

    target.set(
      mouseX,
      1.4 + (scrollProgress * 0.92) + (mouseY * 0.35),
      8 - (scrollProgress * 4.7)
    )

    orbit.set(mouseX * 0.18, 0.2 + (scrollProgress * 0.02), 0)

    // Split interpolation: Fast sync for scroll (0.15), organic dampening for mouse
    camera.position.lerp(target, 0.15)
    camera.lookAt(orbit)
  })

  return null
}
