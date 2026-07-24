import { Headphones, Home as HomeIcon, Shirt, Dumbbell, Mountain, Tag } from "lucide-react";
import { store } from "@/lib/store";
import { ensureSeeded } from "@/lib/seed";
import { gradientFor } from "@/lib/productVisual";

const CATEGORY_ICON: Record<string, typeof Tag> = {
  Electronics: Headphones,
  Home: HomeIcon,
  Apparel: Shirt,
  Fitness: Dumbbell,
  Outdoor: Mountain,
};

export default async function StorefrontPage() {
  ensureSeeded();

  return (
    <div className="container wide">
      <div className="page-head">
        <div>
          <p className="eyebrow">New Arrivals</p>
          <h1>Storefront</h1>
          <p className="page-sub">Public - no account needed.</p>
        </div>
      </div>

      <div className="product-grid">
        {store.products.map((p) => {
          const Icon = CATEGORY_ICON[p.category] ?? Tag;
          return (
            <div key={p.id} className="product-card">
              <div className="product-tile" style={{ background: gradientFor(p.category) }}>
                <Icon size={34} strokeWidth={1.5} />
              </div>
              <div className="product-body">
                <div className="product-name">{p.name}</div>
                <div className="product-meta">
                  <span className="pill">{p.category}</span>
                  <span className="product-price">${p.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
