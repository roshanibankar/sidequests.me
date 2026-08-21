"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(params.get("next") || "/add");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-3xl italic text-parchment">
        My Bookshelf
      </h1>
      <p className="mt-1 mb-8 font-body text-sm text-ash">
        Log in to add or edit books.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block font-mono text-xs uppercase tracking-wide text-ash">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-surface px-3 py-2 font-body text-sm text-parchment outline-none focus:border-brass"
          />
        </div>

        {error && <p className="font-body text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-md bg-brass px-4 py-2 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <a href="/" className="mt-8 font-mono text-xs text-ash underline decoration-dotted underline-offset-2 hover:text-parchment">
        ← back to the shelf
      </a>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
