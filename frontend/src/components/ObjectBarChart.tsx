import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  counts: Record<string, number>;
}

export default function ObjectBarChart({ counts }: Props) {
  const data = Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) return null;

  return (
    <div className="border border-line rounded-sm p-4">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E363C" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#8B939A", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            axisLine={{ stroke: "#2E363C" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#8B939A", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            axisLine={{ stroke: "#2E363C" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1B2126",
              border: "1px solid #2E363C",
              borderRadius: 2,
              fontFamily: "IBM Plex Mono",
              fontSize: 12,
            }}
            labelStyle={{ color: "#EDEAE0" }}
            cursor={{ fill: "#222A30" }}
          />
          <Bar dataKey="count" fill="#FFC53D" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
