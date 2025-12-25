/**
 * Logo component with Ocean Breeze theme colors and animations
 */
export function Logo({ className = 'h-10 w-10 md:h-12 md:w-12' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={`logo-svg ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="logo-gradient-start" />
          <stop offset="100%" className="logo-gradient-end" />
        </linearGradient>
      </defs>
      {/* Medical cross */}
      <rect
        x="40"
        y="20"
        width="20"
        height="60"
        rx="4"
        fill="url(#logo-gradient)"
        className="logo-cross-vertical"
      />
      <rect
        x="20"
        y="40"
        width="60"
        height="20"
        rx="4"
        fill="url(#logo-gradient)"
        className="logo-cross-horizontal"
      />
      {/* Heart pulse */}
      <path
        d="M30 50 L35 45 L40 50 L45 45 L50 50 L55 45 L60 50 L65 45 L70 50"
        stroke="url(#logo-gradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="logo-pulse"
      />
      {/* Circle background */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        fill="none"
        className="logo-circle"
      />
    </svg>
  )
}

