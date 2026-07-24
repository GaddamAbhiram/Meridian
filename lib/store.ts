// The in-memory data store. Held on `globalThis` so it survives Next.js
// dev-server hot reloads within the same process - without this, editing
// any file would silently wipe every seeded user, order, and session.

export type Role = "customer" | "staff";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  storeId: string;
  storeCredit: number;
};

export type Store = {
  id: string;
  name: string;
};

export type Order = {
  id: string;
  customerId: string;
  storeId: string;
  summary: string; // e.g. "2 items - $110.15"
  note: string; // customer-editable delivery note
  receiptPath: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type Session = {
  id: string;
  userId: string;
};

type StoreState = {
  users: User[];
  stores: Store[];
  orders: Order[];
  products: Product[];
  sessions: Map<string, Session>;
  seeded: boolean;
};

const g = globalThis as unknown as { __meridianStore?: StoreState };

export const store: StoreState =
  g.__meridianStore ??
  (g.__meridianStore = {
    users: [],
    stores: [],
    orders: [],
    products: [],
    sessions: new Map(),
    seeded: false,
  });
