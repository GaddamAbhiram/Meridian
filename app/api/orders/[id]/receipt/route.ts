// Missing-authorization: VULNERABLE. This "quick receipt link" route is
// meant to require a logged-in session (declared via `authRequired: true`
// below) but the handler itself never actually checks for one - it works
// identically with zero credentials, exactly the kind of "share a receipt
// link" pattern real order-confirmation emails often expose. Compare with
// ../invoice/route.ts.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { readReceipt } from "@/lib/receipt";

async function handleGet(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  ensureSeeded();
  const { id } = await ctx.params;

  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // VULNERABLE: no session check at all, despite `authRequired: true` below
  // declaring that this route is supposed to need one.
  return NextResponse.json({
    id: order.id,
    customerId: order.customerId,
    receipt: readReceipt(order.receiptPath),
  });
}

export const GET = withBold(handleGet, { authRequired: true });
