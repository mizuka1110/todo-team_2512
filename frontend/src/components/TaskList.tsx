// src/components/TaskList.tsx
"use client";

import TaskItem from "./TaskItem";
import { Task } from "@/lib/types";

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onToggle: (t: Task) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </ul>
  );
}
