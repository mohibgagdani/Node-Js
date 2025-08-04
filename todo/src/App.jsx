import { useState } from "react";
import "./App.css";

function App() {
  const [isEditing, setIsEditing] = useState(null);
  const [inp, setInp] = useState("");
  const [inp2, setInp2] = useState("");
  const [tasks, setTasks] = useState([
    {
      id: 0,
      disc: "hello",
      isCompleted: true,
    },
  ]);
  const [filter, setFilter] = useState("all");

  function updateTask(id) {
    setTasks((t) => t.map((e) => (e.id === id ? { ...e, disc: inp2 } : e)));
    setIsEditing(null);
    setInp2("");
  }

  function toggleComplete(id) {
    setTasks((t) =>
      t.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e))
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.isCompleted;
    if (filter === "pending") return !task.isCompleted;
    return true;
  });

  function createTask() {
    if (!inp.trim()) return;
    let newTask = {
      id: crypto.randomUUID(),
      disc: inp,
      isCompleted: false,
    };
    setTasks([...tasks, newTask]);
    setInp("");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 Todo App</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inp}
            onChange={(e) => setInp(e.target.value)}
            placeholder="Enter a task"
            className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={createTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="flex gap-2 justify-center mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "pending"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Pending
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
            >
              {isEditing === task.id ? (
                <>
                  <input
                    type="text"
                    value={inp2}
                    onChange={(e) => setInp2(e.target.value)}
                    className="flex-1 border px-2 py-1 rounded-md"
                  />
                  <button
                    onClick={() => updateTask(task.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleComplete(task.id)}
                    className="w-4 h-4"
                  />
                  <span
                    className={`flex-1 ${
                      task.isCompleted ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.disc}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditing(task.id);
                      setInp2(task.disc);
                    }}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;




// without styles


// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [isEditing, setIsEditing] = useState(null);
//   const [inp, setInp] = useState("");
//   const [inp2, setInp2] = useState("");
//   const [tasks, setTasks] = useState([
//     {
//       id: 0,
//       disc: "hello",
//       isCompleted: true,
//     },
//   ]);

//   const [filter, setFilter] = useState("all");

//   function updateTask(id) {
//     setTasks((t) => t.map((e) => (e.id == id ? { ...e, disc: inp2 } : e)));
//     setIsEditing(null);
//     setInp2("");
//   }

//   function toggleComplete(id) {
//     setTasks((t) =>
//       t.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e))
//     );
//   }

//   const filteredTasks = tasks.filter((task) => {
//     if (filter === "completed") return task.isCompleted;
//     if (filter === "pending") return !task.isCompleted;
//     return true;
//   });

//   function createTask() {
//     let newTask = {
//       id: crypto.randomUUID(),
//       disc: inp,
//       isCompleted: false,
//     };
//     setTasks([...tasks, newTask]);
//     setInp("");
//   }
//   return (
//     <>
//       <input type="text" value={inp} onChange={(e) => setInp(e.target.value)} />
//       <button onClick={createTask}>Add</button>
//       <button onClick={() => setFilter("all")}>All</button>
//       <button onClick={() => setFilter("completed")}>Completed</button>
//       <button onClick={() => setFilter("pending")}>Pending</button>

//       <ul type="none">
//         {filteredTasks.map((task) => {
//           return isEditing === task.id ? (
//             <>
//               <input
//                 type="text"
//                 value={inp2}
//                 onChange={(e) => setInp2(e.target.value)}
//               />
//               <button onClick={() => updateTask(task.id)}>Add</button>
//             </>
//           ) : (
//             <>
//               <li key={task.id}>
//                 <input
//                   type="checkbox"
//                   checked={task.isCompleted}
//                   onChange={() => toggleComplete(task.id)}
//                 />
//                 {task.disc}

//                 <button
//                   onClick={() => {
//                     setIsEditing(task.id);
//                     setInp2(task.disc);
//                   }}
//                 >
//                   Edit
//                 </button>
//               </li>
//             </>
//           );
//         })}
//       </ul>
//     </>
//   );
// }

// export default App;