// ============================================================
// ForecastScreen.jsx — Screen 2 of the iOS Weather Design
// Shows: 7 Days Forecast with top summary card & daily list
// ============================================================

import WeatherIllustration from "./WeatherIllustration";

function ForecastScreen({ weather, onBack }) {
  if (!weather) return null;

  const {
    temp,
    tempMin,
    tempMax,
    precipitation,
    humidity,
    windSpeed,
    daily,
    theme
  } = weather;

  return (
    <div className="screen-content forecast-screen">
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

        <h1 className="ios-screen-title">7 Days</h1>

        <div style={{ width: 36 }} /> {/* Balance spacer */}
      </div>

      {/* ── Top Summary Glass Card ── */}
      <div className="ios-glass-card forecast-summary-card">
        <div className="summary-top">
          <div className="summary-illus">
            <WeatherIllustration type={theme.type} size="medium" />
          </div>
          <div className="summary-temp-group">
            <span className="summary-main-temp">{temp}°</span>
            <span className="summary-slash">/</span>
            <span className="summary-low-temp">{tempMin || (temp - 6)}°</span>
          </div>
        </div>

        <div className="summary-metrics-row">
          <div className="metric-cell">
            <span className="metric-icon">🌧️</span>
            <span className="metric-val">{precipitation}%</span>
            <span className="metric-title">Precipitation</span>
          </div>
          <div className="metric-cell">
            <span className="metric-icon">💧</span>
            <span className="metric-val">{humidity}%</span>
            <span className="metric-title">Humidity</span>
          </div>
          <div className="metric-cell">
            <span className="metric-icon">💨</span>
            <span className="metric-val">{windSpeed}km/h</span>
            <span className="metric-title">Wind Speed</span>
          </div>
        </div>
      </div>

      {/* ── 7-Day Forecast List ── */}
      <div className="forecast-days-list">
        {daily && daily.map((dayItem, idx) => (
          <div key={idx} className="forecast-day-row">
            <span className="day-name">{dayItem.day}</span>

            <div className="day-icon-col">
              <WeatherIllustration
                type={
                  dayItem.condition.toLowerCase().includes("thunder")
                    ? "thunder"
                    : dayItem.condition.toLowerCase().includes("rain")
                    ? "rain"
                    : dayItem.condition.toLowerCase().includes("clear")
                    ? "clear"
                    : "cloudy"
                }
                size="small"
              />
            </div>

            <span className="day-condition-label">{dayItem.condition}</span>

            <div className="day-temps-range">
              <span className="day-min">+{dayItem.minTemp}°</span>
              <span className="day-max">+{dayItem.maxTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastScreen;
