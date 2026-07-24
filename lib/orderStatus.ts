// A purely cosmetic, deterministic "shipping status" derived from the order
// id - not stored, not part of the vulnerability surface. Gives the UI
// realistic variety (Processing / Shipped / Delivered) without depending on
// the gap between the seed data's fixed dates and whatever "today" is.

export type OrderStatus = "Processing" | "Shipped" | "Delivered";

const STATUSES: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export function statusFor(orderId: string): OrderStatus {
  let hash = 0;
  for (const ch of orderId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return STATUSES[hash % STATUSES.length];
}
