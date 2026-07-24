import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getCurrentUserFromCookieStore } from "@/lib/session";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { ordersByWeek } from "@/lib/chart";
import { statusFor } from "@/lib/orderStatus";
import BarChart from "@/components/BarChart";
import StatusPill from "@/components/StatusPill";

function orderTotal(summary: string): number {
  return Number(summary.split("$")[1] ?? 0);
}

export default async function DashboardPage() {
  ensureSeeded();
  const user = await getCurrentUserFromCookieStore();
  if (!user) redirect("/login");

  const home = store.stores.find((s) => s.id === user.storeId);
  const isStaff = user.role === "staff";

  // Customers only ever see their OWN orders and spend here - a real store
  // never shows a shopper store-wide numbers. Staff get the store-wide view
  // (member count, total revenue, a weekly trend, everyone's recent orders),
  // which is a legitimate internal reporting view for their own store only.
  const myOrders = store.orders.filter((o) => o.customerId === user.id);
  const mySpend = myOrders.reduce((sum, o) => sum + orderTotal(o.summary), 0);

  const storeOrders = store.orders.filter((o) => o.storeId === user.storeId);
  const teammateCount = store.users.filter((u) => u.storeId === user.storeId).length;
  const storeRevenue = storeOrders.reduce((sum, o) => sum + orderTotal(o.summary), 0);

  const scopedOrders = isStaff ? storeOrders : myOrders;
  const recent = [...scopedOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const usersById = new Map(store.users.map((u) => [u.id, u]));
  const chartData = ordersByWeek(scopedOrders);

  return (
    <div className="container wide">
      <div className="page-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="page-sub">{home?.name ?? "No store"}</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Your orders</div>
          <div className="stat-value">{myOrders.length}</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-label">Your spend</div>
          <div className="stat-value">${mySpend.toFixed(0)}</div>
        </div>
        {isStaff && (
          <>
            <div className="stat-card">
              <div className="stat-label">Store members</div>
              <div className="stat-value">{teammateCount}</div>
            </div>
            <div className="stat-card info">
              <div className="stat-label">Store revenue</div>
              <div className="stat-value">${storeRevenue.toFixed(0)}</div>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <p className="section-title">
          Orders by week{isStaff ? `, ${home?.name ?? "your store"}` : ""}
        </p>
        <BarChart data={chartData} />
      </div>

      <p className="section-title" style={{ marginTop: "1.5rem" }}>
        {isStaff ? `Recent at ${home?.name ?? "your store"}` : "Your recent orders"}
      </p>
      <div className="card tight">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              {isStaff && <th>Customer</th>}
              <th>Status</th>
              <th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr className="empty-row">
                <td colSpan={isStaff ? 4 : 3}>No orders yet.</td>
              </tr>
            )}
            {recent.map((o) => {
              const customer = usersById.get(o.customerId);
              const href = o.customerId === user.id ? `/orders/${o.id}` : `/store/${o.id}`;
              return (
                <tr key={o.id} className="clickable">
                  <td>
                    <a href={href} className="cell-title">
                      <span className="doc-icon">
                        <Package size={14} />
                      </span>
                      {o.summary}
                    </a>
                  </td>
                  {isStaff && (
                    <td>
                      <span className="cell-meta">{customer?.name ?? o.customerId}</span>
                    </td>
                  )}
                  <td>
                    <StatusPill status={statusFor(o.id)} />
                  </td>
                  <td>
                    <span className="cell-meta">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="row" style={{ marginTop: "1.25rem" }}>
        <a className="btn" href="/orders">
          Go to My Orders
        </a>
        {isStaff && (
          <a className="btn secondary" href="/store">
            Go to Store
          </a>
        )}
      </p>
    </div>
  );
}
