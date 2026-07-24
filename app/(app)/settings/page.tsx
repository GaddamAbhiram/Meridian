"use client";

// The UI form intentionally only exposes a "name" field - just like a real
// app's settings page would. It PATCHes /api/profile, which (the bug) also
// accepts role/storeCredit from the raw request body. Those fields are not
// reachable through this form at all - only by an attacker crafting the
// request directly, which is exactly the point: see the README's attack
// snippets.

import { useEffect, useState } from "react";

type Profile = { id: string; email: string; name: string; role: string; storeCredit: number };

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((body: Profile) => {
        setProfile(body);
        setName(body.name);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (res.ok) {
      setProfile(await res.json());
      setSaved(true);
    }
  }

  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Settings</h1>
      <div className="card">
        <p className="hint">
          Email: <code>{profile.email}</code> &middot; Role: <code>{profile.role}</code> &middot; Store
          credit: <code>${profile.storeCredit.toFixed(2)}</code>
        </p>
        <form className="stack" onSubmit={save}>
          <div>
            <label htmlFor="name">Display name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button type="submit" disabled={busy}>
            Save
          </button>
          {saved && <p className="hint">Saved.</p>}
        </form>
      </div>
    </div>
  );
}
