import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import useStore from '@/store/index.js'

export default function RenderPipeline() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.2} intensity={0.7} mipmapBlur radius={0.4} />
      <Noise opacity={0.13} />
      <Vignette eskil={false} offset={0.08} darkness={1.4} />
    </EffectComposer>
  )
}
