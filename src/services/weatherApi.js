// ============================================================
// weatherApi.js — OpenWeatherMap unified service for Solaris Weather
// Fetches: Current Weather, 5-Day/3-Hour Forecast, Air Quality,
// Direct/Reverse Geocoding, and resilient offline/fallback dataset generator.
// ============================================================

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "e5963846b6b82574c147cf004f4e870a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// Helper: convert wind degrees to cardinal direction
export const getWindDirection = (deg) => {
  if (deg === undefined || deg === null) return "N";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                      "S", "SW", "SSW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5);
  return directions[index % 16] || "N";
};

// Helper: format Unix timestamp to "h:mm A" in the city's local timezone
export const formatLocalTime = (unix, timezoneOffsetSeconds = 0) => {
  const date = new Date((unix + timezoneOffsetSeconds) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

// Helper: get Day of week from timestamp
export const getDayName = (unix, timezoneOffsetSeconds = 0, isFirst = false) => {
  if (isFirst) return "Today";
  const date = new Date((unix + timezoneOffsetSeconds) * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getUTCDay()];
};

// Air Quality Index mapping
export const AQI_LEVELS = {
  1: { label: "Good", color: "#10b981", advice: "Air quality is ideal for outdoor activities." },
  2: { label: "Fair", color: "#84cc16", advice: "Air quality is acceptable for most people." },
  3: { label: "Moderate", color: "#f59e0b", advice: "Sensitive individuals should limit prolonged outdoor exertion." },
  4: { label: "Poor", color: "#f97316", advice: "Health effects can be felt by sensitive groups. Reduce outdoor activities." },
  5: { label: "Very Poor", color: "#ef4444", advice: "Health alert: serious risk of health effects for everyone." }
};

// Popular global cities catalog for instant offline autocomplete and radar markers
export const POPULAR_CITIES = [
  { name: "Kurchatov", state: "Kursk Oblast", country: "RU", lat: 51.66, lon: 35.66 },
  { name: "London", state: "England", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", state: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "New York", state: "New York", country: "US", lat: 40.7128, lon: -74.0060 },
  { name: "Chennai", state: "Tamil Nadu", country: "IN", lat: 13.0827, lon: 80.2707 },
  { name: "Paris", state: "Île-de-France", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai", state: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Singapore", state: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
  { name: "Sydney", state: "New South Wales", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "San Francisco", state: "California", country: "US", lat: 37.7749, lon: -122.4194 },
  { name: "Berlin", state: "Berlin", country: "DE", lat: 52.5200, lon: 13.4050 }
];

/**
 * Autocomplete search for exact city: returns city, state, country, lat, lon
 */
export const searchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const trimmed = query.trim().toLowerCase();

  // Try live geocoding API
  const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=6&appid=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item) => ({
          name: item.name,
          state: item.state || "",
          country: item.country || "",
          lat: item.lat,
          lon: item.lon,
          displayName: `${item.name}${item.state ? `, ${item.state}` : ""}, ${item.country}`
        }));
      }
    }
  } catch (err) {
    console.warn("Geocoding API network issue, using cached suggestions:", err);
  }

  // Fallback to matching popular cities list
  return POPULAR_CITIES
    .filter(c => c.name.toLowerCase().includes(trimmed) || (c.state && c.state.toLowerCase().includes(trimmed)))
    .map(item => ({
      name: item.name,
      state: item.state || "",
      country: item.country || "",
      lat: item.lat,
      lon: item.lon,
      displayName: `${item.name}${item.state ? `, ${item.state}` : ""}, ${item.country}`
    }));
};

/**
 * Generate coherent, realistic fallback weather data if offline or API limit reached
 */
