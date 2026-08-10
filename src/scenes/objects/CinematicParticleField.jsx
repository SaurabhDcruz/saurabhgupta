import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '@/store/index.js'
import { getLenis } from '@/utils/lenisRegistry.js'

const IS_MOBILE = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
const PARTICLE_COUNT = IS_MOBILE ? 60 : 120
const LAYER_CONFIGS = IS_MOBILE ? [
  { count: 20, radius: 2.8, size: 2.2, hue: 255, brightness: 0.96, drift: 0.12 },
  { count: 20, radius: 4.0, size: 1.6, hue: 220, brightness: 0.76, drift: 0.08 },
  { count: 20, radius: 5.8, size: 1.1, hue: 190, brightness: 0.52, drift: 0.05 },
] : [
  { count: 40, radius: 2.8, size: 1.9, hue: 255, brightness: 0.96, drift: 0.12 },
  { count: 40, radius: 4.0, size: 1.4, hue: 220, brightness: 0.76, drift: 0.08 },
  { count: 40, radius: 5.8, size: 0.95, hue: 190, brightness: 0.52, drift: 0.05 },
]
const CONNECTION_THRESHOLD = 2.3
const MAX_CONNECTIONS = IS_MOBILE ? 1 : 2

function buildParticleField() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const sizes = new Float32Array(PARTICLE_COUNT)
  const phases = new Float32Array(PARTICLE_COUNT)
  const depths = new Float32Array(PARTICLE_COUNT)
  const basePositions = []

  let index = 0
  let particleIndex = 0

  for (const layer of LAYER_CONFIGS) {
    for (let i = 0; i < layer.count; i += 1) {
      const angle = Math.random() * Math.PI * 2
      const radius = layer.radius * (0.78 + Math.random() * 0.3)
      const z = -radius * 0.72 + (Math.random() * 1.4 - 0.7)
      const x = Math.cos(angle) * radius * (0.85 + Math.random() * 0.25)
      const y = Math.sin(angle) * radius * (0.85 + Math.random() * 0.25)

      positions[index] = x
      positions[index + 1] = y
      positions[index + 2] = z
      basePositions.push(new THREE.Vector3(x, y, z))

      const color = new THREE.Color(`hsl(${layer.hue}, 85%, ${layer.brightness * 75}%)`)
      colors[index] = color.r
      colors[index + 1] = color.g
      colors[index + 2] = color.b

      sizes[particleIndex] = layer.size * (0.9 + Math.random() * 0.35)
      phases[particleIndex] = Math.random() * Math.PI * 2
      depths[particleIndex] = THREE.MathUtils.clamp(1 - Math.abs(z) / 7.5, 0.14, 1)

      particleIndex += 1
      index += 3
    }
  }

  return { positions, colors, sizes, phases, depths, basePositions }
}

function buildConnections(basePositions, phases, depths) {
  const segments = []
  const segmentColors = []
  const segmentPhases = []
  const segmentDepths = []
  const count = basePositions.length

  for (let i = 0; i < count; i += 1) {
    const origin = basePositions[i]
    const neighbors = []

    for (let j = 0; j < count; j += 1) {
      if (i === j) continue
      neighbors.push({
        index: j,
        distance: origin.distanceToSquared(basePositions[j]),
      })
    }

    neighbors.sort((a, b) => a.distance - b.distance)
    for (let k = 0; k < MAX_CONNECTIONS && k < neighbors.length; k += 1) {
      const targetIdx = neighbors[k].index
      const targetPos = basePositions[targetIdx]

      segments.push(origin.x, origin.y, origin.z)
      segments.push(targetPos.x, targetPos.y, targetPos.z)

      const c1 = new THREE.Color().fromArray([0, 0, 0]) // Placeholder
      segmentColors.push(0, 0, 0, 0, 0, 0)

      segmentPhases.push(phases[i], phases[targetIdx])
      segmentDepths.push(depths[i], depths[targetIdx])
    }
  }

  return {
    linePositions: new Float32Array(segments),
    linePhases: new Float32Array(segmentPhases),
    lineDepths: new Float32Array(segmentDepths)
  }
}

