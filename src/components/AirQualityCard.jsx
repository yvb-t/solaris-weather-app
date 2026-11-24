// ============================================================
// AirQualityCard.jsx — Matches DailySky bottom-left card
// Shows: Status dot, Level (1/5), advice text, and
// interactive PM2.5, PM10, O3, NO2 sub-metric tiles.
// ============================================================

function AirQualityCard({ aqi, onOpenInsight }) {
  if (!aqi) return null;

  const { level, label, color, advice, components } = aqi;

  const handleMetricClick = (name, val, threshold, meaning) => {
    if (onOpenInsight) {
      onOpenInsight({
        title: `${name} Particle Concentration`,
        subtitle: `${meaning} — Current level: ${val} µg/m³ (Safe threshold: <${threshold} µg/m³)`,
        condition: `${label} Air Quality`,
        extra: {
          "AQI Rating": `${label} (Level ${level}/5)`,
          "Concentration": `${val} µg/m³`,
          "Advice": advice
        }
      });
    }
  };

  return (
    <div className="ds-card aqi-card">
      <div className="aqi-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="aqi-main-icon">
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
        </svg>
        <h3 className="card-section-title">AIR QUALITY INDEX</h3>
      </div>

      <div className="aqi-status-row">
        <span className="aqi-dot" style={{ backgroundColor: color }} />
        <span className="aqi-label-text">
          <strong>{label}</strong> (Level {level}/5)
        </span>
      </div>

      <p className="aqi-advice">{advice}</p>

      <div className="aqi-metrics-grid">
        <div
          className="aqi-metric-tile interactive-aqi-tile"
          onClick={() => handleMetricClick("PM2.5", components.pm2_5, 25, "Fine Inhalable Particles (diameter ≤2.5 micrometers)")}
          title="Click for PM2.5 details"
        >
          <span className="aqi-sub-label">PM2.5</span>
          <span className="aqi-sub-val">{components.pm2_5}</span>
        </div>
        <div
          className="aqi-metric-tile interactive-aqi-tile"
          onClick={() => handleMetricClick("PM10", components.pm10, 50, "Coarse Inhalable Dust/Pollen Particles (diameter ≤10 micrometers)")}
          title="Click for PM10 details"
        >
          <span className="aqi-sub-label">PM10</span>
          <span className="aqi-sub-val">{components.pm10}</span>
        </div>
        <div
          className="aqi-metric-tile interactive-aqi-tile"
          onClick={() => handleMetricClick("O₃", components.o3, 100, "Ground-level Ozone (formed by sun & photochemical reactions)")}
          title="Click for O3 details"
        >
          <span className="aqi-sub-label">O₃</span>
          <span className="aqi-sub-val">{components.o3}</span>
        </div>
        <div
          className="aqi-metric-tile interactive-aqi-tile"
          onClick={() => handleMetricClick("NO₂", components.no2, 40, "Nitrogen Dioxide (combustion & vehicular emissions)")}
          title="Click for NO2 details"
        >
          <span className="aqi-sub-label">NO₂</span>
          <span className="aqi-sub-val">{components.no2}</span>
        </div>
      </div>
    </div>
  );
}

export default AirQualityCard;
