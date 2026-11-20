# ☀️ Solaris — Real-Time Weather Dashboard

A modern, responsive, and beautiful weather application built with **React** + **Vite**, powered by the **OpenWeatherMap API**. Features live geocoding autocomplete, a 24-hour temperature trend with smooth SVG curve charts, 5-day daily forecasts, atmospheric metrics, and air quality indicators.

---

## 🌟 Features

- 🔍 **Live City Autocomplete**: Instant search suggestions matching exact city, state, and country.
- 🎯 **GPS Live Location**: Detects current coordinates and reverse-geocodes to the exact district.
- ⏱ **24-Hour Trend**: Continuous cubic Bezier curve temperature chart with hourly condition icons and rain probabilities.
- 📅 **5-Day Extended Forecast**: Daily minimum/maximum temperatures with color gradient range bars.
- 💧 **Atmospheric Details**: Humidity, wind speed with cardinal direction, pressure, visibility, sunrise, and sunset.
- 💨 **Air Quality Index**: Real-time AQI with health ratings (Good, Fair, Moderate, etc.) and PM2.5, PM10, O3, NO2 metrics.
- 🌡 **Unit Toggle**: One-click switch between Metric (`°C / km/h`) and Imperial (`°F / mph`).
- 🌙 **Dark & Light Mode**: Seamless theme toggle matching custom 4-color swatch palette.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **OpenWeatherMap API** (Current Weather, 5-day Forecast, Air Pollution, Reverse/Direct Geocoding)
- **Modern Pure CSS** (CSS Variables, Flexbox, CSS Grid, Glassmorphism)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/solaris-weather-app.git
cd solaris-weather-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Inside `.env`, add your free OpenWeatherMap API key:
```env
VITE_WEATHER_API_KEY=your_api_key_here
```
*(Get your free key from [OpenWeatherMap API](https://openweathermap.org/api))*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License
