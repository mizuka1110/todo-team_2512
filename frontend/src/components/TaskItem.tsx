// src/components/TaskItem.tsx
"use client";

import { Task } from "@/lib/types";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-center gap-3">
      <input type="checkbox" checked={task.isDone} onChange={onToggle} />

      <div
        className={
          "flex-1 " + (task.isDone ? "line-through text-gray-500" : "")
        }
      >
        {task.title}
      </div>

      <button onClick={onDelete} className="text-gray-700">
        🗑
      </button>
    </li>
  );
}
