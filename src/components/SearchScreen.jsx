// ============================================================
// SearchScreen.jsx — Screen 3 of the iOS Weather Design
// Shows: Search input with placeholder "🔍 California" and
// list of dark frosted glass city cards with live temps & times
// ============================================================

import { useState } from "react";
import WeatherIllustration from "./WeatherIllustration";

function SearchScreen({ savedCities, onSelectCity, onSearchQuery, onBack }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    onSearchQuery(trimmed);
  };

  return (
    <div className="screen-content search-screen">
      {/* ── Top Header Bar ── */}
      <div className="ios-top-bar">
        <button
          type="button"
          className="ios-icon-btn back-btn"
          onClick={onBack}
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h1 className="ios-screen-title">Weather</h1>

        <button
          type="button"
          className="ios-icon-btn"
          title="More options"
          aria-label="More options"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* ── Search Bar Input ── */}
      <form className="ios-search-form" onSubmit={handleSubmit}>
        <div className="ios-search-box">
          <span className="ios-search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="ios-search-input"
            placeholder="Search for a city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
        </div>
      </form>

      {/* ── City Cards List ── */}
      <div className="city-cards-list">
        {savedCities && savedCities.map((city, idx) => (
          <div
            key={idx}
            className="ios-glass-card city-wide-card"
            onClick={() => onSelectCity(city.name)}
          >
            <div className="card-left">
              <span className="city-big-temp">{city.temp}°</span>
              <div className="city-detail-text">
                <span className="city-cond-title">{city.conditionMain}</span>
                <span className="city-subtext">
                  {city.name}, {city.localTimeStr || "Current 2:00 PM"}
                </span>
              </div>
            </div>

            <div className="card-right-illus">
              <WeatherIllustration type={city.theme.type} size="small" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchScreen;
