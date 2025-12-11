"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("ログイン成功:", userCredential.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

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
          onClick={handleLogin}   // ←このボタンが Firebase のログイン処理を呼ぶ！
        >
          Log In
        </button>
      </div>
    </div>
  );
}
