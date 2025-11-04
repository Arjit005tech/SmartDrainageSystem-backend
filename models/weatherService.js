// models/weatherService.js
const axios = require("axios");
require("dotenv").config();

// Load API credentials and coordinates from .env
const API_KEY = process.env.OPENWEATHER_API_KEY;
const LAT = process.env.LAT;
const LON = process.env.LON;

// ================================
// 🌧️ Fetch rainfall forecast (next 48 hours)
// ================================
const getRainForecast = async () => {
  try {
    // Build API URL with lat/lon
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;
    
    // Fetch weather forecast data
    const response = await axios.get(url);
    const forecast = response.data.list;

    // Sum rainfall for next 16 intervals (16 * 3h = 48h)
    const next48hRain = forecast
      .slice(0, 16)
      .reduce((sum, entry) => sum + (entry.rain?.["3h"] || 0), 0);

    // Return rainfall summary
    return {
      city: response.data.city.name,
      next48hRain: Number(next48hRain.toFixed(2)),
    };

  } catch (error) {
    console.error("Error fetching rain forecast:", error.message);
    return null;
  }
};

// Export function for controllers
module.exports = { getRainForecast };
