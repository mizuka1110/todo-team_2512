// src/components/TaskForm.tsx
"use client";

import { useState } from "react";

export default function TaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState("");

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 border rounded p-2"
        placeholder="Enter a new task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={() => {
          if (title.trim()) {
            onAdd(title);
            setTitle("");
          }
        }}
        className="border px-4 rounded"
      >
        Add
      </button>
    </div>
  );
}
