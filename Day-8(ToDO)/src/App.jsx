import { useState } from "react";

export default function App() {
  function get() {
    fetch("http://localhost:8000/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((req) => req.json())
      .then((res) => {
        console.log(res);
      });
  }

  function put() {
    let userId = document.getElementById("userId").value;
    let userProductName = document.getElementById("userProductName").value;

    fetch("http://localhost:8000/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, name: userProductName }),
    })
      .then((req) => req.json())
      .then((res) => {
        console.log(res);
      });
  }
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    if (!task.trim()) return;
    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex] = task;
      setTodos(updated);
      setEditIndex(null);
    } else {
      setTodos([...todos, task]);
      let userId = document.getElementById("userId").value;
      let userProductName = document.getElementById("userProductName").value;

      fetch("http://localhost:8000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, name: userProductName }),
      })
        .then((req) => req.json())
        .then((res) => {
          console.log(res);
        });
    }
    setTask("");
  };

  const handleEdit = (index) => {
    setTask(todos[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const filtered = todos.filter((_, i) => i !== index);
    setTodos(filtered);
    if (editIndex === index) {
      setTask("");
      setEditIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <div className="flex w-full max-w-md mb-6">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-grow p-2 rounded-l bg-zinc-900 border border-zinc-700 focus:outline-none"
          placeholder="Enter task"
        />
        <button
          onClick={(handleAdd, post)}
          className="px-4 py-2 bg-white text-black font-semibold rounded-r hover:bg-zinc-200"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="w-full max-w-md space-y-2">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-zinc-800 p-3 rounded shadow"
          >
            <span>{todo}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(index)}
                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
