const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const Monitor = require("./models/monitor.js");
const { checkURLsPeriodically } = require("./check.js");

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");

function getStatus(code) {
  if (code >= 200 && code < 300) {
    return "UP";
  } else {
    return "DOWN";
  }
}

let systems = [];

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB Connected");
    systems = await Monitor.find();
    checkURLsPeriodically(systems);
  })
  .catch((err) => console.log(err));

app.post("/add", async (req, res) => {
  const url = req.body.url;
  try {
    const start = Date.now();
    const response = await axios.get(url);
    const code = response.status;
    const status = getStatus(code);
    const latency = Date.now() - start;

    const newMonitor = await Monitor.create({
      url: url,
      lastChecked: new Date(),
      status: status,
      statusCode: code,
      latency: latency,
    });

    systems.push(newMonitor);

    res.json({ message: "Added to database", data: newMonitor });
  } catch (err) {
    return res.status(400).json({
      message: "URL is unreachable. Not adding to database.",
      error: err.message,
    });
  }
});

app.get("/", (req, res) => {
  res.render("index", { systems: systems });
});

app.get("/history", (req, res) => {
  res.render("history", { systems: systems });
});

app.listen(3000, () => {
  console.log("server runnning on PORT 3000");
});
