"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "./actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signIn(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(searchParams.get("redirect") || "/admin");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="eyebrow mb-2 block">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full border-b border-white/20 bg-transparent py-2 text-white focus:border-white focus:outline-none"
        />
      </div>
      <div>
        <label className="eyebrow mb-2 block">Password</label>
        <input
          type="password"
          name="password"
          required
          className="w-full border-b border-white/20 bg-transparent py-2 text-white focus:border-white focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full border border-white/50 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-obsidian disabled:opacity-50"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-6">
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-2 text-center">GODOO Studio</p>
        <h1 className="font-display mb-10 text-center text-3xl text-white">Admin Login</h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
