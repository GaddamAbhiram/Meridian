// Tenant isolation: VULNERABLE. The URL carries a store id, but the handler
// never actually checks that the order's store matches either the caller's
// own store or the storeId in the URL - it just looks the order up by id
// and returns it. Staff or a customer of one store can reach another
// store's orders this way. Compare with ./secure/route.ts.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";
import { readReceipt } from "@/lib/receipt";

async function handleGet(request: Request, ctx: { params: Promise<{ storeId: string; id: string }> }) {
  ensureSeeded();
  const { id } = await ctx.params;
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // VULNERABLE: no `order.storeId === caller.storeId` check.
  return NextResponse.json({
    id: order.id,
    summary: order.summary,
    customerId: order.customerId,
    storeId: order.storeId,
    createdAt: order.createdAt,
    receipt: readReceipt(order.receiptPath),
  });
}

export const GET = withBold(handleGet, {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
  resolveCallerTenant: (req: Request) => getCurrentUser(req)?.storeId ?? null,
  tenantField: "storeId",
});
