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
} from "recharts";

export default function Histograma10Dias({ data, onDayClick, selectedDay }) {
  if (!data || data.length === 0) return <p>Cargando histograma...</p>;

  const diasOrden = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const dataOrdenada = [...data].sort(
    (a, b) => diasOrden.indexOf(a.diaSemana) - diasOrden.indexOf(b.diaSemana)
  );

  const handleBarClick = (data) => {
    if (onDayClick && data.dia) {
      onDayClick(data.dia);
    }
  };

  return (
    <div style={{ width: "100%", height: 450 }}>
      <h3>Promedio semanal</h3>
      <h4 className="subtituloPromedioSemana">
        Mira cuáles han sido los promedios de este factor contaminante durante
        la última semana. Haz clic en una barra para ver detalles por hora.
      </h4>
      <ResponsiveContainer width="100%" height="100%" className="histogramaSemana">
        <BarChart data={dataOrdenada}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="diaSemana" />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="promedio" 
            onClick={handleBarClick}
            cursor="pointer"
          >
            {dataOrdenada.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={selectedDay === entry.dia ? "#1e40af" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
