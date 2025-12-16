"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";

export default function DashboardPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState("");

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask);
    setNewTask("");
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">
      <div className="w-full max-w-sm px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Todo</h1>

        {/* 追加フォーム */}
        <div className="flex mb-6 gap-2">
          <input
            className="flex-1 border rounded-l-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="border rounded-r-md px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition"
          >
            Add
          </button>
        </div>

        {/* タスクリスト */}
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.isDone}
                onChange={() => toggleTask(task)}
                className="h-4 w-4"
              />
              <span
                className={`flex-1 h-8 flex items-center border-b ${
                  task.isDone ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                aria-label="Delete task"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// import { useState } from "react";

// type Task = {
//   id: number;
//   title: string;
//   done: boolean;
// };

// export default function DashboardPage() {
//   const [tasks, setTasks] = useState<Task[]>([
//     { id: 1, title: "First task", done: false },
//     { id: 2, title: "Second task", done: false },
//     { id: 3, title: "Third task", done: false },
//   ]);
//   const [newTask, setNewTask] = useState("");

//   const handleAdd = () => {
//     if (!newTask.trim()) return;
//     setTasks((prev) => [
//       ...prev,
//       { id: Date.now(), title: newTask.trim(), done: false },
//     ]);
//     setNewTask("");
//   };

//   const toggleTask = (id: number) => {
//     setTasks((prev) =>
//       prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
//     );
//   };

//   const removeTask = (id: number) => {
//     setTasks((prev) => prev.filter((t) => t.id !== id));
//   };

//   return (
//     <div className="min-h-screen flex items-start justify-center pt-10">
//       <div className="w-full max-w-sm px-4">
//         <h1 className="text-3xl font-bold text-center mb-8">Todo</h1>

//         {/* 追加フォーム */}
//         <div className="flex mb-6 gap-2">
//           <input
//             className="flex-1 border rounded-l-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
//             placeholder="Enter a new task"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//           />
//           <button
//             onClick={handleAdd}
//             className="border rounded-r-md px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition"
//           >
//             Add
//           </button>
//         </div>

//         {/* タスクリスト */}
//         <ul className="space-y-3">
//           {tasks.map((task) => (
//             <li key={task.id} className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 checked={task.done}
//                 onChange={() => toggleTask(task.id)}
//                 className="h-4 w-4"
//               />
//               <span
//                 className={`flex-1 h-8 flex items-center border-b ${
//                   task.done ? "line-through text-gray-400" : ""
//                 }`}
//               >
//                 {task.title}
//               </span>
//               <button
//                 onClick={() => removeTask(task.id)}
//                 className="text-sm px-2 py-1 rounded hover:bg-gray-100"
//                 aria-label="Delete task"
//               >
//                 🗑
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
