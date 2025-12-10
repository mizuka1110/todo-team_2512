
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Todo</h1>
      <p className="text-gray-600 mb-10">
        A simple task<br />management tool
      </p>

      <Link
        href="/login"
        className="block border border-gray-400 py-2 rounded text-lg"
      >
        Log In
      </Link>
    </div>
  );
}
