// ============================================================
// App.jsx — DailySky Premium Dark Glassmorphism Weather Dashboard
// Full desktop & mobile responsive dark glassmorphism theme
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import AtmosphericDetailsCard from "./components/AtmosphericDetailsCard";
import AirQualityCard from "./components/AirQualityCard";
import HourlyTrendCard from "./components/HourlyTrendCard";
import DailyForecastCard from "./components/DailyForecastCard";
import BottomNav from "./components/BottomNav";
import { fetchCompleteWeatherData } from "./services/weatherApi";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("Kurchatov");
  const [units, setUnits] = useState("metric"); // 'metric' (°C, km/h) or 'imperial' (°F, mph)
  const [activeTab, setActiveTab] = useState("home");

  // Load weather for a given target (city string or {lat, lon, name, state, country})
  const loadWeather = useCallback(async (target, unitSystem = units) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCompleteWeatherData(target, unitSystem);
      setData(result);
      if (typeof target === "string") {
        setLastQuery(target);
      } else if (result.city) {
        setLastQuery(result.city);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [units]);

  // Initial load
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((res) => {
        if (res.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (pos) => loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => loadWeather("Kurchatov")
          );
        } else {
          loadWeather("Kurchatov");
        }
      }).catch(() => loadWeather("Kurchatov"));
    } else {
      loadWeather("Kurchatov");
    }
  }, [loadWeather]);

  // Live Location button handler
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (geoErr) => {
        setLoading(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError("Location access denied. Please allow location permissions in your browser.");
        } else {
          setError("Unable to retrieve your current location. Please use search.");
        }
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Toggle Units (°C <-> °F)
  const handleToggleUnits = () => {
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);
    if (data) {
      loadWeather(lastQuery, newUnits);
    }
  };

  const handleBottomTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "search") {
      const input = document.querySelector(".nav-search-input");
      if (input) input.focus();
    } else if (tab === "map") {
      handleLiveLocation();
    } else if (tab === "profile") {
      handleToggleUnits();
    }
  };

  return (
    <div className="app-container">
      {/* ── Top Navigation Bar ── */}
      <Navbar
        onSearch={(city) => loadWeather(city)}
        onSelectSuggestion={(suggestion) => loadWeather(suggestion)}
        onLiveLocation={handleLiveLocation}
        units={units}
        onToggleUnits={handleToggleUnits}
        isDark={true}
        onToggleTheme={handleToggleUnits}
      />

      {/* ── Error Banner ── */}
      {error && (
        <div className="error-banner" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ── Loading Spinner ── */}
      {loading && !data && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span>Synchronizing atmospheric data…</span>
        </div>
      )}

      {/* ── Main 2-Column Dashboard Grid ── */}
      {data && (
        <main className="dashboard-grid">
          {/* ── Left Column (Current Weather, Atmospheric Details, Air Quality) ── */}
          <section className="dashboard-col left-col">
            <CurrentWeatherCard data={data} onRefresh={() => loadWeather(lastQuery)} />
            <AtmosphericDetailsCard data={data} />
            <AirQualityCard aqi={data.aqi} />
          </section>

          {/* ── Right Column (Hourly Trend, 5-Day Forecast) ── */}
          <section className="dashboard-col right-col">
            <HourlyTrendCard hourly={data.hourly} />
            <DailyForecastCard daily={data.daily} />
          </section>
        </main>
      )}

      {/* ── Floating Frosted Glass Bottom Navigation Bar ── */}
      <BottomNav activeTab={activeTab} onTabChange={handleBottomTabChange} />
    </div>
  );
}

export default App;
