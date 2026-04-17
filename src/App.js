import { useState } from "react";

// ✅ CONFIG
const API_KEY = "568d833a62642ae154c8264bbd5d5e8e";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// ✅ WEATHER CARD
function WeatherCard({ data }) {
  const { name, sys, main, weather, wind, visibility } = data;

  const icon = weather[0].icon;
  const description = weather[0].description;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h2 style={styles.cityName}>
            {name}, {sys.country}
          </h2>
          <p style={styles.description}>{description}</p>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon"
          style={styles.icon}
        />
      </div>

      <div style={styles.tempRow}>
        <span style={styles.temp}>{Math.round(main.temp)}°</span>
        <span style={styles.tempUnit}>C</span>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <span>Feels Like</span>
          <strong>{Math.round(main.feels_like)}°C</strong>
        </div>

        <div style={styles.statBox}>
          <span>Humidity</span>
          <strong>{main.humidity}%</strong>
        </div>

        <div style={styles.statBox}>
          <span>Wind</span>
          <strong>{Math.round(wind.speed)} m/s</strong>
        </div>

        <div style={styles.statBox}>
          <span>Visibility</span>
          <strong>{(visibility / 1000).toFixed(1)} km</strong>
        </div>

        <div style={styles.statBox}>
          <span>Pressure</span>
          <strong>{main.pressure} hPa</strong>
        </div>

        <div style={styles.statBox}>
          <span>Min / Max</span>
          <strong>
            {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
          </strong>
        </div>
      </div>
    </div>
  );
}

// ✅ MAIN APP
export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `${BASE_URL}?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric`;

      const res = await fetch(url);
      const data = await res.json(); // ✅ important

      // ✅ Handle API errors properly
      if (data.cod === 401) {
        throw new Error("Invalid API key (wait or regenerate)");
      }

      if (data.cod === "404") {
        throw new Error("City not found");
      }

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
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logo}>⛅</div>
          <h1 style={styles.title}>WeatherNow</h1>
          <p style={styles.subtitle}>
            Real-time weather for any city in the world
          </p>
        </div>

        {/* SEARCH */}
        <div style={styles.searchRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            style={styles.button}
            onClick={fetchWeather}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {/* ERROR */}
        {error && <div style={styles.error}>⚠️ {error}</div>}

        {/* RESULT */}
        {weather && <WeatherCard data={weather} />}

        {/* EMPTY */}
        {!weather && !error && !loading && (
          <div style={styles.empty}>
            🌍 Search a city to see weather
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f172a, #1e3a5f, #0f4c81)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "500px",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#fff",
  },

  logo: {
    fontSize: "40px",
  },

  title: {
    margin: "5px 0",
  },

  subtitle: {
    color: "#aaa",
  },

  searchRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },

  button: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
  },

  error: {
    background: "#ff4d4f33",
    color: "#ff4d4f",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "20px",
    color: "#fff",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  cityName: {
    margin: 0,
  },

  description: {
    color: "#ccc",
  },

  icon: {
    width: "70px",
  },

  tempRow: {
    display: "flex",
    alignItems: "center",
  },

  temp: {
    fontSize: "60px",
  },

  tempUnit: {
    fontSize: "20px",
    marginTop: "10px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginTop: "20px",
  },

  statBox: {
    background: "rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "10px",
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: "20px",
  },
};