import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import useStore from '@/store/index.js'

export default function CameraController() {
  const scrollProgress = useStore((state) => state.scrollProgress)
  const cursor = useStore((state) => state.cursorState)
  const target = useMemo(() => new THREE.Vector3(), [])
  const orbit = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const camera = state.camera
    const mouseX = (cursor.x / window.innerWidth - 0.5) * 0.8
    const mouseY = (cursor.y / window.innerHeight - 0.5) * 0.6

    target.set(
      mouseX,
      1.4 + scrollProgress * 0.92 + mouseY * 0.35,
      8 - scrollProgress * 4.7
    )

    orbit.set(mouseX * 0.18, 0.2 + scrollProgress * 0.02, 0)
    camera.position.lerp(target, 0.09)
    camera.lookAt(orbit)
  })

  return null
}
