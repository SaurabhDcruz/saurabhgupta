import React, { useEffect, useRef } from 'react'
import './App.css'
import {
  LoaderScreen,
  CustomCursor,
  NeuralNav,
  ScrollProgress,
  FooterSection
} from '@/components/layout'
import Hero from '@/sections/Hero/Hero.jsx'
import useLenisScroll from '@/hooks/useLenisScroll.js'
import useCinematicTimeline from '@/hooks/useCinematicTimeline.js'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Lazy load heavy sections directly from source to ensure proper code splitting
const Services = React.lazy(() => import('@/sections/Services/Services.jsx'))
const Portfolio = React.lazy(() => import('@/sections/Portfolio/Portfolio.jsx'))
const Resume = React.lazy(() => import('@/sections/Resume/Resume.jsx'))
const Clients = React.lazy(() => import('@/sections/Clients/Clients.jsx'))
const Contact = React.lazy(() => import('@/sections/Contact/Contact.jsx'))
const CanvasContainer = React.lazy(() => import('@/components/layout/CanvasContainer.jsx'))

function App() {
  const [showCanvas, setShowCanvas] = React.useState(false)
  useLenisScroll()
  useCinematicTimeline()

  const heroCardRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Disable on touch devices for performance
      if (window.matchMedia('(pointer: coarse)').matches) return

      const { clientX, clientY } = e

      // Throttle updates using requestAnimationFrame
      if (window._mouseFrame) cancelAnimationFrame(window._mouseFrame)
      window._mouseFrame = requestAnimationFrame(() => {
        const xPercent = (clientX / window.innerWidth) * 100
        const yPercent = (clientY / window.innerHeight) * 100

        // Only update variables on the hero card if it exists
        if (heroCardRef.current) {
          heroCardRef.current.style.setProperty('--mouse-x', `${xPercent}%`)
          heroCardRef.current.style.setProperty('--mouse-y', `${yPercent}%`)

          const rect = heroCardRef.current.getBoundingClientRect()
          const cardX = clientX - (rect.left + rect.width / 2)
          const cardY = clientY - (rect.top + rect.height / 2)

          const rotateX = (cardY / (rect.height / 2)) * -5
          const rotateY = (cardX / (rect.width / 2)) * 5

          heroCardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Delay 3D Canvas mounting to prioritize Hero text and LCP
    const timer = setTimeout(() => {
      setShowCanvas(true)
    }, 1500)

    // Global ScrollTrigger refresh after sections might have loaded
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 2500)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timer)
      clearTimeout(refreshTimer)
    }
  }, [])

  return (
    <div id="app-root" className="app-shell">
      <div className="spotlight" />
      <LoaderScreen />
      <CustomCursor />
      <NeuralNav />
      <ScrollProgress />

      {showCanvas && (
        <React.Suspense fallback={null}>
          <CanvasContainer />
        </React.Suspense>
      )}

      <main className="content-shell">
        <Hero heroCardRef={heroCardRef} />
        <React.Suspense fallback={null}>
          <Services />
          <Portfolio />
          <Resume />
          <Clients />
          <Contact />
        </React.Suspense>
      </main>

      <FooterSection />
    </div>
  )
}

export default App
