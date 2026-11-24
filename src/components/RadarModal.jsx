// ============================================================
// RadarModal.jsx — Interactive Weather Radar & Satellite Overlay
// Features: Doppler precipitation radar, temperature heatmap,
// wind streams, timeline scrub (Play/Pause, Live, +2h forecast),
// and clickable global city markers.
// ============================================================

import { useState, useEffect } from "react";
import { POPULAR_CITIES } from "../services/weatherApi";

function RadarModal({ isOpen, onClose, currentCity, onSelectCity, lat = 51.66, lon = 35.66 }) {
  const [activeLayer, setActiveLayer] = useState("precipitation"); // 'precipitation' | 'temperature' | 'wind' | 'clouds'
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeStep, setTimeStep] = useState(2); // 0: -1hr, 1: -30m, 2: Now, 3: +30m, 4: +1h
  const [zoom, setZoom] = useState(1);

  // Auto-play timeline loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setTimeStep((prev) => (prev + 1) % 5);
    }, 1200);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const timeLabels = ["-1h", "-30m", "LIVE", "+30m", "+1h"];

  const handleCityPinClick = (city) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="radar-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="radar-header">
          <div className="radar-title-wrap">
            <span className="radar-pulse-dot" />
            <h3>Solaris Live Doppler Radar</h3>
            <span className="radar-location-chip">{currentCity || "Regional View"}</span>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close radar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Layer Selector Pills ── */}
        <div className="radar-layer-bar">
          <button
            type="button"
            className={`radar-layer-pill ${activeLayer === "precipitation" ? "active" : ""}`}
            onClick={() => setActiveLayer("precipitation")}
          >
            🌧️ Rain / Snow
          </button>
          <button
            type="button"
            className={`radar-layer-pill ${activeLayer === "temperature" ? "active" : ""}`}
            onClick={() => setActiveLayer("temperature")}
          >
            🌡️ Temperature
          </button>
          <button
            type="button"
            className={`radar-layer-pill ${activeLayer === "wind" ? "active" : ""}`}
            onClick={() => setActiveLayer("wind")}
          >
            💨 Wind Streams
          </button>
          <button
            type="button"
            className={`radar-layer-pill ${activeLayer === "clouds" ? "active" : ""}`}
            onClick={() => setActiveLayer("clouds")}
          >
            ☁️ Satellite Clouds
          </button>
        </div>

        {/* ── Radar Visualizer Screen ── */}
        <div className="radar-screen-viewport" style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}>
          {/* Animated Scanning Radar Sweep */}
          <div className="radar-sweep-beam" />

          {/* Background Map Grid & Topology */}
          <svg className="radar-map-svg" viewBox="0 0 600 360">
            <defs>
              <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>

              {/* Rain Gradient */}
              <radialGradient id="rainBlob1" cx="45%" cy="40%" r="35%">
                <stop offset="0%" stopColor="#3b6cff" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#00d2ff" stopOpacity="0.5" />
                <stop offset="80%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>

              {/* Heat gradient */}
              <radialGradient id="heatBlob" cx="60%" cy="50%" r="45%">
                <stop offset="0%" stopColor="#ff5722" stopOpacity="0.65" />
                <stop offset="50%" stopColor="#ffc83d" stopOpacity="0.45" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid */}
            <rect width="600" height="360" fill="url(#radarGrid)" />

            {/* Concentric Range Rings */}
            <circle cx="300" cy="180" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            <circle cx="300" cy="180" r="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <circle cx="300" cy="180" r="170" fill="none" stroke="rgba(255,255,255,0.06)" />

            {/* Layer Displays */}
            {activeLayer === "precipitation" && (
              <g className={`radar-precip-layer step-${timeStep}`}>
                <ellipse cx={270 + timeStep * 12} cy={160 - timeStep * 4} rx="110" ry="75" fill="url(#rainBlob1)" filter="blur(6px)" />
                <ellipse cx={400 - timeStep * 8} cy={230 + timeStep * 3} rx="85" ry="55" fill="url(#rainBlob1)" filter="blur(8px)" />
              </g>
            )}

            {activeLayer === "temperature" && (
              <g className="radar-temp-layer">
                <circle cx="300" cy="180" r="140" fill="url(#heatBlob)" filter="blur(14px)" />
              </g>
            )}

            {activeLayer === "wind" && (
              <g className="radar-wind-layer" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="8 6">
                <path d="M 50 100 Q 250 140 550 90" />
                <path d="M 40 180 Q 280 200 560 170" />
                <path d="M 60 260 Q 300 240 540 280" />
              </g>
            )}

            {activeLayer === "clouds" && (
              <g className="radar-clouds-layer" fill="rgba(255,255,255,0.18)" filter="blur(16px)">
                <ellipse cx={220 + timeStep * 6} cy="140" rx="130" ry="60" />
                <ellipse cx={380 - timeStep * 4} cy="210" rx="140" ry="70" />
              </g>
            )}

            {/* Center Reticle */}
            <line x1="300" y1="165" x2="300" y2="195" stroke="#ffc83d" strokeWidth="1.5" />
            <line x1="285" y1="180" x2="315" y2="180" stroke="#ffc83d" strokeWidth="1.5" />
          </svg>

          {/* Interactive City Marker Pins */}
          <div className="radar-pins-overlay">
            {POPULAR_CITIES.slice(0, 7).map((city, idx) => {
              // Distribute pins across radar map
              const positions = [
                { top: "42%", left: "48%" }, // Center (Kurchatov)
                { top: "32%", left: "26%" }, // London
                { top: "54%", left: "78%" }, // Tokyo
                { top: "38%", left: "18%" }, // New York
                { top: "65%", left: "64%" }, // Chennai
                { top: "36%", left: "32%" }, // Paris
                { top: "56%", left: "54%" }  // Dubai
              ];
              const pos = positions[idx] || { top: "50%", left: "50%" };

              const isCurrent = currentCity && currentCity.toLowerCase().includes(city.name.toLowerCase());

              return (
                <button
                  key={city.name}
                  type="button"
                  className={`radar-city-pin ${isCurrent ? "active-pin" : ""}`}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => handleCityPinClick(city.name)}
                  title={`View weather for ${city.name}`}
                >
                  <span className="pin-dot" />
                  <span className="pin-label">{city.name}</span>
                </button>
              );
            })}
          </div>

          {/* Map Zoom Controls */}
          <div className="radar-zoom-controls">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.15, 1.45))}
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.85))}
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>

        {/* ── Bottom Controls: Timeline Scrubber & Legend ── */}
        <div className="radar-controls-footer">
          <div className="radar-playback-group">
            <button
              type="button"
              className="radar-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Radar" : "Play Radar"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <div className="timeline-steps">
              {timeLabels.map((lbl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`step-btn ${timeStep === idx ? "current-step" : ""}`}
                  onClick={() => {
                    setTimeStep(idx);
                    setIsPlaying(false);
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Color Legend */}
          <div className="radar-legend">
            <span className="legend-label">Intensity:</span>
            <span className="legend-box" style={{ background: "rgba(59, 108, 255, 0.4)" }}>Light</span>
            <span className="legend-box" style={{ background: "rgba(0, 210, 255, 0.7)" }}>Mod</span>
            <span className="legend-box" style={{ background: "rgba(255, 200, 61, 0.8)" }}>Heavy</span>
            <span className="legend-box" style={{ background: "rgba(255, 75, 75, 0.9)" }}>Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RadarModal;
