const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  url: { type: String, required: true },
  timeStamp: { type: Date },
  status: { type: String, enum: ["UP", "DOWN"] },
  statusCode: { type: Number },
  latency: { type: Number },
});

module.exports = mongoose.model("History", HistorySchema, "History");
