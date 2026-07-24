import type { OrderStatus } from "@/lib/orderStatus";

const CLASS: Record<OrderStatus, string> = {
  Processing: "status-pill status-processing",
  Shipped: "status-pill status-shipped",
  Delivered: "status-pill status-delivered",
};

export default function StatusPill({ status }: { status: OrderStatus }) {
  return <span className={CLASS[status]}>{status}</span>;
}
