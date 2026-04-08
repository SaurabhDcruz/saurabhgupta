import { useEffect } from 'react'
import useStore from '@/store/index.js'

export default function LoaderScreen() {
  const loadingProgress = useStore((state) => state.loadingProgress)
  const loadingComplete = useStore((state) => state.loadingComplete)
  const setLoadingProgress = useStore((state) => state.setLoadingProgress)
  const setLoadingComplete = useStore((state) => state.setLoadingComplete)

  useEffect(() => {
    let frame = 0
    let progress = 0
    const handle = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 18)
      setLoadingProgress(Math.round(progress))

      if (progress >= 100) {
        clearInterval(handle)
        setTimeout(() => setLoadingComplete(true), 550)
      }
    }, 140)

    return () => clearInterval(handle)
  }, [setLoadingComplete, setLoadingProgress])

  return (
    <div className={`loader-screen ${loadingComplete ? 'loader-hidden' : ''}`}>
      <div className="loader-grid" aria-hidden={loadingComplete}>
        <span className="loader-eyeball" />
        <div className="loader-copy">
          <p className="loader-label">Immersive pipeline</p>
          <div className="loader-bar">
            <div className="loader-fill" style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="loader-percent">{loadingProgress}%</p>
        </div>
      </div>
    </div>
  )
}
