const cron = require("node-cron");
const axios = require("axios");
const mongoose = require("mongoose");
const History = require("./models/history.js");
const Monitor = require("./models/monitor.js");
const { sendEmail } = require("./mailer.js");

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

      // Uncomment if you want email feature
      /*
      if (prevStatus == "UP" && status == "DOWN") {
        sendEmail(
          "recepient@gmail.com",
          `ALERT: ${system.url} is DOWN`,
          `The service ${system.url} is DOWN. Status code: ${code} `
        );
      } else if (prevStatus == "DOWN" && status == "UP") {
        sendEmail(
          "recepient@gmail.com",
          `ALERT: ${system.url} is UP`,
          `The service ${system.url} is UP. Status code: ${code} `
        );
      }
        */
      await Monitor.findByIdAndUpdate(system._id, {
        status: status,
        statusCode: code,
        latency: latency,
        lastChecked: new Date(),
      });

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