export default function CinematicParticleField() {
  const pointsRef = useRef(null)
  const linesRef = useRef(null)
  const groupRef = useRef(null)
  const cursor = useStore((state) => state.cursorState)

  const { positions, colors, sizes, phases, depths, basePositions } = useMemo(buildParticleField, [])
  const { linePositions, linePhases, lineDepths } = useMemo(() => buildConnections(basePositions, phases, depths), [basePositions, phases, depths])

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))
    geometry.setAttribute('depth', new THREE.BufferAttribute(depths, 1))
    return geometry
  }, [positions, colors, sizes, phases, depths])

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    geometry.setAttribute('phase', new THREE.BufferAttribute(linePhases, 1))
    geometry.setAttribute('depth', new THREE.BufferAttribute(lineDepths, 1))
    return geometry
  }, [linePositions, linePhases, lineDepths])

  useFrame((state) => {
    const lenis = getLenis()
    const scrollProgress = lenis ? lenis.scroll / lenis.limit : 0
    const time = state.clock.elapsedTime

    if (groupRef.current) {
      const mouseX = (cursor.x / window.innerWidth - 0.5) * 0.35
      const mouseY = (cursor.y / window.innerHeight - 0.5) * 0.25
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseY, 0.05)
      groupRef.current.rotation.z = time * 0.01
    }

    if (pointsRef.current) pointsRef.current.material.uniforms.uTime.value = time
    if (linesRef.current) linesRef.current.material.uniforms.uTime.value = time
    if (pointsRef.current) pointsRef.current.material.uniforms.uScroll.value = scrollProgress
    if (linesRef.current) linesRef.current.material.uniforms.uScroll.value = scrollProgress
  })

  useEffect(() => {
    return () => {
      particleGeometry.dispose()
      lineGeometry.dispose()
    }
  }, [particleGeometry, lineGeometry])

  return (
    <group ref={groupRef} position={[0, 0.2, -0.3]}>
      <points ref={pointsRef} geometry={particleGeometry} frustumCulled={false}>
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors
          uniforms={{
            uTime: { value: 0 },
            uScroll: { value: 0 },
            pixelRatio: { value: window.devicePixelRatio }
          }}
          vertexShader={/* glsl */ `
            uniform float uTime;
            uniform float uScroll;
            uniform float pixelRatio;
            attribute float size;
            attribute float phase;
            attribute float depth;
            varying float vDepth;
            varying vec3 vColor;

            void main() {
              vColor = color;
              vDepth = depth;
              
              vec3 pos = position;
              float speed = 0.18 + (depth * 0.12);
              float t = uTime * 0.38;
              
              pos.x += cos(t * speed + phase) * (0.18 + depth * 0.08);
              pos.y += sin(t * speed * 1.08 + phase * 0.8) * (0.18 + depth * 0.06);
              pos.z += sin(t * speed * 0.42 + phase * 1.3) * (0.08 + depth * 0.04);
              pos.z -= uScroll * 0.2;

              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              float pointSize = size * (150.0 / -mvPosition.z) * pixelRatio;
              gl_PointSize = clamp(pointSize, 1.5, 28.0);
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec3 vColor;
            varying float vDepth;

            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              float alpha = smoothstep(0.52, 0.22, dist);
              float fade = mix(0.55, 1.0, vDepth);
              gl_FragColor = vec4(vColor, alpha * fade * 0.8);
            }
          `}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uScroll: { value: 0 },
            uColor: { value: new THREE.Color("#8b5cf6") }
          }}
          vertexShader={/* glsl */ `
            uniform float uTime;
            uniform float uScroll;
            attribute float phase;
            attribute float depth;
            varying float vDepth;
            varying float vOpacity;

            void main() {
              vDepth = depth;
              
              vec3 pos = position;
              float speed = 0.18 + (depth * 0.12);
              float t = uTime * 0.38;
              
              pos.x += cos(t * speed + phase) * (0.18 + depth * 0.08);
              pos.y += sin(t * speed * 1.08 + phase * 0.8) * (0.18 + depth * 0.06);
              pos.z += sin(t * speed * 0.42 + phase * 1.3) * (0.08 + depth * 0.04);
              pos.z -= uScroll * 0.2;

              vOpacity = 0.15 * smoothstep(0.4, 1.0, depth);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 uColor;
            varying float vOpacity;
            varying float vDepth;

            void main() {
              gl_FragColor = vec4(uColor, vOpacity);
            }
          `}
        />
      </lineSegments>
    </group>
  )
}

