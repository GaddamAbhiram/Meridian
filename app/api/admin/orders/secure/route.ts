// BFLA: SECURED counterpart to ../route.ts. The role check actually happens.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";

async function handleGet(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  // SECURED: the check ../route.ts is missing.
  if (caller.role !== "staff") {
    return NextResponse.json({ error: "Staff only." }, { status: 403 });
  }

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
