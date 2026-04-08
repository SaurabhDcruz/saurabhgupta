import { memo, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '@/store/index.js'

gsap.registerPlugin(ScrollTrigger)

export const ScrollSection = memo(function ScrollSection({ id, index, title, subtitle, children, pure = false, className = '' }) {
  const sectionRef = useRef(null)
  const setCurrentSection = useStore((state) => state.setCurrentSection)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reveal = gsap.fromTo(
      section,
      { opacity: 0, y: 60, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        paused: true,
      }
    )

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: () => {
        reveal.play()
        setCurrentSection(id)
      },
      onEnterBack: () => {
        reveal.play()
        setCurrentSection(id)
      },
      onLeave: () => reveal.reverse(),
      onLeaveBack: () => reveal.reverse(),
    })

    return () => {
      trigger.kill()
      reveal.kill()
    }
  }, [id, setCurrentSection])

  return (
    <section id={id} ref={sectionRef} className={`${pure ? '' : 'scroll-section'} ${className}`}>
      {pure ? (
        children
      ) : (
        <div className="section-copy">
          <p className="section-index">0{index + 1}</p>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
          {children}
        </div>
      )}
    </section>
  )
})
