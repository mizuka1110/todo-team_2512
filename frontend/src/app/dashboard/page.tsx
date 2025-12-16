"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

type ApiTask = {
  id: number;
  title: string;
  is_done?: boolean;
  done?: boolean;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function normalizeTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    done: typeof t.done === "boolean" ? t.done : Boolean(t.is_done),
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ログインガード
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const getIdToken = useCallback(async () => {
    if (!user) throw new Error("Not logged in");
    return await (user as any).getIdToken();
  }, [user]);

  // GET /tasks（ヘッダー方式 → ダメならクエリ方式）
  const fetchTasks = useCallback(async () => {
    setError(null);
    setFetching(true);

    try {
      const idToken = await getIdToken();

      // 1) Authorization header 方式
      let res = await fetch(`${API_BASE}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // 2) fallback: query 方式
      if (res.status === 401 || res.status === 422) {
        res = await fetch(
          `${API_BASE}/tasks?id_token=${encodeURIComponent(idToken)}`,
          { method: "GET" }
        );
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`GET /tasks failed: ${res.status} ${text}`);
      }

      const data = (await res.json()) as ApiTask[];
      setTasks(Array.isArray(data) ? data.map(normalizeTask) : []);
    } catch (e) {
      setError(String(e));
    } finally {
      setFetching(false);
    }
  }, [getIdToken]);

  // ログイン後に tasks を取得
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    fetchTasks();
  }, [user, loading, fetchTasks]);

  // POST /tasks（ヘッダー方式 ）
  const handleAdd = async () => {
    if (!newTask.trim()) return;
    if (!user) {
      setError("Not logged in");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const title = newTask.trim();
      const idToken = await getIdToken();

      // 送るbody（バックエンドが description を受けても受けなくてもOKな形）
      const body = JSON.stringify({ title });

      // 1) Authorization header 方式
      let res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body,
      });

      // 2) fallback: query 方式
      if (res.status === 401 || res.status === 422) {
        res = await fetch(
          `${API_BASE}/tasks?id_token=${encodeURIComponent(idToken)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          }
        );
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST /tasks failed: ${res.status} ${text}`);
      }

      // 返り値が「作成したtask」でも「OK」でも対応できるようにする
      const text = await res.text();
      try {
        const created = JSON.parse(text) as ApiTask;
        if (created && typeof created.id === "number") {
          setTasks((prev) => [...prev, normalizeTask(created)]);
        } else {
          // 返り値が配列/別形式ならGETし直す
          await fetchTasks();
        }
      } catch {
        // JSONじゃないならGETし直す
        await fetchTasks();
      }

      setNewTask("");
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = (id: number) => {
    // 今はローカル表示だけ（PUTは後で）
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTask = (id: number) => {
    // 今はローカル表示だけ（DELETEは後で）
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ✅ ここで早期returnしてOK
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Redirecting...</div>;

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">
      <div className="w-full max-w-sm px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Todo</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 break-words">{error}</div>
        )}

        <div className="flex mb-6 gap-2">
          <input
            className="flex-1 border rounded-l-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            disabled={saving}
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newTask.trim()}
            className="border rounded-r-md px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
          <span>{fetching ? "Loading tasks..." : ""}</span>
          <button
            onClick={fetchTasks}
            className="underline hover:opacity-80"
            disabled={fetching}
          >
            Refresh
          </button>
        </div>

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

        {tasks.length === 0 && !fetching && (
          <div className="text-sm text-gray-400 mt-6 text-center">
            No tasks yet.
          </div>
        )}
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
