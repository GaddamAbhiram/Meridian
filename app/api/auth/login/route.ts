// Login is not object-bearing (no owner concept), so it's deliberately left
// un-wrapped by withBold().

import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { verifyPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/session";

export async function POST(request: Request) {
  ensureSeeded();
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const user = store.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const sessionId = createSession(user.id);
  const res = NextResponse.json({ id: user.id, email: user.email, name: user.name });
  res.cookies.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
