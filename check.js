const cron = require("node-cron");
const axios = require("axios");

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
      const code = await getCode(system.url);
      const status = getStatus(code);

      system.statusCode = code;
      system.status = status;
      system.lastChecked = new Date().toISOString();
    }
  });
};

module.exports = { checkURLsPeriodically };
