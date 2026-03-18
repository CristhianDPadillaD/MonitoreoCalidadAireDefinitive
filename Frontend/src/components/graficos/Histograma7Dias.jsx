import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import nivelesPorVariable, { obtenerLimiteMaximo } from "../../config/nivelesPorVariable";
import { VARIABLES_ALL } from "../../config/variablesAll";

export default function Histograma10Dias({ data, variable, onDayClick, selectedDay }) {
  if (!data || data.length === 0) return <p>Cargando histograma...</p>;

  const diasOrden = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const dataOrdenada = [...data].sort(
    (a, b) => diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana)
  );
  const niveles = nivelesPorVariable[variable] || [];
  const unidad = VARIABLES_ALL.find((item) => item.key === variable)?.unidad || "";
  const limiteMaximo = obtenerLimiteMaximo(variable);

  const obtenerColorPorValor = (valor) => {
    const numero = Number(valor);
    if (Number.isNaN(numero)) return "#47a2b9";

    const nivel = niveles.find(
      (n) => n && Array.isArray(n.rango) && numero >= n.rango[0] && numero <= n.rango[1]
    );

    return nivel ? nivel.color : "#47a2b9";
  };

  const handleBarClick = (data) => {
    if (onDayClick && data.dia) {
      onDayClick(data.dia);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const valor = Number(payload[0].value);
    const superaLimite = limiteMaximo !== null && Number.isFinite(valor) && valor > limiteMaximo;

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
          <strong>{label}</strong>
        </p>
        <p style={{ margin: "4px 0 0", color: "#333" }}>
          Promedio: <strong>{Number.isFinite(valor) ? valor.toFixed(2) : "0.00"}</strong>
          {unidad ? ` ${unidad}` : ""}
        </p>
        {superaLimite && (
          <p style={{ margin: "4px 0 0", color: "#b91c1c", fontWeight: "bold" }}>
            Supera el límite ({limiteMaximo}{unidad ? ` ${unidad}` : ""})
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: 450 }}>
      <h3>Promedio de los ultimos 7 dias</h3>
      <h4 className="subtituloPromedioSemana">
        Mira cuáles han sido los promedios de este factor contaminante durante
        los ultimos siete dias. Haz clic en una barra para ver detalles por hora.
      </h4>
      <ResponsiveContainer width="100%" height="100%" className="histogramaSemana">
        <BarChart data={dataOrdenada}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="diaSemana" />
          <YAxis
            label={{
              value: unidad || "Valor",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="promedio" 
            onClick={handleBarClick}
            cursor="pointer"
          >
            {dataOrdenada.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={obtenerColorPorValor(entry.promedio)}
                stroke={selectedDay === entry.dia ? "#1e3a8a" : "none"}
                strokeWidth={selectedDay === entry.dia ? 2 : 1}
              />
            ))}
          </Bar>
          {limiteMaximo !== null && (
            <ReferenceLine
              isFront
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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
