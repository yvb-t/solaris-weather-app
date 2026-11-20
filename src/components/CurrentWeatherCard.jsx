// ============================================================
// CurrentWeatherCard.jsx — Matches DailySky top-left card
// City, Country, Refresh button, Local time, Condition,
// Big icon + temperature, Feels like, and H/L.
// ============================================================

function CurrentWeatherCard({ data, onRefresh }) {
  const {
    city,
    country,
    updatedTime,
    localTime,
    condition,
    icon,
    temp,
    feelsLike,
    tempHigh,
    tempLow
  } = data;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="ds-card current-weather-card">
      <div className="current-header">
        <div>
          <h2 className="city-title">
            {city}
            {country && <span className="country-code">, {country}</span>}
          </h2>
          <p className="city-subtitle">
            Local Time {localTime} • <span className="capitalize">{condition}</span>
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          title="Refresh weather"
          aria-label="Refresh weather"
        >
          <span>Updated {updatedTime}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="refresh-icon">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
          </svg>
        </button>
      </div>

      <div className="current-body">
        <div className="temp-display">
          <img src={iconUrl} alt={condition} className="current-icon" />
          <span className="big-temp">{temp}°</span>
        </div>

        <div className="temp-stats">
          <div className="feels-stat">Feels like {feelsLike}°</div>
          <div className="high-low-stat">H: {tempHigh}° • L: {tempLow}°</div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherCard;
