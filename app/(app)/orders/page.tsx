import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getCurrentUserFromCookieStore } from "@/lib/session";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { statusFor } from "@/lib/orderStatus";
import StatusPill from "@/components/StatusPill";

export default async function OrdersPage() {
  ensureSeeded();
  const user = await getCurrentUserFromCookieStore();
  if (!user) redirect("/login");

  const home = store.stores.find((s) => s.id === user.storeId);
  const mine = [...store.orders.filter((o) => o.customerId === user.id)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="container wide">
      <div className="page-head">
        <div>
          <p className="eyebrow">{home?.name ?? "Your store"}</p>
          <h1>My Orders</h1>
        </div>
      </div>

      <div className="card tight">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
            {mine.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>You haven&apos;t placed any orders yet.</td>
              </tr>
            )}
            {mine.map((o) => (
              <tr key={o.id} className="clickable">
                <td>
                  <a href={`/orders/${o.id}`} className="cell-title">
                    <span className="doc-icon">
                      <Package size={14} />
                    </span>
                    {o.summary.split(" - ")[0]}
                  </a>
                </td>
                <td>
                  <span className="cell-meta">{o.summary.split(" - ")[1]}</span>
                </td>
                <td>
                  <StatusPill status={statusFor(o.id)} />
                </td>
                <td>
                  <span className="cell-meta">{new Date(o.createdAt).toLocaleDateString()}</span>
                </td>
                <td>
                  <span className="cell-id">{o.id}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
