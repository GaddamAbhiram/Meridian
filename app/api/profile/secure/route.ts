// BOPLA: SECURED counterpart to ../route.ts. Only name is ever applied -
// role and storeCredit are silently ignored even if present in the body.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { getCurrentUser } from "@/lib/session";
import { ensureSeeded } from "@/lib/seed";

async function handlePatch(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const body = await request.json().catch(() => ({}) as Record<string, unknown>);

  // SECURED: role/storeCredit in the body, if present, are simply never read.
  if (typeof body.name === "string" && body.name.trim()) caller.name = body.name.trim();

  return NextResponse.json({
    id: caller.id,
    email: caller.email,
    name: caller.name,
    role: caller.role,
    storeId: caller.storeId,
    storeCredit: caller.storeCredit,
    customerId: caller.id,
  });
}

export const PATCH = withBold(handlePatch, {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
  sensitiveFields: ["role", "storeCredit"],
});
