// Session helpers. The cookie stores a signed user id instead of a process-local
// random session id, so auth remains stable across Vercel serverless invocations.
//
// Two entry points on purpose:
//   - getCurrentUser(request) reads straight off a raw Request's Cookie
//     header, so it works both inside a route handler AND as the basis for
//     a withBold() `resolveCallerId` callback (which only ever gets a
//     Request, never Next's cookies() helper).
//   - getCurrentUserFromCookieStore() uses next/headers' cookies() for
//     Server Component pages, which don't have a Request object to read.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { store, type User } from "./store";
import { ensureSeeded } from "./seed";

export const SESSION_COOKIE_NAME = "meridian_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "meridian-demo-session-secret";

function sign(value: string): string {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

export function createSession(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export function destroySession(_sessionId: string): void {
  // Stateless sessions are invalidated client-side by clearing the cookie.
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

function verifySession(token: string | null): string | null {
  if (!token) return null;
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;

  const expected = sign(userId);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);
  if (actualBytes.length !== expectedBytes.length) return null;
  return timingSafeEqual(actualBytes, expectedBytes) ? userId : null;
}

function userForSession(token: string | null): User | null {
  const userId = verifySession(token);
  if (!userId) return null;
  return store.users.find((u) => u.id === userId) ?? null;
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
