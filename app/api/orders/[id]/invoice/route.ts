// Missing-authorization: SECURED counterpart to ../receipt/route.ts. A
// session is actually required here.

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

  // SECURED: the check ../receipt/route.ts is missing.
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  return NextResponse.json({
    id: order.id,
    customerId: order.customerId,
    receipt: readReceipt(order.receiptPath),
  });
}

export const GET = withBold(handleGet, {
  resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null,
  authRequired: true,
});
