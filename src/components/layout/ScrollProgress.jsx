import useStore from '@/store/index.js'

export default function ScrollProgress() {
  const scrollProgress = useStore((state) => state.scrollProgress)

  return (
    <div className="scroll-progress">
      <div className="scroll-progress__track">
        <div className="scroll-progress__fill" style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>
    </div>
  )
}
