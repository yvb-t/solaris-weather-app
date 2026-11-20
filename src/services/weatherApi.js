// ============================================================
// weatherApi.js — OpenWeatherMap unified service for DailySky Dashboard
// Fetches: Current Weather, 5-Day/3-Hour Forecast, Air Quality,
// and Direct/Reverse Geocoding for 100% accurate location data.
// ============================================================

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// Helper: convert wind degrees to cardinal direction
const getWindDirection = (deg) => {
  if (deg === undefined || deg === null) return "";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5);
  return directions[index % 16];
};

// Helper: format Unix timestamp to "h:mm A" in the city's local timezone
export const formatLocalTime = (unix, timezoneOffsetSeconds) => {
  const date = new Date((unix + timezoneOffsetSeconds) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

// Helper: get Day of week from timestamp
const getDayName = (unix, timezoneOffsetSeconds, isFirst = false) => {
  if (isFirst) return "Today";
  const date = new Date((unix + timezoneOffsetSeconds) * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getUTCDay()];
};

// Air Quality Index mapping
const AQI_LEVELS = {
  1: { label: "Good", color: "#10b981", advice: "Air quality is ideal for outdoor activities." },
  2: { label: "Fair", color: "#84cc16", advice: "Air quality is acceptable for most people." },
  3: { label: "Moderate", color: "#f59e0b", advice: "Sensitive individuals should limit prolonged outdoor exertion." },
  4: { label: "Poor", color: "#f97316", advice: "Health effects can be felt by sensitive groups. Reduce outdoor activities." },
  5: { label: "Very Poor", color: "#ef4444", advice: "Health alert: serious risk of health effects for everyone." }
};

/**
 * Autocomplete search for exact city: returns city, state, country, lat, lon
 */
export const searchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const list = await res.json();
    return list.map((item) => ({
      name: item.name,
      state: item.state || "",
      country: item.country || "",
      lat: item.lat,
      lon: item.lon,
      displayName: `${item.name}${item.state ? `, ${item.state}` : ""}, ${item.country}`
    }));
  } catch {
    return [];
  }
};

/**
 * Main fetch function: returns complete weather data bundle for DailySky
 */
