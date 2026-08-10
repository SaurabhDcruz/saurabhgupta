import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function FloatingCV() {
    const nodeRef = useRef(null)

    useEffect(() => {
        // Magnetic effect implementation for the node
        const handleMouseMove = (e) => {
            if (!nodeRef.current) return
            const rect = nodeRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const dist = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2)

            if (dist < 100) {
                const strength = (100 - dist) / 100 * 20
                const x = (e.clientX - centerX) * 0.15
                const y = (e.clientY - centerY) * 0.15
                gsap.to(nodeRef.current, {
                    x: x * strength * 0.1,
                    y: y * strength * 0.1,
                    duration: 0.4,
                    ease: 'power2.out'
                })
            } else {
                gsap.to(nodeRef.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <a
            href="/assets/resume/Saurabh%20Gupta%202.0.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="floating-cv-node"
            ref={nodeRef}
        >
            <div className="node-ring" />
            <div className="node-pulse" />
            <div className="node-core">
                CV
            </div>
        </a>
    )
}
