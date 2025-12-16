"use client";

import useSWR from "swr";
import { Task } from "@/lib/types";
import * as taskService from "@/services/taskService";

export function useTasks() {
  const { data, mutate } = useSWR<Task[]>("/tasks", taskService.fetchTasks);

  // タスク追加
  async function addTask(title: string) {
    const newTask = await taskService.createTask(title);
    // mutate でローカルデータを即座に更新
    mutate([...(data ?? []), newTask.data], false);
  }

  // タスク削除
  async function deleteTask(id: number) {
    await taskService.deleteTask(id);
    mutate(data?.filter((t) => t.id !== id), false);
  }

  return {
    tasks: data ?? [],
    addTask,
    deleteTask,
  };
}