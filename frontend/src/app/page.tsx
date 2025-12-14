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
    return (
      <div className="min-h-screen grid place-items-center bg-white text-black">
        <div className="text-sm tracking-wide text-neutral-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="border border-neutral-200 rounded-2xl p-10">
          <h1 className="text-5xl font-semibold tracking-tight">
            Todo
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Minimal task manager. Clean. Fast. Focused.
          </p>

          <div className="mt-10 space-y-3">
            <Link
              href="/login"
              className="
                group inline-flex w-full items-center justify-center gap-2
                rounded-xl border border-neutral-900
                bg-neutral-900 px-5 py-3
                text-sm font-semibold text-white
                transition
                hover:bg-black
                active:translate-y-[1px]
                focus:outline-none focus:ring-2 focus:ring-neutral-300
              "
            >
              使ってみる
              <span className="transition group-hover:translate-x-0.5">→</span>
            </Link>

            <div className="text-center text-xs text-neutral-500">
              続行することで利用規約に同意したものとみなされます
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400">
          © Todo
        </div>
      </div>
    </div>
  );
}
