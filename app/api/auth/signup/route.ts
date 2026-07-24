import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { hashPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/session";

export async function POST(request: Request) {
  ensureSeeded();
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : "New customer";
  const storeId = body?.storeId === "store_bluebird" ? "store_bluebird" : "store_northwind";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (store.users.some((u) => u.email === email)) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const user = {
    id: `u_${randomBytes(6).toString("hex")}`,
    email,
    passwordHash: hashPassword(password),
    name,
    role: "customer" as const,
    storeId,
    storeCredit: 0,
  };
  store.users.push(user);

  const sessionId = createSession(user.id);
  const res = NextResponse.json({ id: user.id, email: user.email, name: user.name });
  res.cookies.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
