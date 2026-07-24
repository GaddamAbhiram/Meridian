// BFLA: VULNERABLE. Meant to be a staff-only listing of every order across
// every customer and store - but the handler never actually checks
// caller.role === "staff" before returning it. Any logged-in customer
// reaches it. Compare with ./secure/route.ts.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";

async function handleGet(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  // VULNERABLE: no `caller.role === "staff"` check.
  return NextResponse.json({
    orders: store.orders.map((o) => ({
      id: o.id,
      summary: o.summary,
      customerId: o.customerId,
      storeId: o.storeId,
    })),
  });
}

function resolveCallerPrivilege(req: Request): boolean | null {
  const user = getCurrentUser(req);
  if (!user) return null;
  return user.role === "staff";
}

export const GET = withBold(handleGet, {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
  privileged: true,
  resolveCallerPrivilege,
});
