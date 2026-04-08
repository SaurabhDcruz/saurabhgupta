import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import useStore from '@/store/index.js'

export default function LoaderScreen() {
  const loadingProgress = useStore((state) => state.loadingProgress)
  const loadingComplete = useStore((state) => state.loadingComplete)
  const setLoadingProgress = useStore((state) => state.setLoadingProgress)
  const setLoadingComplete = useStore((state) => state.setLoadingComplete)

  const textRef = useRef(null)
  const welcomeText = "Welcome to Dcruz Portfolio"

  useEffect(() => {
    let progress = 0
    const handle = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 12)
      setLoadingProgress(Math.round(progress))

      if (progress >= 100) {
        clearInterval(handle)
        setTimeout(() => setLoadingComplete(true), 1500)
      }
    }, 160)

    // Cinematic Text Animation
    const chars = textRef.current.querySelectorAll('.char')
    gsap.fromTo(chars,
      {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)',
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.2,
        stagger: 0.04,
        ease: "power4.out",
        delay: 0.2
      }
    )

    return () => clearInterval(handle)
  }, [setLoadingComplete, setLoadingProgress])

  return (
    <div className={`loader-screen ${loadingComplete ? 'loader-hidden' : ''}`}>
      <div className="loader-grid" aria-hidden={loadingComplete}>
        <span className="loader-eyeball" />
        <div className="loader-copy">
          <p className="loader-label" ref={textRef}>
            {welcomeText.split("").map((char, index) => (
              <span key={index} className="char" style={{ display: 'inline-block', whiteSpace: char === " " ? 'pre' : 'normal' }}>
                {char}
              </span>
            ))}
          </p>
          <div className="loader-bar">
            <div className="loader-fill" style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="loader-percent">{loadingProgress}%</p>
        </div>
      </div>
    </div>
  )
}
