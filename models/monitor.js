const mongoose = require("mongoose");

const MonitorSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  lastChecked: { type: Date },
  status: { type: String, enum: ["UP", "DOWN"] },
  statusCode: { type: Number },
  prevStatus: { type: String, enum: ["UP", "DOWN"] },
  latency: { type: Number },
});

module.exports = mongoose.model("Monitor", MonitorSchema, "Monitor");