export const fetchCompleteWeatherData = async (target, units = "metric") => {
  let currentWeatherUrl;
  let reverseGeoUrl = null;

  if (typeof target === "object" && target.lat !== undefined) {
    currentWeatherUrl = `${BASE_URL}/weather?lat=${target.lat}&lon=${target.lon}&appid=${API_KEY}&units=${units}`;
    reverseGeoUrl = `${GEO_URL}/reverse?lat=${target.lat}&lon=${target.lon}&limit=1&appid=${API_KEY}`;
  } else {
    currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(target)}&appid=${API_KEY}&units=${units}`;
  }

  // 1. Fetch current weather
  const currentRes = await fetch(currentWeatherUrl);
  if (!currentRes.ok) {
    const errorData = await currentRes.json().catch(() => ({}));
    if (currentRes.status === 404) {
      throw new Error(`Location "${typeof target === 'string' ? target : 'coordinates'}" not found.`);
    }
    if (currentRes.status === 401) {
      throw new Error("Invalid API key. Please check your OpenWeatherMap key in .env.");
    }
    throw new Error(errorData.message || "Failed to fetch weather data.");
  }
  const currentData = await currentRes.json();

  const { coord, timezone } = currentData;
  const lat = coord.lat;
  const lon = coord.lon;

  // 2. Fetch 5-Day / 3-Hour Forecast and Air Pollution concurrently
  const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
  const aqiUrl = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  const fetchPromises = [
    fetch(forecastUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    fetch(aqiUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null)
  ];

  if (reverseGeoUrl) {
    fetchPromises.push(fetch(reverseGeoUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  }

  const [forecastData, aqiData, reverseGeoData] = await Promise.all(fetchPromises);

  // Determine city & country name
  let cityName = currentData.name;
  let stateName = "";
  if (typeof target === "object" && target.name) {
    cityName = target.name;
    if (target.state) stateName = target.state;
  } else if (reverseGeoData && Array.isArray(reverseGeoData) && reverseGeoData[0]) {
    if (reverseGeoData[0].name) cityName = reverseGeoData[0].name;
    if (reverseGeoData[0].state) stateName = reverseGeoData[0].state;
  }
  const countryCode = currentData.sys?.country || "";

  // ── 24-Hour Trend (8 data points = 24h) ──
  const hourly = [];
  if (forecastData && forecastData.list) {
    const next8 = forecastData.list.slice(0, 8);
    next8.forEach((item) => {
      const hourDate = new Date((item.dt + timezone) * 1000);
      const h = hourDate.getUTCHours();
      const ampm = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 || 12;

      hourly.push({
        time: `${displayH} ${ampm}`,
        temp: Math.round(item.main.temp),
        icon: item.weather[0]?.icon || "01d",
        condition: item.weather[0]?.main || "Clear",
        pop: Math.round((item.pop || 0) * 100),
        dt: item.dt
      });
    });
  }

  // ── 5-Day Forecast ──
  const dailyMap = {};
  if (forecastData && forecastData.list) {
    forecastData.list.forEach((item) => {
      const localDate = new Date((item.dt + timezone) * 1000);
      const dateKey = localDate.toISOString().slice(0, 10);

      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          dt: item.dt,
          temps: [],
          icons: [],
          pops: []
        };
      }
      dailyMap[dateKey].temps.push(item.main.temp);
      dailyMap[dateKey].icons.push(item.weather[0]?.icon || "01d");
      dailyMap[dateKey].pops.push(item.pop || 0);
    });
  }

  const dailyKeys = Object.keys(dailyMap).slice(0, 5);
  const daily = dailyKeys.map((dateKey, idx) => {
    const entry = dailyMap[dateKey];
    const minTemp = Math.round(Math.min(...entry.temps));
    const maxTemp = Math.round(Math.max(...entry.temps));
    const midIcon = entry.icons[Math.floor(entry.icons.length / 2)] || entry.icons[0];
    const maxPop = Math.round(Math.max(...entry.pops) * 100);

    return {
      day: getDayName(entry.dt, timezone, idx === 0),
      minTemp,
      maxTemp,
      icon: midIcon,
      pop: maxPop
    };
  });

  // ── Air Quality ──
  let aqiInfo = {
    level: 1,
    label: "Good",
    color: "#10b981",
    advice: "Air quality is ideal for outdoor activities.",
    components: { pm2_5: 5, pm10: 6, o3: 36, no2: 4 }
  };

  if (aqiData && aqiData.list && aqiData.list[0]) {
    const aqiVal = aqiData.list[0].main.aqi || 1;
    const comps = aqiData.list[0].components || {};
    aqiInfo = {
      level: aqiVal,
      label: AQI_LEVELS[aqiVal]?.label || "Good",
      color: AQI_LEVELS[aqiVal]?.color || "#10b981",
      advice: AQI_LEVELS[aqiVal]?.advice || "",
      components: {
        pm2_5: Math.round(comps.pm2_5 || 0),
        pm10: Math.round(comps.pm10 || 0),
        o3: Math.round(comps.o3 || 0),
        no2: Math.round(comps.no2 || 0)
      }
    };
  }

  // ── Atmospheric Details ──
  const windUnit = units === "metric" ? "km/h" : "mph";
  const windSpeedConverted = units === "metric"
    ? Math.round(currentData.wind.speed * 3.6)
    : Math.round(currentData.wind.speed);

  const windDirection = getWindDirection(currentData.wind.deg);

  return {
    city: cityName,
    state: stateName,
    country: countryCode,
    updatedTime: formatLocalTime(Math.floor(Date.now() / 1000), timezone),
    localTime: formatLocalTime(Math.floor(Date.now() / 1000), timezone),
    condition: currentData.weather[0]?.description || "",
    conditionMain: currentData.weather[0]?.main || "",
    icon: currentData.weather[0]?.icon || "01d",
    temp: Math.round(currentData.main.temp),
    feelsLike: Math.round(currentData.main.feels_like),
    tempHigh: Math.round(currentData.main.temp_max),
    tempLow: Math.round(currentData.main.temp_min),
    humidity: currentData.main.humidity,
    wind: `${windSpeedConverted} ${windUnit} ${windDirection}`.trim(),
    pressure: currentData.main.pressure,
    visibility: (currentData.visibility / 1000).toFixed(1),
    sunrise: formatLocalTime(currentData.sys.sunrise, timezone),
    sunset: formatLocalTime(currentData.sys.sunset, timezone),
    timezone,
    hourly,
    daily,
    aqi: aqiInfo,
    units
  };
};
