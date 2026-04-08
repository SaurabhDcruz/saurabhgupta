import { useRef } from 'react'
import useStore from '@/store/index.js'

export default function LightManager() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[4, 5, 5]}
        intensity={1.06}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-2.4, 2.4, -3]} intensity={0.42} color="#7c6cff" />
      <pointLight position={[3.6, -1.8, 2.4]} intensity={0.28} color="#56baf0" />
      <pointLight position={[0, 4, 6]} intensity={0.16} color="#ffffff" />
    </>
  )
}
