import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '@/store/index.js'

export default function useCinematicTimeline() {
  const setScenePhase = useStore((state) => state.setScenePhase)
  const setActiveScene = useStore((state) => state.setActiveScene)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const scrollState = { progress: 0 }

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: '#app-root',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    master.to(scrollState, {
      progress: 1,
      ease: 'none',
      onUpdate: () => {
        const progress = scrollState.progress
        setScenePhase(progress)

        if (progress < 0.22) setActiveScene('intro')
        else if (progress < 0.72) setActiveScene('experience')
        else setActiveScene('outro')
      },
    })

    gsap.fromTo(
      '#hero .hero-copy',
      { y: 56, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.6, ease: 'power3.out' }
    )

    gsap.fromTo(
      '#hero .animated-char',
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.03, delay: 0.15 }
    )

    gsap.fromTo(
      '#hero .hero-description',
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.25 }
    )

    gsap.fromTo(
      '#hero .hero-actions',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out', delay: 0.35 }
    )

    const createReveal = (selector, config = {}) => {
      ScrollTrigger.batch(selector, {
        start: 'top 78%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 48, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              stagger: { each: 0.08, from: 'start' },
              overwrite: true,
              ...config,
            }
          )
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, { y: 48, opacity: 0, scale: 0.96, duration: 0.6, ease: 'power3.out', stagger: 0.05 })
        },
      })
    }

    createReveal('.feature-card')
    createReveal('.portfolio-card')
    createReveal('.blog-card')
    createReveal('.client-pill')
    createReveal('.pricing-panel')
    createReveal('.contact-card')

    // Timeline Line Growth Animation
    gsap.fromTo(
      '.timeline-line',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.resume-timeline',
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: true,
        },
      }
    )

    // Left Items Reveal
    ScrollTrigger.batch('.timeline-item.left', {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { x: -80, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.15,
            overwrite: true,
          }
        )
      },
    })

    // Right Items Reveal
    ScrollTrigger.batch('.timeline-item.right', {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { x: 80, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.15,
            overwrite: true,
          }
        )
      },
    })

    ScrollTrigger.batch('.section-title, .section-subtitle', {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08 }
        )
      },
    })

    return () => {
      master.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [setScenePhase, setActiveScene])
}
