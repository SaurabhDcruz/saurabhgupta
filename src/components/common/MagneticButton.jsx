import React, { useRef, useCallback } from 'react'
import gsap from 'gsap'

export default function MagneticButton({ children, onClick, className = '', type = 'submit' }) {
  const buttonRef = useRef(null)

  const handleMouseMove = useCallback((event) => {
    const el = buttonRef.current
    if (!el) return
    const bounds = el.getBoundingClientRect()
    const x = (event.clientX - bounds.left - bounds.width / 2) / 8
    const y = (event.clientY - bounds.top - bounds.height / 2) / 8
    gsap.to(el, { x, y, duration: 0.28, ease: 'power3.out' })
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = buttonRef.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.6)' })
  }, [])

  const handleClick = (event) => {
    if (navigator.vibrate) navigator.vibrate(12)
    if (onClick) onClick(event)
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
