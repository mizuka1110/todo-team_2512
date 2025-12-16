"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { tasks, addTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ログインガード
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await addTask(newTask.trim());
      setNewTask("");
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
    } catch (e) {
      setError(String(e));
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Redirecting...</div>;

  return (
    <div className="min-h-screen flex items-start justify-center pt-10">
      <div className="w-full max-w-sm px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Todo</h1>

        {error && <div className="mb-4 text-sm text-red-600 break-words">{error}</div>}

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

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3">
              <input
              type="checkbox"
              checked={task.done}
              readOnly // クリックでの更新は無効化
              className="h-4 w-4"
              />
              <span
                className={`flex-1 h-8 flex items-center border-b ${
                  task.done ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                aria-label="Delete task"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && <div className="text-sm text-gray-400 mt-6 text-center">No tasks yet.</div>}
      </div>
    </div>
  );
}
