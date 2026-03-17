interface Props {
  size?: number
  className?: string
}

/**
 * FreshDesk in-app logo — coordinates scaled from resources/icon.svg (256×256 → 200×200,
 * factor 0.78125) so that the in-app logo is pixel-perfect identical to the desktop icon.
 */
export default function FreshDeskLogo({ size = 28, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FreshDesk logo"
    >
      <defs>
        <linearGradient id="fdBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      {/* Rounded square background — rx/ry scaled from 56 → 43.75 ≈ 44 */}
      <rect width="200" height="200" rx="44" fill="url(#fdBg)" />
      {/* Subtle top highlight — scaled from x16,y16,w224,h112,rx40 */}
      <rect x="12.5" y="12.5" width="175" height="87.5" rx="31" fill="white" opacity="0.06" />
      {/* Letter F — vertical bar: x66,y54,w23,h148,rx9 */}
      <rect x="51.5" y="42" width="18" height="115.5" rx="7" fill="white" />
      {/* Letter F — top horizontal bar: x66,y54,w112,h23,rx9 */}
      <rect x="51.5" y="42" width="87.5" height="18" rx="7" fill="white" />
      {/* Letter F — middle horizontal bar: x66,y119,w82,h23,rx9 */}
      <rect x="51.5" y="92.5" width="64" height="18" rx="7" fill="white" />
      {/* Circuit decoration — main circle: cx190,cy182,r10 */}
      <circle cx="148.5" cy="142" r="7.8" fill="white" opacity="0.85" />
      {/* Circuit decoration — vertical wire: x185,y144,w10,h40 */}
      <rect x="144" y="112.5" width="7.8" height="31.2" rx="3.9" fill="white" opacity="0.5" />
      {/* Circuit decoration — small top circle: cx190,cy140,r6 */}
      <circle cx="148.5" cy="109.5" r="4.7" fill="white" opacity="0.65" />
      {/* Circuit decoration — far circle: cx210,cy182,r6 */}
      <circle cx="164" cy="142" r="4.7" fill="white" opacity="0.45" />
      {/* Circuit decoration — horizontal wire: x190,y176,w22,h10 */}
      <rect x="148.5" y="137.5" width="17.2" height="7.8" rx="3.9" fill="white" opacity="0.4" />
    </svg>
  )
}
