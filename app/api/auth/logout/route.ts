import { NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/session";

export async function POST(request: Request) {
  const header = request.headers.get("cookie") ?? "";
  const match = header.split(";").map((p) => p.trim()).find((p) => p.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (match) {
    const sessionId = decodeURIComponent(match.slice(SESSION_COOKIE_NAME.length + 1));
    destroySession(sessionId);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
