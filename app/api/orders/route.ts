// Support endpoint for the "My Orders" page - always filtered to the
// caller's own orders, so there's no vulnerability here.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";

async function handleGet(request: Request) {
  ensureSeeded();
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const mine = store.orders.filter((o) => o.customerId === caller.id);
  return NextResponse.json({
    orders: mine.map((o) => ({
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
});
