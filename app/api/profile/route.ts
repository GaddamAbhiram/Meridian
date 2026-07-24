// BOPLA (mass assignment): VULNERABLE PATCH. GET is safe (always just the
// caller's own profile). The PATCH applies the ENTIRE request body onto the
// caller's own record, including fields a normal customer should never be
// able to set on themselves - role and storeCredit. The normal Settings UI
// only ever sends `name`, so this bug is invisible through the app itself;
// it's only reachable by an attacker crafting the request directly. Compare
// with ./secure/route.ts.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { getCurrentUser } from "@/lib/session";
import { ensureSeeded } from "@/lib/seed";
import type { User } from "@/lib/store";

function serialize(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    storeId: user.storeId,
    storeCredit: user.storeCredit,
    customerId: user.id,
  };
}

async function handleGet(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  return NextResponse.json(serialize(caller));
}

async function handlePatch(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const body = await request.json().catch(() => ({}) as Record<string, unknown>);

  // VULNERABLE: role and storeCredit are applied straight from the request body.
  if (typeof body.name === "string" && body.name.trim()) caller.name = body.name.trim();
  if (body.role === "customer" || body.role === "staff") caller.role = body.role;
  if (typeof body.storeCredit === "number" && Number.isFinite(body.storeCredit)) {
    caller.storeCredit = body.storeCredit;
  }

  return NextResponse.json(serialize(caller));
}

const boldConfig = {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
  sensitiveFields: ["role", "storeCredit"],
};

export const GET = withBold(handleGet, boldConfig);
export const PATCH = withBold(handlePatch, boldConfig);
