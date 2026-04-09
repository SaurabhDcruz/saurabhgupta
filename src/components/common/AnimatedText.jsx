import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const randomBetween = (min, max) => min + Math.random() * (max - min)
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const getCharacterRect = (textNode, offset) => {
  if (!textNode || !textNode.parentNode || !document.createRange) return null
  const range = document.createRange()
  range.setStart(textNode, Math.max(0, offset - 1))
  range.setEnd(textNode, Math.max(0, offset))
  const rect = range.getBoundingClientRect()
  range.detach?.()
  return rect.width === 0 && rect.height === 0 ? null : rect
}

const createParticle = (container) => {
  const element = document.createElement('div')
  element.className = 'typewriter-particle'
  element.style.opacity = '0'
  element.style.pointerEvents = 'none'
  container.appendChild(element)
  return {
    element,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    ttl: 0,
    active: false,
  }
}

const typedPhrases = ['Web Designer.', 'Web Developer.', 'Professional Coder.']

export default function AnimatedText({ phrases = [], className = '' }) {
  const wrapperRef = useRef(null)
  const lettersRef = useRef(null)
  const cursorRef = useRef(null)
  const particlesRef = useRef(null)
  const poolRef = useRef([])
  const activeParticlesRef = useRef([])
  const phraseIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const modeRef = useRef('typing')
  const timeoutRef = useRef(null)
  const particleRafRef = useRef(null)
  const cursorRafRef = useRef(null)

  useEffect(() => {
    if (!wrapperRef.current || !lettersRef.current || !particlesRef.current) return

    const particleRoot = particlesRef.current

    if (!poolRef.current.length) {
      poolRef.current = Array.from({ length: 48 }, () => createParticle(particleRoot))
    }

    const getParticle = () => poolRef.current.find((item) => !item.active) || null

    const spawnParticles = (x, y) => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      const count = isMobile ? 3 : 6 // Reduced from 12 to 6 on desktop, 3 on mobile
      for (let i = 0; i < count; i += 1) {
        const particle = getParticle()
        if (!particle) break
        const angle = randomBetween(0, Math.PI * 2)
        const speed = randomBetween(2, 6)
        particle.active = true
        particle.ttl = randomBetween(600, 1000)
        particle.life = particle.ttl
        particle.x = x
        particle.y = y
        particle.vx = Math.cos(angle) * speed
        particle.vy = Math.sin(angle) * speed - 1.5 // upward drift
        particle.element.style.left = `${x}px`
        particle.element.style.top = `${y}px`
        particle.element.style.opacity = '1'
        particle.element.style.transform = 'translate3d(-50%, -50%, 0) scale(1)'

        // Neon tech palette
        const colors = [
          'radial-gradient(circle, rgba(168,85,247,1) 0%, rgba(168,85,247,0) 70%)',
          'radial-gradient(circle, rgba(236,72,153,1) 0%, rgba(236,72,153,0) 70%)',
          'radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(59,130,246,0) 70%)'
        ]
        particle.element.style.background = colors[Math.floor(Math.random() * colors.length)]
        particle.element.style.width = `${randomBetween(2, 6)}px`
        particle.element.style.height = particle.element.style.width
        particle.element.style.filter = 'blur(1px) brightness(1.5)'
        activeParticlesRef.current.push(particle)
      }
    }

    const animateParticles = () => {
      const nextActive = []
      activeParticlesRef.current.forEach((particle) => {
        particle.life -= 16
        if (particle.life <= 0) {
          particle.active = false
          particle.element.style.opacity = '0'
          return
        }
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.x += particle.vx
        particle.y += particle.vy
        const progress = 1 - particle.life / particle.ttl
        particle.element.style.left = `${particle.x}px`
        particle.element.style.top = `${particle.y}px`
        particle.element.style.opacity = `${clamp(1 - progress * 1.5, 0, 1)}`
        particle.element.style.transform = `translate3d(-50%, -50%, 0) scale(${clamp(1 - progress, 0, 1)})`
        nextActive.push(particle)
      })
      activeParticlesRef.current = nextActive
      particleRafRef.current = requestAnimationFrame(animateParticles)
    }

    const clearTimers = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const resetText = () => {
      lettersRef.current.textContent = ''
      charIndexRef.current = 0
    }

    const pulseCursor = () => {
      if (!cursorRef.current) return
      gsap.fromTo(
        cursorRef.current,
        { scale: 1, opacity: 1, filter: 'brightness(1)' },
        { scale: 1.2, opacity: 0.8, filter: 'brightness(2) blur(2px)', duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }
      )
    }

    const createLetter = (nextText) => {
      lettersRef.current.textContent = nextText
      const textNode = lettersRef.current.firstChild
      const rect = getCharacterRect(textNode, nextText.length)
      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      const x = rect ? rect.left - wrapperRect.left + rect.width * 0.5 : wrapperRect.width * 0.5
      const y = rect ? rect.top - wrapperRect.top + rect.height * 0.5 : wrapperRect.height * 0.5

      requestAnimationFrame(() => {
        gsap.fromTo(
          lettersRef.current,
          { opacity: 0, scale: 1.2, filter: 'blur(4px) brightness(2)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px) brightness(1)',
            duration: 0.4,
            ease: 'expo.out',
          }
        )
        pulseCursor()
        spawnParticles(x, y)
      })
    }
    const removeLetter = (nextText) => {
      lettersRef.current.textContent = nextText
      gsap.to(lettersRef.current, {
        opacity: 0.82,
        scale: 0.98,
        duration: 0.14,
        ease: 'power3.in',
      })
    }
    const updateCursorPosition = () => {
      if (!cursorRef.current) return
      const textNode = lettersRef.current.firstChild
      const offset = (lettersRef.current.textContent || '').length
      const bounds = getCharacterRect(textNode, offset) || lettersRef.current.getBoundingClientRect()
      const wrapperBounds = wrapperRef.current.getBoundingClientRect()
      const x = bounds.right - wrapperBounds.left + 10
      const y = bounds.top - wrapperBounds.top + bounds.height * 0.1
      cursorRef.current.style.left = `${x}px`
      cursorRef.current.style.top = `${y}px`
      cursorRafRef.current = requestAnimationFrame(updateCursorPosition)
    }

    const runCycle = () => {
      clearTimers()
      const phrase = typedPhrases[phraseIndexRef.current]
      if (modeRef.current === 'typing') {
        if (charIndexRef.current < phrase.length) {
          const nextText = phrase.slice(0, charIndexRef.current + 1)
          createLetter(nextText)
          charIndexRef.current += 1
          const delay = 32 + Math.random() * 84
          timeoutRef.current = window.setTimeout(runCycle, delay)
        } else {
          modeRef.current = 'pause'
          timeoutRef.current = window.setTimeout(() => {
            modeRef.current = 'deleting'
            timeoutRef.current = window.setTimeout(runCycle, 120)
          }, 1200 + Math.random() * 680)
        }
      } else if (modeRef.current === 'deleting') {
        if (charIndexRef.current > 0) {
          const nextText = phrase.slice(0, charIndexRef.current - 1)
          removeLetter(nextText)
          charIndexRef.current -= 1
          const delay = 18 + Math.random() * 50
          timeoutRef.current = window.setTimeout(runCycle, delay)
        } else {
          phraseIndexRef.current = (phraseIndexRef.current + 1) % typedPhrases.length
          modeRef.current = 'typing'
          timeoutRef.current = window.setTimeout(runCycle, 520)
        }
      }
    }

    const start = () => {
      resetText()
      activeParticlesRef.current = []
      phraseIndexRef.current = 0
      modeRef.current = 'typing'
      timeoutRef.current = window.setTimeout(runCycle, 260)
      particleRafRef.current = requestAnimationFrame(animateParticles)
      cursorRafRef.current = requestAnimationFrame(updateCursorPosition)
    }

    start()

    return () => {
      clearTimers()
      if (particleRafRef.current) {
        cancelAnimationFrame(particleRafRef.current)
      }
      if (cursorRafRef.current) {
        cancelAnimationFrame(cursorRafRef.current)
      }
      activeParticlesRef.current.forEach((particle) => {
        particle.active = false
        particle.element.style.opacity = '0'
      })
    }
  }, [])

  return (
    <div className={`typewriter-root ${className}`} ref={wrapperRef}>
      <div className="typewriter-text" ref={lettersRef} aria-live="polite" />
      <div className="typewriter-cursor" ref={cursorRef} />
      <div className="typewriter-particles" ref={particlesRef} />
    </div>
  )
}
