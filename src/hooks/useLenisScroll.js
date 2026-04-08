import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useStore from '@/store/index.js'
import { setLenis } from '@/utils/lenisRegistry.js'

gsap.registerPlugin(ScrollTrigger)

export default function useLenisScroll() {
  const setScrollState = useStore((state) => state.setScrollState)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      gestureOrientation: 'vertical',
      infinite: false,
      lerp: 0.08,
    })

    // Register globally so NavigationOverlay can use Lenis for smooth nav scrolls
    setLenis(lenis)

    const raf = (time) => {
      lenis.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }

    const file = requestAnimationFrame(raf)

    lenis.on('scroll', ({ scroll, limit, velocity, direction }) => {
      setScrollState({
        scrollProgress: limit > 0 ? scroll / limit : 0,
        scrollVelocity: Math.abs(velocity),
        scrollDirection: direction,
      })
    })

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value) : lenis.scroll.instance.scroll
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

    const refreshHandler = () => lenis.resize()
    ScrollTrigger.addEventListener('refreshInit', refreshHandler)
    ScrollTrigger.addEventListener('refresh', refreshHandler)
    ScrollTrigger.refresh()

    return () => {
      cancelAnimationFrame(file)
      lenis.destroy()
      setLenis(null)
      ScrollTrigger.removeEventListener('refreshInit', refreshHandler)
      ScrollTrigger.removeEventListener('refresh', refreshHandler)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [setScrollState])
}
