"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartEntry = {
  teamName: string;
  points: number;
};

interface LeaderboardChartProps {
  data: ChartEntry[];
}

export function LeaderboardChart({ data }: LeaderboardChartProps) {
  const chartData = data.map((d) => ({
    name: d.teamName,
    points: d.points,
  }));

  return (
    <div className="rounded border border-white/[0.06] bg-[#111] p-5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/30">
        Points Overview
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barSize={32}>
          <XAxis
            dataKey="name"
            tick={{
              fontFamily: "monospace",
              fontSize: 10,
              fill: "rgba(255,255,255,0.3)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontFamily: "monospace",
              fontSize: 10,
              fill: "rgba(255,255,255,0.2)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "monospace",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar
            dataKey="points"
            fill="#39FF14"
            fillOpacity={0.7}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}