import Image from 'next/image'

import { cn } from '@/lib/utils'

/*
 * Ponto único de uso do logotipo. Para trocar o PNG pelo SVG de alta resolução,
 * basta ajustar os caminhos abaixo (os arquivos ficam em /public).
 */
const LOGO = {
  light: { src: '/shalom-logo.png', width: 536, height: 373 }, // para fundos claros
  dark: { src: '/shalom-logo-white.png', width: 536, height: 373 }, // para fundos escuros
  monogram: { src: '/shalom-monogram.png', width: 160, height: 170 },
} as const

export function Logo({
  tone = 'light',
  className,
  priority = false,
}: {
  tone?: 'light' | 'dark'
  className?: string
  priority?: boolean
}) {
  const asset = LOGO[tone]
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt="Shalom Imóveis"
      priority={priority}
      className={cn('h-auto w-40', className)}
    />
  )
}

export function Monogram({ className, decorative = true }: { className?: string; decorative?: boolean }) {
  return (
    <Image
      src={LOGO.monogram.src}
      width={LOGO.monogram.width}
      height={LOGO.monogram.height}
      alt={decorative ? '' : 'Monograma Shalom Imóveis'}
      aria-hidden={decorative}
      className={cn('h-auto w-10', className)}
    />
  )
}

/** Lockup tipográfico compacto (monograma + SHALOM / IMÓVEIS) para barras e menus escuros. */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Monogram className="w-9" />
      <div className="leading-none">
        <div className="font-display text-lg font-extrabold tracking-[0.14em] text-white">SHALOM</div>
        <div className="eyebrow mt-1 !text-[0.6rem] !tracking-[0.42em] text-gold">Imóveis</div>
      </div>
    </div>
  )
}