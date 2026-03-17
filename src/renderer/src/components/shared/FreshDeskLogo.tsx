interface Props {
  size?: number
  className?: string
}

/**
 * FreshDesk in-app logo — atomic/orbital design matching resources/icon.svg
 */
export default function FreshDeskLogo({ size = 28, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FreshDesk logo"
    >
      <defs>
        <radialGradient id="fdBg" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1e2d4a" />
          <stop offset="100%" stopColor="#0a1220" />
        </radialGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="256" height="256" rx="56" fill="url(#fdBg)" />

      {/* Orbital ring 1 - tilted upper-left to lower-right */}
      <ellipse cx="128" cy="128" rx="100" ry="42"
        fill="none" stroke="#7c6ef5" strokeWidth="2.5" opacity="0.75"
        transform="rotate(-35 128 128)" />

      {/* Orbital ring 2 - tilted upper-right to lower-left */}
      <ellipse cx="128" cy="128" rx="100" ry="42"
        fill="none" stroke="#4e8ef0" strokeWidth="2.5" opacity="0.75"
        transform="rotate(35 128 128)" />

      {/* Orbital ring 3 - near-horizontal */}
      <ellipse cx="128" cy="128" rx="100" ry="42"
        fill="none" stroke="#5b8de8" strokeWidth="2.5" opacity="0.55"
        transform="rotate(0 128 128)" />

      {/* Left dot (blue-purple) */}
      <circle cx="28" cy="128" r="9" fill="#7c7ff5" />

      {/* Right dot (cyan) */}
      <circle cx="228" cy="128" r="9" fill="#38c6f5" />

      {/* Letter F - vertical bar */}
      <rect x="82" y="70" width="22" height="116" rx="9" fill="white" />
      {/* Letter F - top horizontal bar */}
      <rect x="82" y="70" width="92" height="22" rx="9" fill="white" />
      {/* Letter F - middle horizontal bar */}
      <rect x="82" y="125" width="66" height="20" rx="9" fill="white" />
    </svg>
  )
}
