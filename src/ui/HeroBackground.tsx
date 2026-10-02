import type { CSSProperties } from 'react'

type HeroBackgroundProps = {
  image?: string
  video?: string
  gradient?: string
  className?: string
  style?: CSSProperties
}

export function HeroBackground({
  image,
  video,
  gradient,
  className = '',
  style,
}: HeroBackgroundProps) {
  return (
    <div
      className={[
        'hero-bg pointer-events-none absolute inset-0 overflow-hidden',
        className,
      ].join(' ')}
      aria-hidden
      style={style}
    >
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={image}
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : image ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ) : null}

      {/* Gradient overlay for readability and luxury cinematic tint */}
      {gradient && (
        <div
          className="absolute inset-0"
          style={{
            background: gradient,
          }}
        />
      )}
    </div>
  )
}
