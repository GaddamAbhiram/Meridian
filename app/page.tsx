import { redirect } from "next/navigation";
import { ShoppingBag, Package, Store as StoreIcon, ShieldCheck } from "lucide-react";
import { getCurrentUserFromCookieStore } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUserFromCookieStore();
  if (user) redirect("/dashboard");

  return (
    <div className="hero">
      <span className="brand-mark">
        <ShoppingBag size={20} />
      </span>
      <p className="eyebrow">Meridian</p>
      <h1>Shop, track, and manage your orders</h1>
      <p className="lead">
        A small online store platform - browse products, place orders, and keep track of every
        receipt in one place.
      </p>
      <div className="row">
        <a className="btn" href="/login">
          Log in
        </a>
        <a className="btn secondary" href="/signup">
          Create an account
        </a>
        <a className="btn secondary" href="/storefront">
          Browse the storefront
        </a>
      </div>

      <div className="feature-grid">
        <div className="card">
          <span className="doc-icon">
            <Package size={16} />
          </span>
          <h3>Order history</h3>
          <p>Every order, with a full itemized receipt, always a click away.</p>
        </div>
        <div className="card">
          <span className="doc-icon">
            <StoreIcon size={16} />
          </span>
          <h3>Store activity</h3>
          <p>See recent orders at your store, kept separate from every other store.</p>
        </div>
        <div className="card">
          <span className="doc-icon">
            <ShieldCheck size={16} />
          </span>
          <h3>Staff oversight</h3>
          <p>A dedicated view for staff to keep track of orders platform-wide.</p>
        </div>
      </div>
    </div>
  );
}
