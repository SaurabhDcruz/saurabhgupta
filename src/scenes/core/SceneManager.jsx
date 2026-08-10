import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useStore from '@/store/index.js'
import CameraController from './CameraController.jsx'
import LightManager from './LightManager.jsx'
import CinematicParticleField from '../objects/CinematicParticleField.jsx'

export default function SceneManager() {
  return (
    <>
      <CameraController />
      <LightManager />
      <CinematicParticleField />
    </>
  )
}
