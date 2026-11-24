// ============================================================
// AtmosphericDetailsCard.jsx — Matches DailySky 6-item grid
// Humidity, Wind (with direction), Pressure, Visibility,
// Sunrise, and Sunset.
// Every tile is interactive and clickable to view detailed insights.
// ============================================================

function AtmosphericDetailsCard({ data, onOpenInsight }) {
  const { humidity, wind, windSpeed, windDirection, pressure, visibility, sunrise, sunset } = data;

  const displayWind = wind || `${windSpeed} ${windDirection || ""}`.trim();

  const items = [
    {
      id: "humidity",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
      label: "Humidity",
      value: `${humidity}%`,
      desc: "Water vapor concentration in the ambient atmosphere."
    },
    {
      id: "wind",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
          <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
          <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
        </svg>
      ),
      label: "Wind",
      value: displayWind,
      desc: "Horizontal air movement velocity & cardinal direction."
    },
    {
      id: "pressure",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      ),
      label: "Pressure",
      value: `${pressure} hPa`,
      desc: "Barometric sea-level atmospheric pressure."
    },
    {
      id: "visibility",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="3" r="3" />
        </svg>
      ),
      label: "Visibility",
      value: `${visibility} km`,
      desc: "Distance at which prominent objects can be identified clearly."
    },
    {
      id: "sunrise",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 18a5 5 0 0 0-10 0" />
          <line x1="12" y1="2" x2="12" y2="9" />
          <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
          <line x1="1" y1="18" x2="3" y2="18" />
          <line x1="21" y1="18" x2="23" y2="18" />
          <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
          <line x1="23" y1="22" x2="1" y2="22" />
        </svg>
      ),
      label: "Sunrise",
      value: sunrise,
      desc: "Time solar disc rises above horizon in local timezone."
    },
    {
      id: "sunset",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 18a5 5 0 0 0-10 0" />
          <line x1="12" y1="9" x2="12" y2="2" />
          <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
          <line x1="1" y1="18" x2="3" y2="18" />
          <line x1="21" y1="18" x2="23" y2="18" />
          <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
          <line x1="23" y1="22" x2="1" y2="22" />
        </svg>
      ),
      label: "Sunset",
      value: sunset,
      desc: "Time solar disc sinks below horizon in local timezone."
    }
  ];

  return (
    <div className="ds-card atmospheric-card">
      <h3 className="card-section-title">ATMOSPHERIC DETAILS</h3>
      <div className="atmospheric-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="atm-tile interactive-atm-tile"
            onClick={() => onOpenInsight && onOpenInsight({
              title: `${item.label} Analysis`,
              subtitle: item.desc,
              temp: data.temp,
              condition: data.condition,
              extra: { [item.label]: item.value }
            })}
            title={`Click for ${item.label} information`}
          >
            <div className="atm-label-row">
              <span className="atm-icon">{item.icon}</span>
              <span className="atm-label">{item.label}</span>
            </div>
            <div className="atm-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AtmosphericDetailsCard;
