// src/services/taskService.ts
import { apiClient } from "@/lib/apiClient";
import { Task } from "@/lib/types";

export const fetchTasks = () => apiClient.get<Task[]>("/tasks");
export const createTask = (title: string) =>
  apiClient.post<Task>("/tasks", { title });
export const toggleTask = (id: number, isDone: boolean) =>
  apiClient.patch<Task>(`/tasks/${id}`, { isDone });
export const deleteTask = (id: number) =>
  apiClient.delete(`/tasks/${id}`);
