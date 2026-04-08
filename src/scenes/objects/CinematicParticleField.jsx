import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '@/store/index.js'

const PARTICLE_COUNT = 180
const LAYER_CONFIGS = [
  { count: 50, radius: 2.8, size: 1.9, hue: 255, brightness: 0.96, drift: 0.12 },
  { count: 80, radius: 4.0, size: 1.4, hue: 220, brightness: 0.76, drift: 0.08 },
  { count: 50, radius: 5.8, size: 0.95, hue: 190, brightness: 0.52, drift: 0.05 },
]
const CONNECTION_THRESHOLD = 2.3
const MAX_CONNECTIONS = 2

function buildParticleField() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const baseColors = new Float32Array(PARTICLE_COUNT * 3)
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
      baseColors[index] = color.r
      baseColors[index + 1] = color.g
      baseColors[index + 2] = color.b

      sizes[particleIndex] = layer.size * (0.9 + Math.random() * 0.35)
      phases[particleIndex] = Math.random() * Math.PI * 2
      depths[particleIndex] = THREE.MathUtils.clamp(1 - Math.abs(z) / 7.5, 0.14, 1)

      particleIndex += 1
      index += 3
    }
  }

  return { positions, colors, baseColors, sizes, phases, depths, basePositions }
}

function buildConnections(basePositions) {
  const pairs = []
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
      pairs.push([i, neighbors[k].index])
    }
  }

  return pairs
}

export default function CinematicParticleField() {
  const pointsRef = useRef(null)
  const linesRef = useRef(null)
  const groupRef = useRef(null)
  const cursor = useStore((state) => state.cursorState)
  const scrollProgress = useStore((state) => state.scrollProgress)

  const { positions, colors, sizes, phases, depths, basePositions, baseColors } = useMemo(buildParticleField, [])
  const connections = useMemo(() => buildConnections(basePositions), [basePositions])

  const linePositions = useMemo(
    () => new Float32Array(connections.length * 2 * 3),
    [connections.length]
  )
  const lineColors = useMemo(
    () => new Float32Array(connections.length * 2 * 3),
    [connections.length]
  )
  const lineStrength = useMemo(() => new Float32Array(connections.length), [connections.length])

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
    geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    geometry.setAttribute('strength', new THREE.BufferAttribute(lineStrength, 1))
    return geometry
  }, [linePositions, lineColors, lineStrength])

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime * 0.38
    const mouseX = (cursor.x / window.innerWidth - 0.5) * 0.7
    const mouseY = (cursor.y / window.innerHeight - 0.5) * 0.5

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX * 0.55, 0.07)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseY * 0.35, 0.07)
      groupRef.current.rotation.z = elapsed * 0.02
    }

    const positionsAttr = pointsRef.current.geometry.attributes.position
    const colorAttr = pointsRef.current.geometry.attributes.color
    const sizeAttr = pointsRef.current.geometry.attributes.size
    const depthAttr = pointsRef.current.geometry.attributes.depth

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const base = basePositions[i]
      const phase = phases[i]
      const speed = 0.18 + (depths[i] * 0.12)
      const drift = 0.25 + depths[i] * 0.28

      const px = base.x + Math.cos(elapsed * speed + phase) * (0.18 + depths[i] * 0.08)
      const py = base.y + Math.sin(elapsed * speed * 1.08 + phase * 0.8) * (0.18 + depths[i] * 0.06)
      const pz = base.z + Math.sin(elapsed * speed * 0.42 + phase * 1.3) * (0.08 + depths[i] * 0.04)

      positionsAttr.array[i * 3] = px
      positionsAttr.array[i * 3 + 1] = py
      positionsAttr.array[i * 3 + 2] = pz - scrollProgress * 0.2

      const depthFactor = THREE.MathUtils.clamp(1 - Math.abs(pz) / 7.5, 0.18, 1)
      const baseIndex = i * 3
      colorAttr.array[baseIndex] = baseColors[baseIndex] * (0.92 + depthFactor * 0.14)
      colorAttr.array[baseIndex + 1] = baseColors[baseIndex + 1] * (0.92 + depthFactor * 0.12)
      colorAttr.array[baseIndex + 2] = baseColors[baseIndex + 2] * (0.88 + depthFactor * 0.22)
      depthAttr.array[i] = depthFactor
    }

    positionsAttr.needsUpdate = true
    colorAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
    depthAttr.needsUpdate = true

    const linePosAttr = linesRef.current.geometry.attributes.position
    const strengthAttr = linesRef.current.geometry.attributes.strength
    const lineColorAttr = linesRef.current.geometry.attributes.color
    let segment = 0

    for (let pairIndex = 0; pairIndex < connections.length; pairIndex += 1) {
      const [a, b] = connections[pairIndex]
      const ax = positionsAttr.array[a * 3]
      const ay = positionsAttr.array[a * 3 + 1]
      const az = positionsAttr.array[a * 3 + 2]
      const bx = positionsAttr.array[b * 3]
      const by = positionsAttr.array[b * 3 + 1]
      const bz = positionsAttr.array[b * 3 + 2]

      const distance = Math.sqrt(
        (ax - bx) * (ax - bx) +
        (ay - by) * (ay - by) +
        (az - bz) * (az - bz)
      )
      const strength = THREE.MathUtils.clamp(1 - distance / CONNECTION_THRESHOLD, 0, 1)
      const alpha = Math.pow(strength, 2) * 0.9

      linePosAttr.array[segment * 6] = ax
      linePosAttr.array[segment * 6 + 1] = ay
      linePosAttr.array[segment * 6 + 2] = az
      linePosAttr.array[segment * 6 + 3] = bx
      linePosAttr.array[segment * 6 + 4] = by
      linePosAttr.array[segment * 6 + 5] = bz

      const baseColorIndex = a * 3
      const r = colorAttr.array[baseColorIndex]
      const g = colorAttr.array[baseColorIndex + 1]
      const bColor = colorAttr.array[baseColorIndex + 2]

      lineColorAttr.array[segment * 6] = r
      lineColorAttr.array[segment * 6 + 1] = g
      lineColorAttr.array[segment * 6 + 2] = bColor
      lineColorAttr.array[segment * 6 + 3] = r
      lineColorAttr.array[segment * 6 + 4] = g
      lineColorAttr.array[segment * 6 + 5] = bColor
      strengthAttr.array[pairIndex] = alpha

      segment += 1
    }

    linePosAttr.needsUpdate = true
    lineColorAttr.needsUpdate = true
    strengthAttr.needsUpdate = true
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
          uniforms={{ pixelRatio: { value: window.devicePixelRatio } }}
          vertexShader={/* glsl */ `
            uniform float pixelRatio;
            attribute float size;
            attribute float depth;
            varying float vDepth;
            varying vec3 vColor;

            void main() {
              vColor = color;
              vDepth = depth;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
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
              float halo = smoothstep(0.0, 0.6, 1.0 - dist);
              vec3 color = vColor * mix(0.9, 1.2, halo);
              gl_FragColor = vec4(color, alpha * fade * 0.88);
            }
          `}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
          uniforms={{ pointOpacity: { value: 1.0 } }}
          vertexShader={/* glsl */ `
            attribute float strength;
            varying vec3 vColor;
            varying float vStrength;

            void main() {
              vColor = color;
              vStrength = strength;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec3 vColor;
            varying float vStrength;

            void main() {
              float alpha = smoothstep(0.0, 1.0, vStrength);
              gl_FragColor = vec4(vColor * 1.1, alpha * 0.18);
            }
          `}
        />
      </lineSegments>
    </group>
  )
}
