import { useState } from "react";

// ─── CONFIG ──────────────────────────────────────────────
const API_KEY = "568d833a62642ae154c8264bbd5d5e8e";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ─── WEATHER COMPONENT ───────────────────────────────────
function WeatherCard({ data }) {
  const { name, sys, main, weather, wind, visibility } = data;
  const icon = weather[0].icon;
  const description = weather[0].description;

  const stats = [
    { label: "Feels Like", value: `${Math.round(main.feels_like)}°C` },
    { label: "Humidity", value: `${main.humidity}%` },
    { label: "Wind", value: `${Math.round(wind.speed)} m/s` },
    { label: "Visibility", value: `${(visibility / 1000).toFixed(1)} km` },
    { label: "Pressure", value: `${main.pressure} hPa` },
    { label: "Min / Max", value: `${Math.round(main.temp_min)}° / ${Math.round(main.temp_max)}°` },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cityName}>{name}, {sys.country}</h2>
          <p style={styles.description}>{description}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          style={styles.icon}
        />
      </div>

      <div style={styles.tempRow}>
        <span style={styles.temp}>{Math.round(main.temp)}°</span>
        <span style={styles.tempUnit}>C</span>
      </div>

      <div style={styles.statsGrid}>
        {stats.map(({ label, value }) => (
          <div key={label} style={styles.statBox}>
            <span style={styles.statLabel}>{label}</span>
            <span style={styles.statValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────
export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) throw new Error("City not found. Please check the name and try again.");
        if (res.status === 401) throw new Error("Invalid API key. Please update your OpenWeatherMap API key.");
        throw new Error("Failed to fetch weather data. Please try again.");
      }
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchWeather();
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>⛅</div>
          <h1 style={styles.title}>WeatherNow</h1>
          <p style={styles.subtitle}>Real-time weather for any city in the world</p>
        </header>

        {/* Search */}
        <div style={styles.searchRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            onClick={fetchWeather}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Weather Result */}
        {weather && <WeatherCard data={weather} />}

        {/* Empty state */}
        {!weather && !error && !loading && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🌍</div>
            <p style={styles.emptyText}>Search for a city to see the current weather</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c81 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "520px",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  logo: {
    fontSize: "48px",
    marginBottom: "8px",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    margin: 0,
  },
  searchRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "1.5px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    outline: "none",
    backdropFilter: "blur(10px)",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "14px 22px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "opacity 0.2s",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#fca5a5",
    fontSize: "0.9rem",
    marginBottom: "16px",
  },
  card: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: "28px",
    color: "#fff",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  cityName: {
    margin: "0 0 4px",
    fontSize: "1.5rem",
    fontWeight: "700",
  },
  description: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.95rem",
    textTransform: "capitalize",
  },
  icon: {
    width: "72px",
    height: "72px",
    filter: "drop-shadow(0 0 12px rgba(59,130,246,0.5))",
  },
  tempRow: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "24px",
    lineHeight: 1,
  },
  temp: {
    fontSize: "5rem",
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: "-2px",
  },
  tempUnit: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: "14px",
    marginLeft: "4px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
  },
  statBox: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: "12px",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statLabel: {
    fontSize: "0.72rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "600",
  },
  statValue: {
    fontSize: "0.95rem",
    color: "#e2e8f0",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#475569",
  },
  emptyIcon: {
    fontSize: "52px",
    marginBottom: "12px",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: "0.95rem",
    margin: 0,
  },
};