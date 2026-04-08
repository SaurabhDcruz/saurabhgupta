import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import useStore from '@/store/index.js'
import { smoothScrollTo } from '@/utils/lenisRegistry.js'

const navItems = [
    { id: 'hero', label: 'Home', code: 'SYS.INIT', status: 'STABLE' },
    { id: 'services', label: 'Services', code: 'MOD.SRV.01', status: 'ACTIVE' },
    { id: 'portfolio', label: 'Portfolio', code: 'ARC.PV.02', status: 'READY' },
    { id: 'resume', label: 'Resume', code: 'USR.DAT.XP', status: 'LOCKED' },
    { id: 'clients', label: 'Clients', code: 'NET.CLT.SOC', status: 'ONLINE' },
    { id: 'contact', label: 'Contact', code: 'COM.LNK.EXT', status: 'OPEN' },
]

// Helper for "Decoding" text effect
const DecodingText = ({ text, delay = 0, isHovered = false }) => {
    const [displayText, setDisplayText] = useState('')
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const timerRef = useRef(null)

    const decode = useCallback(() => {
        let iterations = 0
        clearInterval(timerRef.current)

        timerRef.current = setInterval(() => {
            setDisplayText(
                text.split('').map((char, index) => {
                    if (index < iterations) return char
                    return chars[Math.floor(Math.random() * chars.length)]
                }).join('')
            )

            if (iterations >= text.length) clearInterval(timerRef.current)
            iterations += 1 / 3
        }, 30)
    }, [text])

    useEffect(() => {
        const t = setTimeout(decode, delay * 1000)
        return () => {
            clearTimeout(t)
            clearInterval(timerRef.current)
        }
    }, [decode, delay])

    useEffect(() => {
        if (isHovered) decode()
    }, [isHovered, decode])

    return <span className="decoding-text">{displayText || text}</span>
}

import { SciFiLogo } from '../common'

export default function NeuralNav() {
    const menuOpen = useStore((state) => state.menuOpen)
    const toggleMenu = useStore((state) => state.toggleMenu)
    const currentSection = useStore((state) => state.currentSection)
    const setCurrentSection = useStore((state) => state.setCurrentSection)

    const [hoveredNode, setHoveredNode] = useState(null)
    const panelRef = useRef(null)
    const itemsRef = useRef([])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && menuOpen) toggleMenu()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [menuOpen])

    useEffect(() => {
        if (menuOpen) {
            const tl = gsap.timeline()
            tl.fromTo(panelRef.current,
                { y: 100, opacity: 0, rotateX: -20, filter: 'brightness(2) blur(20px)' },
                { y: 0, opacity: 1, rotateX: 0, filter: 'brightness(1) blur(0px)', duration: 1, ease: "expo.out" }
            )

            const validItems = itemsRef.current.filter(Boolean)
            tl.fromTo(validItems,
                { x: -50, opacity: 0, skewX: 10 },
                { x: 0, opacity: 1, skewX: 0, duration: 0.6, stagger: 0.08, ease: "power4.out" },
                "-=0.7"
            )
        }
    }, [menuOpen])


    const handleNavClick = (id) => {
        setCurrentSection(id)
        toggleMenu()
        const section = document.getElementById(id)
        if (section) smoothScrollTo(section, { duration: 1.5 })
    }

    return (
        <>
            <div className={`neural-nav ${menuOpen ? 'open' : ''}`}>
                <button
                    className="ultimate-trigger"
                    onClick={toggleMenu}
                    aria-label="Access System"
                >
                    <div className="trigger-visual">
                        <SciFiLogo size={42} className="nav-logo-sync" />
                        <div className="scanner-line" />
                    </div>
                    <div className="trigger-info">
                        <span className="title">CORE_ACCESS</span>
                        <span className="version">SYS_v2.1.0</span>
                    </div>
                </button>
            </div>

            {menuOpen && (
                <div className="ultimate-overlay" onClick={toggleMenu}>
                    <div className="glitch-layer" />
                    <div className="data-rain" />

                    <div
                        className="ultimate-terminal"
                        ref={panelRef}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Mechanical Frame */}
                        <div className="frame-corner tl" />
                        <div className="frame-corner tr" />
                        <div className="frame-corner bl" />
                        <div className="frame-corner br" />

                        <div className="terminal-top">
                            <div className="top-left">
                                <div className="pulse-dot" />
                                <span className="terminal-id">LOG_ID: ANTIGRAVITY_0x7FF</span>
                            </div>
                            <div className="top-right">ACCESS_KEY://{Math.random().toString(16).substr(2, 6).toUpperCase()}</div>
                        </div>

                        <div className="terminal-main">
                            {navItems.map((item, i) => (
                                <button
                                    key={item.id}
                                    ref={el => itemsRef.current[i] = el}
                                    className={`ultimate-item ${currentSection === item.id ? 'active' : ''}`}
                                    onMouseEnter={() => setHoveredNode(item.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => handleNavClick(item.id)}
                                >
                                    <div className="item-prefix">[0{i + 1}]</div>
                                    <div className="item-body">
                                        <div className="item-name">
                                            <DecodingText text={item.label} delay={0.3 + (i * 0.1)} isHovered={hoveredNode === item.id} />
                                        </div>
                                        <div className="item-sub">
                                            <span>{item.code}</span>
                                            <span className="separator">//</span>
                                            <span className="status">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="item-glow" />
                                </button>
                            ))}
                        </div>

                        <div className="terminal-action-hub">
                            <a
                                href="/assets/resume/Saurabh%20Gupta%202.0.pdf"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tactical-download-btn"
                            >
                                <span className="btn-prefix">GET_DATA://</span>
                                <span className="btn-label">DOWNLOAD_CV_v2.0.pdf</span>
                                <div className="btn-scanner" />
                            </a>
                        </div>

                        <div className="terminal-bottom">
                            <div className="bitstream">01011001 01000101 01010011 00100000 01010010 01000101 01000001 01000100 01011001</div>
                            <div className="sys-time">SYS_TIME: {new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}