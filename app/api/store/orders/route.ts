// Support endpoint for the "Store" page - always scoped to the caller's own
// store, so there's no vulnerability here (compare with the deliberately
// unscoped /api/stores/[storeId]/orders/[id] pair).

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";

async function handleGet(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const storeOrders = store.orders.filter((o) => o.storeId === caller.storeId);
  return NextResponse.json({
    orders: storeOrders.map((o) => ({
      id: o.id,
      summary: o.summary,
      customerId: o.customerId,
      storeId: o.storeId,
      createdAt: o.createdAt,
    })),
  });
}

export const GET = withBold(handleGet, {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
  resolveCallerTenant: (req: Request) => getCurrentUser(req)?.storeId ?? null,
  tenantField: "storeId",
});
