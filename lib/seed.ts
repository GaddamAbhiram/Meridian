// Seeds the in-memory store once per server process. Called defensively at
// the top of every route handler and page that reads the store, so the app
// is self-contained - no separate "run this script first" step.

import { store } from "./store";
import { hashPassword } from "./password";

export function ensureSeeded(): void {
  if (store.seeded) return;
  store.seeded = true; // set first: guards against re-entrant calls while seeding

  store.stores.push(
    { id: "store_northwind", name: "Northwind Traders" },
    { id: "store_bluebird", name: "Bluebird Goods" },
  );

  store.users.push(
    {
      id: "u_alice",
      email: "alice@northwind.test",
      passwordHash: hashPassword("alice-pw"),
      name: "Alice Chen",
      role: "customer",
      storeId: "store_northwind",
      storeCredit: 0,
    },
    {
      id: "u_bob",
      email: "bob@northwind.test",
      passwordHash: hashPassword("bob-pw"),
      name: "Bob Martinez",
      role: "customer",
      storeId: "store_northwind",
      storeCredit: 15,
    },
    {
      id: "u_dana",
      email: "dana@northwind.test",
      passwordHash: hashPassword("dana-pw"),
      name: "Dana Kim",
      role: "staff",
      storeId: "store_northwind",
      storeCredit: 0,
    },
    {
      id: "u_carol",
      email: "carol@bluebird.test",
      passwordHash: hashPassword("carol-pw"),
      name: "Carol Nguyen",
      role: "customer",
      storeId: "store_bluebird",
      storeCredit: 25,
    },
  );

  store.orders.push(
    {
      id: "ord_1",
      customerId: "u_alice",
      storeId: "store_northwind",
      summary: "2 items - $110.15",
      note: "",
      receiptPath: "receipt-1.txt",
      createdAt: "2026-01-08T00:00:00.000Z",
    },
    {
      id: "ord_2",
      customerId: "u_alice",
      storeId: "store_northwind",
      summary: "2 items - $66.36",
      note: "",
      receiptPath: "receipt-2.txt",
      createdAt: "2026-01-15T00:00:00.000Z",
    },
    {
      id: "ord_3",
      customerId: "u_alice",
      storeId: "store_northwind",
      summary: "1 item - $104.18",
      note: "",
      receiptPath: "receipt-3.txt",
      createdAt: "2026-02-02T00:00:00.000Z",
    },
    {
      id: "ord_4",
      customerId: "u_bob",
      storeId: "store_northwind",
      summary: "1 item - $71.78",
      note: "",
      receiptPath: "receipt-4.txt",
      createdAt: "2026-01-11T00:00:00.000Z",
    },
    {
      id: "ord_5",
      customerId: "u_bob",
      storeId: "store_northwind",
      summary: "2 items - $72.85",
      note: "",
      receiptPath: "receipt-5.txt",
      createdAt: "2026-01-24T00:00:00.000Z",
    },
    {
      id: "ord_6",
      customerId: "u_bob",
      storeId: "store_northwind",
      summary: "1 item - $140.39",
      note: "",
      receiptPath: "receipt-6.txt",
      createdAt: "2026-02-09T00:00:00.000Z",
    },
    {
      id: "ord_7",
      customerId: "u_dana",
      storeId: "store_northwind",
      summary: "2 items - $58.81",
      note: "",
      receiptPath: "receipt-7.txt",
      createdAt: "2026-01-19T00:00:00.000Z",
    },
    {
      id: "ord_8",
      customerId: "u_dana",
      storeId: "store_northwind",
      summary: "1 item - $161.99",
      note: "",
      receiptPath: "receipt-8.txt",
      createdAt: "2026-02-14T00:00:00.000Z",
    },
    {
      id: "ord_9",
      customerId: "u_carol",
      storeId: "store_bluebird",
      summary: "2 items - $199.78",
      note: "",
      receiptPath: "receipt-9.txt",
      createdAt: "2026-01-06T00:00:00.000Z",
    },
    {
      id: "ord_10",
      customerId: "u_carol",
      storeId: "store_bluebird",
      summary: "1 item - $109.58",
      note: "",
      receiptPath: "receipt-10.txt",
      createdAt: "2026-01-28T00:00:00.000Z",
    },
    {
      id: "ord_11",
      customerId: "u_carol",
      storeId: "store_bluebird",
      summary: "2 items - $112.81",
      note: "",
      receiptPath: "receipt-11.txt",
      createdAt: "2026-02-11T00:00:00.000Z",
    },
  );

  store.products.push(
    { id: "p_1", name: "Wireless Earbuds Pro", price: 79.99, category: "Electronics" },
    { id: "p_2", name: "Ceramic Coffee Mug Set (4-Pack)", price: 24.99, category: "Home" },
    { id: "p_3", name: "Classic Denim Jacket", price: 64.99, category: "Apparel" },
    { id: "p_4", name: "Stainless Steel Water Bottle", price: 18.99, category: "Fitness" },
    { id: "p_5", name: "2-Person Camping Tent", price: 129.99, category: "Outdoor" },
    { id: "p_6", name: "Trail Running Shoes", price: 89.99, category: "Apparel" },
    { id: "p_7", name: "Portable Bluetooth Speaker", price: 45.99, category: "Electronics" },
    { id: "p_8", name: "Cast Iron Camp Cookware Set", price: 54.99, category: "Outdoor" },
  );
}

// Test-account reference, for the README / attack snippets:
//   alice@northwind.test / alice-pw  (Northwind, customer, owns ord_1, ord_2, ord_3)
//   bob@northwind.test   / bob-pw    (Northwind, customer, owns ord_4, ord_5, ord_6)
//   dana@northwind.test  / dana-pw   (Northwind, staff,    owns ord_7, ord_8)
//   carol@bluebird.test  / carol-pw  (Bluebird,  customer, owns ord_9, ord_10, ord_11)
