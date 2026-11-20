// ============================================================
// HomeScreen.jsx — Screen 1 of the iOS Weather Design
// Shows: City header, 3D Hero Weather illustration,
// 3-Metric Frosted Glass Card, Other Cities Carousel, and Today Hourly Pills
// ============================================================

import WeatherIllustration from "./WeatherIllustration";

function HomeScreen({ weather, otherCities, onSelectCity, onNavigateToForecast, onOpenSearch, onLiveLocation }) {
  if (!weather) return null;

  const {
    name,
    conditionMain,
    precipitation,
    humidity,
    windSpeed,
    hourly,
    theme
  } = weather;

  return (
    <div className="screen-content home-screen">
      {/* ── Top Header Actions ── */}
      <div className="ios-top-bar">
        <button
          type="button"
          className="ios-icon-btn"
          onClick={onOpenSearch}
          title="Cities list"
          aria-label="Cities list"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        </button>

        <div className="ios-header-center">
          <h1 className="ios-city-title">{name}</h1>
          <p className="ios-condition-subtitle">{conditionMain}</p>
        </div>

        <button
          type="button"
          className="ios-icon-btn"
          onClick={onLiveLocation}
          title="Use current location"
          aria-label="Use current location"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2" />
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      </div>

      {/* ── Hero 3D Weather Graphic ── */}
      <div className="hero-weather-center">
        <WeatherIllustration type={theme.type} size="large" />
      </div>

      {/* ── 3-Metric Frosted Glass Card ── */}
      <div className="ios-glass-card metrics-card">
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

      {/* ── Other Cities Carousel ── */}
      <div className="section-block other-cities-section">
        <div className="section-header">
          <span className="section-title">Other Cities</span>
          <button
            type="button"
            className="add-city-btn"
            onClick={onOpenSearch}
            title="Add city"
          >
            +
          </button>
        </div>

        <div className="other-cities-row">
          {otherCities && otherCities.map((city, idx) => (
            <div
              key={idx}
              className="ios-glass-card city-chip"
              onClick={() => onSelectCity(city.name)}
            >
              <div className="chip-left">
                <WeatherIllustration type={city.theme.type} size="small" />
                <div className="chip-info">
                  <span className="chip-name">{city.name}</span>
                  <span className="chip-cond">{city.conditionMain}</span>
                </div>
              </div>
              <span className="chip-temp">{city.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today Hourly Forecast Pills ── */}
      <div className="section-block today-forecast-section">
        <div className="section-header">
          <span className="section-title">Today</span>
          <button
            type="button"
            className="link-forecast-btn"
            onClick={onNavigateToForecast}
          >
            7-Day Forecasts &gt;
          </button>
        </div>

        <div className="hourly-pills-row">
          {hourly && hourly.map((item, idx) => (
            <div key={idx} className="ios-glass-card hourly-pill">
              <span className="pill-time">{item.time}</span>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                alt={item.condition}
                className="pill-icon"
              />
              <span className="pill-temp">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
