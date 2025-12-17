// src/services/taskService.ts
import { apiClient } from "@/lib/apiClient";
import { Task } from "@/lib/types";
import { getIdToken } from "@/lib/firebase"; // Firebase ユーザーのトークン取得関数

export const fetchTasks = async () => {
  const token = await getIdToken();
  return apiClient.get<Task[]>("/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTask = async (title: string) => {
  const token = await getIdToken();
  return apiClient.post<Task>(
    "/tasks",
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteTask = async (id: number) => {
  const token = await getIdToken();
  return apiClient.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
