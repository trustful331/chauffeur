import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({ children, className = '', narrow }: PageContainerProps) {
  return (
    <div className={[narrow ? 'page-container max-w-content' : 'page-container', className].join(' ')}>
      {children}
    </div>
  )
}

type SectionProps = {
  children: ReactNode
  className?: string
  alt?: boolean
  cream?: boolean
  id?: string
}

export function Section({ children, className = '', alt, cream, id }: SectionProps) {
  const bg = cream ? 'bg-maseer-cream' : alt ? 'bg-maseer-surface' : ''
  return (
    <section id={id} className={['section-pad', bg, className].filter(Boolean).join(' ')}>
      {children}
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow?: string
  before: string
  accent: string
  after?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  before,
  accent,
  after = '',
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : ''
  const descClass = align === 'center' ? 'mx-auto text-center' : ''

  return (
    <div className={[alignClass, className].filter(Boolean).join(' ')}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="heading-lg">
        {before}
        <span className="text-maseer-gold">{accent}</span>
        {after}
      </h2>
      {description && <p className={['body-text mt-4 max-w-xl', descClass].join(' ')}>{description}</p>}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}