export const createFallbackWeatherData = (target, units = "metric") => {
  let cityName = "Kurchatov";
  let countryCode = "RU";
  let lat = 51.66;
  let lon = 35.66;

  if (typeof target === "string") {
    cityName = target.split(",")[0].trim();
    const match = POPULAR_CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (match) {
      countryCode = match.country;
      lat = match.lat;
      lon = match.lon;
    }
  } else if (typeof target === "object" && target.name) {
    cityName = target.name;
    countryCode = target.country || "RU";
    lat = target.lat || 51.66;
    lon = target.lon || 35.66;
  }

  const isMetric = units === "metric";
  const baseC = 18;
  const temp = isMetric ? baseC : Math.round(baseC * 1.8 + 32);
  const feelsLike = isMetric ? baseC - 1 : Math.round((baseC - 1) * 1.8 + 32);
  const tempHigh = isMetric ? baseC + 4 : Math.round((baseC + 4) * 1.8 + 32);
  const tempLow = isMetric ? baseC - 5 : Math.round((baseC - 5) * 1.8 + 32);
  const windUnit = isMetric ? "km/h" : "mph";
  const windSpeedVal = isMetric ? 14 : 9;

  const now = Math.floor(Date.now() / 1000);
  const timezone = 3 * 3600; // default UTC+3

  // Hourly curve
  const hourly = [];
  const conditions = [
    { cond: "Clear", icon: "01d", pop: 5 },
    { cond: "Partly Cloudy", icon: "02d", pop: 10 },
    { cond: "Cloudy", icon: "03d", pop: 15 },
    { cond: "Overcast", icon: "04d", pop: 20 },
    { cond: "Light Rain", icon: "10d", pop: 45 },
    { cond: "Scattered Clouds", icon: "03d", pop: 15 },
    { cond: "Clear", icon: "01n", pop: 5 },
    { cond: "Clear", icon: "01n", pop: 0 }
  ];

  for (let i = 0; i < 8; i++) {
    const hourDate = new Date((now + i * 3600 * 3) * 1000);
    const h = hourDate.getUTCHours();
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    const tempDelta = Math.round(Math.sin((i / 8) * Math.PI) * 5);

    hourly.push({
      time: `${displayH} ${ampm}`,
      temp: temp + tempDelta,
      icon: conditions[i].icon,
      condition: conditions[i].cond,
      pop: conditions[i].pop,
      dt: now + i * 10800
    });
  }

  // 7-Day daily forecast
  const days = ["Today", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayConditions = ["Scattered Clouds", "Partly Cloudy", "Light Rain", "Thunderstorm", "Sunny", "Overcast", "Clear"];
  const daily = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date((now + i * 86400) * 1000);
    const dayName = i === 0 ? "Today" : days[dayDate.getUTCDay() % days.length];
    daily.push({
      day: dayName,
      minTemp: tempLow + (i % 3) - 1,
      maxTemp: tempHigh + (i % 2),
      icon: i === 2 ? "10d" : i === 3 ? "11d" : "02d",
      condition: dayConditions[i % dayConditions.length],
      pop: i === 2 ? 65 : i === 3 ? 80 : 15
    });
  }

  return {
    city: cityName,
    state: "",
    country: countryCode,
    updatedTime: formatLocalTime(now, timezone),
    localTime: formatLocalTime(now, timezone),
    condition: "Scattered Clouds",
    conditionMain: "Clouds",
    icon: "03d",
    temp,
    feelsLike,
    tempHigh,
    tempLow,
    humidity: 62,
    wind: `${windSpeedVal} ${windUnit} SE`,
    windSpeed: `${windSpeedVal} ${windUnit}`,
    precipitation: 25,
    pressure: 1014,
    visibility: "10.0",
    sunrise: "6:15 AM",
    sunset: "7:45 PM",
    lat,
    lon,
    timezone,
    hourly,
    daily,
    aqi: {
      level: 1,
      label: "Good",
      color: "#10b981",
      advice: "Air quality is ideal for outdoor activities.",
      components: { pm2_5: 8, pm10: 12, o3: 42, no2: 5 }
    },
    units,
    isFallback: true
  };
};

/**
 * Main fetch function: returns complete weather data bundle for Solaris Weather
 */
export const fetchCompleteWeatherData = async (target, units = "metric") => {
  try {
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
      console.warn("Current weather API returned non-200. Using resilient fallback data.");
      return createFallbackWeatherData(target, units);
    }
    const currentData = await currentRes.json();

    const { coord, timezone = 0 } = currentData;
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

    // ── Daily Forecast (5 to 7 days) ──
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
            conditions: [],
            pops: []
          };
        }
        dailyMap[dateKey].temps.push(item.main.temp);
        dailyMap[dateKey].icons.push(item.weather[0]?.icon || "01d");
        dailyMap[dateKey].conditions.push(item.weather[0]?.main || "Clear");
        dailyMap[dateKey].pops.push(item.pop || 0);
      });
    }

    const dailyKeys = Object.keys(dailyMap).slice(0, 7);
    const daily = dailyKeys.map((dateKey, idx) => {
      const entry = dailyMap[dateKey];
      const minTemp = Math.round(Math.min(...entry.temps));
      const maxTemp = Math.round(Math.max(...entry.temps));
      const midIcon = entry.icons[Math.floor(entry.icons.length / 2)] || entry.icons[0];
      const midCond = entry.conditions[Math.floor(entry.conditions.length / 2)] || entry.conditions[0];
      const maxPop = Math.round(Math.max(...entry.pops) * 100);

      return {
        day: getDayName(entry.dt, timezone, idx === 0),
        minTemp,
        maxTemp,
        icon: midIcon,
        condition: midCond,
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

    // Compute realistic precipitation estimation
    let precipitationPercent = 15;
    if (hourly.length > 0 && hourly[0].pop !== undefined) {
      precipitationPercent = hourly[0].pop;
    } else {
      const mainLower = (currentData.weather[0]?.main || "").toLowerCase();
      if (mainLower.includes("rain") || mainLower.includes("drizzle")) precipitationPercent = 85;
      else if (mainLower.includes("thunder")) precipitationPercent = 90;
      else if (mainLower.includes("snow")) precipitationPercent = 70;
      else if (mainLower.includes("cloud")) precipitationPercent = 25;
      else precipitationPercent = 5;
    }

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
      windSpeed: `${windSpeedConverted} ${windUnit}`,
      windDirection,
      precipitation: precipitationPercent,
      pressure: currentData.main.pressure,
      visibility: (currentData.visibility / 1000).toFixed(1),
      sunrise: formatLocalTime(currentData.sys.sunrise, timezone),
      sunset: formatLocalTime(currentData.sys.sunset, timezone),
      lat,
      lon,
      timezone,
      hourly,
      daily,
      aqi: aqiInfo,
      units,
      isFallback: false
    };
  } catch (err) {
    console.warn("Weather fetch failed, activating resilient fallback data generator:", err);
    return createFallbackWeatherData(target, units);
  }
};
