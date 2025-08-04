const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Read data
const moviesData = JSON.parse(
  fs.readFileSync(path.join("data/movies.json"), "utf-8")
).results;

app.set("view engine", "ejs");
app.set("views", path.join("views"));
app.use(express.static(path.join("public")));

app.get("/", (req, res) => {
  res.render("movies", { moviesData });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});