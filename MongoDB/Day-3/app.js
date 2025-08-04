const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());

app.options("*", cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/usersData")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const UserSchema = new mongoose.Schema({
  name: String,
});
const User = mongoose.model("User", UserSchema);

app.post("/add", async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json({ message: "User added!" });
});

app.delete("/remove", async (req, res) => {
  const { name } = req.body;
  await User.deleteOne({ name });
  res.json({ message: "User removed!" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
