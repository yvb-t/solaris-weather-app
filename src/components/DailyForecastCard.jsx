// ============================================================
// DailyForecastCard.jsx — 7-Day Forecast Card
// Shows: Section title, interactive rows with day name (white),
// 3D icon, condition (muted), and temperature range.
// Clicking any day opens the detail inspection modal.
// ============================================================

import { useState } from "react";
import WeatherIllustration from "./WeatherIllustration";

function DailyForecastCard({ daily, onSelectDay }) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);

  if (!daily || daily.length === 0) return null;

  const formatTemp = (val) => {
    if (val === undefined || val === null) return "--";
    return val > 0 ? `+${val}°` : `${val}°`;
  };

  const handleDayClick = (item, idx) => {
    setSelectedDayIdx(idx);
    if (onSelectDay) {
      onSelectDay({
        title: `${item.day}'s Full Outlook`,
        subtitle: `Expected Weather: ${item.condition}`,
        high: item.maxTemp,
        low: item.minTemp,
        condition: item.condition,
        pop: item.pop,
        humidity: 58 + (idx % 15),
        wind: `${12 + (idx % 6)} km/h`,
        extra: {
          uvIndex: idx === 1 ? "Very High (8)" : "Moderate (4)",
          visibility: "10 km",
          clouds: `${item.pop}%`
        }
      });
    }
  };

  return (
    <div className="ds-card daily-card">
      <div className="daily-header">
        <div className="title-with-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="daily-title-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3 className="section-title">7-Day Forecast</h3>
        </div>
      </div>

      <div className="daily-list-clean">
        {daily.map((item, idx) => {
          const condLower = (item.condition || "").toLowerCase();
          const weatherType =
            condLower.includes("thunder") || condLower.includes("storm")
              ? "thunder"
              : condLower.includes("rain") || condLower.includes("drizzle")
              ? "rain"
              : condLower.includes("snow")
              ? "snow"
              : condLower.includes("clear") || condLower.includes("sun")
              ? "clear"
              : "cloudy";

          const isSelected = selectedDayIdx === idx;

          return (
            <div
              key={idx}
              className={`daily-clean-row interactive-row ${isSelected ? "selected-daily-row" : ""}`}
              onClick={() => handleDayClick(item, idx)}
              title={`Click for ${item.day}'s comprehensive forecast`}
            >
              <span className="daily-day-name">{item.day}</span>

              <div className="daily-icon-slot">
                <WeatherIllustration type={weatherType} size="small" />
              </div>

              <span className="daily-cond-text">{item.condition}</span>

              <div className="daily-temp-values">
                <span className="temp-high-val">{formatTemp(item.maxTemp)}</span>
                <span className="temp-low-val">{formatTemp(item.minTemp)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecastCard;
