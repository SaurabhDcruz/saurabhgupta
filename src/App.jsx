import React, { useEffect, useRef } from 'react'
import './App.css'
import {
  LoaderScreen,
  CustomCursor,
  NavigationOverlay,
  ScrollProgress,
  CanvasContainer,
  FooterSection
} from '@/components/layout'
import Hero from '@/sections/Hero/Hero.jsx'
import useLenisScroll from '@/hooks/useLenisScroll.js'
import useCinematicTimeline from '@/hooks/useCinematicTimeline.js'

// Lazy load heavy sections directly from source to ensure proper code splitting
const Services = React.lazy(() => import('@/sections/Services/Services.jsx'))
const Portfolio = React.lazy(() => import('@/sections/Portfolio/Portfolio.jsx'))
const Resume = React.lazy(() => import('@/sections/Resume/Resume.jsx'))
const Clients = React.lazy(() => import('@/sections/Clients/Clients.jsx'))
const Contact = React.lazy(() => import('@/sections/Contact/Contact.jsx'))

function App() {
  useLenisScroll()
  useCinematicTimeline()

  const heroCardRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const xPercent = (clientX / window.innerWidth) * 100
      const yPercent = (clientY / window.innerHeight) * 100

      document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`)
      document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`)

      if (heroCardRef.current) {
        const rect = heroCardRef.current.getBoundingClientRect()
        const cardX = clientX - (rect.left + rect.width / 2)
        const cardY = clientY - (rect.top + rect.height / 2)

        const rotateX = (cardY / (rect.height / 2)) * -5
        const rotateY = (cardX / (rect.width / 2)) * 5

        heroCardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div id="app-root" className="app-shell">
      <div className="spotlight" />
      <LoaderScreen />
      <CustomCursor />
      <NavigationOverlay />
      <ScrollProgress />
      <CanvasContainer />

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
