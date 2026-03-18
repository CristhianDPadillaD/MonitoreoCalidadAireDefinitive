import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import nivelesPorVariable, { obtenerLimiteMaximo } from "../../config/nivelesPorVariable";
import { VARIABLES_ALL } from "../../config/variablesAll";

export default function Linea24Horas({ data, variable, fecha }) {
  if (!data || !data.horas || data.horas.length === 0) {
    return (
      <div style={{ width: "100%", padding: "2rem", textAlign: "center" }}>
        <h3>Promedios por hora</h3>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          No hay datos disponibles para las últimas 24 horas{fecha ? ` del ${fecha}` : ""}.
        </p>
      </div>
    );
  }

  // Formatear fecha para mostrar
  const fechaFormateada = fecha 
    ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : "";

  // Crear array de 24 horas con datos o null
  const horasCompletas = Array.from({ length: 24 }, (_, i) => {
    const horaStr = String(i).padStart(2, "0") + ":00";
    const horaData = data.horas.find((h) => h.hora === horaStr);
    return {
      hora: horaStr,
      promedio: horaData ? horaData.promedio : null,
    };
  });

  // Obtener niveles para colorear puntos
  const niveles = nivelesPorVariable[variable] || [];
  const unidad = VARIABLES_ALL.find((item) => item.key === variable)?.unidad || "";
  const limiteMaximo = obtenerLimiteMaximo(variable);

  const obtenerColorPorValor = (valor) => {
    if (valor === null || valor === undefined) return "#ccc";
    const nivel = niveles.find(
      (n) => n && n.rango && Array.isArray(n.rango) && valor >= n.rango[0] && valor <= n.rango[1]
    );
    return nivel ? nivel.color : "#47a2b9";
  };

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const valor = payload[0].value;
      if (valor === null) {
        return (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <strong>{payload[0].payload.hora}</strong>
            </p>
            <p style={{ margin: "4px 0 0", color: "#999" }}>Sin datos</p>
          </div>
        );
      }
      const nivel = niveles.find(
        (n) => n && n.rango && Array.isArray(n.rango) && valor >= n.rango[0] && valor <= n.rango[1]
      );
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <strong>{payload[0].payload.hora}</strong>
          </p>
          <p style={{ margin: "4px 0 0", color: "#333" }}>
            Promedio: <strong>{valor.toFixed(2)}</strong>
          </p>
          {nivel && (
            <p style={{ margin: "4px 0 0", color: nivel.color, fontWeight: "bold" }}>
              {nivel.label}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Punto personalizado con color según nivel
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.promedio === null) return null;
    const color = obtenerColorPorValor(payload.promedio);
    return (
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
    );
  };

  return (
    <div style={{ width: "100%", padding: "1rem 0" }}>
      <h3>Promedios por hora</h3>
      {fechaFormateada && (
        <p style={{ 
          textAlign: "center", 
          color: "#2865a1", 
          fontWeight: "600",
          fontSize: "0.95rem",
          margin: "0.25rem 0 0.5rem"
        }}>
          {fechaFormateada}
        </p>
      )}
      <h4
        style={{
          fontWeight: "normal",
          textAlign: "center",
          margin: "0.5rem 0 1.5rem",
          color: "#555",
        }}
      >
        Evolución de los niveles durante las últimas 24 horas registradas.
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={horasCompletas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hora"
            tick={{ fontSize: 12 }}
            interval={2}
          />
          <YAxis
            label={{
              value: unidad || "Valor",
              angle: -90,
              position: "insideLeft",
            }}
          />
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
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="promedio"
            stroke="#2865a1"
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
