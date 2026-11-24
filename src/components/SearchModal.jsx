// ============================================================
// SearchModal.jsx — Quick Search & Trending Cities Modal
// Triggered by BottomNav search button or mobile search action.
// ============================================================

import { useState, useEffect } from "react";
import { searchCitySuggestions, POPULAR_CITIES } from "../services/weatherApi";

function SearchModal({ isOpen, onClose, onSelectCity, onLiveLocation }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchCitySuggestions(query);
      setSuggestions(res);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    onSelectCity(item);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h3>Explore Weather Worldwide</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Input Bar with GPS */}
        <div className="search-modal-input-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-input-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Type city or airport (e.g. Kurchatov, Tokyo, London)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="search-gps-pill"
            onClick={() => {
              onLiveLocation();
              onClose();
            }}
            title="Use current GPS location"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>Live GPS</span>
          </button>
        </div>

        {/* Dynamic Suggestions */}
        {suggestions.length > 0 && (
          <div className="search-modal-suggestions">
            <span className="suggestions-label">Matching Locations</span>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="search-suggestion-row"
                onClick={() => handleSelect(item)}
              >
                <span className="sugg-pin">📍</span>
                <div className="sugg-text">
                  <span className="sugg-name">{item.name}</span>
                  <span className="sugg-region">{item.state ? `${item.state}, ` : ""}{item.country}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trending / Popular Cities Grid */}
        <div className="popular-cities-section">
          <span className="popular-section-title">Trending Global Cities</span>
          <div className="popular-cities-grid">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                className="popular-city-chip"
                onClick={() => handleSelect(city.name)}
              >
                <span className="city-chip-name">{city.name}</span>
                <span className="city-chip-code">{city.country}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
