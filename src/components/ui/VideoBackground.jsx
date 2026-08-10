import useStore from '@/store/index.js'

export default function VideoBackground() {
  return (
    <div className="video-background">
      <video className="video-background__media" autoPlay muted loop playsInline>
        <source src="/media/hero-loop.mp4" type="video/mp4" />
        <p>Your browser does not support video background.</p>
      </video>
      <div className="video-background__overlay" />
    </div>
  )
}
