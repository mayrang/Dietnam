"use client";
import { Pie, ResponsiveContainer, PieChart, Sector, Cell } from "recharts";

export default function Piechart({ data, type, number }) {
  return (
    <div className="text-center w-full h-full">
      <ResponsiveContainer width="100%" height="70%">
        <PieChart width={60} height={60}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            startAngle={90} // 12시 방향에서 시작
            endAngle={-270}
            innerRadius={30}
            outerRadius={40}
            labelLine={false}
            label={(props) => getCenterLabel(props, type)}
          ></Pie>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ marginTop: "10px", fontSize: "16px", fontWeight: "bold" }}>
        {number}
      </div>
    </div>
  );
}

const getCenterLabel = (
  { cx, cy, midAngle, innerRadius, outerRadius, value, index },
  type
) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const color =
    type === "Step" ? "#00FF00" : type === "Km" ? "#239CFF" : "#FF21B3";
  return (
    <text
      x={cx}
      y={cy}
      fill={color}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "16px" }}
    >
      {type}
    </text>
  );
};
