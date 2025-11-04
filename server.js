// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sensorRoutes = require("./routes/sensorRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Base route
app.get("/", (req, res) => {
  res.send("Smart Drainage Backend is Running 🚀");
});

// ✅ Connect all sensor routes
app.use("/api/sensors", sensorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
