interface Props {
  size?: number
  className?: string
}

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
      <rect width="200" height="200" rx="44" fill="url(#fdBg)" />
      <rect x="12" y="12" width="176" height="90" rx="32" fill="white" opacity="0.06" />
      {/* F - vertical bar */}
      <rect x="52" y="42" width="18" height="116" rx="7" fill="white" />
      {/* F - top bar */}
      <rect x="52" y="42" width="88" height="18" rx="7" fill="white" />
      {/* F - middle bar */}
      <rect x="52" y="93" width="64" height="18" rx="7" fill="white" />
      {/* Circuit dots */}
      <circle cx="148" cy="142" r="8" fill="white" opacity="0.85" />
      <rect x="144" y="112" width="8" height="32" rx="4" fill="white" opacity="0.5" />
      <circle cx="148" cy="110" r="5" fill="white" opacity="0.65" />
      <circle cx="164" cy="142" r="5" fill="white" opacity="0.45" />
      <rect x="148" y="138" width="18" height="8" rx="4" fill="white" opacity="0.4" />
    </svg>
  )
}
