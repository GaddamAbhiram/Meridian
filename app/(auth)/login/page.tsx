"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alice@northwind.test");
  const [password, setPassword] = useState("alice-pw");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Login failed.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="brand-mark">
          <ShoppingBag size={16} />
        </span>
        <h1>Welcome back</h1>
        <p className="hint">Log in to your Meridian account.</p>

        <form className="stack" onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <a href="/signup">Create an account</a>
        </p>

        <div className="seed-hint">
          Seeded accounts: <code>alice@northwind.test</code> / <code>alice-pw</code> &middot;{" "}
          <code>bob@northwind.test</code> / <code>bob-pw</code> &middot;{" "}
          <code>carol@bluebird.test</code> / <code>carol-pw</code> &middot;{" "}
          <code>dana@northwind.test</code> / <code>dana-pw</code> (staff)
        </div>
      </div>
    </div>
  );
}
