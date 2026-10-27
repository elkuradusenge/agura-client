/** Recharts wrappers that keep charts readable under the low-data rule. */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPercent } from "../lib/utils";

const PALETTE = ["#3f8f4f", "#a1662f", "#d9a520", "#6b8f71", "#8a5a2b", "#4a7c59"];

export interface SeriesPoint {
  label: string;
  value: number | null;
}

/** A horizontal bar chart for ranked shares. Null values are dropped, not zeroed. */
export function ShareBarChart({
  data,
  height = 260,
  percent = true,
}: {
  data: SeriesPoint[];
  height?: number;
  percent?: boolean;
}) {
  const rows = data.filter((point) => point.value !== null);
  if (!rows.length) return <p className="muted p-4 text-sm">No data</p>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d8d2c8" horizontal={false} />
        <XAxis type="number" tickFormatter={(value: number) => (percent ? formatPercent(value, 0) : String(value))} />
        <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value: number) => (percent ? formatPercent(value) : value)} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {rows.map((row, index) => (
            <Cell key={row.label} fill={PALETTE[index % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data, height = 240 }: { data: SeriesPoint[]; height?: number }) {
  if (!data.length) return <p className="muted p-4 text-sm">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d8d2c8" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3f8f4f" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function FunnelBarChart({ data, height = 260 }: { data: SeriesPoint[]; height?: number }) {
  if (!data.length) return <p className="muted p-4 text-sm">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d8d2c8" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#6b8f71" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CompositionPieChart({ data, height = 240 }: { data: SeriesPoint[]; height?: number }) {
  const rows = data.filter((point) => point.value !== null && point.value > 0);
  if (!rows.length) return <p className="muted p-4 text-sm">No data</p>;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="label" outerRadius={80} label>
          {rows.map((row, index) => (
            <Cell key={row.label} fill={PALETTE[index % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatPercent(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
