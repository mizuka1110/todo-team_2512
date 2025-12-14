"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {/* タイトル */}
        <h1 className="text-5xl font-bold tracking-tight mb-10">
          Todo
        </h1>

        {/* メインボタン */}
        <Link
          href="/login"
          className="
            block w-full
            border border-gray-300
            py-3
            rounded-lg
            text-lg font-semibold
            transition
            hover:bg-gray-100
            active:scale-[0.99]
          "
        >
          使ってみる
        </Link>
      </div>
    </div>
  );
}
