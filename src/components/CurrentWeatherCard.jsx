// ============================================================
// CurrentWeatherCard.jsx — Hero Weather Card
// Dark glassmorphism hero layout:
// City on top, condition, favorite bookmark star, interactive
// refresh button with spin animation, floating 3D weather art with glow,
// large thin temperature, and 3-stat interactive glass row.
// ============================================================

import { useState } from "react";
import WeatherIllustration from "./WeatherIllustration";

function CurrentWeatherCard({
  data,
  onRefresh,
  isRefreshing = false,
  isFavorite = false,
  onToggleFavorite,
  onOpenStatDetail
}) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const {
    city,
    country,
    updatedTime,
    localTime,
    condition,
    conditionMain,
    icon,
    temp,
    feelsLike,
    tempHigh,
    tempLow,
    humidity,
    wind,
    windSpeed,
    precipitation = 25
  } = data;

  const displayWind = windSpeed || wind || "12 km/h";

  // Determine weather type for 3D illustration and glowing ambient light
  const condLower = (condition || "").toLowerCase();
  const weatherType =
    condLower.includes("thunder") || condLower.includes("storm")
      ? "thunder"
      : condLower.includes("rain") || condLower.includes("drizzle")
      ? "rain"
      : condLower.includes("snow")
      ? "snow"
      : condLower.includes("clear") || condLower.includes("sun")
      ? "clear"
      : "cloudy";

  const glowClass =
    weatherType === "thunder" || weatherType === "clear"
      ? "glow-sun"
      : weatherType === "rain"
      ? "glow-rain"
      : "glow-neutral";

  const handleStatClick = (statName, statVal, description) => {
    if (onOpenStatDetail) {
      onOpenStatDetail({
        title: statName,
        subtitle: `Current atmospheric reading: ${statVal}`,
        condition,
        temp,
        pop: precipitation,
        humidity,
        wind: displayWind,
        extra: { uvIndex: "Moderate (3)", clouds: `${precipitation}%` }
      });
    } else {
      setActiveTooltip(activeTooltip === statName ? null : statName);
    }
  };

  return (
    <div className={`ds-card current-weather-card ${glowClass}`}>
      {/* ── Top Bar: City name, favorite star & refresh button ── */}
      <div className="current-header">
        <div className="city-title-group">
          <div className="city-title-row">
            <h2 className="city-title">
              {city}
              {country && <span className="country-code">, {country}</span>}
            </h2>

            {/* Favorite Bookmark Star Button */}
            <button
              type="button"
              className={`favorite-star-btn ${isFavorite ? "is-favorite" : ""}`}
              onClick={onToggleFavorite}
              title={isFavorite ? "Remove from favorite cities" : "Bookmark this city"}
              aria-label="Bookmark city"
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? "#ffc83d" : "none"} stroke="#ffc83d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          </div>

          <p className="city-subtitle">
            Local Time {localTime} • <span className="capitalize">{condition}</span>
          </p>
        </div>

        {/* Refresh Live Data Button */}
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          title="Click to refresh live weather data"
          aria-label="Refresh live data"
        >
          <span>Updated {updatedTime}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`refresh-icon ${isRefreshing ? "spin-active" : ""}`}>
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
          </svg>
        </button>
      </div>

      {/* ── Centered Hero 3D Weather Art & Temperature ── */}
      <div className="current-body-centered">
        <div className="hero-art-floating">
          <WeatherIllustration type={weatherType} size="large" />
        </div>

        <div className="hero-temp-display">
          <div className="big-temp-wrap">
            <span className="big-temp">{temp}</span>
            <span className="temp-degree">°</span>
          </div>
          <div className="temp-stats-inline">
            <span className="feels-stat">Feels like {feelsLike}°</span>
            <span className="high-low-stat">H: {tempHigh}° • L: {tempLow}°</span>
          </div>
        </div>
      </div>

      {/* ── 3-Column Glass Stat Bar (Precipitation, Humidity, Wind Speed) ── */}
      <div className="hero-three-stats-bar">
        {/* Precipitation Column */}
        <div
          className="stat-col interactive-stat"
          onClick={() => handleStatClick("Precipitation", `${precipitation}%`, "Probability of liquid atmospheric moisture")}
          title="Click for precipitation details"
        >
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M16 14v6" />
              <path d="M8 14v6" />
              <path d="M12 16v6" />
            </svg>
          </div>
          <span className="stat-value">{precipitation}%</span>
          <span className="stat-label">Precipitation</span>
        </div>

        {/* Humidity Column */}
        <div
          className="stat-col interactive-stat"
          onClick={() => handleStatClick("Humidity", `${humidity}%`, "Current relative air humidity")}
          title="Click for humidity details"
        >
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <span className="stat-value">{humidity}%</span>
          <span className="stat-label">Humidity</span>
        </div>

        {/* Wind Speed Column */}
        <div
          className="stat-col interactive-stat"
          onClick={() => handleStatClick("Wind Speed", displayWind, "Atmospheric air velocity")}
          title="Click for wind details"
        >
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
            </svg>
          </div>
          <span className="stat-value">{displayWind}</span>
          <span className="stat-label">Wind Speed</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherCard;
