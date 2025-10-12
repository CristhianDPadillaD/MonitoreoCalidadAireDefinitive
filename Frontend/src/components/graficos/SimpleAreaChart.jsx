import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SimpleAreaChart = ({ data, color = "#3b82f6" }) => {
  const formattedData = data.map((value, index) => ({
    name: index + 1,
    valor: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={formattedData}>
        {/* */}
        <defs>
          <linearGradient id="customGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Ejes */}
        <YAxis
          tick={{ fill: "#555", fontSize: 12 }}
          axisLine={{ stroke: "#aaa" }}
          tickLine={{ stroke: "#aaa" }}
        />

        {/* Cuadrícula */}
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            color: "#000",
          }}
        />

        {/*  */}
        <Area
          type="monotone"
          dataKey="valor"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#customGradient)"
          
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaChart;
