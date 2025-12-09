const cron = require("node-cron");
const axios = require("axios");
const mongoose = require("mongoose");
const History = require("./models/history.js");

async function getCode(url) {
  try {
    const response = await axios.get(url);
    return response.status;
  } catch (error) {
    if (error.response) {
      return error.response.status;
    } else {
      return null;
    }
  }
}

function getStatus(code) {
  if (code >= 200 && code < 300) {
    return "UP";
  } else {
    return "DOWN";
  }
}

const checkURLsPeriodically = (systems) => {
  cron.schedule("* * * * *", async () => {
    console.log("Running every minute");

    for (const system of systems) {
      const prevStatus = system.status;
      const start = Date.now();
      const code = await getCode(system.url);
      const latency = Date.now() - start;
      const status = getStatus(code);

      if (prevStatus == "UP" && status == "DOWN") {
      } else if (prevStatus == "DOWN" && status == "UP") {
      }

      const newHistory = await History.create({
        url: system.url,
        timeStamp: new Date(),
        status: status,
        statusCode: code,
        latency: latency,
      });
    }
  });
};

module.exports = { checkURLsPeriodically };
