const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// In-memory database (for beginners)
let users = [];

// Static token
const STATIC_TOKEN = "5114";

// Register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const exist = users.find(u => u.username === username);
  if (exist) return res.status(400).json({ message: "User already exists" });

  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ token: STATIC_TOKEN, message: "Login successful" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
