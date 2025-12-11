"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Log In</h1>

      <div className="flex flex-col gap-4 w-80">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="border border-gray-400 py-2 rounded text-lg hover:bg-gray-100 transition"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
