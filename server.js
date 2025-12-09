const express = require("express");
const axios = require("axios");
const { checkURLsPeriodically } = require("./check.js");

const app = express();

app.use(express.json());

function isAccessible(code) {
  if (code >= 200 && code < 400) {
    return true;
  } else {
    return false;
  }
}

app.post("/add", async (req, res) => {
  const url = req.body.url;
  const code = await axios.get(url);
  const access = isAccessible(code);
  if (access) {
    //add to the database;
  } else {
    console.log("Invalid URL / URL is not accessible");
  }
});

//checkURLsPeriodically(systems);

/*
systems is an array of objects with parameters like
id (this is a variable in the server.js initialized with 1 and for every new entry => id = id+1)
url
lastchecked
status
statusCode
prevStatus
latency

*/

app.listen(3000, () => {
  console.log("server runnning on PORT 3000");
});
