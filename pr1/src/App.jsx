import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://localhost:8000/todos";

  useEffect(() => {
    fetchTodos();
  }, []);

  function fetchTodos() {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setTodos);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!text || !id) return;

    if (isEditing) {
      fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then(() => {
        resetForm();
        fetchTodos();
      });
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(id), text, status: "pending" }),
      }).then(() => {
        resetForm();
        fetchTodos();
      });
    }
  }

  function handleDelete(todoId) {
    fetch(`${API_URL}/${todoId}`, { method: "DELETE" }).then(fetchTodos);
  }

  function handleDone(todoId) {
    fetch(`${API_URL}/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    }).then(fetchTodos);
  }

  function handleEdit(todo) {
    setId(todo.id);
    setText(todo.text);
    setIsEditing(true);
  }

  function resetForm() {
    setId("");
    setText("");
    setIsEditing(false);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 Todo App</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="number"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="flex-1 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Todo text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-3 p-3 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white"
        >
          {isEditing ? "Save Edit" : "Add Todo"}
        </button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <div
                className={
                  todo.status === "done" ? "line-through text-gray-400" : ""
                }
              >
                {todo.text}
              </div>
              <small className="text-gray-500">
                ID: {todo.id}, Status: {todo.status}
              </small>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleDone(todo.id)}
                className="text-green-400 hover:text-green-500"
              >
                ✔️
              </button>
              <button
                onClick={() => handleEdit(todo)}
                className="text-yellow-400 hover:text-yellow-500"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-400 hover:text-red-500"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
