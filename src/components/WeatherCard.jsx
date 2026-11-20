// ============================================================
// WeatherCard.jsx — Displays all weather information for a city.
// Props:
//   data {object} — raw JSON response from OpenWeatherMap API
// ============================================================

import "./WeatherCard.css";

// Helper: round a number to 1 decimal place
const round1 = (n) => Math.round(n * 10) / 10;

// Helper: convert wind speed (m/s) to km/h
const msToKmh = (ms) => round1(ms * 3.6);

// Helper: format Unix timestamp to a readable local time string
const formatTime = (unix, timezone) => {
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().slice(17, 22); // "HH:MM"
};

// Map weather condition IDs to gradient class names for card theming
const getGradientClass = (weatherId) => {
  if (weatherId >= 200 && weatherId < 300) return "gradient-thunder";
  if (weatherId >= 300 && weatherId < 600) return "gradient-rain";
  if (weatherId >= 600 && weatherId < 700) return "gradient-snow";
  if (weatherId >= 700 && weatherId < 800) return "gradient-mist";
  if (weatherId === 800) return "gradient-clear";
  if (weatherId > 800) return "gradient-clouds";
  return "gradient-default";
};

function WeatherCard({ data }) {
  const {
    name,                           // Fallback city name
    customCityName,                 // Accurate reverse geocoded city name
    customState,                    // State / Region
    coords,                         // Lat, Lon if fetched via live location
    sys,                            // { country, sunrise, sunset }
    main,                           // { temp, feels_like, humidity, pressure }
    weather,                        // Array of condition objects
    wind,                           // { speed, deg }
    visibility,                     // Visibility in metres
    timezone,                       // Offset in seconds from UTC
  } = data;

  const displayName = customCityName || name;
  const condition = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;
  const gradientClass = getGradientClass(condition.id);

  return (
    <div className={`weather-card ${gradientClass}`}>
      {/* ── HEADER: City, state, country & local time ── */}
      <div className="card-header">
        <div>
          <h2 className="city-name">
            {displayName}
            {customState && <span className="state-badge">, {customState}</span>}
            {sys?.country && <span className="country-badge">{sys.country}</span>}
          </h2>
          <p className="local-time">
            🕐 Local time: {formatTime(Math.floor(Date.now() / 1000), timezone)}
            {coords && ` • (${round1(coords.lat)}°, ${round1(coords.lon)}°)`}
          </p>
        </div>

        {/* Weather icon from OpenWeatherMap CDN */}
        <div className="icon-wrapper">
          <img src={iconUrl} alt={condition.description} className="weather-icon" />
        </div>
      </div>

      {/* ── MAIN: Temperature & condition ── */}
      <div className="card-main">
        <span className="temperature">{round1(main.temp)}°C</span>
        <span className="condition-text">{condition.description}</span>
      </div>

      {/* ── FEELS LIKE ── */}
      <p className="feels-like">Feels like {round1(main.feels_like)}°C</p>

      {/* ── DETAIL GRID: Humidity, Wind, Pressure, Visibility ── */}
      <div className="detail-grid">
        <DetailItem icon="💧" label="Humidity" value={`${main.humidity}%`} />
        <DetailItem icon="💨" label="Wind" value={`${msToKmh(wind.speed)} km/h`} />
        <DetailItem icon="🌡️" label="Pressure" value={`${main.pressure} hPa`} />
        <DetailItem icon="👁️" label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} />
      </div>

      {/* ── SUNRISE / SUNSET with clear labels ── */}
      <div className="sun-times">
        <div className="sun-item">
          <span className="sun-label">🌅 Sunrise</span>
          <span className="sun-val">{formatTime(sys.sunrise, timezone)}</span>
        </div>
        <div className="sun-item">
          <span className="sun-label">🌇 Sunset</span>
          <span className="sun-val">{formatTime(sys.sunset, timezone)}</span>
        </div>
      </div>
    </div>
  );
}

// Small reusable sub-component for each detail cell
function DetailItem({ icon, label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-icon">{icon}</span>
      <span className="detail-value">{value}</span>
      <span className="detail-label">{label}</span>
    </div>
  );
}

export default WeatherCard;
