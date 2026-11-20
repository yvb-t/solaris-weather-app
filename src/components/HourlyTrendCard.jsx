// ============================================================
// HourlyTrendCard.jsx — 24-Hour Trend & Hourly Pill Strip ("Today")
// Features: Smooth SVG curve with gradient fill +
// Horizontal tall glass pills (width ~64px, radius 32px) with
// current hour highlight and soft white glow.
// ============================================================

function HourlyTrendCard({ hourly }) {
  if (!hourly || hourly.length === 0) return null;

  const width = 520;
  const height = 90;
  const paddingX = 35;
  const paddingY = 20;

  const temps = hourly.map((h) => h.temp);
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  const points = hourly.map((h, i) => {
    const x = paddingX + (i / (hourly.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((h.temp - minT) / range) * (height - 2 * paddingY);
    return { x, y };
  });

  const buildSmoothPath = (pts) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="ds-card hourly-card">
      {/* ── Section Title Row: "Today" on left, "7-Day Forecasts" link on right ── */}
      <div className="hourly-header">
        <div className="title-with-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="hourly-title-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3 className="section-title">Today</h3>
        </div>
        <span className="forecast-link-text">24-Hour Trend</span>
      </div>

      {/* ── Smooth SVG Wave Line ── */}
      <div className="chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b6cff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b6cff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#trendGradient)" />
          <path d={linePath} fill="none" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2.5" strokeLinecap="round" />
          {points.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="rgba(59, 108, 255, 0.8)" strokeWidth="2" />
          ))}
        </svg>
      </div>

      {/* ── Horizontal Scroll of Tall Glass Pill Cards (width ~64px, radius 32px) ── */}
      <div className="hourly-pills-row">
        {hourly.map((h, idx) => {
          const isCurrent = idx === 0;
          return (
            <div key={idx} className={`hourly-tall-pill ${isCurrent ? "current-active-hour" : ""}`}>
              <span className="pill-hour-time">{h.time}</span>
              <img
                src={`https://openweathermap.org/img/wn/${h.icon}.png`}
                alt={h.condition}
                className="pill-icon-img"
              />
              <span className="pill-hour-temp">{h.temp}°</span>
              {h.pop > 0 ? (
                <span className="pill-hour-pop">{h.pop}%</span>
              ) : (
                <span className="pill-hour-pop invisible-pop">0%</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyTrendCard;
