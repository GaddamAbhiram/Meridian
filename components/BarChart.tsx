import type { ChartPoint } from "@/lib/chart";

export default function BarChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p className="hint">No orders yet to chart.</p>;
  }

  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-chart-col" key={d.label}>
          <div className="bar-chart-value">{d.value}</div>
          <div className="bar-chart-bar" style={{ height: `${Math.max(6, (d.value / max) * 100)}%` }} />
          <div className="bar-chart-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
