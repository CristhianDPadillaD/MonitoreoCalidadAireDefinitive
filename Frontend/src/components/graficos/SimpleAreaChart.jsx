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

const formatearHora = (timestamp, fallback) => {
  if (!timestamp || typeof timestamp !== "string") return fallback;

  const partes = timestamp.split(" ");
  if (partes.length > 1 && partes[1]) return partes[1];

  const fecha = new Date(timestamp);
  if (!Number.isNaN(fecha.getTime())) {
    return fecha.toLocaleTimeString("es-CO", { hour12: false });
  }

  return fallback;
};

const SimpleAreaChart = ({ data, variable, color = "#3b82f6" }) => {
  const formattedData = (Array.isArray(data) ? data : []).map((item, index) => {
    const fallbackHora = `${index + 1}`;

    if (item && typeof item === "object" && !Array.isArray(item)) {
      const valorNumerico = Number(item.valor ?? item.value ?? 0);

      return {
        name: index + 1,
        hora: formatearHora(item.timestamp, fallbackHora),
        valor: Number.isFinite(valorNumerico) ? valorNumerico : 0,
      };
    }

    const valorNumerico = Number(item);
    return {
      name: index + 1,
      hora: fallbackHora,
      valor: Number.isFinite(valorNumerico) ? valorNumerico : 0,
    };
  });
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
          dataKey="hora"
          tick={{ fill: "#555", fontSize: 10 }}
          axisLine={{ stroke: "#aaa" }}
          tickLine={{ stroke: "#aaa" }}
          label={{ value: "Hora", position: "insideBottom", offset: -8 }}
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
          labelFormatter={(label) => `Hora: ${label}`}
          formatter={(value) => [`${value}${unidad ? ` ${unidad}` : ""}`, "Valor"]}
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
