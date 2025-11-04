// controllers/sensorController.js

const { getLiveData, getHistoryData } = require("../models/SensorData");
const { getRainForecast } = require("../models/weatherService"); // Weather API integration

// ========================================================
// 🔹 Detect real-time clogging based on flowRate + totalVolume
// ========================================================
const analyzeClogging = (tributaries) => {
  const alerts = [];

  // Go through all tributaries
  Object.keys(tributaries).forEach((key) => {
    const { flowRate = 0, totalVolume = 0 } = tributaries[key];

    // Ignore if both are zero — no water
    if (flowRate === 0 && totalVolume === 0) return;

    // Detect clogging based on thresholds
    if (flowRate < 0.3 && totalVolume < 0.5) {
      alerts.push({
        sensor: key,
        status: "⚠️ Possible Clogging Detected",
        details: { flowRate, totalVolume },
      });
    }
  });

  return {
    totalSensors: Object.keys(tributaries).length,
    cloggedSensors: alerts.length,
    alerts,
  };
};

// ========================================================
// 🔹 Live data endpoint — returns current readings & clogs
// ========================================================
const getLiveSensorData = async (req, res) => {
  try {
    const data = await getLiveData();
    if (!data) return res.status(404).json({ message: "No live data found" });

    // Extract tributary data (ignore timestamp)
    const { timestamp, ...tributaries } = data;

    const clogReport = analyzeClogging(tributaries);

    // ✅ Return data in same format as your old Firebase live data
    res.status(200).json({
      timestamp: timestamp || new Date().toLocaleString(),
      ...tributaries, // all tributaries
      totalSensors: clogReport.totalSensors,
      cloggedSensors: clogReport.cloggedSensors,
      alerts: clogReport.alerts,
    });
  } catch (error) {
    console.error("Error fetching live data:", error);
    res.status(500).json({ error: "Failed to fetch live data" });
  }
};

// ========================================================
// 🔹 History endpoint — returns recent readings for dashboard
// ========================================================
const getHistorySensorData = async (req, res) => {
  try {
    const data = await getHistoryData();
    res.status(200).json(data || { message: "No history data found" });
  } catch (error) {
    console.error("Error fetching history data:", error);
    res.status(500).json({ error: "Failed to fetch history data" });
  }
};

// ========================================================
// 🌦️ Rainfall-based clog prediction (next 2 days)
// ========================================================
const getRainClogPrediction = async (req, res) => {
  try {
    const rainData = await getRainForecast();
    const liveData = await getLiveData();

    if (!rainData || !liveData) {
      return res.status(404).json({ message: "Insufficient data for prediction" });
    }

    const { timestamp, ...tributaries } = liveData;
    const { next48hRain } = rainData;
    const alerts = [];

    if (next48hRain > 5) {
      Object.keys(tributaries).forEach((key) => {
        const { flowRate = 0, totalVolume = 0 } = tributaries[key];
        if (flowRate < 1 && totalVolume < 1) {
          alerts.push({
            sensor: key,
            prediction: "⚠️ Risk of Clogging in Next 2 Days",
            reason: `Low flow (${flowRate} L/min) and rain expected (${next48hRain} mm).`,
          });
        }
      });
    }

    res.status(200).json({
      city: rainData.city,
      rainForecastNext48h: next48hRain,
      totalSensors: Object.keys(tributaries).length,
      predictedClogs: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Error predicting rain clog risk:", error);
    res.status(500).json({ error: "Failed to generate rain clog prediction" });
  }
};

// ========================================================
// 🧩 Export all controller functions
// ========================================================
module.exports = {
  getLiveSensorData,
  getHistorySensorData,
  getRainClogPrediction,
};
