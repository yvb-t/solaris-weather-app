// ============================================================
// DailyForecastCard.jsx — Matches DailySky bottom-right card
// Shows: 5-DAY FORECAST with day names, condition icons,
// rain probability %, min temp, temperature gradient range bar,
// and max temp.
// ============================================================

function DailyForecastCard({ daily }) {
  if (!daily || daily.length === 0) return null;

  // Calculate global min & max across the 5 days to scale the temperature bars
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalRange = globalMax - globalMin || 1;

  return (
    <div className="ds-card daily-card">
      <div className="daily-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="daily-title-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <h3 className="card-section-title">5-DAY FORECAST</h3>
      </div>

      <div className="daily-list">
        {daily.map((item, idx) => {
          // Calculate left offset and width percentage for the temp range bar
          const leftPercent = Math.max(0, ((item.minTemp - globalMin) / globalRange) * 100);
          const widthPercent = Math.max(15, (((item.maxTemp - item.minTemp) / globalRange) * 100));

          return (
            <div key={idx} className="daily-row">
              <span className="daily-day">{item.day}</span>

              <div className="daily-icon-wrapper">
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                  alt="weather icon"
                  className="daily-icon"
                />
              </div>

              <div className="daily-pop-col">
                {item.pop > 0 ? (
                  <span className="daily-pop">{item.pop}%</span>
                ) : (
                  <span className="daily-pop invisible-pop">0%</span>
                )}
              </div>

              <span className="daily-min-temp">{item.minTemp}°</span>

              {/* Temperature Range Bar */}
              <div className="temp-bar-track">
                <div
                  className="temp-bar-fill"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${Math.min(widthPercent, 100 - leftPercent)}%`,
                    background: "linear-gradient(90deg, #475e56 0%, #b8c9a8 50%, #f4cf0c 100%)"
                  }}
                />
              </div>

              <span className="daily-max-temp">{item.maxTemp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecastCard;
