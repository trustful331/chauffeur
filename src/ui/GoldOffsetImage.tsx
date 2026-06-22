type GoldOffsetImageProps = {
  src: string
  alt: string
  offset?: 'right' | 'left'
  objectPosition?: string
  className?: string
}

export function GoldOffsetImage({
  src,
  alt,
  offset = 'right',
  objectPosition = 'center',
  className = '',
}: GoldOffsetImageProps) {
  const goldPosition = offset === 'right' ? 'left-[8.75px] top-[12.17px]' : 'right-[8.75px] top-[12.17px]'

  return (
    <div className={`relative h-[449px] w-full max-w-[549px] ${className}`}>
      <div
        className={`absolute ${goldPosition} h-[437px] w-full max-w-[549px] rounded-[19.28px] bg-maseer-gold-bright`}
        aria-hidden
      />
      <img
        src={src}
        alt={alt}
        className="relative z-10 h-[437px] w-full max-w-[549px] rounded-[19.28px] object-cover shadow-[6px_4px_4px_rgba(0,0,0,0.27)]"
        style={{ objectPosition }}
      />
    </div>
  )
}
