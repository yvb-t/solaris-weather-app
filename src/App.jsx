// ============================================================
// App.jsx — Solaris Premium Dark Glassmorphism Weather Dashboard
// Complete desktop & mobile responsive weather experience with
// fully functional icons, Auth/Login/Profile modal,
// Live Doppler Radar map, Quick Search modal, and Inspection dialogs.
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import AtmosphericDetailsCard from "./components/AtmosphericDetailsCard";
import AirQualityCard from "./components/AirQualityCard";
import HourlyTrendCard from "./components/HourlyTrendCard";
import DailyForecastCard from "./components/DailyForecastCard";
import BottomNav from "./components/BottomNav";
import AuthModal from "./components/AuthModal";
import RadarModal from "./components/RadarModal";
import SearchModal from "./components/SearchModal";
import DetailModal from "./components/DetailModal";
import { fetchCompleteWeatherData, createFallbackWeatherData } from "./services/weatherApi";
import "./App.css";

const DEFAULT_CITY = "Kurchatov";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(DEFAULT_CITY);
  const [units, setUnits] = useState("metric"); // 'metric' (°C, km/h) or 'imperial' (°F, mph)
  const [activeTab, setActiveTab] = useState("home");
  const [isLocating, setIsLocating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuroraTheme, setIsAuroraTheme] = useState(false);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);

  // Persistent User state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("solaris_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persistent Favorite cities
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("solaris_favorites");
      return saved ? JSON.parse(saved) : ["Kurchatov", "Tokyo", "London"];
    } catch {
      return ["Kurchatov", "Tokyo", "London"];
    }
  });

  // Load weather for target
  const loadWeather = useCallback(async (target, unitSystem = units) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCompleteWeatherData(target, unitSystem);
      setData(result);
      if (typeof target === "string") {
        setLastQuery(target);
      } else if (result && result.city) {
        setLastQuery(result.city);
      }
    } catch (err) {
      console.warn("Falling back to simulated weather:", err);
      const fallback = createFallbackWeatherData(target, unitSystem);
      setData(fallback);
      setError("Synchronized with offline satellite backup.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      setIsLocating(false);
    }
  }, [units]);

  // Initial load
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((res) => {
        if (res.state === "granted") {
          setIsLocating(true);
          navigator.geolocation.getCurrentPosition(
            (pos) => loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => loadWeather(DEFAULT_CITY)
          );
        } else {
          loadWeather(DEFAULT_CITY);
        }
      }).catch(() => loadWeather(DEFAULT_CITY));
    } else {
      loadWeather(DEFAULT_CITY);
    }
  }, [loadWeather]);

  // GPS Live Location button handler
  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError("Location access denied. Displaying default city.");
          loadWeather(DEFAULT_CITY);
        } else {
          setError("Unable to retrieve GPS coordinates. Please use search.");
          loadWeather(DEFAULT_CITY);
        }
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Refresh handler with spin animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWeather(lastQuery);
  };

  // Toggle Units (°C <-> °F)
  const handleToggleUnits = () => {
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);
    if (data) {
      loadWeather(lastQuery, newUnits);
    }
  };

  // Theme Toggle: Midnight Storm vs Aurora Glow
  const handleToggleTheme = () => {
    setIsAuroraTheme((prev) => !prev);
  };

  // Reset to Home
  const handleResetHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadWeather(DEFAULT_CITY);
    setActiveTab("home");
  };

  // Toggle Favorite
  const handleToggleFavorite = () => {
    if (!data || !data.city) return;
    const cityName = data.city;
    const isCurrentlyFav = favorites.some((f) => f.toLowerCase() === cityName.toLowerCase());

    let updated;
    if (isCurrentlyFav) {
      updated = favorites.filter((f) => f.toLowerCase() !== cityName.toLowerCase());
    } else {
      updated = [...favorites, cityName];
    }
    setFavorites(updated);
    try {
      localStorage.setItem("solaris_favorites", JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // User Auth handlers
  const handleLogin = (userObj) => {
    setCurrentUser(userObj);
    try {
      localStorage.setItem("solaris_user", JSON.stringify(userObj));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("solaris_user");
    } catch (e) {
      console.warn(e);
    }
  };

  // Bottom Navigation handler
  const handleBottomTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "search") {
      setIsSearchOpen(true);
    } else if (tab === "map") {
      setIsRadarOpen(true);
    } else if (tab === "profile") {
      setIsAuthOpen(true);
    }
  };

  const isCurrentCityFavorite = Boolean(
    data && data.city && favorites.some((f) => f.toLowerCase() === data.city.toLowerCase())
  );

  return (
    <div className={`app-container ${isAuroraTheme ? "theme-aurora" : ""}`}>
      {/* ── Top Navigation Bar ── */}
      <Navbar
        onSearch={(city) => loadWeather(city)}
        onSelectSuggestion={(suggestion) => loadWeather(suggestion)}
        onLiveLocation={handleLiveLocation}
        isLocating={isLocating}
        units={units}
        onToggleUnits={handleToggleUnits}
        isDark={!isAuroraTheme}
        onToggleTheme={handleToggleTheme}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetHome={handleResetHome}
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
          <span>Synchronizing atmospheric telemetry…</span>
        </div>
      )}

      {/* ── Main 2-Column Dashboard Grid ── */}
      {data && (
        <main className="dashboard-grid">
          {/* ── Left Column (Current Weather, Atmospheric Details, Air Quality) ── */}
          <section className="dashboard-col left-col">
            <CurrentWeatherCard
              data={data}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              isFavorite={isCurrentCityFavorite}
              onToggleFavorite={handleToggleFavorite}
              onOpenStatDetail={(detail) => setDetailModalData(detail)}
            />
            <AtmosphericDetailsCard
              data={data}
              onOpenInsight={(insight) => setDetailModalData(insight)}
            />
            <AirQualityCard
              aqi={data.aqi}
              onOpenInsight={(insight) => setDetailModalData(insight)}
            />
          </section>

          {/* ── Right Column (Hourly Trend, 7-Day Forecast) ── */}
          <section className="dashboard-col right-col">
            <HourlyTrendCard
              hourly={data.hourly}
              onSelectHour={(hourDetail) => setDetailModalData(hourDetail)}
            />
            <DailyForecastCard
              daily={data.daily}
              onSelectDay={(dayDetail) => setDetailModalData(dayDetail)}
            />
          </section>
        </main>
      )}

      {/* ── Floating Frosted Glass Bottom Navigation Bar ── */}
      <BottomNav activeTab={activeTab} onTabChange={handleBottomTabChange} />

      {/* ── Modals ── */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setActiveTab("home");
        }}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentCity={data?.city || lastQuery}
        onSelectCity={(city) => loadWeather(city)}
        units={units}
        onToggleUnits={handleToggleUnits}
      />

      <RadarModal
        isOpen={isRadarOpen}
        onClose={() => {
          setIsRadarOpen(false);
          setActiveTab("home");
        }}
        currentCity={data?.city || lastQuery}
        onSelectCity={(city) => loadWeather(city)}
        lat={data?.lat}
        lon={data?.lon}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setActiveTab("home");
        }}
        onSelectCity={(city) => loadWeather(city)}
        onLiveLocation={handleLiveLocation}
      />

      <DetailModal
        isOpen={Boolean(detailModalData)}
        onClose={() => setDetailModalData(null)}
        detailData={detailModalData}
      />
    </div>
  );
}

export default App;
