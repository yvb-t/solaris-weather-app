// ============================================================
// DetailModal.jsx — Detailed Day / Hour Weather Inspection Modal
// Opened when clicking an hourly card or daily forecast row.
// ============================================================

function DetailModal({ isOpen, onClose, detailData }) {
  if (!isOpen || !detailData) return null;

  const { title, subtitle, temp, condition, icon, pop, wind, humidity, high, low, extra } = detailData;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal-header">
          <div>
            <h3>{title}</h3>
            <p className="detail-subtitle">{subtitle || condition}</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close details"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="detail-hero-row">
          <div className="detail-temp-group">
            <span className="detail-big-temp">{temp !== undefined ? `${temp}°` : `${high}°`}</span>
            {low !== undefined && <span className="detail-low-temp">/ {low}°</span>}
          </div>
          <span className="detail-condition-badge">{condition}</span>
        </div>

        <div className="detail-stats-grid">
          <div className="detail-stat-tile">
            <span className="stat-sub">Precipitation Chance</span>
            <strong className="stat-val">{pop !== undefined ? `${pop}%` : "15%"}</strong>
          </div>
          <div className="detail-stat-tile">
            <span className="stat-sub">Relative Humidity</span>
            <strong className="stat-val">{humidity !== undefined ? `${humidity}%` : "64%"}</strong>
          </div>
          <div className="detail-stat-tile">
            <span className="stat-sub">Expected Wind</span>
            <strong className="stat-val">{wind || "12 km/h"}</strong>
          </div>
          <div className="detail-stat-tile">
            <span className="stat-sub">UV Index</span>
            <strong className="stat-val">{extra?.uvIndex || "Moderate (3)"}</strong>
          </div>
          <div className="detail-stat-tile">
            <span className="stat-sub">Visibility</span>
            <strong className="stat-val">{extra?.visibility || "10 km"}</strong>
          </div>
          <div className="detail-stat-tile">
            <span className="stat-sub">Cloud Cover</span>
            <strong className="stat-val">{extra?.clouds || "35%"}</strong>
          </div>
        </div>

        <button type="button" className="detail-close-action-btn" onClick={onClose}>
          Close Details
        </button>
      </div>
    </div>
  );
}

export default DetailModal;
