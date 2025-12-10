// src/lib/apiClient.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const apiClient = {
  get: (path: string) =>
    fetch(`${API_BASE}${path}`).then((res) => res.json()),
  post: (path: string, body: any) =>
    fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json()),
  patch: (path: string, body: any) =>
    fetch(`${API_BASE}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json()),
  delete: (path: string) =>
    fetch(`${API_BASE}${path}`, { method: "DELETE" }).then((res) => res.json()),
};
