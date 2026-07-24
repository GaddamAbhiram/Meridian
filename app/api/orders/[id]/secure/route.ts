// BOLA: SECURED counterpart to ../route.ts. An order that isn't the
// caller's own is treated as if it doesn't exist at all.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";
import { readReceipt } from "@/lib/receipt";

async function handleGet(request: Request, ctx: { params: Promise<{ id: string }> }) {
  ensureSeeded();
  const { id } = await ctx.params;
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // SECURED: the ownership check that ../route.ts is missing.
  if (order.customerId !== caller.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    summary: order.summary,
    note: order.note,
    customerId: order.customerId,
    storeId: order.storeId,
    createdAt: order.createdAt,
    receipt: readReceipt(order.receiptPath),
  });
}

export const GET = withBold(handleGet, {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
});
