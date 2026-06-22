type SplitHeadingProps = {
  before: string
  accent: string
  after?: string
  align?: 'left' | 'center'
  className?: string
}

export function SplitHeading({
  before,
  accent,
  after = '',
  align = 'left',
  className = '',
}: SplitHeadingProps) {
  return (
    <h2 className={[
      'font-serif text-figma-h2 font-medium text-maseer-green-text',
      align === 'center' ? 'text-center' : '',
      className,
    ].join(' ')}>
      {before}
      <span className="text-maseer-gold">{accent}</span>
      {after}
    </h2>
  )
}
