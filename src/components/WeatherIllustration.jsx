// ============================================================
// WeatherIllustration.jsx — High-end 3D style weather graphic
// Renders glossy, realistic clouds with lightning, rain, or sun
// ============================================================

function WeatherIllustration({ type = "thunder", size = "large" }) {
  const isSmall = size === "small";
  const w = isSmall ? 70 : 180;
  const h = isSmall ? 55 : 140;

  return (
    <div className={`weather-3d-wrapper ${size}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="weather-3d-svg"
      >
        <defs>
          {/* Cloud linear gradient */}
          <linearGradient id="cloudGrad" x1="40" y1="20" x2="160" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#dce4ec" />
            <stop offset="100%" stopColor="#9aaec0" />
          </linearGradient>

          {/* Cloud back shadow gradient */}
          <linearGradient id="cloudBack" x1="80" y1="0" x2="180" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b0c4de" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5d6f85" stopOpacity="0.9" />
          </linearGradient>

          {/* Sun disc gradient */}
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff59d" />
            <stop offset="40%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#ff6f00" />
          </radialGradient>

          {/* Lightning gradient */}
          <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff59d" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Rain droplet gradient */}
          <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── SUN (shown for clear, sunny, or sun-cloud) ── */}
        {(type === "clear" || type === "cloudy") && (
          <g filter="url(#softGlow)">
            <circle cx="140" cy="52" r="32" fill="url(#sunGrad)" />
          </g>
        )}

        {/* ── BACK CLOUD LAYER ── */}
        <path
          d="M60 75 A 25 25 0 0 1 100 55 A 32 32 0 0 1 155 65 A 25 25 0 0 1 155 105 L 60 105 Z"
          fill="url(#cloudBack)"
          opacity="0.6"
        />

        {/* ── MAIN FRONT 3D CLOUD ── */}
        <path
          d="M50 110 C 35 110 24 98 24 84 C 24 71 34 60 47 58 C 50 42 66 30 84 30 C 97 30 109 36 116 46 C 122 41 130 38 138 38 C 154 38 167 50 168 66 C 177 68 184 76 184 86 C 184 99 173 110 160 110 Z"
          fill="url(#cloudGrad)"
          filter="drop-shadow(0 12px 20px rgba(0,0,0,0.45))"
        />

        {/* Cloud highlight rim */}
        <path
          d="M48 60 C 51 45 66 32 84 32 C 96 32 108 38 115 47"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* ── LIGHTNING BOLT (for thunder) ── */}
        {type === "thunder" && (
          <g filter="url(#softGlow)">
            <polygon
              points="102,96 85,124 100,124 88,154 118,114 103,114 114,96"
              fill="url(#boltGrad)"
            />
            {/* Tiny accent spark */}
            <polygon points="128,126 131,133 138,136 131,139 128,146 125,139 118,136 125,133" fill="#fbbf24" opacity="0.9" />
          </g>
        )}

        {/* ── RAIN DROPLETS (for rain) ── */}
        {(type === "rain" || type === "thunder") && (
          <g>
            <path d="M60 122 Q 62 135 60 142 A 4 4 0 0 1 54 142 Q 54 135 60 122 Z" fill="url(#rainGrad)" />
            <path d="M80 126 Q 82 139 80 146 A 4 4 0 0 1 74 146 Q 74 139 80 126 Z" fill="url(#rainGrad)" />
            <path d="M125 124 Q 127 137 125 144 A 4 4 0 0 1 119 144 Q 119 137 125 124 Z" fill="url(#rainGrad)" />
            <path d="M145 120 Q 147 133 145 140 A 4 4 0 0 1 139 140 Q 139 133 145 120 Z" fill="url(#rainGrad)" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default WeatherIllustration;
