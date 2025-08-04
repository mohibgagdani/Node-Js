const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");

let data = [];

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});


app.post("/add-user", (req, res) => {
  let { name, email } = req.body;
  data.push({ name: name, email: email });
  res.redirect("/data");
});


app.get("/data", (req, res) => {
  res.render("data", { data });
});

app.listen(3000);
