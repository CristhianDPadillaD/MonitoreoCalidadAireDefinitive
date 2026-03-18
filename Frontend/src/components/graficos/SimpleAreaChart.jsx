import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { VARIABLES_ALL } from "../../config/variablesAll";
import { obtenerLimiteMaximo } from "../../config/nivelesPorVariable";

const SimpleAreaChart = ({ data, variable, color = "#3b82f6" }) => {
  const formattedData = data.map((value, index) => ({
    name: index + 1,
    valor: value,
  }));
  const unidad = VARIABLES_ALL.find((item) => item.key === variable)?.unidad || "";
  const limiteMaximo = obtenerLimiteMaximo(variable);

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
          label={{
            value: unidad || "Valor",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <XAxis
          label={{ value: "Tiempo", position: "insideBottom", offset: -8 }}
        />

        {/* Cuadrícula */}
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        {limiteMaximo !== null && (
          <ReferenceLine
            y={limiteMaximo}
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="6 4"
            ifOverflow="extendDomain"
            label={{
              value: `Límite: ${limiteMaximo}${unidad ? ` ${unidad}` : ""}`,
              fill: "#dc2626",
              fontSize: 11,
              position: "right",
            }}
          />
        )}
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
