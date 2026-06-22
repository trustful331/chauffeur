import { Link } from 'react-router-dom'
import { images } from '../assets/images'

type MaseerLogoProps = {
  className?: string
}

export function MaseerLogo({ className = '' }: MaseerLogoProps) {
  return (
    <Link to="/" className={`inline-block ${className}`}>
      <img src={images.logo} alt="Maseer Luxury Chauffeur Service" className="h-[52px] w-auto object-contain" />
    </Link>
  )
}
