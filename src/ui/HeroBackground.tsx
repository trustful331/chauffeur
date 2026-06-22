import type { CSSProperties } from 'react'

type HeroBackgroundProps = {
  image: string
  gradient: string
  className?: string
  style?: CSSProperties
}

export function HeroBackground({
  image,
  gradient,
  className = '',
  style,
}: HeroBackgroundProps) {
  return (
    <div
      className={[
        'hero-bg pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat',
        className,
      ].join(' ')}
      aria-hidden
      style={{
        backgroundImage: `${gradient}, url(${image})`,
        ...style,
      }}
    />
  )
}
