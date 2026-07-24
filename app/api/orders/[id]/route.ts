// BOLA: VULNERABLE. View, edit (delivery note), or cancel an order purely
// by id - never checking that the order actually belongs to whoever is
// asking. Any logged-in customer can reach any other customer's order just
// by knowing (or guessing/incrementing) its id. This is the exact shape of
// BoLD's own "invoice/104 -> invoice/105" teaching example. Compare with
// ./secure/route.ts.

import { NextResponse } from "next/server";
import { withBold } from "@boldsec/next";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser } from "@/lib/session";
import { readReceipt } from "@/lib/receipt";

type Ctx = { params: Promise<{ id: string }> };

function serialize(o: (typeof store.orders)[number]) {
  return {
    id: o.id,
    summary: o.summary,
    note: o.note,
    customerId: o.customerId,
    storeId: o.storeId,
    createdAt: o.createdAt,
    receipt: readReceipt(o.receiptPath),
  };
}

async function handleGet(request: Request, ctx: Ctx) {
  ensureSeeded();
  const { id } = await ctx.params;
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // VULNERABLE: no `order.customerId === caller.id` check before returning it.
  return NextResponse.json(serialize(order));
}

async function handlePut(request: Request, ctx: Ctx) {
  ensureSeeded();
  const { id } = await ctx.params;
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const order = store.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await request.json().catch(() => ({}) as Record<string, unknown>);

  // VULNERABLE: no ownership check before allowing an edit.
  if (typeof body.note === "string") order.note = body.note.slice(0, 280);
  return NextResponse.json(serialize(order));
}

async function handleDelete(request: Request, ctx: Ctx) {
  ensureSeeded();
  const { id } = await ctx.params;
  const caller = getCurrentUser(request);
  if (!caller) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // VULNERABLE: no ownership check before allowing a cancellation.
  const [removed] = store.orders.splice(idx, 1);
  return NextResponse.json({ id: removed.id, cancelled: true });
}

const boldConfig = { resolveCallerId: (req: Request) => getCurrentUser(req)?.id ?? null };

export const GET = withBold(handleGet, boldConfig);
export const PUT = withBold(handlePut, boldConfig);
export const DELETE = withBold(handleDelete, boldConfig);
