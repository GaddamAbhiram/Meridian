// Session helpers. Two entry points on purpose:
//   - getCurrentUser(request) reads straight off a raw Request's Cookie
//     header, so it works both inside a route handler AND as the basis for
//     a withBold() `resolveCallerId` callback (which only ever gets a
//     Request, never Next's cookies() helper).
//   - getCurrentUserFromCookieStore() uses next/headers' cookies() for
//     Server Component pages, which don't have a Request object to read.

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { store, type User } from "./store";
import { ensureSeeded } from "./seed";

export const SESSION_COOKIE_NAME = "meridian_session";

export function createSession(userId: string): string {
  const id = randomBytes(24).toString("hex");
  store.sessions.set(id, { id, userId });
  return id;
}

export function destroySession(sessionId: string): void {
  store.sessions.delete(sessionId);
}

function readCookieHeader(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    if (key === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

function userForSession(sessionId: string | null): User | null {
  if (!sessionId) return null;
  const session = store.sessions.get(sessionId);
  if (!session) return null;
  return store.users.find((u) => u.id === session.userId) ?? null;
}

/** For use inside route handlers and as a withBold() resolveCallerId callback. */
export function getCurrentUser(request: Request): User | null {
  ensureSeeded();
  return userForSession(readCookieHeader(request, SESSION_COOKIE_NAME));
}

export function isStaff(request: Request): boolean {
  return getCurrentUser(request)?.role === "staff";
}

/** For use inside Server Component pages, which have no Request object. */
export async function getCurrentUserFromCookieStore(): Promise<User | null> {
  ensureSeeded();
  const jar = await cookies();
  return userForSession(jar.get(SESSION_COOKIE_NAME)?.value ?? null);
}
