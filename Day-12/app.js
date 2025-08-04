const express = require("express");
const app = express();
const port = 3000;

function Check(req, res, next) {
  if (req.headers.passport === "valid") {
    console.log("welcome");
    next();
  } else {
    console.log("notValid");
    res.send("access denied");
  }
}

app.get("/welcome", Check, (req, res) => {
  res.send("welcome");
});

app.get("/", (req,res) => {
  res.send("home");
});

app.listen(port);
