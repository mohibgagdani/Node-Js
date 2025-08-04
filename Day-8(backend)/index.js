const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

let products = [
  {
    id: 1,
    name: "product 1",
  },
];
app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  let data = req.body;
  products.push(data);
});

app.put("/products", (req, res) => {
  products = [];
  let data = req.body;
  products.push(data);
});

app.listen(8000);
