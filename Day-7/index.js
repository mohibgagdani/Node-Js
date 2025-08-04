const express = require("express");

const cors = require("cors");

const app = express();

let products = [
  {
    id: 0,
    name: "hello",
  },
];

app.use(cors());

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("products", (res, req) => {
  products.push({
    id: 1,
    name: "pr1",
  });
});
app.put("products", (res, req) => {
  products = [];
  products.push({
    id: 100,
    name: "hiii",
  });
});
app.patch("products", (res, req) => {
  products.push({
    id: 1,
    name: "pr1",
  });
});
app.delete("products", (res, req) => {
  products = [];
});
app.listen(3000);
