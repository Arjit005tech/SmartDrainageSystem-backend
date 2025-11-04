// routes/sensorRoutes.js
const express = require("express");
const {
  getLiveSensorData,
  getHistorySensorData,
  getRainClogPrediction,
} = require("../controllers/sensorController.js");

const router = express.Router();

// ✅ All available endpoints
router.get("/live", getLiveSensorData);
router.get("/history", getHistorySensorData);
router.get("/predictRainClog", getRainClogPrediction); // this one is key

module.exports = router;
