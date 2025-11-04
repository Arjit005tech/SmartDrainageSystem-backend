// models/SensorData.js
const { db } = require("./firebase");

// Base path in Firebase
const LIVE_PATH = "SmartDrainage";

const getLiveData = async () => {
  // Fetch last timestamp node (latest reading)
  const snapshot = await db.ref(LIVE_PATH).limitToLast(1).once("value");
  const data = snapshot.val();
  if (!data) return null;

  // Extract latest key and readings
  const latestKey = Object.keys(data)[0];
  const readings = data[latestKey];

  // Collect tributary data
  const sensors = Object.entries(readings)
    .filter(([key]) => key.startsWith("tributary"))
    .map(([key, val]) => ({
      name: key,
      flowRate: val.flowRate ?? 0,
      totalVolume: val.totalVolume ?? 0,
    }));

  return {
    timestamp: readings.timestamp,
    sensors,
  };
};

// (optional) For history endpoint
const getHistoryData = async () => {
  const snapshot = await db.ref(LIVE_PATH).limitToLast(10).once("value");
  return snapshot.val();
};

module.exports = { getLiveData, getHistoryData };
