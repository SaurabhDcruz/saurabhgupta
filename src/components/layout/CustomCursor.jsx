import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import useStore from '@/store/index.js'

const lerp = (a, b, t) => a + (b - a) * t

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const innerRef = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)
  const trailRefs = useRef(Array.from({ length: 5 }, () => null))
  const rippleRef = useRef(null)
  const tooltipRef = useRef(null)

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const targetPosRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const glowPosRef = useRef({ x: 0, y: 0 })
  const trailPosRef = useRef(Array(5).fill({ x: 0, y: 0 }))
  const [hoverType, setHoverType] = useState(null)
  const [isClicking, setIsClicking] = useState(false)
  const [magneticElement, setMagneticElement] = useState(null)
  const [tooltipText, setTooltipText] = useState('')

  const setCursorState = useStore((state) => state.setCursorState)
  const animationFrameRef = useRef(null)

  const getMagneticForce = useCallback((mouseX, mouseY) => {
    const elements = document.querySelectorAll('button, a, .feature-card, .portfolio-card, .pricing-panel, .contact-form input, .contact-form textarea, .magnetic-button')
    let closestDist = Infinity
    let force = { x: 0, y: 0 }
    let element = null

    elements.forEach(el => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2)

      if (dist < 100 && dist < closestDist) {
        closestDist = dist
        const strength = (100 - dist) / 100 * 0.3
        force.x = (centerX - mouseX) * strength
        force.y = (centerY - mouseY) * strength
        element = el
      }
    })

    return { force, element }
  }, [])

  const setFixedPosition = (el, x, y) => {
    if (!el) return
    el.style.left = `${x}px`
    el.style.top = `${y}px`
  }

  const updateCursor = useCallback(() => {
    const { x: mouseX, y: mouseY } = mousePos
    const { force: magnetic, element } = getMagneticForce(mouseX, mouseY)
    const adjustedX = mouseX + magnetic.x
    const adjustedY = mouseY + magnetic.y

    targetPosRef.current = {
      x: lerp(targetPosRef.current.x, adjustedX, 0.15),
      y: lerp(targetPosRef.current.y, adjustedY, 0.15)
    }

    ringPosRef.current = {
      x: lerp(ringPosRef.current.x, adjustedX, 0.08),
      y: lerp(ringPosRef.current.y, adjustedY, 0.08)
    }

    glowPosRef.current = {
      x: lerp(glowPosRef.current.x, adjustedX, 0.05),
      y: lerp(glowPosRef.current.y, adjustedY, 0.05)
    }

    trailPosRef.current = trailPosRef.current.map((pos, i) => ({
      x: lerp(pos.x, adjustedX, 0.1 - i * 0.015),
      y: lerp(pos.y, adjustedY, 0.1 - i * 0.015)
    }))

    setMagneticElement(element)

    // Apply magnetic effect to element
    if (element && magnetic.x !== 0 && magnetic.y !== 0) {
      element.style.transform = `translate(${magnetic.x * 0.5}px, ${magnetic.y * 0.5}px)`
    } else if (magneticElement && magneticElement !== element) {
      magneticElement.style.transform = ''
      setMagneticElement(null)
    }

    if (innerRef.current) {
      setFixedPosition(innerRef.current, targetPosRef.current.x, targetPosRef.current.y)
    }
    if (ringRef.current) {
      setFixedPosition(ringRef.current, ringPosRef.current.x, ringPosRef.current.y)
    }
    if (glowRef.current) {
      setFixedPosition(glowRef.current, glowPosRef.current.x, glowPosRef.current.y)
    }
    trailRefs.current.forEach((el, i) => {
      if (el) {
        setFixedPosition(el, trailPosRef.current[i].x, trailPosRef.current[i].y)
      }
    })

    setCursorState({ x: mouseX, y: mouseY, hover: !!hoverType, active: isClicking })

    animationFrameRef.current = requestAnimationFrame(updateCursor)
  }, [mousePos, hoverType, isClicking, getMagneticForce, setCursorState, magneticElement])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (target.closest('button, a')) {
        setHoverType('link')
        setTooltipText('Click')
      } else if (target.closest('.feature-card, .portfolio-card')) {
        setHoverType('card')
        setTooltipText('View')
      } else if (target.closest('input, textarea')) {
        setHoverType('input')
        setTooltipText('Type')
      } else {
        setHoverType(null)
        setTooltipText('')
      }
    }

    const handleMouseOut = () => {
      setHoverType(null)
      setTooltipText('')
    }

    const handleMouseDown = (e) => {
      setIsClicking(true)
      if (rippleRef.current) {
        const x = e.clientX
        const y = e.clientY
        rippleRef.current.style.left = `${x}px`
        rippleRef.current.style.top = `${y}px`
        rippleRef.current.style.transform = 'translate3d(-50%, -50%, 0) scale(0)'
        gsap.fromTo(rippleRef.current,
          { scale: 0, opacity: 1 },
          { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out' }
        )
      }
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mouseout', handleMouseOut)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    animationFrameRef.current = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mouseout', handleMouseOut)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateCursor])

  useEffect(() => {
    if (hoverType === 'link') {
      gsap.to([innerRef.current, ringRef.current], { scale: 1.5, duration: 0.3, ease: 'power2.out' })
      gsap.to(glowRef.current, { scale: 2, opacity: 0.8, duration: 0.3, ease: 'power2.out' })
    } else if (hoverType === 'card') {
      gsap.to([innerRef.current, ringRef.current], { scale: 1.2, duration: 0.3, ease: 'power2.out' })
      gsap.to(glowRef.current, { scale: 1.8, opacity: 0.6, duration: 0.3, ease: 'power2.out' })
    } else if (hoverType === 'input') {
      gsap.to(ringRef.current, { scale: 2, borderWidth: 2, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.to([innerRef.current, ringRef.current], { scale: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(glowRef.current, { scale: 1, opacity: 0.3, duration: 0.3, ease: 'power2.out' })
      gsap.to(ringRef.current, { borderWidth: 1, duration: 0.3, ease: 'power2.out' })
    }
  }, [hoverType])

  return (
    <>
      <div className="custom-cursor" ref={cursorRef}>
        <div className="cursor-glow" ref={glowRef} />
        <div className="cursor-ring" ref={ringRef} />
        <div className="cursor-inner" ref={innerRef} />
        <div className="cursor-ripple" ref={rippleRef} />
      </div>
      {trailRefs.current.map((_, i) => (
        <div key={i} className="cursor-trail" ref={el => trailRefs.current[i] = el} style={{ animationDelay: `${i * 0.05}s` }} />
      ))}
      {tooltipText && (
        <div className="cursor-tooltip" ref={tooltipRef} style={{ left: mousePos.x + 20, top: mousePos.y - 30 }}>
          {tooltipText}
        </div>
      )}
    </>
  )
}
