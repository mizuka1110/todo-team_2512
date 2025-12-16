// src/lib/apiClient.ts
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function authFetch(path: string, options: RequestInit = {}) {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

export const apiClient = {
  get: async <T>(path: string): Promise<T> => {
    const res = await authFetch(path);
    if (!res.ok) throw new Error("API error");
    return res.json();
  },
  post: async <T>(path: string, body: any): Promise<T> => {
    const res = await authFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  },
  delete: async (path: string) => {
    const res = await authFetch(path, { method: "DELETE" });
    if (!res.ok) throw new Error("API error");
  },
};


// // src/lib/apiClient.ts
// export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// export const apiClient = {
//   get: (path: string) =>
//     fetch(`${API_BASE}${path}`).then((res) => res.json()),
//   post: (path: string, body: any) =>
//     fetch(`${API_BASE}${path}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     }).then((res) => res.json()),
//   patch: (path: string, body: any) =>
//     fetch(`${API_BASE}${path}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     }).then((res) => res.json()),
//   delete: (path: string) =>
//     fetch(`${API_BASE}${path}`, { method: "DELETE" }).then((res) => res.json()),
// };
