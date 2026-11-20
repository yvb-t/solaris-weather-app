// ============================================================
// HourlyTrendCard.jsx — 24-Hour Trend Card
// Uses the user's custom color palette: #f4cf0c, #475e56, #43454a, #f5f7f8
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
      <div className="hourly-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hourly-title-icon">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h3 className="card-section-title">24-HOUR TREND</h3>
      </div>

      {/* ── Smooth SVG Temperature Trend Line (Palette Gold & Sage) ── */}
      <div className="chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4cf0c" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f4cf0c" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Gradient area */}
          <path d={areaPath} fill="url(#trendGradient)" />
          {/* Smooth line */}
          <path d={linePath} fill="none" stroke="#f4cf0c" strokeWidth="3.2" strokeLinecap="round" />
          {/* Data point dots */}
          {points.map((pt, i) => (
            <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#475e56" stroke="#f4cf0c" strokeWidth="2" />
          ))}
        </svg>
      </div>

      {/* ── Hourly Forecast Columns ── */}
      <div className="hourly-grid">
        {hourly.map((h, idx) => (
          <div key={idx} className="hourly-col">
            <span className="hourly-time">{h.time}</span>
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}.png`}
              alt={h.condition}
              className="hourly-icon"
            />
            <span className="hourly-temp">{h.temp}°</span>
            {h.pop > 0 ? (
              <span className="hourly-pop">{h.pop}%</span>
            ) : (
              <span className="hourly-pop invisible-pop">0%</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyTrendCard;
