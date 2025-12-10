// src/hooks/useTasks.ts
"use client";

import useSWR from "swr";
import { Task } from "@/lib/types";
import * as taskService from "@/services/taskService";

export function useTasks() {
  const { data, mutate } = useSWR<Task[]>("/tasks", taskService.fetchTasks);

  async function addTask(title: string) {
    const newTask = await taskService.createTask(title);
    mutate([...(data ?? []), newTask], false);
  }

  async function toggleTask(task: Task) {
    const updated = await taskService.toggleTask(task.id, !task.isDone);
    mutate(
      data?.map((t) => (t.id === task.id ? updated : t)),
      false
    );
  }

  async function deleteTask(id: number) {
    await taskService.deleteTask(id);
    mutate(data?.filter((t) => t.id !== id), false);
  }

  return {
    tasks: data ?? [],
    addTask,
    toggleTask,
    deleteTask,
  };
}
