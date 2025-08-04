const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, text: "Learn JavaScript", status: "pending" },
  { id: 2, text: "Build Todo App", status: "done" },
];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const { id, text, status } = req.body;
  todos.push({ id, text, status: status || "pending" });
  res.json({ message: "Todo added", data: { id, text, status } });
});

app.patch("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body;

  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...updates };
    res.json({ message: "Todo updated", data: todos[index] });
  }
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((todo) => todo.id !== id);

  if (todos.length < initialLength) {
    res.json({ message: "Todo deleted" });
  }
});

app.listen(8000, () => {
  console.log("🚀 Todo List API running at http://localhost:8000");
});
