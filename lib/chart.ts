// Buckets a list of orders into weekly (Monday-start) counts, purely for the
// Dashboard's bar chart. Derived dynamically from real createdAt values so
// it isn't hardcoded to the seed data's specific dates.

export type ChartPoint = { label: string; value: number };

export function ordersByWeek(orders: { createdAt: string }[]): ChartPoint[] {
  const buckets = new Map<string, { start: Date; count: number }>();

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const day = d.getUTCDay(); // 0 = Sunday
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() + diffToMonday);
    monday.setUTCHours(0, 0, 0, 0);
    const key = monday.toISOString().slice(0, 10);

    const existing = buckets.get(key);
    if (existing) existing.count += 1;
    else buckets.set(key, { start: monday, count: 1 });
  }

  return [...buckets.values()]
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .map((b) => ({
      label: b.start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: b.count,
    }));
}
