const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error("serviceAccountKey.json not found at " + serviceAccountPath);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// ⚠️ Replace with your exact Realtime Database URL from Firebase console
const databaseURL =
  "https://smart-drainage-project-texpo-default-rtdb.firebaseio.com/";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

const db = admin.database();

module.exports = { db };
