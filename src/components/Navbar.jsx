// ============================================================
// Navbar.jsx — Solaris Top Navigation Bar
// Brand, Search with embedded GPS & Autocomplete dropdown,
// Unit Toggle (°C / km/h), Theme Mode button, and User Profile / Auth button.
// ============================================================

import { useState, useEffect, useRef } from "react";
import { searchCitySuggestions } from "../services/weatherApi";

function Navbar({
  onSearch,
  onSelectSuggestion,
  onLiveLocation,
  isLocating = false,
  units,
  onToggleUnits,
  isDark = true,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onResetHome
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchWrapperRef = useRef(null);

  // Live autocomplete search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchCitySuggestions(query);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setShowDropdown(false);
  };

  const handlePickCity = (item) => {
    onSelectSuggestion({
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      state: item.state,
      country: item.country
    });
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <header className="navbar">
      {/* ── Brand Logo ── */}
      <div
        className="brand"
        onClick={onResetHome || (() => onSearch("Kurchatov"))}
        title="Solaris Weather — Click to return to Home"
        style={{ cursor: "pointer" }}
      >
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </div>
        <span className="brand-name">Solaris</span>
      </div>

      {/* ── Search Bar with integrated GPS button & Autocomplete ── */}
      <div className="nav-search-container" ref={searchWrapperRef}>
        <form className="nav-search-form" onSubmit={handleSubmit}>
          <div className="nav-search-wrapper">
            <button
              type="submit"
              className="nav-search-submit-btn"
              title="Search"
              aria-label="Submit search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <input
              type="text"
              className="nav-search-input"
              placeholder="Search city (e.g. Kurchatov, Chennai, London)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              aria-label="Search city"
            />

            <button
              type="button"
              className={`nav-gps-btn ${isLocating ? "locating-spin" : ""}`}
              onClick={onLiveLocation}
              title={isLocating ? "Finding your coordinates..." : "Use current GPS location"}
              aria-label="Use current location"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="7" />
                <circle cx="12" cy="12" r="2" />
                <line x1="12" y1="2" x2="12" y2="5" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="2" y1="12" x2="5" y2="12" />
                <line x1="19" y1="12" x2="22" y2="12" />
              </svg>
            </button>
          </div>
        </form>

        {/* ── Autocomplete Dropdown ── */}
        {showDropdown && suggestions.length > 0 && (
          <div className="nav-autocomplete-dropdown">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="nav-dropdown-item"
                onClick={() => handlePickCity(item)}
              >
                <span className="dropdown-pin">📍</span>
                <div className="dropdown-text">
                  <span className="dropdown-city">{item.name}</span>
                  <span className="dropdown-region">
                    {item.state ? `${item.state}, ` : ""}{item.country}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right Controls: Unit Toggle, Theme Toggle & Profile Button ── */}
      <div className="nav-controls">
        <button
          type="button"
          className="unit-toggle-btn"
          onClick={onToggleUnits}
          title={`Switch to ${units === "metric" ? "°F / mph" : "°C / km/h"}`}
        >
          {units === "metric" ? "°C / km/h" : "°F / mph"}
        </button>

        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title={isDark ? "Switch to Aurora Glow Mode" : "Switch to Midnight Storm Mode"}
          aria-label="Toggle theme mode"
        >
          {isDark ? (
            /* Sun / Amber ambient icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Profile / Auth Button in Navbar */}
        <button
          type="button"
          className="nav-profile-btn"
          onClick={onOpenAuth}
          title={currentUser ? `Signed in as ${currentUser.name}` : "Sign In / Profile"}
        >
          {currentUser ? (
            <div className="nav-profile-badge">
              <span className="profile-badge-avatar">{currentUser.avatar || "👤"}</span>
              <span className="profile-badge-name">{currentUser.name.split(" ")[0]}</span>
            </div>
          ) : (
            <div className="nav-login-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Sign In</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
