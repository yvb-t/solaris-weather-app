// ============================================================
// SearchBar.jsx — Controlled input + search button + live location button.
// Props:
//   onSearch(city: string) — called when the user submits a city name.
//   onLocation() — called when user clicks the "Live Location" button.
// ============================================================

import { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch, onLocation }) {
  // Local state: what the user is currently typing
  const [inputValue, setInputValue] = useState("");

  // Called when the form is submitted (Enter key or button click)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent full-page reload

    const trimmed = inputValue.trim();
    if (!trimmed) return; // Ignore empty submissions

    onSearch(trimmed); // Bubble the city name up to App
    setInputValue(""); // Clear the input after searching
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <div className="search-input-wrapper">
          {/* Search icon (SVG inline) */}
          <span className="search-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            type="text"
            className="search-input"
            placeholder="Search for a city…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="City search"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <button type="submit" className="search-btn" aria-label="Search">
          Search
        </button>

        {/* ── Live Location Button ── */}
        <button
          type="button"
          className="location-btn"
          onClick={onLocation}
          title="Use live current location"
          aria-label="Use current location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="location-icon">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span className="location-btn-text">Live Location</span>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
