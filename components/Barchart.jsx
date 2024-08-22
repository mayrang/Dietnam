"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function Barchart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={150} height={40} label={{ position: "top" }} data={data}>
        <Bar dataKey="value" fill="#8884d8" />
        <XAxis
          dataKey="name"
          ticks={["1", "7", "14", "21", "30"]} // 1, 12, 24를 표시
          interval={0}
          allowDataOverflow={true}
        />
        <YAxis tick={false} width={3} />
      </BarChart>
    </ResponsiveContainer>
  );
}
