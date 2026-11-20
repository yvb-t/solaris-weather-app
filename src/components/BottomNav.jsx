// ============================================================
// BottomNav.jsx — Floating Glass Bottom Navigation Bar
// Fixed at bottom with 4 circular icon buttons (stroke: 1.5px):
// 1. Home, 2. Search, 3. Map/Location, 4. Profile/Settings
// ============================================================

function BottomNav({ activeTab = "home", onTabChange }) {
  return (
    <nav className="ios-bottom-nav">
      {/* 1. Home */}
      <button
        type="button"
        className={`nav-circle-btn ${activeTab === "home" ? "active" : ""}`}
        onClick={() => onTabChange && onTabChange("home")}
        title="Home"
        aria-label="Home"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* 2. Search */}
      <button
        type="button"
        className={`nav-circle-btn ${activeTab === "search" ? "active" : ""}`}
        onClick={() => onTabChange && onTabChange("search")}
        title="Search city"
        aria-label="Search city"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {/* 3. Map / Location */}
      <button
        type="button"
        className={`nav-circle-btn ${activeTab === "map" ? "active" : ""}`}
        onClick={() => onTabChange && onTabChange("map")}
        title="Live GPS Location"
        aria-label="Live GPS Location"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      </button>

      {/* 4. Profile / Units / Settings */}
      <button
        type="button"
        className={`nav-circle-btn ${activeTab === "profile" ? "active" : ""}`}
        onClick={() => onTabChange && onTabChange("profile")}
        title="Settings & Units"
        aria-label="Settings & Units"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </nav>
  );
}

export default BottomNav;
