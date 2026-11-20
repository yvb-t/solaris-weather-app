// ============================================================
// IPhoneDevice.jsx — Authentic iPhone Enclosure
// Dynamic Island, Status Bar (9:41, Signal, Wifi, Battery),
// and Home Indicator Bar
// ============================================================

function IPhoneDevice({ children, currentTime = "9:41" }) {
  return (
    <div className="iphone-frame">
      {/* Outer bezel with subtle metallic border & soft shadow */}
      <div className="iphone-inner">
        {/* ── iOS Status Bar with Dynamic Island ── */}
        <div className="ios-status-bar">
          <span className="status-time">{currentTime}</span>

          {/* Dynamic Island pill */}
          <div className="dynamic-island">
            <div className="camera-lens" />
            <div className="sensor-dot" />
          </div>

          <div className="status-icons">
            {/* Cellular signal */}
            <svg viewBox="0 0 18 12" width="16" height="12" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5" width="3" height="7" rx="1" />
              <rect x="10" y="2" width="3" height="10" rx="1" />
              <rect x="15" y="0" width="3" height="12" rx="1" />
            </svg>

            {/* Wi-Fi */}
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <circle cx="12" cy="20" r="1" fill="currentColor" />
            </svg>

            {/* Battery */}
            <div className="status-battery">
              <div className="battery-level" />
            </div>
          </div>
        </div>

        {/* ── Screen Body Content ── */}
        <div className="iphone-screen-viewport">
          {children}
        </div>

        {/* ── iOS Bottom Home Indicator Bar ── */}
        <div className="ios-home-indicator-bar">
          <div className="home-indicator" />
        </div>
      </div>
    </div>
  );
}

export default IPhoneDevice;
