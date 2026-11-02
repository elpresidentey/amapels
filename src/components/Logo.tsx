import Image from 'next/image'

type LogoVariant = 'mark' | 'wordmark'
type LogoTone = 'auto' | 'ink' | 'gold' | 'cream'

const ASSETS: Record<LogoVariant, Record<Exclude<LogoTone, 'auto'>, string>> = {
  mark: {
    ink: '/images/brand/mark-ink.png',
    gold: '/images/brand/mark-gold.png',
    cream: '/images/brand/mark-cream.png',
  },
  wordmark: {
    ink: '/images/brand/wordmark-ink.png',
    gold: '/images/brand/wordmark-gold.png',
    cream: '/images/brand/wordmark-cream.png',
  },
}

interface LogoProps {
  /** `mark` is the A monogram; `wordmark` is the full AMAPELS lockup. */
  variant?: LogoVariant
  /**
   * `auto` follows the theme (ink on paper, gold on black). Pass an explicit
   * tone when the surface does not follow the page theme, such as a dark
   * overlay, an email or a printed receipt.
   */
  tone?: LogoTone
  className?: string
  priority?: boolean
  alt?: string
}

/**
 * Brand logo. Uses transparent PNGs and swaps them in CSS via `data-theme`,
 * so the correct mark paints on the very first frame with no hydration flash.
 */
export default function Logo({
  variant = 'wordmark',
  tone = 'auto',
  className = '',
  priority = false,
  alt = 'AMAPELS',
}: LogoProps) {
  const frame = `relative block ${className}`

  if (tone !== 'auto') {
    return (
      <span className={frame}>
        <Image
          src={ASSETS[variant][tone]}
          alt={alt}
          fill
          sizes="(max-width: 768px) 40vw, 320px"
          className="object-contain"
          priority={priority}
        />
      </span>
    )
  }

  return (
    <span className={frame}>
      {/* Paper surfaces: ink logo */}
      <Image
        src={ASSETS[variant].ink}
        alt={alt}
        fill
        sizes="(max-width: 768px) 40vw, 320px"
        className="logo-on-light object-contain"
        priority={priority}
      />
      {/* Ink surfaces: gold logo. Loaded eagerly but not preloaded so a
          theme still costs only one preload hint. */}
      <Image
        src={ASSETS[variant].gold}
        alt={alt}
        fill
        loading="eager"
        sizes="(max-width: 768px) 40vw, 320px"
        className="logo-on-dark object-contain"
      />
    </span>
  )
}
