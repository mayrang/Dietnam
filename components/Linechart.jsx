"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Linechart({ data }) {
  return (
    <ResponsiveContainer width="101%" height="100%">
      <AreaChart data={data}>
        <XAxis
          dataKey="name"
          ticks={["1", "12", "24  -."]} // 1, 12, 24를 표시
          interval={0}
          allowDataOverflow={true}
        />
        <YAxis tick={false} width={3} />
        <Area
          type="monotone"
          dataKey="steps"
          stroke="#63FF51"
          fill="#63FF51"
          opacity={0.4}
        />
        <Area
          type="monotone"
          dataKey="km"
          stroke="#239CFF"
          fill="transparent"
          opacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
